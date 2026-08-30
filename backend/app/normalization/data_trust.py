from typing import List, Dict, Any

def calculate_data_trust(deals: List[Dict[str, Any]], work_orders: List[Dict[str, Any]]) -> Dict[str, Any]:
    total_deals = len(deals)
    total_wos = len(work_orders)
    
    if total_deals == 0 or total_wos == 0:
        return {
            "overall_confidence": "LOW",
            "completeness_score": 0.0,
            "date_coverage_score": 0.0,
            "probability_coverage_score": 0.0,
            "sector_coverage_score": 0.0,
            "cross_board_match_score": 0.0,
            "dimensions": []
        }

    # 1. Field Completeness
    populated_deal_fields = sum(1 for d in deals if d.get("deal_name") and d.get("deal_status") and d.get("deal_value") is not None)
    populated_wo_fields = sum(1 for w in work_orders if w.get("deal_name") and w.get("execution_status") and w.get("amount_excl_gst") is not None)
    completeness_score = round(((populated_deal_fields + populated_wo_fields) / (total_deals + total_wos)) * 100.0, 1)

    # 2. Date Coverage
    valid_dates_count = sum(1 for d in deals if d.get("tentative_close_date") or d.get("close_date") or d.get("created_date")) + \
                        sum(1 for w in work_orders if w.get("data_delivery_date") or w.get("po_date"))
    total_expected_date_fields = total_deals + total_wos
    date_coverage_score = round((valid_dates_count / total_expected_date_fields) * 100.0, 1) if total_expected_date_fields > 0 else 0.0

    # 3. Probability Coverage
    open_deals = [d for d in deals if d.get("deal_status") == "Open"]
    open_rated = sum(1 for d in open_deals if str(d.get("closure_probability") or "").lower() in ["high", "medium", "low"])
    probability_coverage_score = round((open_rated / len(open_deals)) * 100.0, 1) if open_deals else 0.0

    # 4. Sector Taxonomy Coverage
    classified_sectors = sum(1 for d in deals if d.get("sector") and d.get("sector") != "Others / Unspecified") + \
                         sum(1 for w in work_orders if w.get("sector") and w.get("sector") != "Others / Unspecified")
    sector_coverage_score = round((classified_sectors / (total_deals + total_wos)) * 100.0, 1)

    # 5. Cross-Board Linkage
    deal_names_set = set(d.get("deal_name", "").lower() for d in deals if d.get("deal_name"))
    wo_names_set = set(w.get("deal_name", "").lower() for w in work_orders if w.get("deal_name"))
    matched = wo_names_set.intersection(deal_names_set)
    cross_board_match_score = round((len(matched) / len(wo_names_set)) * 100.0, 1) if wo_names_set else 0.0

    # Overall Confidence Calculation
    avg_score = (completeness_score + date_coverage_score + probability_coverage_score + sector_coverage_score + cross_board_match_score) / 5.0
    if avg_score >= 80.0:
        overall_confidence = "HIGH CONFIDENCE"
    elif avg_score >= 50.0:
        overall_confidence = "MEDIUM CONFIDENCE"
    else:
        overall_confidence = "LOW CONFIDENCE"

    return {
        "overall_confidence": overall_confidence,
        "completeness_score": completeness_score,
        "date_coverage_score": date_coverage_score,
        "probability_coverage_score": probability_coverage_score,
        "sector_coverage_score": sector_coverage_score,
        "cross_board_match_score": cross_board_match_score,
        "dimensions": [
            {"name": "Field Completeness", "score": completeness_score, "desc": "Populated core record fields"},
            {"name": "Date Normalized Coverage", "score": date_coverage_score, "desc": "Valid ISO 8601 timeline dates"},
            {"name": "Probability Forecast Coverage", "score": probability_coverage_score, "desc": f"Explicit win probability ratings ({open_rated}/{len(open_deals)} open deals)"},
            {"name": "Sector Taxonomy Mapping", "score": sector_coverage_score, "desc": "Classified industry sectors"},
            {"name": "Cross-Board Linkage Confidence", "score": cross_board_match_score, "desc": f"Deal name match confidence ({len(matched)}/{len(wo_names_set)} matched)"}
        ]
    }
