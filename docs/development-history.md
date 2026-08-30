# Skylark Executive Intelligence — Engineering Evolution & Development History

This document outlines the architectural milestones and engineering rationale behind the Skylark Executive Intelligence solution.

---

## Milestone 1: Problem Definition & Data Reconciliation
- **Objective**: Analyze supplied `Deal funnel Data.xlsx` (344 records) and `Work_Order_Tracker Data.xlsx` (175 records) datasets.
- **Key Decisions**:
  - Identified data quality issues: 49 open deals missing tentative close dates, unrated deals, and 5 delayed execution work orders.
  - Reconciled cross-board deal name matching at **89.7% match rate** (52/58 work order deal names matched).
  - Established win rate calculation formula: `Won / (Won + Dead)` = `165 / (165 + 127)` = **56.5%** across 292 decided opportunities.

---

## Milestone 2: Normalization & Data Trust Architecture
- **Objective**: Build robust parsing layer in `normalizer.py` and mathematical data trust evaluation in `data_trust.py`.
- **Key Decisions**:
  - Implemented ISO 8601 date parsing (`YYYY-MM-DD`), currency symbol cleaning (`₹`), and sector taxonomy standardizations (`Mining`, `Renewables`, `Railways`, `Powerline`, `Construction`).
  - Created 5-dimensional Data Trust scoring (Completeness, Date Coverage, Probability Rating Coverage, Sector Mapping, Cross-Board Linkage Confidence).

---

## Milestone 3: Deterministic BI & Executive Risk Radar Engine
- **Objective**: Guarantee zero LLM math hallucinations by computing 100% of metrics programmatically in Python (`bi_engine.py` & `risk_engine.py`).
- **Key Decisions**:
  - Separated financial arithmetic from LLM synthesis.
  - Calculated Active Pipeline (**₹68.82 Cr**), Weighted Forecast (**₹26.46 Cr**), Billed Value (**₹10.74 Cr**), and Receivables (**₹3.63 Cr**).
  - Implemented deterministic risk signal triggers (Forecast Risk, Execution Risk, Concentration Risk, Linkage Risk).

---

## Milestone 4: Monday.com GraphQL v2 Integration & Automated Seeding
- **Objective**: Build dynamic Monday.com integration in `client.py` and automated board seeder in `seed_monday.py`.
- **Key Decisions**:
  - Built GraphQL queries for `boards`, `items_page`, and `column_values`.
  - Configured strict production safety (`APP_ENV=production`) raising explicit API errors when credentials are missing.
  - Added UI indicator displaying `● LIVE — Monday.com` (emerald) vs `● DEMO — Mock Data` (amber).

---

## Milestone 5: Structured AI Agent Router & Security Hardening
- **Objective**: Multi-step intent routing, natural language prompt pills, prompt-injection resilience, and unsupported query refusal in `agent.py`.
- **Key Decisions**:
  - Added system guardrails treating retrieved business data strictly as DATA.
  - Implemented graceful refusal cards for unsupported queries (EBITDA, CAC, LTV, salaries, churn rates).
  - Formatted assistant responses into Evidence-First structure (`ANSWER`, `EVIDENCE`, `WHY IT MATTERS`, `DATA QUALITY`, `RECOMMENDED ACTION`).

---

## Milestone 6: Executive Intelligence Workspace Frontend
- **Objective**: Build React 18 + TypeScript + Vite + Tailwind CSS dark glassmorphism dashboard (`App.tsx`).
- **Key Decisions**:
  - Designed 5-tab executive workspace (Overview, Ask AI, Risk Radar, Data Trust, Leadership Brief).
  - Built interactive Recharts visual analytics and 1-click Leadership Brief Markdown exporter.

---

## Milestone 7: Testing & CI/CD Pipeline Hardening
- **Objective**: Validate full system reliability with PyTest unit and integration tests (`tests/`) and GitHub Actions CI (`ci.yml`).
- **Key Decisions**:
  - Configured GitHub Actions workflow running automated PyTest suite and Vite production builds on Python 3.12 and Node 20.
  - Configured `pytest.ini` and `.gitattributes` for zero warning execution across OS environments.

---

## Milestone 8: Executive Action Center & Priorities Engine (V3 Upgrade)
- **Objective**: Convert deterministic risk signals into prioritized executive recovery directives (`action_center.py`).
- **Key Decisions**:
  - Built automated prioritization logic mapping delayed work orders to immediate recovery plans, owner suggestions, and business impact summaries.
  - Implemented `/api/action-center` endpoint and `ActionCenterView.tsx` tab.

---

## Milestone 9: Deterministic Scenario Analysis Engine & Provenance Audit (V3 Upgrade)
- **Objective**: Enable interactive what-if pipeline simulations and metric provenance transparency (`scenario_engine.py`).
- **Key Decisions**:
  - Built 100% deterministic scenario simulation for win probability shifts (+10%, +20%) and open pipeline conversion without mutating underlying production records.
  - Added `/api/scenario` endpoint, `ScenarioModal.tsx`, and `DataLineageModal.tsx` provenance audit trail.
  - Expanded test suite to **42 PyTest unit & integration tests**.
