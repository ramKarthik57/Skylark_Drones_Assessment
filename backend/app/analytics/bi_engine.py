from typing import List, Dict, Any, Optional

def calculate_bi_analytics(
    deals: List[Dict[str, Any]],
    work_orders: List[Dict[str, Any]],
    sector_filter: Optional[str] = None,
    quarter_filter: Optional[str] = None
) -> Dict[str, Any]:
    # Sector Filtering
    filtered_deals = deals
    filtered_wos = work_orders

    if sector_filter:
        sec_lower = sector_filter.lower()
        filtered_deals = [d for d in deals if d.get("sector") and sec_lower in d["sector"].lower()]
        filtered_wos = [w for w in work_orders if w.get("sector") and sec_lower in w["sector"].lower()]

    # Deals Summary Metrics
    total_deal_count = len(filtered_deals)
    open_deals = [d for d in filtered_deals if d.get("deal_status") == "Open"]
    won_deals = [d for d in filtered_deals if d.get("deal_status") == "Won"]
    dead_deals = [d for d in filtered_deals if d.get("deal_status") == "Dead"]
    on_hold_deals = [d for d in filtered_deals if d.get("deal_status") == "On Hold"]

    open_deal_count = len(open_deals)
    won_deal_count = len(won_deals)
    dead_deal_count = len(dead_deals)
    decided_deal_count = won_deal_count + dead_deal_count

    # Pipeline Financial Calculations
    open_pipeline_value = sum(d.get("deal_value") or 0.0 for d in open_deals)
    won_revenue_value = sum(d.get("deal_value") or 0.0 for d in won_deals)

    # Weighted Pipeline Calculation
    weighted_pipeline_value = 0.0
    open_deals_with_prob = 0
    open_deals_missing_prob = 0

    for d in open_deals:
        prob = str(d.get("closure_probability") or "").strip().lower()
        val = d.get("deal_value") or 0.0

        if prob == "high":
            weighted_pipeline_value += val * 0.8
            open_deals_with_prob += 1
        elif prob == "medium":
            weighted_pipeline_value += val * 0.5
            open_deals_with_prob += 1
        elif prob == "low":
            weighted_pipeline_value += val * 0.2
            open_deals_with_prob += 1
        elif prob.endswith("%"):
            try:
                num_pct = float(prob.replace("%", "").strip()) / 100.0
                weighted_pipeline_value += val * num_pct
                open_deals_with_prob += 1
            except ValueError:
                weighted_pipeline_value += val * 0.3
                open_deals_missing_prob += 1
        else:
            weighted_pipeline_value += val * 0.3
            open_deals_missing_prob += 1

    # Win Rate Calculation
    win_rate = round((won_deal_count / decided_deal_count) * 100.0, 1) if decided_deal_count > 0 else 0.0
    avg_deal_size = round(open_pipeline_value / open_deal_count, 2) if open_deal_count > 0 else 0.0

    # Quarter Filtering (Tentative Close Date / Close Date)
    this_quarter_deals = []
    for d in open_deals:
        close_dt = d.get("tentative_close_date") or d.get("close_date") or ""
        qtr = d.get("quarter") or ""
        if quarter_filter and quarter_filter != "THIS_QUARTER":
            if qtr == quarter_filter or quarter_filter.lower() in close_dt.lower():
                this_quarter_deals.append(d)
        else:
            if "2026" in close_dt or qtr in ["Q1 2026", "Q2 2026"]:
                this_quarter_deals.append(d)

    this_quarter_deal_count = len(this_quarter_deals)
    this_quarter_pipeline_value = sum(d.get("deal_value") or 0.0 for d in this_quarter_deals)

    # Sector Breakdown (Deals)
    sector_deals_map: Dict[str, Dict[str, Any]] = {}
    for d in filtered_deals:
        sec = d.get("sector") or "Others / Unspecified"
        if sec not in sector_deals_map:
            sector_deals_map[sec] = {"open_pipeline": 0.0, "won_revenue": 0.0, "open_deals": 0, "won_deals": 0}
        
        status = d.get("deal_status")
        val = d.get("deal_value") or 0.0
        if status == "Open":
            sector_deals_map[sec]["open_pipeline"] += val
            sector_deals_map[sec]["open_deals"] += 1
        elif status == "Won":
            sector_deals_map[sec]["won_revenue"] += val
            sector_deals_map[sec]["won_deals"] += 1

    sector_breakdown = [
        {"sector": k, **v} for k, v in sorted(sector_deals_map.items(), key=lambda x: x[1]["open_pipeline"], reverse=True)
    ]

    # Stage Breakdown (Deals)
    stage_deals_map: Dict[str, Dict[str, Any]] = {}
    for d in filtered_deals:
        stg = d.get("stage") or "Unspecified Stage"
        if stg not in stage_deals_map:
            stage_deals_map[stg] = {"count": 0, "total_val": 0.0}
        stage_deals_map[stg]["count"] += 1
        stage_deals_map[stg]["total_val"] += d.get("deal_value") or 0.0

    stage_breakdown = [{"stage": k, **v} for k, v in stage_deals_map.items()]

    # Top Opportunities
    sorted_open_deals = sorted(open_deals, key=lambda x: x.get("deal_value") or 0.0, reverse=True)
    top_opportunities = [
        {
            "deal_name": d.get("deal_name", "Un-named Deal"),
            "client_code": d.get("client_code", "N/A"),
            "sector": d.get("sector", "Others"),
            "deal_value": d.get("deal_value") or 0.0,
            "probability": d.get("closure_probability") or "Unrated",
            "tentative_close": d.get("tentative_close_date") or "N/A"
        }
        for d in sorted_open_deals[:5]
    ]

    # Work Orders Summary Metrics
    total_wo_count = len(filtered_wos)
    ongoing_wos = [w for w in filtered_wos if w.get("execution_status") == "Ongoing"]
    delayed_wos = [w for w in filtered_wos if w.get("execution_status") == "Delayed"]
    completed_wos = [w for w in filtered_wos if w.get("execution_status") == "Completed"]
    on_hold_wos = [w for w in filtered_wos if w.get("execution_status") == "On Hold"]

    active_wo_count = len(ongoing_wos) + len(delayed_wos)
    delayed_count = len(delayed_wos)
    ongoing_count = len(ongoing_wos)
    completed_count = len(completed_wos)

    total_wo_contract_value = sum(w.get("amount_excl_gst") or 0.0 for w in filtered_wos)
    total_billed_value = sum(w.get("billed_value_excl_gst") or 0.0 for w in filtered_wos)
    total_receivable_value = sum(w.get("amount_receivable") or 0.0 for w in filtered_wos)

    billing_completion_rate = round((total_billed_value / total_wo_contract_value) * 100.0, 1) if total_wo_contract_value > 0 else 0.0

    # Sector Breakdown (Work Orders)
    sector_wo_map: Dict[str, Dict[str, Any]] = {}
    for w in filtered_wos:
        sec = w.get("sector") or "Others / Unspecified"
        if sec not in sector_wo_map:
            sector_wo_map[sec] = {"active_wos": 0, "delayed_wos": 0, "total_wo_val": 0.0}
        
        status = w.get("execution_status")
        val = w.get("amount_excl_gst") or 0.0
        sector_wo_map[sec]["total_wo_val"] += val
        if status in ["Ongoing", "Delayed"]:
            sector_wo_map[sec]["active_wos"] += 1
        if status == "Delayed":
            sector_wo_map[sec]["delayed_wos"] += 1

    wo_sector_breakdown = [{"sector": k, **v} for k, v in sector_wo_map.items()]

    # Cross-Board Metrics
    deal_names_set = set(d.get("deal_name", "").lower() for d in deals if d.get("deal_name"))
    wo_deal_names = [w.get("deal_name", "").lower() for w in work_orders if w.get("deal_name")]
    matched_wo_deals = [name for name in wo_deal_names if name in deal_names_set]

    matched_count = len(set(matched_wo_deals))
    total_unique_wo_deals = len(set(wo_deal_names))
    cross_board_match_rate = round((matched_count / total_unique_wo_deals) * 100.0, 1) if total_unique_wo_deals > 0 else 0.0

    sales_vs_execution_gap = open_pipeline_value - total_wo_contract_value

    return {
        "filters": {
            "sector": sector_filter,
            "quarter": quarter_filter
        },
        "deals_summary": {
            "total_deal_count": total_deal_count,
            "open_deal_count": open_deal_count,
            "this_quarter_deal_count": this_quarter_deal_count,
            "this_quarter_pipeline_value": this_quarter_pipeline_value,
            "won_deal_count": won_deal_count,
            "dead_deal_count": dead_deal_count,
            "decided_deal_count": decided_deal_count,
            "on_hold_deal_count": len(on_hold_deals),
            "open_pipeline_value": open_pipeline_value,
            "weighted_pipeline_value": weighted_pipeline_value,
            "open_deals_with_prob": open_deals_with_prob,
            "open_deals_missing_prob": open_deals_missing_prob,
            "won_revenue_value": won_revenue_value,
            "win_rate": win_rate,
            "avg_deal_size": avg_deal_size,
            "top_opportunities": top_opportunities,
            "sector_breakdown": sector_breakdown,
            "stage_breakdown": stage_breakdown
        },
        "work_orders_summary": {
            "total_wo_count": total_wo_count,
            "active_wo_count": active_wo_count,
            "ongoing_count": ongoing_count,
            "delayed_count": delayed_count,
            "completed_count": completed_count,
            "on_hold_count": len(on_hold_wos),
            "total_wo_contract_value": total_wo_contract_value,
            "total_billed_value": total_billed_value,
            "total_receivable_value": total_receivable_value,
            "billing_completion_rate": billing_completion_rate,
            "sector_breakdown": wo_sector_breakdown
        },
        "cross_board_metrics": {
            "cross_board_match_rate": cross_board_match_rate,
            "matched_deals_count": matched_count,
            "sales_vs_execution_gap": sales_vs_execution_gap,
            "velocity_status": "Volume Gap Analysis (Requires snapshot history for true time-series rate)"
        }
    }
