import pytest
from app.normalization.normalizer import (
    clean_currency, clean_date, clean_sector, clean_deal_status, clean_wo_execution_status, is_null_or_empty
)

def test_null_handling():
    assert is_null_or_empty("N/A") is True
    assert is_null_or_empty("nan") is True
    assert is_null_or_empty("-") is True
    assert is_null_or_empty("  ") is True
    assert is_null_or_empty(None) is True
    assert is_null_or_empty("Active") is False

def test_currency_cleaning():
    assert clean_currency("₹17,616,960.00") == 17616960.0
    assert clean_currency("$500,000") == 500000.0
    assert clean_currency(489360.0) == 489360.0
    assert clean_currency("N/A") is None

def test_date_cleaning():
    assert clean_date("2026-02-26") == "2026-02-26"
    assert clean_date("Jul-25") == "2025-07-01"
    assert clean_date("N/A") is None

def test_sector_cleaning():
    assert clean_sector("Mining") == "Mining"
    assert clean_sector("Renewables & Solar") == "Renewables"
    assert clean_sector("Railway work") == "Railways"
    assert clean_sector(None) == "Others / Unspecified"

def test_deal_status_cleaning():
    assert clean_deal_status("Won") == "Won"
    assert clean_deal_status("Dead") == "Dead"
    assert clean_deal_status("Open") == "Open"
    assert clean_deal_status("On Hold") == "On Hold"

def test_wo_execution_status_cleaning():
    assert clean_wo_execution_status("Completed") == "Completed"
    assert clean_wo_execution_status("Ongoing") == "Ongoing"
    assert clean_wo_execution_status("Executed until current month") == "Ongoing"
    assert clean_wo_execution_status("Pause / struck") == "Delayed"
