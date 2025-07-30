# FastMCP Data Retrieval Server

A FastMCP server that provides tools for retrieving data from MySQL, MongoDB, and CSV files.

## Features

- **MySQL Tools**: Execute queries, get table schemas, list tables
- **MongoDB Tools**: Query collections, get schemas, list collections
- **CSV Tools**: Read files, get file info, list available files

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
# Edit .env with your database configurations
```

4. Create data directory for CSV files:
```bash
mkdir data
```

## Usage

Run the FastMCP server:
```bash
# Using script
poetry run start

# Or directly
poetry run python mcp_tools.py
```

## Available Tools

### MySQL Tools
- `mysql_query(query)`: Execute SQL queries
- `mysql_get_tables()`: List all tables
- `mysql_get_schema(table_name)`: Get table schema

### MongoDB Tools
- `mongo_query(collection, query, projection, limit)`: Execute MongoDB queries
- `mongo_get_collections()`: List all collections
- `mongo_get_schema(collection)`: Get collection schema

### CSV Tools
- `csv_read(filename, limit)`: Read CSV files
- `csv_get_info(filename)`: Get file information
- `csv_list_files()`: List available CSV files

## Configuration

Update the `.env` file with your database connection details:

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=root
MYSQL_PASSWORD=password
MYSQL_DATABASE=test_db

# MongoDB Configuration
MONGO_URI=mongodb://localhost:27017/
MONGO_DATABASE=test_db

# CSV Configuration
CSV_BASE_PATH=./data
``` 