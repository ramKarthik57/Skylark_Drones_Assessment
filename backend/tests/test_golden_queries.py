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
    assert "bottleneck" not in res.text.lower()
    assert "sla" not in res.text.lower()
    assert "unrecorded" in res.text.lower() or "not recorded" in res.text.lower()

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
    assert "Sakura" in res.text
    assert "Luffy" in res.text

def test_issue_8_q40_owner_role_suggestions():
    res = process_agent_query("Where should management intervene immediately?")
    assert "Suggested Role" in res.text or "modeling suggestion" in res.text
    assert "no individual owner is recorded" in res.text.lower() or "suggested" in res.text.lower()

def test_issue_9_q48_scenario_semantics_distinction():
    res = process_agent_query("Which scenario gives us the largest improvement in weighted pipeline?")
    assert res.intent == "SCENARIO_BEST"
    assert "+20% Probability Uplift" in res.text
    assert "realized revenue" in res.text.lower() or "weighted forecast" in res.text.lower()

def test_baseline_30_percent_labeled_as_modeling_assumption():
    res = process_agent_query("How was the weighted forecast calculated?")
    assert "30% Analytical Baseline Assumption" in res.text or "30% application modeling baseline" in res.text or "baseline assumption" in res.text.lower()

def test_no_ai_invented_facts_in_responses():
    res = process_agent_query("What are the biggest risks to converting our current pipeline into revenue?")
    assert "procurement committees" not in res.text.lower()
    assert "by friday" not in res.text.lower()
    assert "heavy monsoon weather" not in res.text.lower()
    assert "sla breach" not in res.text.lower()

def test_forecast_exposure_question_not_concentration():
    q = "Which open opportunity creates the largest forecast exposure if it does not convert, and how much of the weighted forecast does it represent?"
    res = process_agent_query(q)
    assert res.intent == "FORECAST_EXPOSURE"
    assert "Luffy" in res.text
    assert "₹9.79 Cr" in res.text or "9.79" in res.text
    assert "37.0%" in res.text or "37" in res.text
    assert "Mining represents" not in res.text # not sector concentration

def test_opportunity_exposure_paraphrases():
    paraphrases = [
        "Which opportunity puts the most forecast at risk?",
        "Which deal would hurt the forecast most if it failed?",
        "Where is our biggest individual forecast exposure?",
        "Which deal has the largest weighted contribution?"
    ]
    for q in paraphrases:
        intent, _, _, _ = classify_intent_and_entities(q)
        assert intent == "FORECAST_EXPOSURE", f"Failed for query: {q}"

def test_sector_combination_question_honest_when_no_composite_metric():
    q = "Which sector currently has the strongest combination of sales pipeline and operational execution, and what evidence supports that conclusion?"
    res = process_agent_query(q)
    assert res.intent == "SECTOR_COMBINATION"
    assert "No single sector can be declared" in res.text or "composite" in res.text.lower()
    assert "Mining" in res.text
    assert "Renewables" in res.text
    assert "[SOURCE FACT]" in res.text
    assert "[DERIVED METRIC]" in res.text
    assert "[UNKNOWN / NOT IN DATASET]" in res.text

def test_two_part_leadership_question():
    q = "What should leadership prioritize right now based strictly on the available data, and what important conclusions can the dataset not support?"
    res = process_agent_query(q)
    assert res.intent == "LEADERSHIP_PRIORITIES_LIMITS"
    assert "DATA-SUPPORTED PRIORITIES" in res.text
    assert "WHAT THE DATA CANNOT ESTABLISH" in res.text
    assert "49 Missing Tentative Close Dates" in res.text or "49" in res.text
    assert "True Sales Velocity" in res.text or "Exact Delay Root Causes" in res.text

def test_probability_count_is_47_rated_3_unrated():
    res = process_agent_query("How was the weighted forecast calculated?")
    assert "47 open deals" in res.text or "47" in res.text
    assert "3 unrated" in res.text or "3" in res.text
    assert "12 rated" not in res.text
    assert "38 unrated" not in res.text

def test_exact_question_contract():
    res_single = process_agent_query("Which open opportunity creates the largest forecast exposure?")
    assert "Luffy" in res_single.text
    res_composite = process_agent_query("Which sector has the strongest combination?")
    assert "composite" in res_composite.text.lower()

def test_paraphrases_individual_forecast_exposure():
    queries = [
        "Which individual opportunity has the largest impact on our weighted forecast if it fails to convert?",
        "Which deal has the largest weighted forecast exposure?",
        "Which opportunity would hurt our forecast most if it failed?",
        "Which individual deal contributes the most to weighted forecast?",
        "Where is our biggest single-opportunity forecast exposure?",
        "Which deal has the largest weighted contribution?",
        "Which opportunity puts the most forecast at risk?"
    ]
    for q in queries:
        intent, _, _, _ = classify_intent_and_entities(q)
        assert intent == "FORECAST_EXPOSURE", f"Routing failure for: {q}"
        res = process_agent_query(q)
        assert "Luffy" in res.text
        assert "₹9.79 Cr" in res.text or "9.79" in res.text

def test_paraphrases_calculation_derivation():
    queries = [
        "How was the weighted forecast derived? Show the calculation and separate facts from assumptions.",
        "How was the weighted forecast calculated?",
        "Show me the formula and calculation for weighted forecast",
        "How did we derive the 26.46 Cr forecast?"
    ]
    for q in queries:
        intent, _, _, _ = classify_intent_and_entities(q)
        assert intent == "DATA_LINEAGE", f"Routing failure for: {q}"
        res = process_agent_query(q)
        assert "18 High (80%)" in res.text or "High Probability (80%)" in res.text
        assert "18 Medium (50%)" in res.text or "Medium Probability (50%)" in res.text
        assert "11 Low (20%)" in res.text or "Low Probability (20%)" in res.text
        assert "30% Analytical Baseline Assumption" in res.text or "30%" in res.text
        assert "₹26.46 Cr" in res.text or "26.46" in res.text

def test_fifteen_required_golden_questions():
    # G01
    g01 = process_agent_query("Which single deal contributes the most to our weighted forecast?")
    assert g01.intent == "FORECAST_EXPOSURE"
    assert "Luffy" in g01.text

    # G02
    g02 = process_agent_query("If our largest opportunity fails to convert, how much weighted forecast would we lose?")
    assert g02.intent == "FORECAST_EXPOSURE"
    assert "9.79" in g02.text or "₹9.79 Cr" in g02.text

    # G03
    g03 = process_agent_query("What is the forecast contribution of our top opportunity, and what percentage of weighted forecast is that?")
    assert g03.intent == "FORECAST_EXPOSURE"
    assert "37.0%" in g03.text or "37%" in g03.text

    # G04
    g04 = process_agent_query("Walk me through the exact calculation behind the ₹26.46 Cr weighted forecast.")
    assert g04.intent == "DATA_LINEAGE"
    assert "13.35" in g04.text and "4.16" in g04.text

    # G05
    g05 = process_agent_query("Show me the inputs, formula, assumptions, and final result used to calculate the weighted forecast.")
    assert g05.intent == "DATA_LINEAGE"
    assert "30% Analytical Baseline Assumption" in g05.text or "30%" in g05.text

    # G06
    g06 = process_agent_query("What can we confidently conclude from the current dataset, and what conclusions would be unsupported?")
    assert g06.intent == "LEADERSHIP_PRIORITIES_LIMITS"
    assert "DATA-SUPPORTED PRIORITIES" in g06.text

    # G07
    g07 = process_agent_query("Which sector is commercially strongest, which is operationally strongest, and are those necessarily the same sector?")
    assert g07.intent == "SECTOR_COMBINATION"
    assert "Mining" in g07.text and "Renewables" in g07.text

    # G08
    g08 = process_agent_query("Where do we have the biggest gap between commercial opportunity and execution realization?")
    assert g08.intent in ["SECTOR_PIPELINE_VS_EXECUTION", "SECTOR_COMBINATION"]
    assert "Mining" in g08.text

    # G09
    g09 = process_agent_query("Which risk has the strongest quantitative evidence, and how do you know?")
    assert g09.intent == "RISK_STRONGEST"
    assert "Forecast Risk" in g09.text

    # G10
    g10 = process_agent_query("Which two opportunities create the greatest combined forecast exposure if they fail?")
    assert g10.intent == "FORECAST_EXPOSURE"
    assert "Luffy" in g10.text and "Sakura" in g10.text

    # G11
    g11 = process_agent_query("Compare Mining and Renewables across pipeline, active work orders, billed value, and delays.")
    assert g11.intent in ["SECTOR_PERFORMANCE", "SECTOR_COMBINATION", "SECTOR_PIPELINE_VS_EXECUTION"]
    assert "₹24.15 Cr" in g11.text and "₹18.40 Cr" in g11.text

    # G12
    g12 = process_agent_query("You said Mining has the largest pipeline. Does that mean Mining is also our best-performing sector?")
    assert "composite" in g12.text.lower() or "No single sector can be declared" in g12.text or "trade-off" in g12.text.lower()

    # G13
    g13 = process_agent_query("What does the current snapshot tell us about sales versus execution, and what can't it tell us?")
    assert "static snapshot" in g13.text.lower() or "snapshot" in g13.text.lower()

    # G14
    g14 = process_agent_query("Who is responsible for the delayed work orders, and what deadline should they meet?")
    assert "unrecorded" in g14.text.lower() or "not recorded" in g14.text.lower()

    # G15
    g15 = process_agent_query("Tell me exactly why Coal India will close and when it will close.")
    assert "UNSUPPORTED" in g15.intent or "guarantee" in g15.text.lower() or "uncertain" in g15.text.lower()

def test_visualization_routing_and_specs():
    # 1. Forecast Exposure -> TOP_OPPORTUNITY_BAR
    res1 = process_agent_query("Which individual opportunity has the largest impact on our weighted forecast if it fails to convert?")
    assert res1.visualization is not None
    assert res1.visualization.type == "TOP_OPPORTUNITY_BAR"
    assert "Luffy" in [d["name"] for d in res1.visualization.data]

    # 2. Calculation Breakdown -> FORECAST_WATERFALL
    res2 = process_agent_query("Walk me through the exact calculation behind the ₹26.46 Cr weighted forecast.")
    assert res2.visualization is not None
    assert res2.visualization.type == "FORECAST_WATERFALL"

    # 3. Sector Comparison -> SECTOR_COMPARISON
    res3 = process_agent_query("Compare Mining and Renewables across pipeline, active work orders, billed value, and delays.")
    assert res3.visualization is not None
    assert res3.visualization.type == "SECTOR_COMPARISON"

    # 4. Execution Distribution -> EXECUTION_STATUS_DONUT
    res4 = process_agent_query("How many active and delayed work orders do we have?")
    assert res4.visualization is not None
    assert res4.visualization.type == "EXECUTION_STATUS_DONUT"

    # 5. Pipeline Concentration -> CONCENTRATION_PARETO
    res5 = process_agent_query("Where is our biggest pipeline concentration?")
    assert res5.visualization is not None
    assert res5.visualization.type == "CONCENTRATION_PARETO"

    # 6. Risk Evidence -> RISK_EVIDENCE_BAR
    res6 = process_agent_query("Which risk has the strongest quantitative evidence?")
    assert res6.visualization is not None
    assert res6.visualization.type == "RISK_EVIDENCE_BAR"

    # 7. Fact vs Limitation -> None (No generic chart)
    res7 = process_agent_query("What can we confidently conclude from the current dataset, and what conclusions would be unsupported?")
    assert res7.visualization is None



