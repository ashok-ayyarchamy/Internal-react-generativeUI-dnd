# AI SDK Backend

A FastAPI-based backend for the AI SDK project.

## Setup

### Prerequisites

- Python 3.11+
- Poetry

### Installation

1. Install Poetry (if not already installed):
   ```bash
   curl -sSL https://install.python-poetry.org | python3 -
   ```

2. Navigate to the backend directory:
   ```bash
   cd backend
   ```

3. Install dependencies:
   ```bash
   poetry install
   ```

4. Activate the virtual environment:
   ```bash
   poetry shell
   ```

5. Set up environment variables:
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

6. Run the development server:
   ```bash
   poetry run python run.py
   # or
   poetry run uvicorn app.main:app --reload
   ```

## Project Structure

```
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # FastAPI application entry point
│   ├── core/                # Core configuration and settings
│   │   ├── __init__.py
│   │   ├── config.py        # Application settings
│   │   └── security.py      # Security utilities
│   ├── api/                 # API routes and endpoints
│   │   └── v1/
│   │       ├── __init__.py
│   │       ├── api.py       # Main API router
│   │       └── endpoints/   # API endpoints
│   │           ├── __init__.py
│   │           └── health.py # Health check endpoints
│   └── utils/               # Utility functions
│       ├── __init__.py
│       └── logger.py        # Logging utilities
├── tests/                   # Test files
│   ├── __init__.py
│   ├── conftest.py          # Pytest configuration
│   └── test_main.py         # Basic tests
├── pyproject.toml           # Poetry configuration
├── env.example              # Environment variables example
├── run.py                   # Application runner
├── setup.py                 # Setup script
└── README.md
```

## Development

### Code Quality

- **Format code**: `poetry run black .`
- **Sort imports**: `poetry run isort .`
- **Lint code**: `poetry run flake8 .`
- **Type checking**: `poetry run mypy .`

### Testing

- **Run all tests**: `poetry run pytest`
- **Run tests with coverage**: `poetry run pytest --cov=app`
- **Run specific test file**: `poetry run pytest tests/test_main.py`

## API Documentation

Once the server is running, visit:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

## Available Endpoints

### Health Checks
- `GET /` - Basic health check
- `GET /health` - Health status
- `GET /api/v1/health/detailed` - Detailed health check

## Environment Variables

Copy `env.example` to `.env` and configure the following variables:

- `APP_NAME` - Application name
- `DEBUG` - Debug mode (true/false)
- `HOST` - Server host
- `PORT` - Server port
- `SECRET_KEY` - JWT secret key
- `ALLOWED_ORIGINS` - CORS allowed origins
- `LOG_LEVEL` - Logging level 