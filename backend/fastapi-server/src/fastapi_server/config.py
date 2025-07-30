import os
from dotenv import load_dotenv

load_dotenv()


class Config:
    # Database Configuration
    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./components.db")

    # MCP Server Configuration
    MCP_SERVER_URL = os.getenv("MCP_SERVER_URL", "http://localhost:8001")

    # API Configuration
    API_HOST = os.getenv("API_HOST", "0.0.0.0")
    API_PORT = int(os.getenv("API_PORT", 8000))
