import pytest
from app.normalization.data_trust import calculate_data_trust

def test_data_trust_scoring():
    deals = [
        {"deal_name": "Deal 1", "deal_status": "Open", "deal_value": 1000.0, "closure_probability": "High", "sector": "Mining", "tentative_close_date": "2026-03-01"},
        {"deal_name": "Deal 2", "deal_status": "Open", "deal_value": 2000.0, "closure_probability": "Medium", "sector": "Renewables", "tentative_close_date": "2026-04-01"}
    ]
    wos = [
        {"deal_name": "Deal 1", "execution_status": "Ongoing", "amount_excl_gst": 1000.0, "sector": "Mining", "po_date": "2026-01-01"},
        {"deal_name": "Deal 3", "execution_status": "Completed", "amount_excl_gst": 500.0, "sector": "Renewables", "po_date": "2026-01-02"}
    ]

    trust = calculate_data_trust(deals, wos)

    assert trust["completeness_score"] == 100.0
    assert trust["probability_coverage_score"] == 100.0
    assert trust["date_coverage_score"] == 100.0
    assert trust["sector_coverage_score"] == 100.0
    assert trust["cross_board_match_score"] == 50.0  # 1 out of 2 matched
    assert trust["overall_confidence"] in ["HIGH CONFIDENCE", "MEDIUM CONFIDENCE"]

def test_data_trust_empty_handles():
    trust = calculate_data_trust([], [])
    assert trust["overall_confidence"] == "LOW"
    assert trust["completeness_score"] == 0.0
