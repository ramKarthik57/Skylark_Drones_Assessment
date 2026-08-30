import pytest
from app.analytics.action_center import generate_executive_action_center

def test_generate_executive_action_center():
    bi_data = {
        "deals_summary": {
            "open_deals_missing_prob": 10,
            "open_deal_count": 20,
            "open_pipeline_value": 50000000.0,
            "open_deals_with_prob": 10,
            "sector_breakdown": [{"sector": "Mining", "open_pipeline": 30000000.0, "open_deals": 5, "won_revenue": 10000000.0}]
        },
        "work_orders_summary": {
            "delayed_count": 5,
            "total_wo_contract_value": 20000000.0,
            "total_receivable_value": 5000000.0
        }
    }
    actions = generate_executive_action_center(bi_data, [])
    assert len(actions) == 3
    assert actions[0]["urgency"] == "IMMEDIATE"
    assert "Recovery Plan" in actions[0]["title"]
