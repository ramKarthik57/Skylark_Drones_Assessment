import pytest
from app.agent.agent import classify_intent_and_entities, process_agent_query

def test_unsupported_adversarial_intents():
    intent, is_amb, sector, qtr = classify_intent_and_entities("What is our company EBITDA?")
    assert intent == "unsupported"

    intent, is_amb, sector, qtr = classify_intent_and_entities("Show me employee salary data and profit margins")
    assert intent == "unsupported"

def test_unsupported_query_response():
    res = process_agent_query("What is our EBITDA?")
    assert res.intent == "unsupported"
    assert "Data Unavailability Notice" in res.text
    assert "EBITDA" in res.text
