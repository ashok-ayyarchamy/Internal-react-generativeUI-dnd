# FastAPI Component Management Server

A FastAPI server that provides a chat endpoint and component management for UI components with query logic and scheduling details.

## Features

- **Chat Endpoint**: Natural language processing to create components
- **Component Management**: CRUD operations for UI components
- **Component Types**: Support for charts, tables, metrics
- **Data Sources**: MySQL, MongoDB, CSV integration
- **Scheduling**: Component update intervals

## Setup

1. Install Poetry (if not already installed):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Create and activate virtual environment:
```bash
poetry env use python3
poetry install
```

3. Copy environment file and configure:
```bash
cp env.example .env
# Edit .env with your configurations
```

4. Run the server:
```bash
# Using script
poetry run start

# Or directly
poetry run python main.py
```

## API Endpoints

### Chat Endpoint
- `POST /chat`: Process natural language requests and suggest components

### Component Endpoints
- `POST /components`: Create a new component
- `GET /components`: Get all components (with pagination)
- `GET /components/{id}`: Get a specific component
- `PUT /components/{id}`: Update a component
- `DELETE /components/{id}`: Delete a component
- `GET /components/type/{type}`: Get components by type
- `GET /components/source/{source}`: Get components by data source

## Component Structure

```json
{
  "id": 1,
  "name": "sales_chart",
  "component_type": "chart",
  "query": "SELECT * FROM sales ORDER BY created_at DESC LIMIT 100",
  "fields": {
    "x_axis": "date",
    "y_axis": "value",
    "chart_type": "line"
  },
  "interval": "10 min",
  "data_source": "mysql",
  "description": "Chart showing sales data",
  "created_at": "2024-01-01T00:00:00",
  "updated_at": "2024-01-01T00:00:00"
}
```

## Chat Examples

- "add chart which shows latest sales details and updates every 10 min"
- "create a table for user data from MongoDB"
- "add metric for revenue from CSV file"

## Configuration

Update the `.env` file with your configurations:

```env
# Database Configuration
DATABASE_URL=sqlite:///./components.db

# MCP Server Configuration
MCP_SERVER_URL=http://localhost:8001

# API Configuration
API_HOST=0.0.0.0
API_PORT=8000
```

## Usage Examples

### Create Component via Chat
```bash
curl -X POST "http://localhost:8000/chat" \
  -H "Content-Type: application/json" \
  -d '{"message": "add chart which shows latest sales details and updates every 10 min"}'
```

### Create Component Directly
```bash
curl -X POST "http://localhost:8000/components" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "sales_chart",
    "component_type": "chart",
    "query": "SELECT * FROM sales ORDER BY created_at DESC LIMIT 100",
    "fields": {"x_axis": "date", "y_axis": "value", "chart_type": "line"},
    "interval": "10 min",
    "data_source": "mysql",
    "description": "Chart showing sales data"
  }'
```

### Get All Components
```bash
curl "http://localhost:8000/components"
``` 