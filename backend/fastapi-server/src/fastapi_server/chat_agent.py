import httpx
import json
import re
from typing import Dict, Any, Optional, List
from .config import Config


class ChatAgent:
    def __init__(self):
        self.mcp_server_url = Config.MCP_SERVER_URL

    async def process_message(self, message: str) -> Dict[str, Any]:
        """
        Process user message and return response with component suggestions and data.
        """
        # Parse the message to extract intent
        intent = self._parse_intent(message.lower())

        if intent["action"] == "add_chart":
            return await self._handle_add_chart(intent, message)
        elif intent["action"] == "add_table":
            return await self._handle_add_table(intent, message)
        elif intent["action"] == "add_metric":
            return await self._handle_add_metric(intent, message)
        else:
            return {
                "response": "I can help you create charts, tables, and metrics. Try saying something like 'add chart which shows latest sales details and updates every 10 min'",
                "component_suggestion": None,
                "data": None,
            }

    def _parse_intent(self, message: str) -> Dict[str, Any]:
        """Parse user message to extract intent and parameters."""
        intent = {
            "action": "unknown",
            "component_type": None,
            "data_source": None,
            "query": None,
            "interval": None,
            "fields": [],
        }

        # Check for component type
        if "chart" in message:
            intent["action"] = "add_chart"
            intent["component_type"] = "chart"
        elif "table" in message:
            intent["action"] = "add_table"
            intent["component_type"] = "table"
        elif "metric" in message or "kpi" in message:
            intent["action"] = "add_metric"
            intent["component_type"] = "metric"

        # Extract interval
        interval_match = re.search(r"(\d+)\s*(min|minute|hour|day)", message)
        if interval_match:
            number = interval_match.group(1)
            unit = interval_match.group(2)
            if unit in ["min", "minute"]:
                intent["interval"] = f"{number} min"
            elif unit == "hour":
                intent["interval"] = f"{number} hour"
            elif unit == "day":
                intent["interval"] = f"{number} day"

        # Extract data source hints
        if any(word in message for word in ["mysql", "sql", "database"]):
            intent["data_source"] = "mysql"
        elif any(word in message for word in ["mongo", "mongodb"]):
            intent["data_source"] = "mongodb"
        elif any(word in message for word in ["csv", "file"]):
            intent["data_source"] = "csv"

        # Extract query hints
        if "sales" in message:
            intent["query"] = "sales"
        elif "revenue" in message:
            intent["query"] = "revenue"
        elif "users" in message:
            intent["query"] = "users"
        elif "orders" in message:
            intent["query"] = "orders"

        return intent

    async def _handle_add_chart(
        self, intent: Dict[str, Any], original_message: str
    ) -> Dict[str, Any]:
        """Handle chart creation requests."""
        try:
            # Call MCP server to get available data
            data = await self._get_data_from_mcp(intent)

            component_suggestion = {
                "name": f"{intent['component_type']}_{intent['query'] or 'data'}",
                "component_type": intent["component_type"],
                "query": self._generate_query(intent),
                "fields": self._generate_fields(intent),
                "interval": intent.get("interval"),
                "data_source": intent.get("data_source", "mysql"),
                "description": f"Chart showing {intent.get('query', 'data')} from {intent.get('data_source', 'database')}",
            }

            return {
                "response": f"I'll create a {intent['component_type']} showing {intent.get('query', 'data')} with {intent.get('interval', 'manual')} updates.",
                "component_suggestion": component_suggestion,
                "data": data,
            }

        except Exception as e:
            return {
                "response": f"Sorry, I couldn't process your request. Error: {str(e)}",
                "component_suggestion": None,
                "data": None,
            }

    async def _handle_add_table(
        self, intent: Dict[str, Any], original_message: str
    ) -> Dict[str, Any]:
        """Handle table creation requests."""
        return await self._handle_add_chart(intent, original_message)

    async def _handle_add_metric(
        self, intent: Dict[str, Any], original_message: str
    ) -> Dict[str, Any]:
        """Handle metric creation requests."""
        return await self._handle_add_chart(intent, original_message)

    async def _get_data_from_mcp(
        self, intent: Dict[str, Any]
    ) -> Optional[Dict[str, Any]]:
        """Call MCP server to get data based on intent."""
        try:
            async with httpx.AsyncClient() as client:
                # This is a simplified example - in a real implementation,
                # you would make actual MCP protocol calls
                if intent.get("data_source") == "mysql":
                    # Simulate MySQL query
                    return {
                        "source": "mysql",
                        "data": [{"id": 1, "value": 100}, {"id": 2, "value": 200}],
                        "count": 2,
                    }
                elif intent.get("data_source") == "mongodb":
                    # Simulate MongoDB query
                    return {
                        "source": "mongodb",
                        "data": [
                            {"_id": "1", "value": 150},
                            {"_id": "2", "value": 250},
                        ],
                        "count": 2,
                    }
                elif intent.get("data_source") == "csv":
                    # Simulate CSV read
                    return {
                        "source": "csv",
                        "data": [{"row": 1, "value": 300}, {"row": 2, "value": 400}],
                        "count": 2,
                    }
                else:
                    # Default to MySQL
                    return {
                        "source": "mysql",
                        "data": [{"id": 1, "value": 100}, {"id": 2, "value": 200}],
                        "count": 2,
                    }
        except Exception as e:
            return None

    def _generate_query(self, intent: Dict[str, Any]) -> str:
        """Generate appropriate query based on intent."""
        data_source = intent.get("data_source", "mysql")
        query_type = intent.get("query", "data")

        if data_source == "mysql":
            if query_type == "sales":
                return "SELECT * FROM sales ORDER BY created_at DESC LIMIT 100"
            elif query_type == "revenue":
                return "SELECT SUM(amount) as total_revenue FROM sales WHERE created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY)"
            else:
                return "SELECT * FROM data LIMIT 100"
        elif data_source == "mongodb":
            if query_type == "sales":
                return '{"collection": "sales", "query": {}, "limit": 100}'
            else:
                return '{"collection": "data", "query": {}, "limit": 100}'
        elif data_source == "csv":
            return "sales_data.csv"
        else:
            return "SELECT * FROM data LIMIT 100"

    def _generate_fields(self, intent: Dict[str, Any]) -> Dict[str, Any]:
        """Generate fields configuration based on intent."""
        component_type = intent.get("component_type", "chart")

        if component_type == "chart":
            return {"x_axis": "date", "y_axis": "value", "chart_type": "line"}
        elif component_type == "table":
            return {
                "columns": ["id", "value", "date"],
                "sortable": True,
                "searchable": True,
            }
        elif component_type == "metric":
            return {"display_format": "number", "prefix": "$", "suffix": ""}
        else:
            return {}
