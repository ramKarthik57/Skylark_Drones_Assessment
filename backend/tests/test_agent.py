import pytest
from app.agent.agent import classify_intent_and_entities, process_agent_query, generate_leadership_update

def test_intent_classification():
    intent, is_ambiguous, sector, qtr = classify_intent_and_entities("How is our pipeline looking this quarter?")
    assert intent == "PIPELINE_OVERVIEW"
    assert is_ambiguous is False

    intent, is_ambiguous, sector, qtr = classify_intent_and_entities("How are we doing?")
    assert intent == "ambiguous"
    assert is_ambiguous is True

    intent, is_ambiguous, sector, qtr = classify_intent_and_entities("How are we performing in Mining?")
    assert intent == "SECTOR_PERFORMANCE"
    assert sector == "Mining"

def test_process_agent_query_pipeline():
    res = process_agent_query("How is our pipeline looking this quarter?")
    assert res.intent == "PIPELINE_OVERVIEW"
    assert res.clarification_needed is False
    assert res.bi_data is not None
    assert res.bi_data["deals_summary"]["open_deal_count"] > 0

def test_process_agent_query_ambiguous():
    res = process_agent_query("How are we doing?")
    assert res.intent == "ambiguous"
    assert res.clarification_needed is True
    assert len(res.suggested_questions) > 0

def test_generate_leadership_update():
    res = generate_leadership_update()
    assert "LEADERSHIP BRIEFING" in res.markdown_report
    assert res.bi_data is not None
    assert res.risk_radar is not None
    assert res.data_trust is not None

def test_process_agent_query_sector():
    res = process_agent_query("How are we performing in Mining sector?")
    assert res.intent == "SECTOR_PERFORMANCE"

def test_process_agent_query_work_orders():
    res = process_agent_query("Show me delayed work orders")
    assert res.intent == "WORK_ORDER_DELAY"
    assert res.bi_data["work_orders_summary"]["delayed_count"] >= 0
