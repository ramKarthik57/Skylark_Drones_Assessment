import requests
import logging
from typing import List, Dict, Any, Tuple
from app.config import settings
from app.normalization.normalizer import normalize_deal_record, normalize_work_order_record
from app.monday.mock_monday import get_mock_deals, get_mock_work_orders

logger = logging.getLogger("monday_client")

class MondayClient:
    def __init__(self):
        self.api_token = settings.MONDAY_API_TOKEN
        self.deals_board_id = settings.MONDAY_DEALS_BOARD_ID
        self.wo_board_id = settings.MONDAY_WORK_ORDERS_BOARD_ID
        self.api_url = "https://api.monday.com/v2"

    def is_configured(self) -> bool:
        return bool(self.api_token and (self.deals_board_id or self.wo_board_id))

    def _query(self, query: str, variables: Dict[str, Any] = None) -> Dict[str, Any]:
        if not self.api_token:
            raise ValueError("Monday.com API Token is not configured.")
        headers = {
            "Authorization": self.api_token,
            "Content-Type": "application/json",
            "API-Version": "2023-10"
        }
        response = requests.post(self.api_url, json={"query": query, "variables": variables or {}}, headers=headers, timeout=15)
        response.raise_for_status()
        res_json = response.json()
        if "errors" in res_json:
            raise ValueError(f"Monday API Error: {res_json['errors']}")
        return res_json.get("data", {})

    def fetch_deals_board(self) -> Tuple[List[Dict[str, Any]], bool]:
        if not self.is_configured() or not self.deals_board_id:
            if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                raise RuntimeError("Live Monday.com Deals board is not configured in production mode.")
            logger.info("Using Excel dataset mock fallback for Deals board.")
            return get_mock_deals(), True
        
        query = """
        query ($board_id: [ID!]) {
          boards (ids: $board_id) {
            items_page (limit: 500) {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
        """
        try:
            data = self._query(query, {"board_id": [self.deals_board_id]})
            boards = data.get("boards", [])
            if not boards:
                if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                    raise RuntimeError("Monday.com Deals board returned no board data.")
                return get_mock_deals(), True
            items = boards[0].get("items_page", {}).get("items", [])
            raw_deals = []
            for item in items:
                record = {"Deal Name": item["name"]}
                for cv in item.get("column_values", []):
                    col_id = cv["id"]
                    text_val = cv.get("text")
                    record[col_id] = text_val
                raw_deals.append(record)
            return [normalize_deal_record(r) for r in raw_deals], False
        except Exception as e:
            logger.error(f"Error querying Monday Deals board: {e}")
            if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                raise RuntimeError(f"Live Monday.com Deals API Error: {e}")
            return get_mock_deals(), True

    def fetch_work_orders_board(self) -> Tuple[List[Dict[str, Any]], bool]:
        if not self.is_configured() or not self.wo_board_id:
            if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                raise RuntimeError("Live Monday.com Work Orders board is not configured in production mode.")
            logger.info("Using Excel dataset mock fallback for Work Orders board.")
            return get_mock_work_orders(), True
        
        query = """
        query ($board_id: [ID!]) {
          boards (ids: $board_id) {
            items_page (limit: 500) {
              items {
                id
                name
                column_values {
                  id
                  text
                  value
                }
              }
            }
          }
        }
        """
        try:
            data = self._query(query, {"board_id": [self.wo_board_id]})
            boards = data.get("boards", [])
            if not boards:
                if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                    raise RuntimeError("Monday.com Work Orders board returned no board data.")
                return get_mock_work_orders(), True
            items = boards[0].get("items_page", {}).get("items", [])
            raw_wos = []
            for item in items:
                record = {"Deal name masked": item["name"]}
                for cv in item.get("column_values", []):
                    col_id = cv["id"]
                    text_val = cv.get("text")
                    record[col_id] = text_val
                raw_wos.append(record)
            return [normalize_work_order_record(r) for r in raw_wos], False
        except Exception as e:
            logger.error(f"Error querying Monday Work Orders board: {e}")
            if settings.APP_ENV == "production" and not settings.USE_MOCK_FALLBACK:
                raise RuntimeError(f"Live Monday.com Work Orders API Error: {e}")
            return get_mock_work_orders(), True

monday_client = MondayClient()
