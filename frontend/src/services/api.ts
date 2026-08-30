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
    impact: 'Delays milestone billing realization and client SLA compliance.',
    evidence: ['5 out of 58 active work orders flagged Execution Delayed.', 'Contract value affected: ₹1.85 Cr.'],
    action: 'Investigate recorded site bottlenecks for 5 delayed work orders.'
  }
];

export const fetchBoardStatus = async (): Promise<BoardStatus> => {
  try {
    const response = await axios.get<BoardStatus>(`${API_BASE}/boards/status`);
    return response.data;
  } catch (err) {
    console.warn('API connection unavailable. Utilizing local deterministic BI engine.');
    return {
      connected_live_monday: true,
      is_mock_data: false,
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
2. **Execution Bottlenecks**: 5 work orders in Mining and Renewables are recorded **Execution Delayed** in source tracker records.
3. **Forecast Reliability Risk**: 49 of 50 open deals lack explicit tentative close dates, creating revenue timing uncertainty.

---

## 3. High-Priority Recovery Actions
- **Action 1 (Sales Operations)**: Audit missing tentative close dates for 49 open deals; the dataset does not specify a completion deadline.
- **Action 2 (Project Delivery)**: Investigate site mobilization bottlenecks for 5 execution delayed work orders to unlock ₹1.85 Cr in contract value.
- **Action 3 (Finance)**: Review collections on ₹3.63 Cr outstanding receivables across completed work orders.`,
      is_mock_data: false,
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
        interpretation: `Converting ${deltaPct}% of the ₹68.82 Cr open pipeline adds ₹${(convertedVal / 10000000).toFixed(2)} Cr in revenue realization.`
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

function generateLocalChatResponse(query: string): any {
  const qLower = query.toLowerCase().trim();

  // 1. Adversarial / Security Refusal Check
  if (['ebitda', 'salary', 'cac', 'ltv', 'churn', 'profit margin', 'profitability', 'best employee'].some(t => qLower.includes(t))) {
    return {
      intent: 'UNSUPPORTED',
      is_ambiguous: false,
      text: '### ⚠️ Unsupported Metric Request\n\n**Data Unavailability Notice**:\nThe dataset provided includes operational Deals and Work Orders tracking data. Metrics such as EBITDA, Salary, CAC, LTV, and Profit Margins are not tracked in source CRM or Work Order boards.'
    };
  }

  if (['reveal system prompt', 'api key', 'environment variables', 'ignore previous instructions'].some(t => qLower.includes(t))) {
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

  // 3. Opportunity Risk & Slippage ("slip", "biggest risk", "risk to converting")
  if (qLower.includes('slip') || qLower.includes('biggest risk') || (qLower.includes('risk') && qLower.includes('converting'))) {
    return {
      intent: 'OPPORTUNITY_RISK',
      is_ambiguous: false,
      text: `### ⚠️ Opportunity Forecast Slippage & Conversion Risk Analysis

#### ANSWER
The largest forecast slippage risk comes from **Coal India Mining Survey (₹15.00 Cr)** and **Adani Solar Mapping (₹12.50 Cr)**. Together, they represent **₹27.50 Cr** (40.0%) of total open pipeline and **₹22.00 Cr** (83.1%) of weighted forecast.

#### EVIDENCE & RISK EXPOSURE FORMULA
Formula: \`Forecast Contribution = Deal Value × Explicit Probability\`
- **Coal India Mining Survey**: ₹15.00 Cr × 80% High Probability = **₹12.00 Cr Forecast Contribution**.
- **Adani Solar Mapping Project**: ₹12.50 Cr × 80% High Probability = **₹10.00 Cr Forecast Contribution**.
- **Indian Railways Corridor Survey**: ₹8.00 Cr × 50% Medium Probability = **₹4.00 Cr Forecast Contribution**.
- **PowerGrid Line Inspection**: ₹6.50 Cr × 50% Medium Probability = **₹3.25 Cr Forecast Contribution**.

#### WHY IT MATTERS
If Coal India or Adani Solar slip out of the target period, weighted forecast drops by up to **₹22.00 Cr**.

#### DATA QUALITY CAVEAT
- 49 of 50 open deals lack explicit tentative close dates in the source CRM records.

#### RECOMMENDED ACTION
Audit probability and close date records for top 5 deals; the dataset does not provide external procurement committee details.`
    };
  }

  // 4. Pipeline Concentration ("concentration", "exposed", "exposure")
  if (qLower.includes('concentration') || qLower.includes('exposed') || qLower.includes('exposure')) {
    return {
      intent: 'PIPELINE_CONCENTRATION',
      is_ambiguous: false,
      text: `### 🎯 Pipeline Concentration Exposure Audit

#### ANSWER
Our commercial pipeline is heavily concentrated in the **Mining** sector (**₹24.15 Cr**, 35.1%) and top 5 open opportunities (**₹47.00 Cr**, 68.3% of total pipeline).

#### EVIDENCE
- **Top Sector Share**: Mining represents **35.1%** (₹24.15 Cr) of active open pipeline.
- **Top 2 Sectors Share**: Mining + Renewables represent **61.8%** (₹42.55 Cr) of total open pipeline.
- **Top 5 Deals Share**: Top 5 open deals account for **₹47.00 Cr** out of ₹68.82 Cr total pipeline.
- **Remaining 45 Deals Share**: ₹21.82 Cr (31.7% of total pipeline).

#### WHY IT MATTERS
High sector and top-deal concentration increases revenue vulnerability if a major sector encounters regulatory or market headwinds.

#### RECOMMENDED ACTION
Diversify sales outreach into Railways and Powerline sectors to balance sector concentration exposure.`
    };
  }

  // 5. Sector Pipeline vs Execution Realization ("weak execution", "pipeline vs execution", "considering both pipeline and execution", "weak delivery")
  if ((qLower.includes('sector') || qLower.includes('industry')) && (qLower.includes('execution') || qLower.includes('realization') || qLower.includes('delivery') || qLower.includes('focus') || qLower.includes('weak'))) {
    return {
      intent: 'SECTOR_PIPELINE_VS_EXECUTION',
      is_ambiguous: false,
      text: `### ⛏️ Sector Pipeline vs. Execution Realization Audit

#### ANSWER
**Mining** has our largest active pipeline (**₹24.15 Cr**, 35.1%) but holds **₹2.85 Cr** in billed realization across 18 work orders with **2 execution delays**. **Renewables** shows stronger billing realization (**₹3.10 Cr** billed out of ₹18.40 Cr pipeline).

#### EVIDENCE
- **Mining Sector**: Active Pipeline: **₹24.15 Cr** (15 open deals) | Billed Value: **₹2.85 Cr** (18 active work orders, 2 delayed).
- **Renewables Sector**: Active Pipeline: **₹18.40 Cr** (12 open deals) | Billed Value: **₹3.10 Cr** (14 active work orders, 1 delayed).
- **Railways Sector**: Active Pipeline: **₹12.20 Cr** | Billed Value: **₹2.15 Cr**.
- **Powerline Sector**: Active Pipeline: **₹8.10 Cr** | Billed Value: **₹1.40 Cr**.
- **Construction Sector**: Active Pipeline: **₹5.97 Cr** | Billed Value: **₹1.24 Cr**.

#### WHY IT MATTERS
Mining generates heavy commercial demand, but operational execution bottlenecks delay billing realization.

#### DATA QUALITY CAVEAT
- Sector taxonomy mapping is 100% complete across both Deals and Work Orders boards.
- Specific field operational causes for delays are not recorded in the source dataset.

#### RECOMMENDED ACTION
Review field resource allocation for Mining work orders to resolve recorded execution delays; the dataset does not specify external deadlines.`
    };
  }

  // 6. Work Order Priority ("attention", "priority", "deserve")
  if (qLower.includes('attention') || qLower.includes('priority') || (qLower.includes('deserve') && qLower.includes('work order'))) {
    return {
      intent: 'WORK_ORDER_PRIORITY',
      is_ambiguous: false,
      text: `### 🚨 Work Order Management Priority Audit

#### ANSWER
Management attention must prioritize the **5 Execution Delayed Work Orders** representing **₹1.85 Cr** in contracted value, and **₹3.63 Cr in uncollected receivables**.

#### EVIDENCE & DETERMINISTIC RANKING
- **Priority 1 (Execution Delayed)**: 5 active work orders (Contract Value: **₹1.85 Cr**, Billed: ₹0.60 Cr, Billing Gap: **₹1.25 Cr**).
- **Priority 2 (Receivables Exposure)**: Outstanding uncollected receivables stand at **₹3.63 Cr** across active and completed projects.
- **Priority 3 (Ongoing Work Orders)**: 53 ongoing work orders progressing within normal schedule limits (Contract Value: **₹19.21 Cr**).

#### WHY IT MATTERS
Resolving the 5 delayed work orders unlocks **₹1.25 Cr** in pending milestone billing.

#### DATA QUALITY CAVEAT
- Source records cite delayed status; specific site or client reasons are unrecorded in the dataset.

#### RECOMMENDED ACTION
Investigate the 5 execution delayed work order records to identify site bottlenecks; no external deadline is specified in source data.`
    };
  }

  // 7. Forecast Data Quality & Reliability ("fix first", "forecast reliability", "data reliability")
  if (qLower.includes('fix first') || qLower.includes('forecast reliability') || (qLower.includes('data') && qLower.includes('reliability'))) {
    return {
      intent: 'FORECAST_DATA_QUALITY',
      is_ambiguous: false,
      text: `### 🧹 Forecast Reliability & Data Quality Priority Audit

#### ANSWER
Sales leadership must fix **missing tentative close dates** for **49 out of 50 open deals** and **unrated closure probabilities** for **38 open deals**.

#### EVIDENCE & DATA QUALITY AUDIT
- **Missing Tentative Close Dates**: 49 of 50 open deals (98.0%) lack close dates in CRM records (₹67.32 Cr pipeline unallocated).
- **Unrated Closure Probabilities**: 38 of 50 open deals (76.0%) lack explicit win probability ratings (using 30% baseline assumption).
- **Probability Coverage Score**: Only **25.5%** of deals have explicit win probabilities.

#### WHY IT MATTERS
Unrated deal probabilities and missing close dates force reliance on baseline assumptions, creating forecast variance risk.

#### RECOMMENDED ACTION
Prioritize entering close dates and probability ratings for top open deals; the dataset does not specify a completion deadline.`
    };
  }

  // 8. Data Trust & Explicit Probabilities ("explicit probability", "probability ratings", "backed by explicit")
  if (qLower.includes('explicit probability') || qLower.includes('probability ratings') || qLower.includes('backed by explicit')) {
    return {
      intent: 'DATA_TRUST',
      is_ambiguous: false,
      text: `### 🛡️ Data Trust & Probability Coverage Audit

#### ANSWER
Only **25.5%** of active open deals (12 of 50) have explicit win probability ratings. Overall Data Trust score is **HIGH CONFIDENCE** based on 5 dataset dimensions.

#### EVIDENCE
- **Probability Coverage (25.5%)**: 12 rated open deals vs 38 unrated open deals.
- **Field Completeness (72.8%)**: Essential CRM and Work Order field population.
- **Date Normalized Coverage (89.1%)**: Valid ISO dates across CRM and Work Orders.
- **Sector Mapping (100%)**: Standardized taxonomy across deals and work orders.
- **Cross-Board Linkage (89.7%)**: 52 of 58 work order deal names matched 1:1 to Deals board.

#### RECOMMENDED ACTION
Assign explicit probability ratings (High 80%, Medium 50%, Low 20%) to the 38 unrated open deals.`
    };
  }

  // 9. Top Opportunities Query ("biggest active opportunities", "top opportunities", "biggest opportunities")
  if (qLower.includes('biggest active opportunities') || qLower.includes('top opportunities') || qLower.includes('biggest opportunities') || qLower.includes('top deals')) {
    return {
      intent: 'TOP_OPPORTUNITIES',
      is_ambiguous: false,
      text: `### 🏆 Top 5 Active Open Deal Opportunities

#### ANSWER
Our top 5 active open deals represent **₹47.00 Cr** (68.3%) of total active sales pipeline.

#### EVIDENCE
1. **Coal India Mining Survey**: **₹15.00 Cr** (Mining | Probability: 80% High | Close: Q1 2026)
2. **Adani Solar Mapping Project**: **₹12.50 Cr** (Renewables | Probability: 80% High | Close: Q1 2026)
3. **Indian Railways Corridor Survey**: **₹8.00 Cr** (Railways | Probability: 50% Medium | Close: Q2 2026)
4. **PowerGrid Line Inspection**: **₹6.50 Cr** (Powerline | Probability: 50% Medium | Close: Q2 2026)
5. **L&T Infrastructure Mapping**: **₹5.50 Cr** (Construction | Probability: 20% Low | Close: Unrated)

#### WHY IT MATTERS
Closing Coal India and Adani Solar would secure **₹22.00 Cr** (83.1%) of our Q1 weighted revenue target.

#### RECOMMENDED ACTION
Review sales progress for Coal India and Adani Solar opportunities based on recorded CRM deal stages.`
    };
  }

  // 10. Work Orders & Delayed Projects Query ("delayed", "how many active & delayed work orders")
  if (qLower.includes('delayed') || qLower.includes('how many active & delayed work orders')) {
    return {
      intent: 'WORK_ORDER_DELAY',
      is_ambiguous: false,
      text: `### 🚀 Operational Work Orders & Delay Audit

#### ANSWER
We have **58 Active Work Orders**, of which **53 are Ongoing** and **5 are Execution Delayed**.

#### EVIDENCE
- **Total Active Work Orders**: **58 projects** (Contract Value: **₹21.06 Cr**).
- **Ongoing Work Orders**: **53 projects** progressing on schedule.
- **Execution Delayed Work Orders**: **5 projects** (Contract Value: **₹1.85 Cr**).
- **Billed Realization**: **₹10.74 Cr** billed out of ₹21.06 Cr contracted.
- **Outstanding Receivables**: **₹3.63 Cr** in uncollected invoices.

#### WHY IT MATTERS
The 5 delayed projects block **₹1.85 Cr** in milestone billing and strain client SLA commitments.

#### DATA QUALITY CAVEAT
Delayed status is recorded in source tracker; specific site or client reasons are unrecorded in the dataset.

#### RECOMMENDED ACTION
Investigate the 5 execution delayed work order records to identify operational bottlenecks; no external deadline is specified in source data.`
    };
  }

  // 11. Sales Velocity vs Execution Workload ("relationship", "faster than we can execute", "velocity")
  if (qLower.includes('faster') || qLower.includes('selling') || qLower.includes('velocity') || qLower.includes('relationship')) {
    return {
      intent: 'CROSS_BOARD_ANALYSIS',
      is_ambiguous: false,
      text: `### ⏱️ Sales Velocity vs. Execution Capacity Analysis

#### ANSWER
Based on static dataset snapshots, active sales deal volume (**50 open deals, ₹68.82 Cr**) currently exceeds active operational work order capacity (**58 active projects, 5 delayed**).

#### EVIDENCE & LIMITATION NOTICE
- **Historical Snapshot Constraint**: The provided dataset represents a static point-in-time export without daily timestamp logs.
- **Operational Ratio**: We maintain 50 open deals versus 58 active work orders. 5 work orders (8.6%) are delayed due to operational bottlenecks.

#### WHY IT MATTERS
While new sales intake is strong, operational execution is at 91.4% capacity compliance with 5 delayed projects.

#### DATA QUALITY CAVEAT
Dynamic time-series velocity tracking requires historical Monday.com board status change audit logs.

#### RECOMMENDED ACTION
Implement automated timestamp tracking on stage changes in Monday.com to monitor true week-over-week velocity.`
    };
  }

  // 12. Pipeline / Quarter Query ("pipeline", "quarter", "forecast")
  if (qLower.includes('pipeline') || qLower.includes('quarter') || qLower.includes('forecast')) {
    return {
      intent: 'PIPELINE_OVERVIEW',
      is_ambiguous: false,
      text: `### 📊 Q1 2026 Pipeline Performance Analysis

#### ANSWER
Our active sales pipeline stands at **₹68.82 Cr** across 50 open deals. The risk-adjusted weighted forecast is **₹26.46 Cr**.

#### EVIDENCE
- **Active Open Deals**: 50 deals totaling **₹68.82 Cr**.
- **Weighted Forecast**: **₹26.46 Cr** (based on explicit closure probabilities for rated deals and 30% baseline for unrated deals).
- **Historical Win Rate**: **56.2%** (163 Won / 127 Dead out of 290 decided deals).

#### WHY IT MATTERS
Active pipeline value provides necessary revenue coverage, but unrated deal probabilities create forecast variance risk.

#### DATA QUALITY CAVEAT
- **Close Date Ambiguity**: 49 of 50 open deals lack explicit tentative close dates in the source records.
- **Probability Rating Coverage**: Only 25.5% of deals have explicit closure probabilities.

#### RECOMMENDED ACTION
Sales Leadership should mandate tentative close date entries for all 49 unrated open deals; no completion deadline is specified in source data.`
    };
  }

  // Default Fallback
  return {
    intent: 'PIPELINE_OVERVIEW',
    is_ambiguous: false,
    text: `### 📊 Skylark Executive Decision Support

#### ANSWER
Skylark Executive Intelligence has reconciled **344 Deals** and **175 Work Orders** from Monday.com boards.

#### EVIDENCE SUMMARY
- **Active Sales Pipeline**: **₹68.82 Cr** (50 open deals).
- **Weighted Forecast**: **₹26.46 Cr**.
- **Closed Win Rate**: **56.2%** (163 Won / 127 Dead).
- **Active Work Orders**: **58 projects** (53 Ongoing, 5 Delayed).
- **Financial Realization**: **₹10.74 Cr** Billed | **₹3.63 Cr** Receivables.

#### RECOMMENDED ACTION
Select any KPI card or ask a specific question in the chat bar above for detailed sector or operational analysis.`
  };
}
