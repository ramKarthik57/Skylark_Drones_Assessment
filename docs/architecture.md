# Skylark Executive Intelligence — V2 System Architecture

```mermaid
flowchart TD
    subgraph Frontend [Executive Intelligence Workspace]
        NAV[Tabbed Navigation: Overview, Ask AI, Risk Radar, Data Trust, Leadership Brief]
        CC[Command Center & What Leadership Should Know Signals]
        CHAT[Evidence-First Conversational BI Chat]
        RISK_UI[Deterministic Risk Radar Cards]
        TRUST_UI[Multi-Dimensional Data Trust Center]
        BRIEF[1-Click Leadership Brief Exporter]
    end

    subgraph Backend [FastAPI Application Server]
        ROUTER[API Endpoints /api/chat, /api/leadership-update, /api/boards/status]
        AGENT[AI Agent Router & Safety Guardrails]
        RISK_ENGINE[Risk Radar Engine]
        TRUST_ENGINE[Data Trust Engine]
        BI_ENGINE[Deterministic BI Engine]
        NORM[Data Normalization Layer]
        AUDIT[Data Quality Auditor]
        MONDAY_CLIENT[Monday.com GraphQL Adapter]
    end

    subgraph MondayAPI [Monday.com API v2 GraphQL / Dataset Fallback]
        DEALS_BOARD[Deals Funnel Board]
        WO_BOARD[Work Orders Tracker Board]
    end

    NAV --> ROUTER
    CC --> ROUTER
    CHAT --> ROUTER
    RISK_UI --> ROUTER
    TRUST_UI --> ROUTER
    BRIEF --> ROUTER

    ROUTER --> AGENT
    AGENT --> MONDAY_CLIENT
    MONDAY_CLIENT --> DEALS_BOARD
    MONDAY_CLIENT --> WO_BOARD

    MONDAY_CLIENT --> NORM
    NORM --> AUDIT
    NORM --> BI_ENGINE
    NORM --> TRUST_ENGINE
    BI_ENGINE --> RISK_ENGINE

    BI_ENGINE --> AGENT
    RISK_ENGINE --> AGENT
    TRUST_ENGINE --> AGENT
    AUDIT --> AGENT

    AGENT --> CHAT
    BI_ENGINE --> CC
    RISK_ENGINE --> RISK_UI
    TRUST_ENGINE --> TRUST_UI
```

## System Workflow
1. **User Navigation / Query**: The user accesses the Executive Command Center or asks a natural language question.
2. **Adversarial / Intent Routing**: `classify_intent_and_entities` detects intent, sector/quarter entities, ambiguous queries (*"How are we doing?"*), or unsupported adversarial queries (e.g. EBITDA).
3. **Monday.com Live Data Fetch**: `MondayClient` queries Monday.com GraphQL API v2. In `APP_ENV=production`, unconfigured tokens raise explicit API errors.
4. **Data Normalization & Trust Evaluation**: Normalizes dates, currencies, and statuses; computes field completeness, date coverage, probability coverage, sector mapping, and cross-board linkage confidence.
5. **Deterministic BI & Risk Engine**: Calculates exact pipeline values, weighted forecast, win rate (56.5%), active work orders (58), delayed projects (5), and risk signals (Forecast Risk, Execution Risk, Concentration Risk).
6. **Evidence-First AI Synthesis**: Generates structured responses with `ANSWER`, `EVIDENCE`, `WHY IT MATTERS`, `DATA QUALITY`, and `RECOMMENDED ACTION`.
7. **Executive UI Workspace**: Renders command signals, interactive Recharts, risk radar cards, data trust scores, and exportable leadership briefings.
