"""
Integration tests for the AI crew module.
"""

import pytest
import asyncio
from typing import Dict, Any
from fastapi_server.ai import DashboardCrew


@pytest.mark.asyncio
async def test_basic_message_processing():
    """Test basic message processing through the crew."""
    crew = DashboardCrew()

    message = "add chart which shows latest sales details and updates every 10 min"
    result = await crew.process_message(message)

    # Verify response structure
    assert isinstance(result, dict)
    assert "response" in result
    assert "component_suggestion" in result
    assert "data" in result
    assert "intent" in result

    # Verify intent parsing
    intent = result["intent"]
    assert intent["action"] == "add_chart"
    assert intent["component_type"] == "chart"
    assert intent["data_source"] == "mysql"
    assert intent["query"] == "sales"
    assert intent["interval"] == "10 min"


@pytest.mark.asyncio
async def test_table_creation():
    """Test table creation request."""
    crew = DashboardCrew()

    message = "create a table for user data from mysql database"
    result = await crew.process_message(message)

    intent = result["intent"]
    assert intent["action"] == "add_table"
    assert intent["component_type"] == "table"
    assert intent["data_source"] == "mysql"
    assert intent["query"] == "users"


@pytest.mark.asyncio
async def test_metric_creation():
    """Test metric creation request."""
    crew = DashboardCrew()

    message = "add metric for revenue tracking"
    result = await crew.process_message(message)

    intent = result["intent"]
    assert intent["action"] == "add_metric"
    assert intent["component_type"] == "metric"
    assert intent["query"] == "revenue"


@pytest.mark.asyncio
async def test_mongodb_data_source():
    """Test MongoDB data source detection."""
    crew = DashboardCrew()

    message = "show me a chart of orders from mongodb"
    result = await crew.process_message(message)

    intent = result["intent"]
    assert intent["data_source"] == "mongodb"
    assert intent["query"] == "orders"


@pytest.mark.asyncio
async def test_unknown_intent():
    """Test handling of unknown intent."""
    crew = DashboardCrew()

    message = "hello world"
    result = await crew.process_message(message)

    intent = result["intent"]
    assert intent["action"] == "unknown"
    assert result["component_suggestion"] is None
    assert result["data"] is None


@pytest.mark.asyncio
async def test_component_generation():
    """Test component generation with data."""
    crew = DashboardCrew()

    message = "add chart which shows latest sales details and updates every 10 min"
    result = await crew.process_message(message)

    component = result["component_suggestion"]
    assert component is not None
    assert component["name"] == "chart_sales"
    assert component["component_type"] == "chart"
    assert component["data_source"] == "mysql"
    assert component["interval"] == "10 min"
    assert "query" in component
    assert "fields" in component


@pytest.mark.asyncio
async def test_data_retrieval():
    """Test data retrieval from different sources."""
    crew = DashboardCrew()

    # Test MySQL data
    message = "add chart for sales data from mysql"
    result = await crew.process_message(message)

    data = result["data"]
    assert data is not None
    assert data["source"] == "mysql"
    assert "data" in data
    assert "count" in data
    assert "query" in data


@pytest.mark.asyncio
async def test_crew_workflow():
    """Test the complete crew workflow."""
    crew = DashboardCrew()

    message = "add chart for sales data"
    result = await crew.process_message(message)

    assert isinstance(result, dict)
    assert "response" in result
    assert "intent" in result
    assert "component_suggestion" in result
    assert "data" in result


@pytest.mark.asyncio
async def test_error_handling():
    """Test error handling in the crew."""
    crew = DashboardCrew()

    # Test with empty message
    message = ""
    result = await crew.process_message(message)

    assert isinstance(result, dict)
    assert "response" in result
    # Should handle empty message gracefully
