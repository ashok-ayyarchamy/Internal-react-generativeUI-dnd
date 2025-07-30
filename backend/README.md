# AI SDK Backend - FastMCP and FastAPI Servers

This project contains two separate servers that work together to provide data retrieval and component management capabilities.

## Project Structure

```
backend/
├── fastmcp-server/          # FastMCP server for data retrieval
│   ├── requirements.txt
│   ├── env.example
│   ├── config.py
│   ├── data_connectors.py
│   ├── mcp_tools.py
│   └── README.md
└── fastapi-server/          # FastAPI server for component management
    ├── requirements.txt
    ├── env.example
    ├── config.py
    ├── database.py
    ├── models.py
    ├── schemas.py
    ├── chat_agent.py
    ├── main.py
    └── README.md
```

## FastMCP Server

The FastMCP server provides tools for retrieving data from different data sources:

### Features
- **MySQL Tools**: Execute queries, get table schemas, list tables
- **MongoDB Tools**: Query collections, get schemas, list collections  
- **CSV Tools**: Read files, get file info, list available files

### Setup
```bash
cd fastmcp-server
poetry env use python3
poetry install
cp env.example .env
# Edit .env with your database configurations
poetry run start
```

## FastAPI Server

The FastAPI server provides a chat endpoint and component management for UI components:

### Features
- **Chat Endpoint**: Natural language processing to create components
- **Component Management**: CRUD operations for UI components
- **Component Types**: Support for charts, tables, metrics
- **Data Sources**: MySQL, MongoDB, CSV integration
- **Scheduling**: Component update intervals

### Setup
```bash
cd fastapi-server
poetry env use python3
poetry install
cp env.example .env
# Edit .env with your configurations
poetry run start
```

## How They Work Together

1. **User sends a chat message** to the FastAPI server (e.g., "add chart which shows latest sales details and updates every 10 min")

2. **Chat agent processes the message** and extracts:
   - Component type (chart, table, metric)
   - Data source (MySQL, MongoDB, CSV)
   - Query logic
   - Update interval

3. **Chat agent calls FastMCP server** to retrieve sample data from the appropriate data source

4. **Component suggestion is returned** with the generated query, fields configuration, and sample data

5. **User can save the component** using the component management endpoints

## Example Workflow

### 1. Start both servers
```bash
# Terminal 1 - FastMCP Server
cd fastmcp-server
poetry run start

# Terminal 2 - FastAPI Server  
cd fastapi-server
poetry run start
```

### 2. Send a chat request
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "add chart which shows latest sales details and updates every 10 min"}'
```

### 3. Response includes component suggestion
```json
{
  "response": "I'll create a chart showing sales with 10 min updates.",
  "component_suggestion": {
    "name": "chart_sales",
    "component_type": "chart",
    "query": "SELECT * FROM sales ORDER BY created_at DESC LIMIT 100",
    "fields": {
      "x_axis": "date",
      "y_axis": "value", 
      "chart_type": "line"
    },
    "interval": "10 min",
    "data_source": "mysql",
    "description": "Chart showing sales from database"
  },
  "data": {
    "source": "mysql",
    "data": [{"id": 1, "value": 100}, {"id": 2, "value": 200}],
    "count": 2
  }
}
```

### 4. Save the component
```bash
curl -X POST "http://localhost:8000/components" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "chart_sales",
    "component_type": "chart", 
    "query": "SELECT * FROM sales ORDER BY created_at DESC LIMIT 100",
    "fields": {"x_axis": "date", "y_axis": "value", "chart_type": "line"},
    "interval": "10 min",
    "data_source": "mysql",
    "description": "Chart showing sales from database"
  }'
```

## Configuration

Both servers use environment variables for configuration. Copy the example files and update with your settings:

- `fastmcp-server/env.example` → `.env` (database connections)
- `fastapi-server/env.example` → `.env` (API and MCP server settings)

## API Documentation

Once the FastAPI server is running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc` 