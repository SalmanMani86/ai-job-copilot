from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    supabase_url: str
    supabase_service_key: str
    groq_api_key: str
    gemini_api_key: str
    github_token: str
    github_username: str = "SalmanMani86"
    portfolio_url: str = "https://salmanmani86.github.io/portfolio/"


settings = Settings()
