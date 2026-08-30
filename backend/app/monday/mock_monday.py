import os
import pandas as pd
from typing import List, Dict, Any
from app.normalization.normalizer import normalize_deal_record, normalize_work_order_record

EXCEL_DEALS_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Deal funnel Data.xlsx"))
EXCEL_WO_PATH = os.path.abspath(os.path.join(os.path.dirname(__file__), "../../../Work_Order_Tracker Data.xlsx"))

def get_mock_deals() -> List[Dict[str, Any]]:
    if not os.path.exists(EXCEL_DEALS_PATH):
        return []
    df = pd.read_excel(EXCEL_DEALS_PATH, sheet_name="Deal tracker")
    records = df.to_dict(orient="records")
    normalized = [normalize_deal_record(r) for r in records]
    return [d for d in normalized if d.get("deal_name")]

def get_mock_work_orders() -> List[Dict[str, Any]]:
    if not os.path.exists(EXCEL_WO_PATH):
        return []
    df = pd.read_excel(EXCEL_WO_PATH)
    headers = df.iloc[0].to_dict()
    df_data = df.iloc[1:].copy()
    df_data.columns = [str(headers[col]).strip() for col in df.columns]

    records = df_data.to_dict(orient="records")
    normalized = [
        normalize_work_order_record(r)
        for r in records
        if str(r.get("Deal name masked")).strip() != "Deal name masked"
    ]
    return [w for w in normalized if w.get("deal_name")]
