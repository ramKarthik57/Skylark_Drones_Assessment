import re
from datetime import datetime, date
from typing import Any, Dict, List, Optional

def is_null_or_empty(val: Any) -> bool:
    if val is None:
        return True
    if str(type(val)) == "<class 'pandas._libs.tslibs.nattype.NaTType'>" or str(val) == 'NaT':
        return True
    if isinstance(val, float) and (val != val or str(val).lower() == 'nan'):
        return True
    val_str = str(val).strip().lower()
    return val_str in ['', 'n/a', 'na', '-', 'none', 'unknown', 'null', 'nan', 'blank', 'nat']

def clean_text(val: Any) -> Optional[str]:
    if is_null_or_empty(val):
        return None
    return str(val).strip()

def clean_currency(val: Any) -> Optional[float]:
    if is_null_or_empty(val):
        return None
    if isinstance(val, (int, float)):
        return float(val)
    val_str = str(val).replace('₹', '').replace('$', '').replace(',', '').strip()
    try:
        return float(val_str)
    except ValueError:
        return None

def clean_date(val: Any) -> Optional[str]:
    if is_null_or_empty(val):
        return None
    if isinstance(val, (datetime, date)):
        return val.strftime('%Y-%m-%d')
    val_str = str(val).strip()
    
    for fmt in ('%Y-%m-%d', '%d-%m-%Y', '%Y/%m/%d', '%d/%m/%Y', '%b-%y', '%B %Y'):
        try:
            dt = datetime.strptime(val_str, fmt)
            return dt.strftime('%Y-%m-%d')
        except ValueError:
            pass
    iso_match = re.search(r'\d{4}-\d{2}-\d{2}', val_str)
    if iso_match:
        return iso_match.group(0)
    return val_str

def get_quarter_from_date(date_str: Optional[str]) -> Optional[str]:
    if not date_str:
        return None
    try:
        dt = datetime.strptime(date_str[:10], '%Y-%m-%d')
        q = (dt.month - 1) // 3 + 1
        return f"Q{q} {dt.year}"
    except (ValueError, TypeError):
        return None

def clean_sector(val: Any) -> str:
    cleaned = clean_text(val)
    if not cleaned:
        return "Others / Unspecified"
    
    val_lower = cleaned.lower()
    if 'mine' in val_lower or 'mining' in val_lower:
        return "Mining"
    elif 'renew' in val_lower or 'solar' in val_lower or 'wind' in val_lower:
        return "Renewables"
    elif 'rail' in val_lower or 'railway' in val_lower:
        return "Railways"
    elif 'power' in val_lower or 'line' in val_lower:
        return "Powerline"
    elif 'construct' in val_lower or 'infra' in val_lower:
        return "Construction"
    elif 'dsp' in val_lower:
        return "DSP"
    elif 'tender' in val_lower:
        return "Tender"
    else:
        return cleaned.title()

def clean_deal_status(val: Any) -> str:
    cleaned = clean_text(val)
    if not cleaned:
        return "Open"
    val_lower = cleaned.lower()
    if 'won' in val_lower or 'closed won' in val_lower:
        return "Won"
    elif 'dead' in val_lower or 'lost' in val_lower:
        return "Dead"
    elif 'hold' in val_lower:
        return "On Hold"
    elif 'open' in val_lower or 'lead' in val_lower or 'proposal' in val_lower:
        return "Open"
    return cleaned.title()

def clean_deal_stage(val: Any) -> str:
    cleaned = clean_text(val)
    if not cleaned:
        return "Unknown Stage"
    cleaned = re.sub(r'^[A-Z]\.\s*', '', cleaned)
    return cleaned

def clean_wo_execution_status(val: Any) -> str:
    cleaned = clean_text(val)
    if not cleaned:
        return "Ongoing"
    val_lower = cleaned.lower()
    if 'partial' in val_lower:
        return "Ongoing"
    elif 'complet' in val_lower or 'closed' in val_lower:
        return "Completed"
    elif 'delay' in val_lower or 'stuck' in val_lower or 'pause' in val_lower or 'pending' in val_lower:
        return "Delayed"
    elif 'hold' in val_lower:
        return "On Hold"
    elif 'ongoing' in val_lower or 'executed' in val_lower or 'in progress' in val_lower or 'open' in val_lower or 'not started' in val_lower:
        return "Ongoing"
    return cleaned.title()

def normalize_deal_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    return {
        "raw": raw,
        "deal_name": clean_text(raw.get("Deal Name") or raw.get("name")),
        "owner_code": clean_text(raw.get("Owner code")),
        "client_code": clean_text(raw.get("Client Code")),
        "deal_status": clean_deal_status(raw.get("Deal Status")),
        "close_date": clean_date(raw.get("Close Date (A)")),
        "closure_probability": clean_text(raw.get("Closure Probability")),
        "deal_value": clean_currency(raw.get("Masked Deal value")),
        "tentative_close_date": clean_date(raw.get("Tentative Close Date")),
        "deal_stage": clean_deal_stage(raw.get("Deal Stage")),
        "product_deal": clean_text(raw.get("Product deal")),
        "sector": clean_sector(raw.get("Sector/service")),
        "created_date": clean_date(raw.get("Created Date")),
        "quarter": get_quarter_from_date(clean_date(raw.get("Tentative Close Date") or raw.get("Close Date (A)") or raw.get("Created Date"))),
    }

def normalize_work_order_record(raw: Dict[str, Any]) -> Dict[str, Any]:
    amount_excl = clean_currency(raw.get("Amount in Rupees (Excl of GST) (Masked)"))
    billed_excl = clean_currency(raw.get("Billed Value in Rupees (Excl of GST.) (Masked)"))
    receivable = clean_currency(raw.get("Amount Receivable (Masked)"))
    
    return {
        "raw": raw,
        "deal_name": clean_text(raw.get("Deal name masked") or raw.get("name")),
        "client_code": clean_text(raw.get("Customer Name Code")),
        "serial_no": clean_text(raw.get("Serial #")),
        "nature_of_work": clean_text(raw.get("Nature of Work")),
        "execution_status": clean_wo_execution_status(raw.get("Execution Status")),
        "data_delivery_date": clean_date(raw.get("Data Delivery Date")),
        "po_date": clean_date(raw.get("Date of PO/LOI")),
        "document_type": clean_text(raw.get("Document Type")),
        "owner_code": clean_text(raw.get("BD/KAM Personnel code")),
        "sector": clean_sector(raw.get("Sector")),
        "type_of_work": clean_text(raw.get("Type of Work")),
        "skylark_software": clean_text(raw.get("Is any Skylark software platform part of the client deliverables in this deal?")),
        "amount_excl_gst": amount_excl,
        "billed_value_excl_gst": billed_excl,
        "amount_receivable": receivable,
        "invoice_status": clean_text(raw.get("Invoice Status")),
        "wo_status": clean_text(raw.get("WO Status (billed)")),
        "billing_status": clean_text(raw.get("Billing Status")),
    }
