"""Application configuration loaded from environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """Runtime settings for the TaskFlow API."""

    database_url: str = "postgresql://taskflow:taskflow@localhost:5432/taskflow"
    cors_origins: list[str] = ["http://localhost:3000"]

    model_config = {"env_file": ".env"}


settings = Settings()
