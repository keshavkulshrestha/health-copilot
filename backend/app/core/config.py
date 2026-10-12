import os
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import Optional

class Settings(BaseSettings):
    PROJECT_NAME: str = "MediMind AI"
    API_V1_STR: str = "/api"
    GEMINI_API_KEY: Optional[str] = ""
    GEMINI_MODEL: str = "gemini-2.5-flash"
    DATABASE_URL: str = "sqlite:///./medimind.db"
    SECRET_KEY: str = "medimind-super-secret-key-change-in-production-2026-secure"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440
    FRONTEND_ORIGIN: str = "http://localhost:5173"
    STORAGE_PATH: str = "./storage/documents"
    MAX_UPLOAD_MB: int = 25
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

settings = Settings()
os.makedirs(settings.STORAGE_PATH, exist_ok=True)
