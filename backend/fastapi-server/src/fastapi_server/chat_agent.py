"""
Chat agent for processing user messages.
Clean, simple implementation using AI crew.
"""

import httpx
import json
from typing import Dict, Any, Optional, List
from .config import Config
from .ai import DashboardCrew


class ChatAgent:
    """Chat agent for processing user messages using AI crew."""

    def __init__(self):
        self.mcp_server_url = Config.MCP_SERVER_URL
        self.crew = DashboardCrew()

    async def process_message(
        self,
        message: str,
        session_id: Optional[str] = None,
        chat_history: Optional[List[Dict[str, Any]]] = None,
    ) -> Dict[str, Any]:
        """
        Process user message using AI crew with chat history context.

        Args:
            message: The user's natural language message
            session_id: Optional session ID for conversation tracking
            chat_history: Optional list of previous chat messages

        Returns:
            Dict containing response, component_suggestion, and data
        """
        return self.crew.process_message(
            message, session_id=session_id, chat_history=chat_history
        )

    async def _get_data_from_mcp(
        self, intent: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Get data from MCP server based on intent."""
        try:
            async with httpx.AsyncClient() as client:
                if intent.get("data_source") == "mysql":
                    return {
                        "source": "mysql",
                        "data": [{"id": 1, "value": 100}, {"id": 2, "value": 200}],
                        "count": 2,
                    }
                elif intent.get("data_source") == "mongodb":
                    return {
                        "source": "mongodb",
                        "data": [
                            {"_id": "1", "value": 150},
                            {"_id": "2", "value": 250},
                        ],
                        "count": 2,
                    }
                elif intent.get("data_source") == "csv":
                    return {
                        "source": "csv",
                        "data": [{"row": 1, "value": 300}, {"row": 2, "value": 400}],
                        "count": 2,
                    }
                else:
                    return {
                        "source": "mysql",
                        "data": [{"id": 1, "value": 100}, {"id": 2, "value": 200}],
                        "count": 2,
                    }
        except Exception as e:
            return None
