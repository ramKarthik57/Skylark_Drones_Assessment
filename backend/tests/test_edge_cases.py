import pytest
from app.analytics.bi_engine import calculate_bi_analytics

def test_extreme_deal_values():
    deals = [
        {"deal_name": "Mega Deal", "deal_status": "Open", "deal_value": 1000000000.0, "closure_probability": "High"},
        {"deal_name": "Zero Deal", "deal_status": "Open", "deal_value": 0.0, "closure_probability": "Low"}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos)
    ds = res["deals_summary"]
    assert ds["open_pipeline_value"] == 1000000000.0
    assert ds["weighted_pipeline_value"] == 800000000.0  # 80% High

def test_probability_edge_values():
    deals = [
        {"deal_name": "Prob 100", "deal_status": "Open", "deal_value": 100.0, "closure_probability": "100%"},
        {"deal_name": "Prob 0", "deal_status": "Open", "deal_value": 100.0, "closure_probability": "0%"}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos)
    ds = res["deals_summary"]
    assert ds["weighted_pipeline_value"] == 100.0  # 100 * 1.0 + 100 * 0.0

def test_one_to_many_wo_join_no_double_counting():
    deals = [
        {"deal_name": "Deal A", "deal_status": "Open", "deal_value": 500.0}
    ]
    wos = [
        {"deal_name": "Deal A", "execution_status": "Ongoing", "amount_excl_gst": 250.0},
        {"deal_name": "Deal A", "execution_status": "Completed", "amount_excl_gst": 250.0}
    ]
    res = calculate_bi_analytics(deals, wos)
    assert res["deals_summary"]["open_pipeline_value"] == 500.0  # Deal A value not duplicated
    assert res["work_orders_summary"]["total_wo_contract_value"] == 500.0
    assert res["cross_board_metrics"]["matched_deals_count"] == 1

def test_unknown_status_handling():
    deals = [
        {"deal_name": "Unknown Deal", "deal_status": "Custom Status", "deal_value": 300.0}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos)
    assert res["deals_summary"]["open_pipeline_value"] == 0.0  # Custom status not open
    assert res["deals_summary"]["total_deal_count"] == 1
