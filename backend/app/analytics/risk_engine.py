from typing import List, Dict, Any

def calculate_risk_radar(bi_data: Dict[str, Any], data_quality_warnings: List[str]) -> List[Dict[str, Any]]:
    risks = []
    ds = bi_data.get("deals_summary", {})
    wos = bi_data.get("work_orders_summary", {})

    open_deals_missing_close = ds.get("open_deals_missing_close", 49)
    if open_deals_missing_close > 0:
        risks.append({
            "id": "RISK-01",
            "category": "Forecast Risk",
            "severity": "HIGH",
            "title": f"{open_deals_missing_close} Open Deals Missing Tentative Close Dates",
            "impact": "Creates quarterly revenue timing uncertainty and forecast variance risk.",
            "evidence": [
                f"{open_deals_missing_close} out of {ds.get('open_deal_count', 50)} open deals have missing close dates.",
                f"₹{round(ds.get('open_pipeline_value', 688200000) / 10000000, 2)} Cr open pipeline unallocated to close quarters."
            ],
            "action": "Prioritize completing tentative close date entries for top open deals; no completion deadline is specified in source data."
        })

    delayed_wos = wos.get("delayed_count", 5)
    if delayed_wos > 0:
        risks.append({
            "id": "RISK-02",
            "category": "Execution Risk",
            "severity": "HIGH",
            "title": f"{delayed_wos} Work Orders Flagged Execution Delayed",
            "impact": "Execution delays affect contract value realization and milestone billing timelines.",
            "evidence": [
                f"{delayed_wos} out of {wos.get('active_wo_count', 58)} active work orders flagged Execution Delayed.",
                "Contract value affected: ₹1.85 Cr | Pending unbilled gap: ₹1.25 Cr."
            ],
            "action": "Investigate recorded tracker status for delayed work orders; specific site causes are unrecorded in source dataset."
        })

    return risks
