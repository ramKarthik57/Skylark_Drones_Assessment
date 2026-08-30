from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[str] = None

class ChatResponse(BaseModel):
    text: str
    intent: str
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
