import os

class Settings:
    APP_ENV: str = os.getenv("APP_ENV", "development")
    MONDAY_API_TOKEN: str = os.getenv("MONDAY_API_TOKEN", "")
    MONDAY_WORK_ORDERS_BOARD_ID: str = os.getenv("MONDAY_WORK_ORDERS_BOARD_ID", "")
    MONDAY_DEALS_BOARD_ID: str = os.getenv("MONDAY_DEALS_BOARD_ID", "")
    LLM_API_KEY: str = os.getenv("LLM_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    LLM_MODEL: str = os.getenv("LLM_MODEL", "gemini-2.5-flash")
    USE_MOCK_FALLBACK: bool = os.getenv("USE_MOCK_FALLBACK", "true").lower() in ("true", "1", "yes")

settings = Settings()
