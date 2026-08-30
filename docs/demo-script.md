# Skylark Executive Intelligence — 5-Minute Demo Script (V2)

This script guides a 5-minute technical presentation and live demonstration of **Skylark Executive Intelligence**.

---

## ACT 1 — Executive Command Center (0:00 – 0:45)
- **Speaker**: *"Welcome. Today we are demonstrating Skylark Executive Intelligence, an executive decision-support workspace designed for founders and sales leadership to query live Monday.com Deals Funnel and Work Orders boards."*
- **Showcase**:
  - Show the connection badge (`● LIVE — Monday.com` or `● DEMO — Mock Data`).
  - Highlight the 6 Executive KPI Cards (**₹68.82 Cr Active Pipeline**, **₹26.46 Cr Weighted Forecast**, **56.5% Closed Win Rate**, **58 Active Work Orders**, **5 Execution Delayed Projects**, **₹10.74 Cr Billed Value**).
  - Walk through **"What Leadership Should Know"** signal cards (Forecast Risk, Execution Risk, Pipeline Concentration).

---

## ACT 2 — Risk Radar (0:45 – 1:30)
- **Action**: Click the **Risk Radar** tab in the navigation bar.
- **Showcase**:
  - Point to the deterministic risk signals categorized by severity (🔴 HIGH, 🟠 MEDIUM, 🔵 LOW).
  - Show Ground-Truth Evidence, Business Impact, and Recommended Action for the 5 delayed work orders and unrated deals.

---

## ACT 3 — Data Trust Center (1:30 – 2:15)
- **Action**: Click the **Data Trust** tab.
- **Speaker**: *"A major differentiator of this application is answering: 'Can leadership trust this number?' Instead of a black-box AI score, we calculate 5 mathematical dataset dimensions directly from Monday.com records."*
- **Showcase**:
  - Field Completeness (72.8%)
  - Date Normalized Coverage (89.1%)
  - Probability Rating Coverage (25.5%)
  - Sector Taxonomy Mapping (96.5%)
  - Cross-Board Linkage Confidence (89.7% match rate)

---

## ACT 4 — Evidence-First AI & Ambiguity Clarification (2:15 – 3:30)
- **Action**: Click **Ask AI** tab.
- **User Query 1**: Type `"How is our pipeline looking this quarter?"`
  - Show Evidence-First structure (`ANSWER`, `EVIDENCE`, `WHY IT MATTERS`, `RECOMMENDED ACTION`).
- **User Query 2**: Type `"How are we doing?"`
  - Show ambiguity clarification options.
- **User Query 3 (Adversarial Refusal)**: Type `"What is our company EBITDA?"`
  - Show graceful refusal: *"Data Unavailable: I do not have access to financial metrics such as EBITDA in Monday.com Deals/Work Orders boards."*

---

## ACT 5 — 1-Click Leadership Brief Exporter (3:30 – 4:15)
- **Action**: Click **Leadership Brief** in the top right header.
- **Showcase**:
  - Review formal executive update report covering Commercial Performance, Operational Health, Sector Distribution, Business Risks, Data Trust, and Action Items.
  - Demonstrate **Copy to Clipboard** and **Download .md** features.

---

## ACT 6 — Architecture & Engineering Hardening (4:15 – 5:00)
- **Flow**: `React UI -> FastAPI API -> AI Agent Router -> Deterministic BI Engine -> Risk Radar Engine -> Data Trust Engine -> Monday.com GraphQL API`.
- **Engineering Principles**:
  - **31 PyTest Unit & Integration Tests** passing 100%.
  - **Strict Production Guardrails**: Explicit API error handling in production.
  - **Deterministic Arithmetic**: 100% of metrics calculated in Python.
