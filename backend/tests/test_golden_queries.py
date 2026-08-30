import pytest
from app.agent.agent import classify_intent_and_entities, process_agent_query

def test_golden_queries_intent_taxonomy():
    # 1. Sector Pipeline vs Execution Realization
    q1 = "Which sectors have high pipeline but relatively weak execution realization?"
    intent1, _, _, _ = classify_intent_and_entities(q1)
    assert intent1 == "SECTOR_PIPELINE_VS_EXECUTION"

    # 2. Opportunity Forecast Slippage Risk
    q2 = "What are the biggest risks to converting our current pipeline into revenue?"
    intent2, _, _, _ = classify_intent_and_entities(q2)
    assert intent2 == "OPPORTUNITY_RISK"

    # 3. Pipeline Concentration Exposure
    q3 = "Where are we most exposed to concentration risk?"
    intent3, _, _, _ = classify_intent_and_entities(q3)
    assert intent3 == "PIPELINE_CONCENTRATION"

    # 4. Work Order Priorities
    q4 = "Which active work orders deserve immediate management attention?"
    intent4, _, _, _ = classify_intent_and_entities(q4)
    assert intent4 == "WORK_ORDER_PRIORITY"

    # 5. Forecast Data Quality
    q5 = "What data should sales leadership fix first to improve forecast reliability?"
    intent5, _, _, _ = classify_intent_and_entities(q5)
    assert intent5 == "FORECAST_DATA_QUALITY"

    # 6. Data Trust
    q6 = "How much of our pipeline is backed by explicit probability ratings?"
    intent6, _, _, _ = classify_intent_and_entities(q6)
    assert intent6 == "DATA_TRUST"

def test_issue_1_q29_q30_no_false_velocity_claim():
    res = process_agent_query("Are we selling faster than we can execute?")
    assert "static snapshot" in res.text.lower()
    assert "true sales-versus-execution velocity" in res.text.lower() or "time-series" in res.text.lower()
    assert "exceeds" not in res.text.lower() or "static dataset" in res.text.lower()

def test_issue_2_delay_causes_unsupported_not_invented():
    res = process_agent_query("What is causing our delayed work orders?")
    assert "heavy monsoon weather" not in res.text.lower()
    assert "site access restrictions" not in res.text.lower()
    assert "does not record specific" in res.text.lower() or "unrecorded" in res.text.lower()

def test_issue_3_q28_single_work_order_exposure():
    res = process_agent_query("Which delayed work order has the largest financial exposure?")
    assert res.intent == "WORK_ORDER_SINGLE_EXP"
    assert "₹1.85 Cr" in res.text
    assert "aggregates contract values" in res.text or "aggregate" in res.text.lower()

def test_issue_4_q36_three_risks_handling():
    res = process_agent_query("What are the top three business risks leadership should know about?")
    assert res.intent == "RISK_THREE_RISKS"
    assert "2 high-priority risks" in res.text
    assert "no third risk" in res.text.lower() or "threshold" in res.text.lower()

def test_issue_5_q37_strongest_risk_selection():
    res = process_agent_query("Which risk has the strongest evidence behind it?")
    assert res.intent == "RISK_STRONGEST"
    assert "Forecast Risk" in res.text
    assert "49 out of 50" in res.text or "49" in res.text

def test_issue_6_q32_pipeline_pressure():
    res = process_agent_query("Which pipeline areas are most likely to put pressure on execution?")
    assert res.intent == "PIPELINE_PRESSURE"
    assert "Mining" in res.text
    assert "Renewables" in res.text

def test_issue_7_q33_opportunity_capacity_alignment():
    res = process_agent_query("Do our biggest sales opportunities align with our current work order capacity?")
    assert res.intent == "OPPORTUNITY_ALIGNMENT"
    assert "Coal India" in res.text
    assert "Adani Solar" in res.text

def test_issue_8_q40_owner_role_suggestions():
    res = process_agent_query("Where should management intervene immediately?")
    assert "Suggested Owner Role" in res.text or "Owner Suggestion" in res.text
    assert "no assigned individual" in res.text.lower() or "suggested" in res.text.lower()

def test_issue_9_q48_scenario_semantics_distinction():
    res = process_agent_query("Which scenario gives us the largest improvement in weighted pipeline?")
    assert res.intent == "SCENARIO_BEST"
    assert "+20% Probability Uplift" in res.text
    assert "realized revenue" in res.text.lower() or "weighted forecast" in res.text.lower()

def test_no_ai_invented_facts_in_responses():
    res = process_agent_query("What are the biggest risks to converting our current pipeline into revenue?")
    assert "procurement committees" not in res.text.lower()
    assert "by friday" not in res.text.lower()
    assert "heavy monsoon weather" not in res.text.lower()
