"""
FastAPI server for component management with chat endpoint.
"""

from .main import app
from .chat_agent import ChatAgent
from .ai import DashboardCrew

__version__ = "0.1.0"

__all__ = [
    "app",
    "ChatAgent",
    "DashboardCrew",
]
