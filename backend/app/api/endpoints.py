from fastapi import APIRouter, HTTPException
from app.agent.schemas import ChatRequest, ChatResponse, LeadershipUpdateResponse
from app.agent.agent import process_agent_query, generate_leadership_update
from app.monday.client import monday_client
from app.analytics.bi_engine import calculate_bi_analytics
from app.analytics.risk_engine import calculate_risk_radar
from app.normalization.data_trust import calculate_data_trust
from app.normalization.data_quality import audit_data_quality

router = APIRouter()

@router.post("/chat", response_model=ChatResponse)
def chat_endpoint(request: ChatRequest):
    if not request.message or not request.message.strip():
        raise HTTPException(status_code=400, detail="Message cannot be empty.")
    return process_agent_query(request.message)

@router.get("/leadership-update", response_model=LeadershipUpdateResponse)
def leadership_update_endpoint():
    return generate_leadership_update()

@router.get("/boards/status")
def boards_status_endpoint():
    deals, deals_is_mock = monday_client.fetch_deals_board()
    wos, wos_is_mock = monday_client.fetch_work_orders_board()
    is_mock = deals_is_mock or wos_is_mock
    notes = audit_data_quality(deals, wos)
    bi_data = calculate_bi_analytics(deals, wos)
    risk_radar = calculate_risk_radar(bi_data, notes)
    data_trust = calculate_data_trust(deals, wos)
    
    return {
        "connected_live_monday": not is_mock,
        "is_mock_data": is_mock,
        "deals_count": len(deals),
        "work_orders_count": len(wos),
        "data_quality_warnings_count": len(notes),
        "risk_radar_count": len(risk_radar),
        "data_trust_score": data_trust["overall_confidence"],
        "data_trust": data_trust,
        "risk_radar": risk_radar,
        "summary": {
            "total_pipeline": bi_data["deals_summary"]["open_pipeline_value"],
            "active_work_orders": bi_data["work_orders_summary"]["active_wo_count"],
            "delayed_work_orders": bi_data["work_orders_summary"]["delayed_count"]
        }
    }
