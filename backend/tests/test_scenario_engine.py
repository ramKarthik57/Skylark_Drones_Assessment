import pytest
from app.analytics.scenario_engine import run_scenario_simulation

def test_run_scenario_simulation():
    deals = [
        {"deal_stage": "Open", "deal_value": 10000000.0, "probability_num": 50.0},
        {"deal_stage": "Open", "deal_value": 20000000.0, "probability_num": 20.0}
    ]
    work_orders = []

    res = run_scenario_simulation(deals, work_orders, "probability_increase", delta_pct=10.0)
    assert res["scenario_type"] == "probability_increase"
    assert res["absolute_change"] > 0
    assert "Cr" in res["scenario_formatted"]

    res_conv = run_scenario_simulation(deals, work_orders, "pipeline_conversion", delta_pct=20.0)
    assert res_conv["scenario_type"] == "pipeline_conversion"
    assert res_conv["percentage_change"] == 20.0
