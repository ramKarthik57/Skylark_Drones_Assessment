import pytest
from app.analytics.risk_engine import calculate_risk_radar

def test_risk_radar_execution_risk():
    sample_bi = {
        "deals_summary": {
            "open_deals_missing_prob": 0,
            "open_deal_count": 10,
            "open_pipeline_value": 1000000.0,
            "weighted_pipeline_value": 800000.0,
            "top_opportunities": []
        },
        "work_orders_summary": {
            "delayed_count": 3,
            "active_wo_count": 10,
            "total_receivable_value": 500000.0,
            "sector_breakdown": [{"sector": "Mining", "delayed_wos": 3, "total_wo_val": 500000.0}]
        },
        "cross_board_metrics": {
            "cross_board_match_rate": 100.0,
            "matched_deals_count": 10
        }
    }
    risks = calculate_risk_radar(sample_bi, [])
    assert len(risks) >= 1
    exec_risk = next(r for r in risks if r["category"] == "Execution Risk")
    assert exec_risk["severity"] == "HIGH"
    assert "3 Work Orders Execution Delayed" in exec_risk["title"]

def test_risk_radar_forecast_risk():
    sample_bi = {
        "deals_summary": {
            "open_deals_missing_prob": 5,
            "open_deal_count": 10,
            "open_pipeline_value": 2000000.0,
            "weighted_pipeline_value": 1000000.0,
            "top_opportunities": []
        },
        "work_orders_summary": {
            "delayed_count": 0,
            "active_wo_count": 5,
            "total_receivable_value": 0.0,
            "sector_breakdown": []
        },
        "cross_board_metrics": {
            "cross_board_match_rate": 100.0,
            "matched_deals_count": 5
        }
    }
    risks = calculate_risk_radar(sample_bi, [])
    assert len(risks) >= 1
    forecast_risk = next(r for r in risks if r["category"] == "Forecast Risk")
    assert forecast_risk["severity"] == "HIGH"
    assert "5 Open Deals Lack Probability Ratings" in forecast_risk["title"]
