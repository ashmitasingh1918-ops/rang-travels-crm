from pydantic_settings import BaseSettings
from typing import List

class Settings(BaseSettings):
    PROJECT_NAME: str = "Rang Travels CRM"
    API_V1_STR: str = "/api/v1"
    SECRET_KEY: str = "supersecretkeyforrangtravelscrm"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    ALGORITHM: str = "HS256"
    
    DATABASE_URL: str = "postgresql+asyncpg://postgres:postgres@localhost:5432/rang_travels"
    
    # CORS Origins
    BACKEND_CORS_ORIGINS: List[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
    ]
    
    SMTP_TLS: bool = True
    SMTP_PORT: int = 587
    SMTP_HOST: str = "smtp.gmail.com"
    SMTP_USER: str = ""
    SMTP_PASSWORD: str = ""
    EMAILS_FROM_EMAIL: str = "noreply@rangtravels.com"
    EMAILS_FROM_NAME: str = "Rang Travels"

    class Config:
        case_sensitive = True
        env_file = ".env"

settings = Settings()
