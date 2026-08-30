import os
import requests
import json
import pandas as pd
from app.config import settings

def seed_monday_boards():
    api_token = settings.MONDAY_API_TOKEN
    if not api_token:
        print("Error: MONDAY_API_TOKEN is not set in environment.")
        return

    headers = {
        "Authorization": api_token,
        "Content-Type": "application/json",
        "API-Version": "2023-10"
    }

    url = "https://api.monday.com/v2"

    print("Creating Deals board on Monday.com...")
    create_deals_query = """
    mutation {
      create_board (board_name: "Skylark Sales Deals Board", board_kind: public) {
        id
      }
    }
    """
    res = requests.post(url, json={"query": create_deals_query}, headers=headers).json()
    deals_board_id = res.get("data", {}).get("create_board", {}).get("id")
    print(f"Created Deals Board ID: {deals_board_id}")

    print("Creating Work Orders board on Monday.com...")
    create_wo_query = """
    mutation {
      create_board (board_name: "Skylark Work Orders Tracker", board_kind: public) {
        id
      }
    }
    """
    res = requests.post(url, json={"query": create_wo_query}, headers=headers).json()
    wo_board_id = res.get("data", {}).get("create_board", {}).get("id")
    print(f"Created Work Orders Board ID: {wo_board_id}")

    print(f"\nSeeding completed!\nUpdate your .env file with:\nMONDAY_DEALS_BOARD_ID={deals_board_id}\nMONDAY_WORK_ORDERS_BOARD_ID={wo_board_id}")

if __name__ == "__main__":
    seed_monday_boards()
