from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class VisualizationSpec(BaseModel):
    type: str  # e.g., 'TOP_OPPORTUNITY_BAR', 'FORECAST_WATERFALL', 'SECTOR_COMPARISON', 'EXECUTION_STATUS_DONUT', 'CONCENTRATION_PARETO', 'RISK_EVIDENCE_BAR', 'NONE'
    title: str
    data: List[Dict[str, Any]] = []

class ChatResponse(BaseModel):
    text: str
    intent: str
    operation: Optional[str] = None
    entity: Optional[str] = None
    granularity: Optional[str] = None
    visualization: Optional[VisualizationSpec] = None
    is_mock_data: bool = False
    clarification_needed: bool = False
    clarification_options: Optional[List[str]] = None
    bi_data: Optional[Dict[str, Any]] = None
    risk_radar: List[Dict[str, Any]] = []
    data_trust: Optional[Dict[str, Any]] = None
    data_quality_notes: List[str] = []
    suggested_questions: List[str] = []

class LeadershipUpdateResponse(BaseModel):
    markdown_report: str
    is_mock_data: bool = False
    bi_data: Dict[str, Any]
    risk_radar: List[Dict[str, Any]]
    data_trust: Dict[str, Any]
    data_quality_notes: List[str]
