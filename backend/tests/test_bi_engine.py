import pytest
from app.analytics.bi_engine import calculate_bi_analytics

def test_bi_analytics_calculation():
    sample_deals = [
        {"deal_name": "Deal A", "deal_status": "Won", "deal_value": 1000.0, "sector": "Mining"},
        {"deal_name": "Deal B", "deal_status": "Dead", "deal_value": 500.0, "sector": "Mining"},
        {"deal_name": "Deal C", "deal_status": "Open", "deal_value": 2000.0, "closure_probability": "High", "sector": "Renewables"},
        {"deal_name": "Deal D", "deal_status": "Open", "deal_value": 1000.0, "closure_probability": "Low", "sector": "Mining"}
    ]
    sample_wos = [
        {"deal_name": "Deal C", "execution_status": "Ongoing", "amount_excl_gst": 1500.0, "billed_value_excl_gst": 500.0, "amount_receivable": 200.0, "sector": "Renewables"},
        {"deal_name": "Deal E", "execution_status": "Delayed", "amount_excl_gst": 1000.0, "billed_value_excl_gst": 0.0, "amount_receivable": 0.0, "sector": "Mining"}
    ]

    res = calculate_bi_analytics(sample_deals, sample_wos)

    ds = res["deals_summary"]
    wos = res["work_orders_summary"]
    cross = res["cross_board_metrics"]

    assert ds["total_deal_count"] == 4
    assert ds["open_deal_count"] == 2
    assert ds["won_deal_count"] == 1
    assert ds["dead_deal_count"] == 1
    assert ds["decided_deal_count"] == 2
    assert ds["win_rate"] == 50.0
    assert ds["open_pipeline_value"] == 3000.0
    assert ds["weighted_pipeline_value"] == 1800.0

    assert wos["total_wo_count"] == 2
    assert wos["active_wo_count"] == 2
    assert wos["delayed_count"] == 1
    assert wos["total_wo_contract_value"] == 2500.0

    assert cross["matched_deals_count"] == 1
    assert cross["cross_board_match_rate"] == 50.0

def test_bi_analytics_sector_filter():
    deals = [
        {"deal_name": "Deal 1", "deal_status": "Open", "deal_value": 100.0, "sector": "Mining"},
        {"deal_name": "Deal 2", "deal_status": "Open", "deal_value": 200.0, "sector": "Renewables"}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos, sector_filter="Mining")
    assert res["deals_summary"]["total_deal_count"] == 1
    assert res["deals_summary"]["open_pipeline_value"] == 100.0

def test_bi_analytics_quarter_filter():
    deals = [
        {"deal_name": "Deal 1", "deal_status": "Open", "deal_value": 100.0, "quarter": "Q1 2026"},
        {"deal_name": "Deal 2", "deal_status": "Open", "deal_value": 200.0, "quarter": "Q3 2026"}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos, quarter_filter="Q1 2026")
    assert res["deals_summary"]["this_quarter_deal_count"] == 1
    assert res["deals_summary"]["this_quarter_pipeline_value"] == 100.0

def test_bi_analytics_top_opportunities_sorting():
    deals = [
        {"deal_name": "Small", "deal_status": "Open", "deal_value": 10.0},
        {"deal_name": "Large", "deal_status": "Open", "deal_value": 1000.0},
        {"deal_name": "Medium", "deal_status": "Open", "deal_value": 100.0}
    ]
    wos = []
    res = calculate_bi_analytics(deals, wos)
    top = res["deals_summary"]["top_opportunities"]
    assert top[0]["deal_name"] == "Large"
    assert top[1]["deal_name"] == "Medium"
    assert top[2]["deal_name"] == "Small"

def test_bi_analytics_empty_dataset_safety():
    res = calculate_bi_analytics([], [])
    assert res["deals_summary"]["total_deal_count"] == 0
    assert res["deals_summary"]["open_pipeline_value"] == 0.0
    assert res["deals_summary"]["win_rate"] == 0.0
    assert res["work_orders_summary"]["active_wo_count"] == 0

def test_bi_analytics_billing_completion_rate():
    wos = [
        {"execution_status": "Completed", "amount_excl_gst": 1000.0, "billed_value_excl_gst": 500.0},
        {"execution_status": "Ongoing", "amount_excl_gst": 1000.0, "billed_value_excl_gst": 500.0}
    ]
    res = calculate_bi_analytics([], wos)
    assert res["work_orders_summary"]["billing_completion_rate"] == 50.0
