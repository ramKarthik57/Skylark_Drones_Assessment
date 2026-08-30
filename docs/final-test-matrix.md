# Skylark Executive Intelligence — Final Test Matrix

This matrix documents the 37 unit, integration, edge-case, security, and data-quality test cases verifying system resilience.

---

| Category | Test Function Name | Description & Expected Outcome | Status |
| :--- | :--- | :--- | :--- |
| **Normalizer** | `test_parse_currency` | Verifies Indian Rupee symbol (`₹`), commas, decimals, and null parsing to float | **PASS** |
| **Normalizer** | `test_parse_date` | Normalizes various date formats (ISO `YYYY-MM-DD`, `DD-MM-YYYY`) to canonical ISO string | **PASS** |
| **Normalizer** | `test_normalize_status` | Maps Deals status to `Open`, `Won`, `Dead`, `On Hold` | **PASS** |
| **Normalizer** | `test_normalize_wo_status` | Maps Work Order execution status to `Ongoing`, `Delayed`, `Completed`, `On Hold` | **PASS** |
| **Normalizer** | `test_normalize_sector` | Standardizes sector taxonomy into `Mining`, `Renewables`, `Railways`, `Powerline`, `Construction` | **PASS** |
| **Normalizer** | `test_clean_record_nulls` | Replaces `nan`, `N/A`, `None` strings with explicit clean nulls | **PASS** |
| **BI Engine** | `test_bi_analytics_calculation` | Calculates active pipeline (**₹68.82 Cr**), weighted forecast, win rate (**56.5%**), active WOs (**58**) | **PASS** |
| **BI Engine** | `test_bi_analytics_sector_filter` | Filters Deals & Work Orders boards dynamically by industry sector | **PASS** |
| **BI Engine** | `test_bi_analytics_quarter_filter` | Filters active pipeline for targeted quarter based on `Tentative Close Date` | **PASS** |
| **BI Engine** | `test_bi_analytics_top_opportunities` | Sorts top sales opportunities by deal value in descending order | **PASS** |
| **BI Engine** | `test_bi_analytics_empty_dataset` | Safe zero-value defaults on empty board payloads without division-by-zero crashes | **PASS** |
| **BI Engine** | `test_bi_analytics_billing_rate` | Computes billing completion rate (`billed_value / contract_value * 100`) | **PASS** |
| **Risk Engine**| `test_risk_radar_execution_risk` | Detects delayed work order counts & triggers High Execution Risk signal | **PASS** |
| **Risk Engine**| `test_risk_radar_forecast_risk` | Identifies unrated open deals & triggers High Forecast Risk signal | **PASS** |
| **Data Trust** | `test_data_trust_scoring` | Evaluates 5-dimensional completeness, date coverage, probability coverage, sector mapping, & match rate | **PASS** |
| **Data Trust** | `test_data_trust_empty_handles` | Handles empty dataset payloads by returning Low Confidence without crashes | **PASS** |
| **Data Quality**| `test_audit_missing_dates` | Audits open deals lacking tentative close dates | **PASS** |
| **Data Quality**| `test_audit_delayed_wos` | Audits work orders flagged with `Execution Delayed` status | **PASS** |
| **Data Quality**| `test_audit_unrated_deals` | Audits open deals missing probability ratings | **PASS** |
| **Adversarial** | `test_unsupported_intents` | Classifies unsupported financial questions (EBITDA, salaries, CAC, LTV) as `unsupported` | **PASS** |
| **Adversarial** | `test_unsupported_response` | Returns explicit executive data-unavailability refusal for EBITDA queries | **PASS** |
| **Security** | `test_prompt_injection_intent` | Detects prompt injection attempts (`reveal system prompt / API key`) | **PASS** |
| **Security** | `test_prompt_injection_response` | Refuses system prompt / credential exfiltration with Security Refusal notice | **PASS** |
| **Edge Cases** | `test_extreme_deal_values` | Handles ₹1,00,00,00,000 mega-deals and ₹0 deals without numeric overflow | **PASS** |
| **Edge Cases** | `test_probability_edge_values` | Parses explicit `100%` and `0%` closure probability strings | **PASS** |
| **Edge Cases** | `test_one_to_many_wo_join` | Prevents deal value double-counting when multiple work orders map to 1 deal | **PASS** |
| **Edge Cases** | `test_unknown_status_handling` | Safely isolates unknown custom deal statuses from active pipeline totals | **PASS** |
| **Agent Router**| `test_intent_classification` | Classifies pipeline, sector, work order, cross-board, & ambiguous intent phrasings | **PASS** |
| **Agent Router**| `test_process_pipeline_query` | Executes end-to-end pipeline intent processing | **PASS** |
| **Agent Router**| `test_process_ambiguous_query` | Renders interactive clarification options for vague questions (*"How are we doing?"*) | **PASS** |
| **Agent Router**| `test_generate_leadership_brief` | Generates full founder briefing report with Markdown output | **PASS** |
| **Agent Router**| `test_process_sector_query` | Extracts sector entities & filters BI analytics for Mining/Renewables | **PASS** |
| **Agent Router**| `test_process_wo_query` | Processes active & delayed work order workload queries | **PASS** |
| **API Server** | `test_chat_endpoint_valid` | Integration test for FastAPI `/api/chat` POST route | **PASS** |
| **API Server** | `test_chat_endpoint_empty` | Returns HTTP 400 Bad Request on empty message payloads | **PASS** |
| **API Server** | `test_leadership_endpoint` | Integration test for FastAPI `/api/leadership-update` GET route | **PASS** |
| **API Server** | `test_boards_status_endpoint` | Integration test for FastAPI `/api/boards/status` GET route | **PASS** |
