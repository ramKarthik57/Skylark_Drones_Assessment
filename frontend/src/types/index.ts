export interface DealOpportunity {
  deal_name: string;
  client_code: string;
  sector: string;
  deal_value: number;
  probability: string;
  tentative_close: string;
}

export interface ActionItem {
  id: string;
  urgency: 'IMMEDIATE' | 'HIGH' | 'MEDIUM';
  priority: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  evidence: string[];
  impact: string;
  recommended_action: string;
  owner_suggestion: string;
}

export interface SectorBreakdown {
  sector: string;
  open_pipeline: number;
  won_revenue: number;
  open_deals: number;
  won_deals: number;
}

export interface StageBreakdown {
  stage: string;
  count: number;
  total_val: number;
}

export interface WOSectorBreakdown {
  sector: string;
  active_wos: number;
  delayed_wos: number;
  total_wo_val: number;
}

export interface RiskSignal {
  id: string;
  category: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
  title: string;
  impact: string;
  evidence: string[];
  action: string;
}

export interface TrustDimension {
  name: string;
  score: number;
  desc: string;
}

export interface DataTrust {
  overall_confidence: 'HIGH CONFIDENCE' | 'MEDIUM CONFIDENCE' | 'LOW CONFIDENCE';
  completeness_score: number;
  date_coverage_score: number;
  probability_coverage_score: number;
  sector_coverage_score: number;
  cross_board_match_score: number;
  dimensions: TrustDimension[];
}

export interface BIData {
  filters?: {
    sector?: string;
    quarter?: string;
  };
  deals_summary: {
    total_deal_count: number;
    open_deal_count: number;
    this_quarter_deal_count: number;
    this_quarter_pipeline_value: number;
    won_deal_count: number;
    dead_deal_count: number;
    decided_deal_count: number;
    on_hold_deal_count: number;
    open_pipeline_value: number;
    weighted_pipeline_value: number;
    open_deals_with_prob: number;
    open_deals_missing_prob: number;
    won_revenue_value: number;
    win_rate: number;
    avg_deal_size: number;
    top_opportunities: DealOpportunity[];
    sector_breakdown: SectorBreakdown[];
    stage_breakdown: StageBreakdown[];
  };
  work_orders_summary: {
    total_wo_count: number;
    active_wo_count: number;
    ongoing_count: number;
    delayed_count: number;
    completed_count: number;
    on_hold_count: number;
    total_wo_contract_value: number;
    total_billed_value: number;
    total_receivable_value: number;
    billing_completion_rate: number;
    sector_breakdown: WOSectorBreakdown[];
  };
  cross_board_metrics: {
    cross_board_match_rate: number;
    matched_deals_count: number;
    sales_vs_execution_gap: number;
    velocity_status: string;
  };
}

export interface VisualizationSpec {
  type: 'TOP_OPPORTUNITY_BAR' | 'FORECAST_WATERFALL' | 'SECTOR_COMPARISON' | 'EXECUTION_STATUS_DONUT' | 'CONCENTRATION_PARETO' | 'RISK_EVIDENCE_BAR' | 'NONE';
  title: string;
  data: any[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  intent?: string;
  operation?: string;
  entity?: string;
  granularity?: string;
  visualization?: VisualizationSpec | null;
  biData?: BIData;
  riskRadar?: RiskSignal[];
  dataTrust?: DataTrust;
  dataQualityNotes?: string[];
  clarificationOptions?: string[];
  suggestedQuestions?: string[];
}

export interface BoardStatus {
  connected_live_monday: boolean;
  is_mock_data: boolean;
  deals_count: number;
  work_orders_count: number;
  data_quality_warnings_count: number;
  risk_radar_count: number;
  data_trust_score: string;
  data_trust: DataTrust;
  risk_radar: RiskSignal[];
  action_center?: ActionItem[];
  summary: {
    total_pipeline: number;
    active_work_orders: number;
    delayed_work_orders: number;
  };
}

export interface LeadershipUpdate {
  markdown_report: string;
  is_mock_data: boolean;
  bi_data: BIData;
  risk_radar: RiskSignal[];
  data_trust: DataTrust;
  data_quality_notes: string[];
}
