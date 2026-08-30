from typing import List, Dict, Any

def calculate_risk_radar(bi_data: Dict[str, Any], data_quality_notes: List[str]) -> List[Dict[str, Any]]:
    risks = []
    ds = bi_data["deals_summary"]
    wos = bi_data["work_orders_summary"]
    cross = bi_data["cross_board_metrics"]

    # 1. Execution Risk
    if wos["delayed_count"] > 0:
        delayed_val = sum(s["total_wo_val"] for s in wos["sector_breakdown"] if s.get("delayed_wos", 0) > 0)
        risks.append({
            "id": "risk-exec-1",
            "category": "Execution Risk",
            "severity": "HIGH",
            "title": f"{wos['delayed_count']} Work Orders Execution Delayed",
            "impact": "Project execution bottlenecks flag potential revenue recognition slippage and client dissatisfaction.",
            "evidence": [
                f"{wos['delayed_count']} delayed work orders identified",
                f"{wos['active_wo_count']} total active work orders",
                f"₹{round(wos['total_receivable_value']/10000000, 2)} Cr outstanding receivables"
            ],
            "action": "Schedule immediate operational review with KAMs on delayed projects to clear execution blockers."
        })

    # 2. Forecast Data Risk
    if ds["open_deals_missing_prob"] > 0:
        risks.append({
            "id": "risk-forecast-1",
            "category": "Forecast Risk",
            "severity": "HIGH",
            "title": f"{ds['open_deals_missing_prob']} Open Deals Lack Probability Ratings",
            "impact": "Weighted pipeline forecast relies on baseline 30% estimates, increasing quarterly revenue uncertainty.",
            "evidence": [
                f"{ds['open_deals_missing_prob']} out of {ds['open_deal_count']} open deals lack probability ratings",
                f"Total Active Pipeline: ₹{round(ds['open_pipeline_value']/10000000, 2)} Cr",
                f"Weighted Pipeline Forecast: ₹{round(ds['weighted_pipeline_value']/10000000, 2)} Cr"
            ],
            "action": "Enforce mandatory closure probability updates for top active sales opportunities."
        })

    # 3. Pipeline Concentration Risk
    if ds["top_opportunities"]:
        top3_val = sum(d["deal_value"] or 0.0 for d in ds["top_opportunities"][:3])
        if ds["open_pipeline_value"] > 0:
            top3_pct = round((top3_val / ds["open_pipeline_value"]) * 100.0, 1)
            if top3_pct >= 35.0:
                risks.append({
                    "id": "risk-conc-1",
                    "category": "Concentration Risk",
                    "severity": "MEDIUM",
                    "title": f"Top 3 Opportunities Account for {top3_pct}% of Pipeline",
                    "impact": "Commercial pipeline is heavily concentrated in a small number of large deals.",
                    "evidence": [
                        f"Top 3 Deals Value: ₹{round(top3_val/10000000, 2)} Cr ({top3_pct}% of total)",
                        f"Top Opportunity: {ds['top_opportunities'][0]['deal_name']} (₹{round((ds['top_opportunities'][0]['deal_value'] or 0)/100000, 1)} L)"
                    ],
                    "action": "Executive sponsors should engage directly with key clients on top 3 opportunities."
                })

    # 4. Cross-Board Data Linkage Risk
    if cross["cross_board_match_rate"] < 100.0:
        unmatched_count = wos["total_wo_count"] - cross["matched_deals_count"]
        risks.append({
            "id": "risk-linkage-1",
            "category": "Cross-Board Data Risk",
            "severity": "LOW",
            "title": f"Cross-Board Match Rate at {cross['cross_board_match_rate']}%",
            "impact": "Unmatched deal names between Deals and Work Orders boards require name standardization.",
            "evidence": [
                f"{cross['cross_board_match_rate']}% deal name match confidence",
                f"{cross['matched_deals_count']} matched work order deal names",
                f"{unmatched_count} work orders using client code namespaces"
            ],
            "action": "Standardize deal name naming conventions across CRM and Work Order Tracker."
        })

    return risks
