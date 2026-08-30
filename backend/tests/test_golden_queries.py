import pytest
from app.agent.agent import classify_intent_and_entities, process_agent_query

def test_golden_queries_intent_taxonomy():
    # 1. Sector Pipeline vs Execution Realization
    q1 = "Which sectors have high pipeline but relatively weak execution realization?"
    intent1, _, _, _ = classify_intent_and_entities(q1)
    assert intent1 == "SECTOR_PIPELINE_VS_EXECUTION"

    # Paraphrase for q1
    q1_para = "Which sectors should leadership focus on, considering both pipeline and execution?"
    intent1_p, _, _, _ = classify_intent_and_entities(q1_para)
    assert intent1_p == "SECTOR_PIPELINE_VS_EXECUTION"

    # 2. Opportunity Forecast Slippage Risk
    q2 = "What are the biggest risks to converting our current pipeline into revenue?"
    intent2, _, _, _ = classify_intent_and_entities(q2)
    assert intent2 == "OPPORTUNITY_RISK"

    # Paraphrase for q2
    q2_para = "Which opportunities could have the biggest impact on our forecast if they slip?"
    intent2_p, _, _, _ = classify_intent_and_entities(q2_para)
    assert intent2_p == "OPPORTUNITY_RISK"

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

def test_no_ai_invented_facts_in_responses():
    res = process_agent_query("What are the biggest risks to converting our current pipeline into revenue?")
    assert "procurement committees" not in res.text.lower()
    assert "by friday" not in res.text.lower()
    assert "heavy monsoon weather" not in res.text.lower()
    assert "dataset does not" in res.text.lower() or "source" in res.text.lower()
