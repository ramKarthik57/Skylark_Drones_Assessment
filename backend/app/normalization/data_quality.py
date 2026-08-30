from typing import List, Dict, Any

def audit_data_quality(deals: List[Dict[str, Any]], work_orders: List[Dict[str, Any]]) -> List[str]:
    notes = []
    
    # Audit Deals
    missing_close_dates = sum(1 for d in deals if d.get('deal_status') == 'Open' and not d.get('tentative_close_date'))
    missing_probability = sum(1 for d in deals if d.get('deal_status') == 'Open' and not d.get('closure_probability'))
    missing_deal_value = sum(1 for d in deals if d.get('deal_status') == 'Open' and d.get('deal_value') is None)
    unassigned_deals = sum(1 for d in deals if not d.get('owner_code'))
    unassigned_sector = sum(1 for d in deals if d.get('sector') == 'Others / Unspecified')

    if missing_close_dates > 0:
        notes.append(f"{missing_close_dates} open deal(s) are missing tentative close dates (affects quarter forecasting).")
    if missing_probability > 0:
        notes.append(f"{missing_probability} open deal(s) lack closure probability ratings (probability fallback defaults applied).")
    if missing_deal_value > 0:
        notes.append(f"{missing_deal_value} open deal(s) have unrecorded deal values.")
    if unassigned_deals > 0:
        notes.append(f"{unassigned_deals} deal(s) have missing BD/KAM owner assignments.")
    if unassigned_sector > 0:
        notes.append(f"{unassigned_sector} deal(s) have unclassified sector metadata.")

    # Audit Work Orders
    delayed_wos = sum(1 for w in work_orders if w.get('execution_status') == 'Delayed')
    missing_wo_amount = sum(1 for w in work_orders if w.get('amount_excl_gst') is None)
    unbilled_completed = sum(1 for w in work_orders if w.get('execution_status') == 'Completed' and (w.get('invoice_status') in ['Not billed yet', None] or w.get('billed_value_excl_gst') == 0))

    if delayed_wos > 0:
        notes.append(f"{delayed_wos} work order(s) are flagged as Execution Delayed.")
    if missing_wo_amount > 0:
        notes.append(f"{missing_wo_amount} work order(s) have missing contract financial values.")
    if unbilled_completed > 0:
        notes.append(f"{unbilled_completed} completed work order(s) remain unbilled or pending invoice generation.")

    return notes
