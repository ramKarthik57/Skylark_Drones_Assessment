import pytest
from app.normalization.data_quality import audit_data_quality

def test_audit_data_quality_missing_dates():
    deals = [{"deal_status": "Open", "tentative_close_date": None}]
    wos = []
    notes = audit_data_quality(deals, wos)
    assert any("tentative close dates" in n for n in notes)

def test_audit_data_quality_delayed_wos():
    deals = []
    wos = [{"execution_status": "Delayed"}]
    notes = audit_data_quality(deals, wos)
    assert any("Execution Delayed" in n for n in notes)

def test_audit_data_quality_unrated_deals():
    deals = [{"deal_status": "Open", "closure_probability": None}]
    wos = []
    notes = audit_data_quality(deals, wos)
    assert any("closure probability" in n for n in notes)
