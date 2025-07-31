# FastAPI Component Management Server

A FastAPI server that provides a chat endpoint and component management for UI components with query logic and scheduling details. Features a CrewAI agentic layer for sophisticated natural language processing with **OpenAI as the primary AI provider**.

## Features

- **Chat Endpoint**: Natural language processing to create components using OpenAI GPT models
- **Component Management**: CRUD operations for UI components
- **Component Types**: Support for charts, tables, metrics
- **Data Sources**: MySQL, MongoDB, CSV integration
- **Scheduling**: Component update intervals
- **AI Integration**: CrewAI crew with specialized agents using OpenAI GPT-4

## Setup

1. Install Poetry (if not already installed):
```bash
curl -sSL https://install.python-poetry.org | python3 -
```

2. Create and activate virtual environment:
```bash
poetry env use python3.12
poetry install
```

3. Copy environment file and configure:
```bash
cp env.example .env
# Edit .env with your OpenAI API key and other configurations
```

4. **Configure OpenAI API Key** (Required):
   - Get your OpenAI API key from [OpenAI Platform](https://platform.openai.com/api-keys)
   - Add it to your `.env` file:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

5. Run the server:
```bash
# Using script
poetry run start

# Or directly
poetry run python -m fastapi_server.main
```

## AI Configuration

### Primary Provider: OpenAI
The system is configured to use **OpenAI GPT-4** as the primary AI model for all agents:
- **Intent Analysis Specialist**: Uses GPT-4 to understand user requests
- **Data Integration Specialist**: Uses GPT-4 to determine data sources and queries
- **Component Architecture Specialist**: Uses GPT-4 to generate component configurations
- **User Communication Specialist**: Uses GPT-4 to generate helpful responses

### Alternative Providers (Optional)
You can also configure other AI providers by adding their API keys to `.env`:
- **Anthropic Claude**: `ANTHROPIC_API_KEY`
- **Google Gemini**: `GOOGLE_API_KEY`
- **Mistral AI**: `MISTRAL_API_KEY`
- **Ollama** (Local): `OLLAMA_BASE_URL`

## API Endpoints

### Chat Endpoint
- `POST /chat`: Process natural language requests and suggest components using OpenAI

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

The AI can understand natural language requests like:
- "add chart which shows latest sales details and updates every 10 min"
- "create a table for user data from MongoDB"
- "add metric for revenue from CSV file"
- "show me a line chart of monthly revenue from MySQL database"

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

# OpenAI Configuration (Primary AI Provider)
OPENAI_API_KEY=your_openai_api_key_here
# Optional: Custom OpenAI base URL (for Azure OpenAI or other providers)
# OPENAI_BASE_URL=https://your-custom-endpoint.openai.azure.com/

# Alternative AI Providers (Optional)
ANTHROPIC_API_KEY=your_anthropic_api_key_here
GOOGLE_API_KEY=your_google_api_key_here
MISTRAL_API_KEY=your_mistral_api_key_here

# Ollama Configuration (Local Models)
# OLLAMA_BASE_URL=http://localhost:11434
```

## Usage Examples

### Create Component via Chat (Using OpenAI)
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

## Development

### Python Version
This project requires Python 3.12+ and is compatible with Python 3.13.

### Dependencies
- **FastAPI**: Web framework
- **CrewAI**: AI agent orchestration
- **OpenAI**: Primary AI provider
- **SQLAlchemy**: Database ORM
- **Pydantic**: Data validation

### Running Tests
```bash
poetry run pytest
``` 