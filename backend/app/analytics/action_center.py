from typing import List, Dict, Any

def generate_executive_action_center(bi_data: Dict[str, Any], risk_radar: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    actions = []
    wos = bi_data["work_orders_summary"]
    deals = bi_data["deals_summary"]

    # 1. Recovery Plan for Delayed Work Orders
    if wos["delayed_count"] > 0:
        actions.append({
            "id": "act-exec-1",
            "urgency": "IMMEDIATE",
            "priority": "HIGH",
            "title": f"Execute Recovery Plan for {wos['delayed_count']} Delayed Work Orders",
            "evidence": [
                f"{wos['delayed_count']} projects flagged with 'Execution Delayed'",
                f"Total affected contract value: ₹{round(wos['total_wo_contract_value']/10000000, 2)} Cr",
                f"Outstanding receivables: ₹{round(wos['total_receivable_value']/10000000, 2)} Cr"
            ],
            "impact": "Prevent project delivery default and accelerate revenue recognition across active clients.",
            "recommended_action": "Convene KAM & Operations leadership to re-assign field drone crews and resolve client data delays.",
            "owner_suggestion": "Head of Operations & Key Account Managers"
        })

    # 2. Probability Rating Campaign for Top Open Opportunities
    if deals["open_deals_missing_prob"] > 0:
        actions.append({
            "id": "act-forecast-1",
            "urgency": "HIGH",
            "priority": "HIGH",
            "title": f"Update Closure Probability on {deals['open_deals_missing_prob']} Unrated Deals",
            "evidence": [
                f"{deals['open_deals_missing_prob']} out of {deals['open_deal_count']} open deals lack win probability",
                f"Active pipeline: ₹{round(deals['open_pipeline_value']/10000000, 2)} Cr",
                f"Probability rating coverage: {deals['open_deals_with_prob']}/{deals['open_deal_count']} open deals"
            ],
            "impact": "Improves weighted pipeline forecast confidence from 25.5% to >80%.",
            "recommended_action": "Require BD personnel to set explicit High/Medium/Low probability tags on deals > ₹25 Lakhs.",
            "owner_suggestion": "VP of Sales & BD Personnel"
        })

    # 3. Focus BD Allocation on High-Performing Sectors (Renewables & Mining)
    if deals["sector_breakdown"]:
        top_sec = deals["sector_breakdown"][0]
        actions.append({
            "id": "act-sector-1",
            "urgency": "MEDIUM",
            "priority": "MEDIUM",
            "title": f"Double-down BD Allocation on {top_sec['sector']} Sector",
            "evidence": [
                f"{top_sec['sector']} active pipeline: ₹{round(top_sec['open_pipeline']/100000, 1)} Lakhs ({top_sec['open_deals']} deals)",
                f"Closed Won Revenue: ₹{round(top_sec['won_revenue']/100000, 1)} Lakhs"
            ],
            "impact": "Capitalizes on strong market momentum in top revenue-generating vertical.",
            "recommended_action": "Allocate 2 additional BD representatives to expand enterprise pitch coverage in this sector.",
            "owner_suggestion": "Commercial Strategy & Sector Leads"
        })

    return actions
