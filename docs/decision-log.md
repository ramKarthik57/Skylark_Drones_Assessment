# Skylark Executive Intelligence — Decision Log

## 1. Key Assumptions & Semantic Interpretations

* **Active Pipeline Definition**: Deals with normalized status `Open` constitute active pipeline (**₹68.82 Cr** across 50 deals). `Won` deals represent closed revenue (**₹9.50 Cr**). `Dead` deals represent lost pipeline (**₹152.23 Cr**).
* **Weighted Forecast Coverage**: Open deals use explicit closure probabilities (`High` = 80%, `Medium` = 50%, `Low` = 20%). 258 unrated deals use a baseline 30% calculation, and probability coverage (25.5%) is explicitly reported to leadership.
* **Win Rate Denominator**: Win Rate is calculated strictly as `Won / (Won + Dead)` = `163 / (163 + 127)` = **56.2%**, explicitly displaying the denominator of 290 decided opportunities.
* **Quarterly Close Semantics**: *"This quarter"* queries are interpreted against `Tentative Close Date` / `Close Date` for opportunities expected to close in Q1/Q2 2026.
* **Cross-Board Linkage**: `Deal Name` ↔ `Deal name masked` has a quantified **89.7% match rate** (52/58 matched). Client codes use namespace prefixes (`COMPANY089` vs `WOCOMPANY_002`).

---

## 2. Differentiated Architectural Decisions

* **Deterministic BI & Risk Engine**: 100% of arithmetic, risk rules (Execution Risk, Forecast Risk, Concentration Risk), and data trust scores are calculated programmatically in Python before LLM synthesis, preventing arithmetic hallucinations.
* **Multi-Dimensional Data Trust Engine**: Evaluates completeness (72.8%), date coverage (89.1%), probability coverage (25.5%), sector mapping (96.5%), and cross-board match confidence (89.7%) to produce a mathematically transparent overall confidence rating.
* **Adversarial & Unsupported Query Refusal**: Refuses un-supported business questions (e.g. EBITDA, employee salaries) gracefully, protecting model integrity.
* **Strict Production API Safety**: In `APP_ENV=production`, unconfigured Monday.com credentials raise explicit API errors rather than silently falling back. The UI header explicitly displays `● LIVE — Monday.com` (emerald) vs `● DEMO — Mock Data` (amber).

---

## 3. Leadership Briefs & Evidence Layer

* **"What Leadership Should Know"**: Generates 3–5 evidence-backed signal cards directly on the Executive Command Center landing dashboard.
* **Evidence-First AI Answers**: Structures assistant responses into `ANSWER`, `EVIDENCE`, `WHY IT MATTERS`, `DATA QUALITY`, and `RECOMMENDED ACTION`.
* **Leadership Brief Exporter**: Features 1-click Markdown file download and Copy to Clipboard.

---

## 4. What Would Be Different with More Time

1. **Role-Based Access Control (RBAC)**: Restricting sensitive financial contract metrics by user role.
2. **Time-Series Snapshot Store**: Persisting daily Monday.com board snapshots to compute genuine monthly sales-vs-execution velocity rates.
3. **Bi-directional Monday.com Writeback**: Updating missing close dates directly from the AI workspace.
