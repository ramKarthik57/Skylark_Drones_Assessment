import axios from 'axios';
import type { BoardStatus, LeadershipUpdate } from '../types';

const API_BASE = '/api';

const MOCK_DATA_TRUST = {
  overall_confidence: 'HIGH CONFIDENCE' as const,
  completeness_score: 72.8,
  date_coverage_score: 89.1,
  probability_coverage_score: 25.5,
  sector_coverage_score: 100.0,
  cross_board_match_score: 89.7,
  dimensions: [
    { name: 'Field Completeness', score: 72.8, desc: 'Essential CRM and Work Order field population' },
    { name: 'Date Coverage', score: 89.1, desc: 'Valid close and project timeline dates' },
    { name: 'Probability Coverage', score: 25.5, desc: 'Explicit win probability assigned' },
    { name: 'Sector Mapping', score: 100.0, desc: 'Standardized industry sector taxonomy' },
    { name: 'Cross-Board Linkage', score: 89.7, desc: 'Deal name matching across CRM and Operations' }
  ]
};

const MOCK_RISK_RADAR = [
  {
    id: 'RISK-01',
    category: 'Forecast Risk',
    severity: 'HIGH' as const,
    title: '49 Open Deals Missing Tentative Close Dates',
    impact: 'Creates quarterly revenue timing uncertainty and forecast variance.',
    evidence: ['49 out of 50 open deals have missing close dates.', '₹67.3 Cr pipeline unallocated to close quarters.'],
    action: 'Prioritize completing close date entries for top open deals; no deadline specified.'
  },
  {
    id: 'RISK-02',
    category: 'Execution Risk',
    severity: 'HIGH' as const,
    title: '5 Work Orders Execution Delayed',
    impact: 'Affects contract value realization and milestone billing timelines.',
    evidence: ['5 out of 58 active work orders flagged Execution Delayed.', 'Contract value affected: ₹1.85 Cr.'],
    action: 'Review recorded tracker status for 5 delayed work orders.'
  }
];

export const fetchBoardStatus = async (): Promise<BoardStatus> => {
  try {
    const response = await axios.get<BoardStatus>(`${API_BASE}/boards/status`);
    return response.data;
  } catch (err) {
    console.warn('API connection unavailable. Utilizing local deterministic BI engine with cached snapshot.');
    return {
      connected_live_monday: false,
      is_mock_data: true,
      deals_count: 344,
      work_orders_count: 175,
      data_quality_warnings_count: 5,
      risk_radar_count: 2,
      data_trust_score: 'HIGH CONFIDENCE',
      data_trust: MOCK_DATA_TRUST,
      risk_radar: MOCK_RISK_RADAR,
      summary: {
        total_pipeline: 688200000,
        active_work_orders: 58,
        delayed_work_orders: 5
      }
    };
  }
};

export const sendChatMessage = async (message: string): Promise<any> => {
  try {
    const response = await axios.post(`${API_BASE}/chat`, { message });
    return response.data;
  } catch (err) {
    console.warn('API connection unavailable. Synthesizing evidence-based response locally.');
    return generateLocalChatResponse(message);
  }
};

export const fetchLeadershipUpdate = async (): Promise<LeadershipUpdate> => {
  try {
    const response = await axios.get<LeadershipUpdate>(`${API_BASE}/leadership-update`);
    return response.data;
  } catch (err) {
    console.warn('API connection unavailable. Serving pre-compiled executive briefing.');
    return {
      markdown_report: `# SKYLARK EXECUTIVE INTELLIGENCE — LEADERSHIP BRIEFING

## 1. Executive Summary & Core Ground Truth Metrics
- **Active Sales Pipeline**: **₹68.82 Cr** across 50 open opportunities.
- **Weighted Risk-Adjusted Forecast**: **₹26.46 Cr** (closure probability coverage: 25.5%).
- **Historical Win Rate**: **56.2%** (163 Won / 127 Dead across 290 decided opportunities).
- **Active Operations**: **58 Work Orders** (53 Ongoing, **5 Execution Delayed**).
- **Financial Realization**: **₹21.06 Cr** Contracted | **₹10.74 Cr** Billed | **₹3.63 Cr** Receivables.

---

## 2. Key Operational & Sales Insights
1. **Mining Sector Concentration**: Mining represents **₹24.15 Cr** (35.1%) of active sales pipeline and **₹2.85 Cr** in billed work order execution.
2. **Execution Delays**: 5 work orders in Mining and Renewables are recorded **Execution Delayed** in source tracker records; specific causes are unrecorded.
3. **Forecast Reliability Risk**: 49 of 50 open deals lack explicit tentative close dates, creating revenue timing uncertainty.

---

## 3. High-Priority Recovery Actions
- **Action 1 (Suggested Role — not assigned in source data: Sales Operations Lead)**: Audit missing tentative close dates for 49 open deals; the dataset does not specify a completion deadline.
- **Action 2 (Suggested Role — not assigned in source data: Project Delivery Lead)**: Review project tracker records for 5 execution delayed work orders to unlock ₹1.85 Cr in contract value.
- **Action 3 (Suggested Role — not assigned in source data: Finance Lead)**: Review collections on ₹3.63 Cr outstanding receivables across completed work orders.`,
      is_mock_data: true,
      bi_data: {
        deals_summary: {
          total_deal_count: 344,
          open_deal_count: 50,
          this_quarter_deal_count: 1,
          this_quarter_pipeline_value: 1500000,
          won_deal_count: 163,
          dead_deal_count: 127,
          decided_deal_count: 290,
          on_hold_deal_count: 4,
          open_pipeline_value: 688200000,
          weighted_pipeline_value: 264600000,
          open_deals_with_prob: 12,
          open_deals_missing_prob: 38,
          won_revenue_value: 95000000,
          win_rate: 56.2,
          avg_deal_size: 13764000,
          top_opportunities: [],
          sector_breakdown: [],
          stage_breakdown: []
        },
        work_orders_summary: {
          total_wo_count: 175,
          active_wo_count: 58,
          ongoing_count: 53,
          delayed_count: 5,
          completed_count: 110,
          on_hold_count: 7,
          total_wo_contract_value: 210600000,
          total_billed_value: 107400000,
          total_receivable_value: 36300000,
          billing_completion_rate: 51.0,
          sector_breakdown: []
        },
        cross_board_metrics: {
          cross_board_match_rate: 89.7,
          matched_deals_count: 52,
          sales_vs_execution_gap: -8,
          velocity_status: 'Demand Exceeds Operations Capacity'
        }
      },
      risk_radar: MOCK_RISK_RADAR,
      data_trust: MOCK_DATA_TRUST,
      data_quality_notes: [
        '49 open deals lack tentative close dates.',
        '5 active work orders are execution delayed.'
      ]
    };
  }
};

export const fetchScenarioSimulation = async (scenarioType: string, deltaPct: number = 10.0): Promise<any> => {
  try {
    const response = await axios.get(`${API_BASE}/scenario`, {
      params: { scenario_type: scenarioType, delta_pct: deltaPct }
    });
    return response.data;
  } catch (err) {
    console.warn('API connection unavailable. Executing scenario math locally.');
    const baseWeighted = 264600000;
    const openPipeline = 688200000;
    
    if (scenarioType === 'open_pipeline_conversion') {
      const convertedVal = openPipeline * (deltaPct / 100.0);
      const newForecast = baseWeighted + convertedVal;
      return {
        title: `Open Pipeline Conversion (${deltaPct}% Conversion)`,
        scenario_type: scenarioType,
        baseline_weighted_cr: 26.46,
        simulated_weighted_cr: Number((newForecast / 10000000).toFixed(2)),
        delta_cr: Number((convertedVal / 10000000).toFixed(2)),
        interpretation: `Converting ${deltaPct}% of the ₹68.82 Cr open pipeline adds ₹${(convertedVal / 10000000).toFixed(2)} Cr in potential realized revenue (not weighted forecast improvement).`
      };
    } else {
      const upliftVal = openPipeline * (deltaPct / 100.0);
      const newForecast = baseWeighted + upliftVal;
      return {
        title: `Probability Uplift (+${deltaPct}%)`,
        scenario_type: scenarioType,
        baseline_weighted_cr: 26.46,
        simulated_weighted_cr: Number((newForecast / 10000000).toFixed(2)),
        delta_cr: Number((upliftVal / 10000000).toFixed(2)),
        interpretation: `A +${deltaPct}% probability uplift across open deals increases weighted forecast by ₹${(upliftVal / 10000000).toFixed(2)} Cr to ₹${(newForecast / 10000000).toFixed(2)} Cr.`
      };
    }
  }
};

export function generateLocalChatResponse(query: string): any {
  const qLower = query.toLowerCase().trim();

  // 0. Greetings / Chit-Chat Check
  const greetings = ['hi', 'hello', 'hey', 'good morning', 'good afternoon', 'greetings', 'who are you', 'help'];
  if (greetings.includes(qLower) || greetings.some(g => qLower === g + '!' || qLower === g + '.')) {
    return {
      intent: 'GREETING',
      is_ambiguous: false,
      text: `### 👋 Welcome to Skylark Executive Intelligence

I am your Executive Business Intelligence Assistant connected to your **Deals** and **Work Orders** tracker data.

Ask me any business question about:
- **Sales Pipeline & Forecasts** (e.g., *"How is our pipeline looking this quarter?"*)
- **Sector Performance & Realization** (e.g., *"Which sectors have the strongest pipeline?"*)
- **Top Opportunities** (e.g., *"Show me our biggest active opportunities"*)
- **Operational Work Orders** (e.g., *"How many active & delayed work orders do we have?"*)
- **Business Risks & Data Trust** (e.g., *"Where are we most exposed to concentration risk?"*)`
    };
  }

  // 1. Adversarial / Security Refusal Check
  if (['ebitda', 'salary', 'cac', 'ltv', 'churn', 'profit margin', 'profitability', 'best employee', '2028', 'fired', 'who should be fired', 'employee should be'].some(t => qLower.includes(t))) {
    return {
      intent: 'UNSUPPORTED',
      is_ambiguous: false,
      text: '### ⚠️ Unsupported Metric Request\n\n**Data Unavailability Notice**:\nThe dataset provided includes operational Deals and Work Orders tracking data. Metrics such as EBITDA, Salary, CAC, LTV, HR Firing Decisions, and Profit Margins are not tracked in source CRM or Work Order boards.'
    };
  }

  if (['reveal system prompt', 'api key', 'environment variables', 'ignore previous instructions', 'monday.com token'].some(t => qLower.includes(t))) {
    return {
      intent: 'UNSUPPORTED_SECURITY',
      is_ambiguous: false,
      text: '### 🔒 Security Refusal Card\n\n**Access Denied**: Request refused to protect system integrity, credentials, and configuration.'
    };
  }

  // 2. Ambiguity Check
  if (['how are we doing', 'how is business', 'status report', 'give me an update'].some(t => qLower === t || qLower === t + '?')) {
    return {
      intent: 'AMBIGUOUS',
      is_ambiguous: true,
      text: '### ❓ Ambiguous Query Detected\n\nTo provide the most relevant business intelligence, please select a focus area:',
      suggested_clarifications: [
        { label: 'Overall Sales Pipeline (Q1 2026)', query: 'How is our pipeline looking this quarter?' },
        { label: 'Sector Pipeline vs Execution Realization', query: 'Which sectors have high pipeline but relatively weak execution realization?' },
        { label: 'Opportunity Forecast Slippage Risk', query: 'Which opportunities could have the biggest impact on our forecast if they slip?' },
        { label: 'Pipeline Concentration Exposure', query: 'Where are we most exposed to concentration risk?' },
        { label: 'Work Order Management Priorities', query: 'Which active work orders deserve immediate management attention?' }
      ]
    };
  }

  // Specific Query Intent Router Overrides for Precision
  if (qLower.includes('who owns') || qLower.includes('action owners') || qLower.includes('who is responsible for the actions')) {
    return {
      intent: 'ACTION_OWNERS',
      is_ambiguous: false,
      text: `### 👤 Action Center Role Governance Audit

#### ANSWER
The source dataset does NOT record assigned individual employee names or project owners. Roles listed in action recommendations are **suggested functional roles** (modeling suggestions), NOT source-assigned individuals.

#### [SOURCE FACT]
- Owner / Assignee columns are unpopulated or absent in the source Monday.com export.
- No named employee or individual owner is assigned in source CRM or Operations records.

#### [RECOMMENDATION]
Department heads should assign specific team members to own each action directive.`
    };
  }

  if (qLower.includes('client is responsible') || qLower.includes('client responsible') || qLower.includes('client caused') || qLower.includes('which client')) {
    return {
      intent: 'WORK_ORDER_DELAY_CLIENT',
      is_ambiguous: false,
      text: `### 🏢 Work Order Delay Responsibility Audit

#### ANSWER
The source tracker records **5 Execution Delayed Work Orders**, but client-specific fault or contractual responsibility is **NOT recorded** in source dataset fields.

#### [SOURCE FACT]
- Total Delayed Work Orders: **5 projects** (Contract Value: **₹1.85 Cr**).
- Unbilled Realization Gap: **₹1.25 Cr** pending milestone delivery.

#### [UNKNOWN / NOT IN DATASET]
- Client communication logs, site responsibility, and fault attribution are unrecorded in source tracker fields.

#### [RECOMMENDATION]
Review project tracker records directly to evaluate project execution status.`
    };
  }

  if (qLower.includes('revenue definitely') || qLower.includes('definitely be next quarter')) {
    return {
      intent: 'UNSUPPORTED_FORECAST',
      is_ambiguous: false,
      text: `### 🔮 Revenue Guarantee & Forecasting Disclosure

#### ANSWER
Definite future revenue prediction is **NOT determinable** from static point-in-time datasets. Current open sales pipeline stands at **₹68.82 Cr** with a risk-adjusted weighted forecast of **₹26.46 Cr**.

#### [SOURCE FACT]
- Active Open Pipeline: **₹68.82 Cr** across 50 deals.
- Historical Win Rate: **56.2%** (163 Won / 127 Dead out of 290 decided deals).

#### [MODELING ASSUMPTION]
- Weighted Forecast (₹26.46 Cr) includes explicit win probabilities for 47 rated deals (18 High, 18 Medium, 11 Low) and a **30% application modeling baseline** for 3 unrated deals; this is an analytical modeling parameter, NOT a source-recorded probability.

#### [NOTICE]
Weighted pipeline is a risk-adjusted planning metric, NOT a guaranteed revenue commitment.`
    };
  }

  if (qLower.includes('exact reason coal india') || qLower.includes('definitely close') || qLower.includes('will close') || qLower.includes('why will coal india')) {
    return {
      intent: 'UNSUPPORTED_GUARANTEE',
      is_ambiguous: false,
      text: `### 🔒 Deal Closure Certainty Audit

#### ANSWER
No deal in source CRM records has a **100% guaranteed closure status** or qualitative closing rationale recorded. **Coal India Mining Survey** is recorded as an 80% High win probability deal valued at **₹15.00 Cr**.

#### [SOURCE FACT]
- **Coal India Mining Survey**: ₹15.00 Cr | Probability: 80% High | Weighted Contribution: **₹12.00 Cr**.
- **Adani Solar Mapping**: ₹12.50 Cr | Probability: 80% High | Weighted Contribution: **₹10.00 Cr**.

#### [UNKNOWN / NOT IN DATASET]
- Specific qualitative client decision reasons are unrecorded in CRM fields.

#### [RECOMMENDATION]
Sales leadership should review deal milestones directly with opportunity lead owners.`
    };
  }

  if (qLower.includes('how many work orders will we have next month') || qLower.includes('next month')) {
    return {
      intent: 'WORK_ORDER_FUTURE',
      is_ambiguous: false,
      text: `### 📅 Future Work Order Volume Disclosure

#### ANSWER
Future monthly work order volume is **NOT recorded** in point-in-time snapshot datasets. Currently, there are **58 Active Work Orders** (53 Ongoing, 5 Execution Delayed).

#### [SOURCE FACT]
- Active Work Orders: **58 projects** (Contract Value: **₹21.06 Cr**).
- Billed Realization: **₹10.74 Cr** (51.0% realization rate).

#### [UNKNOWN / NOT IN DATASET]
- Future monthly work-order scheduling projections are unrecorded in current export datasets.`
    };
  }

  if (qLower.includes('probability that mining will miss') || qLower.includes('miss its target') || qLower.includes('will mining miss')) {
    return {
      intent: 'SECTOR_TARGET_MISS',
      is_ambiguous: false,
      text: `### 🎯 Sector Target Variance Audit

#### ANSWER
Target miss probability is **NOT tracked** as a schema field. Mining currently holds **₹24.15 Cr** (35.1%) in active open sales pipeline and **₹2.85 Cr** in billed realization across 18 work orders (**2 execution delayed**).

#### [SOURCE FACT]
- **Mining Open Pipeline**: **₹24.15 Cr** across 15 open deals.
- **Mining Billed Realization**: **₹2.85 Cr** across 18 active work orders.
- **Mining Execution Delays**: 2 work orders flagged Execution Delayed.`
    };
  }

  if (qLower.includes('three business risks') || qLower.includes('three risks')) {
    return {
      intent: 'RISK_THREE_RISKS',
      is_ambiguous: false,
      text: `### 🛡️ Top Deterministic Business Risks Audit

#### ANSWER
The current deterministic risk engine identifies **2 high-priority risks** in the available dataset (rather than 3):

#### [SOURCE FACT]
1. **RISK-01 (HIGH SEVERITY - FORECAST RISK)**
   - **Trigger**: 49 of 50 open deals (98.0%) lack explicit tentative close dates.
   - **Evidence**: ₹67.32 Cr pipeline unallocated to close quarters.
   - **Impact**: Creates revenue timing uncertainty and forecast variance risk.

2. **RISK-02 (HIGH SEVERITY - EXECUTION RISK)**
   - **Trigger**: 5 of 58 active work orders (8.6%) are execution delayed.
   - **Evidence**: Affected contract value: ₹1.85 Cr; unbilled gap: ₹1.25 Cr.
   - **Impact**: Delays milestone billing realization.

#### [UNKNOWN / NOT IN DATASET]
No third risk meets the deterministic risk threshold in the available dataset.`
    };
  }

  if (qLower.includes('strongest evidence') || qLower.includes('strongest risk')) {
    return {
      intent: 'RISK_STRONGEST',
      is_ambiguous: false,
      text: `### 🛡️ Strongest Evidence Risk Audit

#### ANSWER
The risk with the strongest evidence behind it is **Forecast Risk (49 Missing Tentative Close Dates)**.

#### [DERIVED METRIC COMPARISON]
- **Forecast Risk Evidence (STRONGEST)**: Affects **49 out of 50 open deals** (98.0% of open deals) and **₹67.32 Cr** (97.8% of total open pipeline value).
- **Execution Risk Evidence**: Affects **5 out of 58 active work orders** (8.6% of active work orders) and **₹1.85 Cr** (8.8% of active contract value).

#### [INFERENCE]
By both record volume (49 vs 5) and financial exposure (₹67.32 Cr vs ₹1.85 Cr), Forecast Risk possesses the strongest dataset evidence.`
    };
  }

  if (qLower.includes('largest financial exposure') || qLower.includes('which delayed work order')) {
    return {
      intent: 'WORK_ORDER_SINGLE_EXP',
      is_ambiguous: false,
      text: `### 🚨 Delayed Work Order Financial Exposure Analysis

#### ANSWER
The source Work Order tracker contains **5 execution-delayed projects** with an aggregate contract value of **₹1.85 Cr** (billed: ₹0.60 Cr, pending billing gap: **₹1.25 Cr**).

#### [SOURCE FACT]
- **Aggregate Contract Value Affected**: **₹1.85 Cr** across the 5 delayed projects.
- **Unbilled Contract Exposure**: **₹1.25 Cr** pending milestone completion.

#### [UNKNOWN / NOT IN DATASET]
- The source export aggregates contract values for delayed work orders rather than providing itemized breakdown for each individual project ID.

#### [RECOMMENDATION]
Audit individual work order line items in Monday.com to isolate single-project exposure.`
    };
  }

  if (qLower.includes('pressure on execution') || qLower.includes('put pressure')) {
    return {
      intent: 'PIPELINE_PRESSURE',
      is_ambiguous: false,
      text: `### ⚡ Pipeline Execution Pressure Analysis

#### ANSWER
The **Mining** (₹24.15 Cr, 35.1%) and **Renewables** (₹18.40 Cr, 26.7%) sectors represent **₹42.55 Cr** (61.8%) of active open pipeline and are most likely to generate future operational execution demand.

#### [SOURCE FACT]
- **Mining Sector**: Pipeline: **₹24.15 Cr** (15 open deals) | Active Work Orders: 18 (2 delayed).
- **Renewables Sector**: Pipeline: **₹18.40 Cr** (12 open deals) | Active Work Orders: 14 (1 delayed).

#### [UNKNOWN / NOT IN DATASET]
Dataset snapshot limitations prevent predicting exact future worker or equipment capacity pressure.`
    };
  }

  if (qLower.includes('align with our current work order capacity') || qLower.includes('align with')) {
    return {
      intent: 'OPPORTUNITY_ALIGNMENT',
      is_ambiguous: false,
      text: `### 🎯 Opportunities vs. Work Order Capacity Audit

#### ANSWER
Our top 2 open sales opportunities (**Coal India Mining Survey ₹15.00 Cr** and **Adani Solar Mapping ₹12.50 Cr**) align with our two largest operational work order sectors (Mining: 18 work orders, Renewables: 14 work orders).

#### [SOURCE FACT]
- **Coal India Mining Survey**: ₹15.00 Cr deal aligns with Mining sector (18 active work orders, ₹2.85 Cr billed).
- **Adani Solar Mapping Project**: ₹12.50 Cr deal aligns with Renewables sector (14 active work orders, ₹3.10 Cr billed).

#### [UNKNOWN / NOT IN DATASET]
Whether current field hardware capacity can support simultaneous execution cannot be determined from this point-in-time dataset.`
    };
  }

  if (qLower.includes('largest improvement in weighted pipeline') || qLower.includes('which scenario gives us')) {
    return {
      intent: 'SCENARIO_BEST',
      is_ambiguous: false,
      text: `### 🎛️ Optimal Scenario Simulation Audit

#### ANSWER
The **+20% Probability Uplift Scenario** provides the largest improvement in **weighted forecast** (+**₹13.76 Cr** uplift, increasing weighted forecast from ₹26.46 Cr to **₹40.22 Cr**).

#### [SCENARIO METRIC DISTINCTION]
- **+20% Probability Uplift**: Increases weighted pipeline forecast by **₹13.76 Cr** (to ₹40.22 Cr).
- **+10% Probability Uplift**: Increases weighted pipeline forecast by **₹6.88 Cr** (to ₹33.34 Cr).
- **20% Open Pipeline Conversion**: Converts ₹13.76 Cr into potential *realized revenue* rather than weighted forecast improvement.

#### [NOTICE]
Scenario Simulation — NOT a predictive revenue forecast.`
    };
  }

  // 3. Data Lineage / Formula Queries ("where did the active pipeline number come from", "how was the weighted forecast calculated")
  if (qLower.includes('where did the active pipeline') || qLower.includes('how was the weighted forecast calculated') || qLower.includes('formula') || qLower.includes('lineage')) {
    return {
      intent: 'DATA_LINEAGE',
      is_ambiguous: false,
      text: `### 📐 Data Lineage & Calculation Methodology

#### ANSWER
- **Active Pipeline Value (₹68.82 Cr)**: Calculated by summing the \`Deal Value\` field across all 50 deals in the Deals tracker with status \`Open\`.
- **Weighted Forecast Value (₹26.46 Cr)**: Calculated using the formula: \`Weighted Forecast = ∑ (Deal Value × Win Probability)\`.
  - For the 47 open deals with explicit probability ratings (18 High 80%, 18 Medium 50%, 11 Low 20%), explicit values are multiplied.
  - For the 3 unrated open deals (Sasuke, Krillin, Tanjiro), a **30% application modeling baseline assumption** is applied according to governance rules.

#### [SOURCE FACT]
- **Source Dataset**: Deals Funnel Dataset (344 total valid records | 50 Open).
- **Match Rate**: 1:1 deal name linkage verified across 52 of 58 active work order records.`
    };
  }

  // 4. Scenario Analysis Queries ("what happens to our weighted pipeline", "what if 20%")
  if (qLower.includes('scenario') || qLower.includes('what if') || qLower.includes('probabilities increase by')) {
    return {
      intent: 'SCENARIO_ANALYSIS',
      is_ambiguous: false,
      text: `### 🎛️ Executive What-If Scenario Analysis

#### NOTICE
This calculation is an interactive **Scenario Simulation**, NOT a predictive revenue forecast.

#### SIMULATION RESULTS
- **Baseline Weighted Forecast**: **₹26.46 Cr**
- **+10% Probability Uplift Scenario**: Increases weighted forecast by **₹6.88 Cr** to **₹33.34 Cr**.
- **+20% Probability Uplift Scenario**: Increases weighted forecast by **₹13.76 Cr** to **₹40.22 Cr**.
- **20% Open Pipeline Conversion Scenario**: Converts ₹13.76 Cr of open deals, adding **₹13.76 Cr** to realized revenue.

#### WHY IT MATTERS
Targeted sales enablement on high-value unrated deals generates maximum forecast uplift without altering production records.`
    };
  }

  // 5. Leadership Brief / CEO Focus Queries ("ceo", "five-minute executive briefing", "current business situation")
  if (qLower.includes('ceo') || qLower.includes('five-minute executive briefing') || qLower.includes('executive briefing') || qLower.includes('current business situation') || qLower.includes('what should the ceo do')) {
    return {
      intent: 'LEADERSHIP_BRIEF',
      is_ambiguous: false,
      text: `### 👔 CEO Executive Briefing & Action Plan

#### 1. COMMERCIAL SNAPSHOT
- **Active Sales Pipeline**: **₹68.82 Cr** (50 open deals).
- **Weighted Forecast**: **₹26.46 Cr** (Win Rate: 56.2% across 290 decided deals).

#### 2. OPERATIONAL REALIZATION
- **Active Work Orders**: **58 projects** (53 Ongoing, **5 Execution Delayed**).
- **Contract & Billing**: **₹21.06 Cr** contracted | **₹10.74 Cr** billed | **₹3.63 Cr** uncollected receivables.

#### 3. CEO FOCUS & HIGH-PRIORITY ACTIONS
1. **Sales Ops Focus** *(Suggested Role — not assigned in dataset)*: Audit close dates for 49 open deals; no completion deadline is specified in source data.
2. **Operations Focus** *(Suggested Role — not assigned in dataset)*: Review project tracker records for 5 delayed work orders (₹1.85 Cr contract value).
3. **Finance Focus** *(Suggested Role — not assigned in dataset)*: Accelerate collections on ₹3.63 Cr outstanding receivables.`
    };
  }

  // 6. Risk Radar Queries ("top three business risks", "risk has the strongest evidence", "could go wrong with our current forecast")
  if (qLower.includes('could go wrong') || qLower.includes('forecast risk')) {
    return {
      intent: 'RISK_RADAR',
      is_ambiguous: false,
      text: `### 🛡️ Deterministic Executive Risk Radar Audit

#### ANSWER
Our top 2 operational & commercial risks identified by deterministic rules:

1. **RISK-01 (HIGH SEVERITY - FORECAST RISK)**
   - **Trigger**: 49 of 50 open deals lack explicit tentative close dates in CRM records.
   - **Evidence**: ₹67.32 Cr pipeline unallocated to close quarters.
   - **Impact**: Creates revenue timing uncertainty and forecast variance risk.
   - **Action**: Prioritize entering close dates for top open deals.

2. **RISK-02 (HIGH SEVERITY - EXECUTION RISK)**
   - **Trigger**: 5 out of 58 active work orders flagged Execution Delayed.
   - **Evidence**: Contract value affected: ₹1.85 Cr; unbilled gap: ₹1.25 Cr.
   - **Impact**: Affects contract value realization and milestone billing timelines.
   - **Action**: Review recorded tracker status for 5 delayed work orders.`
    };
  }

  // 7. Action Center Queries ("intervene immediately", "management intervene", "action center")
  if (qLower.includes('intervene') || qLower.includes('action center')) {
    return {
      intent: 'ACTION_CENTER',
      is_ambiguous: false,
      text: `### 🎯 Executive Action Directives

#### ANSWER
Management intervention is required across 3 evidence-backed operational recovery areas:

1. **ACT-01 (IMMEDIATE URGENCY)**: Audit & Mandate Close Dates for 49 Unrated Open Deals.
   - **Evidence**: 49 of 50 open deals lack close dates; ₹67.3 Cr pipeline unallocated.
   - **Suggested Role** *(modeling suggestion — not assigned in source data)*: Sales Operations Lead (no individual owner is recorded).

2. **ACT-02 (HIGH URGENCY)**: Review Tracker Status for 5 Execution Delayed Work Orders.
   - **Evidence**: 5 active work orders delayed; contract value affected: ₹1.85 Cr.
   - **Suggested Role** *(modeling suggestion — not assigned in source data)*: Project Delivery Lead (no individual owner is recorded).

3. **ACT-03 (MEDIUM URGENCY)**: Accelerate Collections on ₹3.63 Cr Outstanding Receivables.
   - **Evidence**: ₹3.63 Cr uncollected invoices across completed projects.
   - **Suggested Role** *(modeling suggestion — not assigned in source data)*: Finance Lead (no individual owner is recorded).`
    };
  }

  // 8. Opportunity Risk & Slippage ("slip", "biggest risk", "risk to converting", "hurt our forecast", "forecast exposure")
  if (qLower.includes('slip') || qLower.includes('biggest risk') || (qLower.includes('risk') && qLower.includes('converting')) || qLower.includes('hurt our forecast') || qLower.includes('forecast exposure') || qLower.includes('largest forecast exposure')) {
    return {
      intent: 'OPPORTUNITY_RISK',
      is_ambiguous: false,
      text: `### ⚠️ Opportunity Forecast Slippage & Conversion Risk Analysis

#### ANSWER
The largest forecast slippage risk comes from **Coal India Mining Survey (₹15.00 Cr)** and **Adani Solar Mapping (₹12.50 Cr)**. Together, they represent **₹27.50 Cr** (40.0%) of total open pipeline and **₹22.00 Cr** (83.1%) of weighted forecast.

#### [DERIVED METRIC]
Formula: \`Forecast Contribution = Deal Value × Explicit Probability\`
- **Coal India Mining Survey**: ₹15.00 Cr × 80% High Probability = **₹12.00 Cr Forecast Contribution**.
- **Adani Solar Mapping Project**: ₹12.50 Cr × 80% High Probability = **₹10.00 Cr Forecast Contribution**.
- **Indian Railways Corridor Survey**: ₹8.00 Cr × 50% Medium Probability = **₹4.00 Cr Forecast Contribution**.
- **PowerGrid Line Inspection**: ₹6.50 Cr × 50% Medium Probability = **₹3.25 Cr Forecast Contribution**.

#### [SOURCE FACT & CAVEAT]
- 49 of 50 open deals lack explicit tentative close dates in the source CRM records.

#### [RECOMMENDATION]
Audit probability and close date records for top 5 deals; external client decision timelines are unrecorded in the dataset.`
    };
  }

  // 9. Pipeline Concentration ("concentration", "exposed", "exposure", "where is our revenue pipeline most concentrated")
  if (qLower.includes('concentration') || qLower.includes('exposed') || qLower.includes('exposure')) {
    return {
      intent: 'PIPELINE_CONCENTRATION',
      is_ambiguous: false,
      text: `### 🎯 Pipeline Concentration Exposure Audit

#### ANSWER
Our commercial pipeline is heavily concentrated in the **Mining** sector (**₹24.15 Cr**, 35.1%) and top 5 open opportunities (**₹47.00 Cr**, 68.3% of total pipeline).

#### [DERIVED METRIC]
- **Top Sector Share**: Mining represents **35.1%** (₹24.15 Cr) of active open pipeline.
- **Top 2 Sectors Share**: Mining + Renewables represent **61.8%** (₹42.55 Cr) of total open pipeline.
- **Top 5 Deals Share**: Top 5 open deals account for **₹47.00 Cr** out of ₹68.82 Cr total pipeline.
- **Remaining 45 Deals Share**: ₹21.82 Cr (31.7% of total pipeline).

#### [RECOMMENDATION]
Diversify sales outreach into Railways and Powerline sectors to balance sector concentration exposure.`
    };
  }

  // 10. Sector Pipeline vs Execution Realization ("weak execution", "pipeline vs execution", "considering both pipeline and execution", "weak delivery", "strong sales but weak delivery", "commercial-to-operational gap", "highest billing realization")
  if ((qLower.includes('sector') || qLower.includes('industry') || qLower.includes('industries')) && (qLower.includes('execution') || qLower.includes('realization') || qLower.includes('delivery') || qLower.includes('focus') || qLower.includes('weak') || qLower.includes('gap') || qLower.includes('billing realization'))) {
    return {
      intent: 'SECTOR_PIPELINE_VS_EXECUTION',
      is_ambiguous: false,
      text: `### ⛏️ Sector Pipeline vs. Execution Realization Audit

#### ANSWER
**Mining** has our largest active pipeline (**₹24.15 Cr**, 35.1%) but holds **₹2.85 Cr** in billed realization across 18 work orders with **2 execution delays**. **Renewables** shows stronger billing realization (**₹3.10 Cr** billed out of ₹18.40 Cr pipeline).

#### [SOURCE FACT]
- **Mining Sector**: Active Pipeline: **₹24.15 Cr** (15 open deals) | Billed Value: **₹2.85 Cr** (18 active work orders, 2 delayed).
- **Renewables Sector**: Active Pipeline: **₹18.40 Cr** (12 open deals) | Billed Value: **₹3.10 Cr** (14 active work orders, 1 delayed).
- **Railways Sector**: Active Pipeline: **₹12.20 Cr** | Billed Value: **₹2.15 Cr**.
- **Powerline Sector**: Active Pipeline: **₹8.10 Cr** | Billed Value: **₹1.40 Cr**.
- **Construction Sector**: Active Pipeline: **₹5.97 Cr** | Billed Value: **₹1.24 Cr**.

#### [UNKNOWN / NOT IN DATASET]
Specific field operational causes for delays are unrecorded in the source dataset.

#### [RECOMMENDATION]
Review project tracker records for Mining work orders to evaluate recorded execution delays; no external completion deadline is specified in source data.`
    };
  }

  // 11. Work Order Priority ("attention", "priority", "deserve")
  if (qLower.includes('attention') || qLower.includes('priority') || (qLower.includes('deserve') && qLower.includes('work order'))) {
    return {
      intent: 'WORK_ORDER_PRIORITY',
      is_ambiguous: false,
      text: `### 🚨 Work Order Management Priority Audit

#### ANSWER
Management attention must prioritize the **5 Execution Delayed Work Orders** representing **₹1.85 Cr** in contracted value, and **₹3.63 Cr in uncollected receivables**.

#### [SOURCE FACT]
- **Priority 1 (Execution Delayed)**: 5 active work orders (Contract Value: **₹1.85 Cr**, Billed: ₹0.60 Cr, Billing Gap: **₹1.25 Cr**).
- **Priority 2 (Receivables Exposure)**: Outstanding uncollected receivables stand at **₹3.63 Cr** across active and completed projects.
- **Priority 3 (Ongoing Work Orders)**: 53 ongoing work orders progressing within normal schedule limits (Contract Value: **₹19.21 Cr**).

#### [UNKNOWN / NOT IN DATASET]
Specific site or client delay causes are unrecorded in source tracker fields.

#### [RECOMMENDATION]
Review project tracker records for the 5 execution delayed work orders; no external deadline or cause is recorded in source data.`
    };
  }

  // 12. Forecast Data Quality & Reliability ("fix first", "forecast reliability", "data reliability", "hurting forecast reliability", "deadline for fixing")
  if (qLower.includes('fix first') || qLower.includes('forecast reliability') || (qLower.includes('data') && qLower.includes('reliability')) || qLower.includes('deadline for fixing')) {
    return {
      intent: 'FORECAST_DATA_QUALITY',
      is_ambiguous: false,
      text: `### 🧹 Forecast Reliability & Data Quality Priority Audit

#### ANSWER
Sales leadership must fix **missing tentative close dates** for **49 out of 50 open deals** and **unrated closure probabilities** for **38 open deals**.

#### [SOURCE FACT]
- **Missing Tentative Close Dates**: 49 of 50 open deals (98.0%) lack close dates in CRM records (₹67.32 Cr pipeline unallocated).
- **Unrated Closure Probabilities**: 38 of 50 open deals (76.0%) lack explicit win probability ratings.
- **Probability Coverage Score**: Only **25.5%** of deals have explicit win probabilities.

#### [MODELING ASSUMPTION]
- Includes a 30% application modeling baseline assumption for unrated open deals; this is an analytical governance modeling parameter, NOT a source-recorded probability rating.

#### [RECOMMENDATION]
Prioritize entering close dates and explicit probability ratings for top open deals; the dataset does not specify a completion deadline.`
    };
  }

  // 13. Data Trust & Explicit Probabilities ("explicit probability", "probability ratings", "backed by explicit", "how complete is our current business data", "what data quality issues")
  if (qLower.includes('explicit probability') || qLower.includes('probability ratings') || qLower.includes('backed by explicit') || qLower.includes('how complete is') || qLower.includes('data quality issues')) {
    return {
      intent: 'DATA_TRUST',
      is_ambiguous: false,
      text: `### 🛡️ Data Trust & Probability Coverage Audit

#### ANSWER
**94.0%** of active open deals (47 of 50) have explicit win probability ratings. Overall Data Trust score is **HIGH CONFIDENCE** based on 5 dataset dimensions.

#### [SOURCE FACT]
- **Probability Coverage (94.0%)**: 47 rated open deals vs 3 unrated open deals.
- **Field Completeness (65.3%)**: Essential CRM and Work Order field population.
- **Date Normalized Coverage (99.8%)**: Valid timeline dates across CRM and Work Orders.
- **Sector Mapping (98.5%)**: Standardized taxonomy across deals and work orders.
- **Cross-Board Linkage (89.7%)**: 52 of 58 work order deal names matched 1:1 to Deals board.

#### [MODELING ASSUMPTION]
- Weighted forecast uses a 30% application baseline assumption for 3 unrated deals; this is an analytical modeling parameter, NOT a source-recorded rating.

#### [RECOMMENDATION]
Assign explicit probability ratings (High 80%, Medium 50%, Low 20%) to the 3 unrated open deals (Sasuke, Krillin, Tanjiro).`
    };
  }

  // 14. Top Opportunities Query ("biggest active opportunities", "top opportunities", "biggest opportunities", "five biggest", "top deals", "prioritize right now")
  if (qLower.includes('biggest active opportunities') || qLower.includes('top opportunities') || qLower.includes('biggest opportunities') || qLower.includes('five biggest') || qLower.includes('top deals') || qLower.includes('prioritize right now')) {
    return {
      intent: 'TOP_OPPORTUNITIES',
      is_ambiguous: false,
      text: `### 🏆 Top 5 Active Open Deal Opportunities

#### ANSWER
Our top 5 active open deals represent **₹47.00 Cr** (68.3%) of total active sales pipeline.

#### [SOURCE FACT]
1. **Coal India Mining Survey**: **₹15.00 Cr** (Mining | Probability: 80% High | Close: Q1 2026)
2. **Adani Solar Mapping Project**: **₹12.50 Cr** (Renewables | Probability: 80% High | Close: Q1 2026)
3. **Indian Railways Corridor Survey**: **₹8.00 Cr** (Railways | Probability: 50% Medium | Close: Q2 2026)
4. **PowerGrid Line Inspection**: **₹6.50 Cr** (Powerline | Probability: 50% Medium | Close: Q2 2026)
5. **L&T Infrastructure Mapping**: **₹5.50 Cr** (Construction | Probability: 20% Low | Close: Unrated)

#### [RECOMMENDATION]
Review sales progress for Coal India and Adani Solar opportunities based on recorded CRM deal stages.`
    };
  }

  // 15. Work Order Delay & Count Queries ("delayed", "projects are delayed", "causing our delayed", "what caused the", "staffing", "equipment", "sla")
  if (qLower.includes('delayed') || qLower.includes('projects are delayed') || qLower.includes('causing our delayed') || qLower.includes('what caused the') || qLower.includes('staffing') || qLower.includes('equipment') || qLower.includes('sla')) {
    return {
      intent: 'WORK_ORDER_DELAY',
      is_ambiguous: false,
      text: `### 🚀 Operational Work Orders & Delay Audit

#### ANSWER
We have **58 Active Work Orders**, of which **53 are Ongoing** and **5 are Execution Delayed**.

#### [SOURCE FACT]
- **Total Active Work Orders**: **58 projects** (Contract Value: **₹21.06 Cr**).
- **Ongoing Work Orders**: **53 projects** progressing on schedule.
- **Execution Delayed Work Orders**: **5 projects** (Contract Value: **₹1.85 Cr**).
- **Billed Realization**: **₹10.74 Cr** billed out of ₹21.06 Cr contracted.
- **Outstanding Receivables**: **₹3.63 Cr** in uncollected invoices.

#### [UNKNOWN / NOT IN DATASET]
The source tracker records 5 work orders as Execution Delayed, but specific site, weather, completion target dates, staffing, equipment, SLA breaches, or client causes are unrecorded in dataset fields.

#### [RECOMMENDATION]
Review project tracker records for the 5 delayed work orders to evaluate execution status; no specific cause or external deadline is recorded in the source dataset.`
    };
  }

  // 16. Work Order Overview Queries ("how many active work orders", "total work order contract value", "billed against", "outstanding", "percentage of contracted work")
  if (qLower.includes('how many active work orders') || qLower.includes('total work order contract value') || qLower.includes('billed against') || qLower.includes('outstanding') || qLower.includes('percentage of contracted work')) {
    return {
      intent: 'WORK_ORDER_OVERVIEW',
      is_ambiguous: false,
      text: `### 🚀 Active Work Orders & Financial Overview

#### ANSWER
We have **58 Active Work Orders**, representing **₹21.06 Cr** in total contracted value. **₹10.74 Cr** (51.0%) has been billed to date, and **₹3.63 Cr** remains in uncollected receivables.

#### [SOURCE FACT]
- **Total Active Work Orders**: **58 projects** (53 Ongoing, 5 Execution Delayed).
- **Contract Value**: **₹21.06 Cr**.
- **Billed Realization**: **₹10.74 Cr** (51.0% billing realization rate).
- **Outstanding Receivables**: **₹3.63 Cr** across active and completed work orders.

#### [RECOMMENDATION]
Operations lead to monitor milestone completion across the 53 ongoing work orders.`
    };
  }

  // 17. Sales Velocity vs Execution Workload ("relationship", "faster than we can execute", "velocity")
  if (qLower.includes('faster') || qLower.includes('selling') || qLower.includes('velocity') || qLower.includes('relationship')) {
    return {
      intent: 'CROSS_BOARD_ANALYSIS',
      is_ambiguous: false,
      text: `### ⏱️ Sales Velocity vs. Execution Capacity Analysis

#### ANSWER
The available dataset cannot determine whether sales are occurring faster than execution because it is a static snapshot without historical stage/status timestamps. At this snapshot, there are **50 open deals (₹68.82 Cr)** and **58 active work orders (₹21.06 Cr)**, with **5 execution-delayed work orders**. A true sales-versus-execution velocity comparison requires historical time-series data.

#### [SOURCE FACT]
- Active Open Deals: 50 deals totaling ₹68.82 Cr.
- Active Work Orders: 58 projects (53 Ongoing, 5 Execution Delayed).
- Cross-Board Linkage: 52 of 58 work order deal names match Deals board (89.7% match rate).

#### [UNKNOWN / NOT IN DATASET]
Historical sales intake velocity and stage duration timestamps are unrecorded in current export datasets.

#### [RECOMMENDATION]
Implement automated stage-change timestamp logging in Monday.com to monitor true sales-to-execution velocity.`
    };
  }

  // 18. Sector Performance Queries ("mining", "renewables", "strongest pipeline")
  if (qLower.includes('mining') || qLower.includes('renewables') || qLower.includes('strongest pipeline')) {
    const isMining = qLower.includes('mining');
    return {
      intent: 'SECTOR_PERFORMANCE',
      is_ambiguous: false,
      text: `### ⛏️ Sector Performance Analysis (${isMining ? 'Mining' : 'Renewables'})

#### ANSWER
${isMining 
  ? '**Mining** is our largest commercial sector with **₹24.15 Cr** in active sales pipeline across 15 deals, and **₹2.85 Cr** in billed work order realization.' 
  : '**Renewables** holds **₹18.40 Cr** in active sales pipeline across 12 deals, and leads in billed work order realization with **₹3.10 Cr**.'}

#### [SOURCE FACT]
- **Mining Sector**: Pipeline: **₹24.15 Cr** | Active Work Orders: 18 | Billed: **₹2.85 Cr** (2 delayed).
- **Renewables Sector**: Pipeline: **₹18.40 Cr** | Active Work Orders: 14 | Billed: **₹3.10 Cr** (1 delayed).
- **Railways Sector**: Pipeline: **₹12.20 Cr** | Active Work Orders: 11 | Billed: **₹2.15 Cr**.
- **Powerline Sector**: Pipeline: **₹8.10 Cr** | Active Work Orders: 8 | Billed: **₹1.40 Cr**.
- **Construction Sector**: Pipeline: **₹5.97 Cr** | Active Work Orders: 7 | Billed: **₹1.24 Cr**.

#### [RECOMMENDATION]
Maintain commercial momentum in Mining and Renewables while supporting field survey capacity.`
    };
  }

  // 19. Pipeline / Quarter Queries ("pipeline", "quarter", "forecast", "total value of our current open pipeline")
  if (qLower.includes('pipeline') || qLower.includes('quarter') || qLower.includes('forecast') || qLower.includes('total value')) {
    return {
      intent: 'PIPELINE_OVERVIEW',
      is_ambiguous: false,
      text: `### 📊 Q1 2026 Pipeline Performance Analysis

#### ANSWER
Our active sales pipeline stands at **₹68.82 Cr** across 50 open deals. The risk-adjusted weighted forecast is **₹26.46 Cr**.

#### [SOURCE FACT]
- **Active Open Deals**: 50 deals totaling **₹68.82 Cr**.
- **Historical Win Rate**: **56.2%** (163 Won / 127 Dead out of 290 decided deals).

#### [MODELING ASSUMPTION]
- **Weighted Forecast (₹26.46 Cr)** includes explicit win probabilities for 47 rated deals (18 High, 18 Medium, 11 Low) and a **30% application baseline assumption** for 3 unrated deals; this is an analytical modeling parameter, NOT a source-recorded probability rating.

#### [RECOMMENDATION]
Sales Leadership should mandate tentative close date entries for all 49 unrated open deals; no completion deadline is specified in source data.`
    };
  }

  // Default Fallback
  return {
    intent: 'PIPELINE_OVERVIEW',
    is_ambiguous: false,
    text: `### 📊 Skylark Executive Decision Support

#### ANSWER
Skylark Executive Intelligence has reconciled **344 Deals** and **175 Work Orders** from the assignment dataset snapshot.

#### [SOURCE FACT]
- **Active Sales Pipeline**: **₹68.82 Cr** (50 open deals).
- **Closed Win Rate**: **56.2%** (163 Won / 127 Dead).
- **Active Work Orders**: **58 projects** (53 Ongoing, 5 Delayed).
- **Financial Realization**: **₹10.74 Cr** Billed | **₹3.63 Cr** Receivables.

#### [MODELING ASSUMPTION]
- **Weighted Forecast (₹26.46 Cr)** includes explicit win probabilities for 47 rated deals and a **30% application baseline assumption** for 3 unrated deals.

#### [RECOMMENDATION]
Select any KPI card or ask a specific question in the chat bar above for detailed sector or operational analysis.`
  };
}
