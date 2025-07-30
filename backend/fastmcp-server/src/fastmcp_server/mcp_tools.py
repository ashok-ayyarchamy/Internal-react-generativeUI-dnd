from fastmcp import FastMCP
from .data_connectors import MySQLConnector, MongoDBConnector, CSVConnector
from typing import Dict, List, Any, Optional
import json

# Initialize connectors
mysql_connector = MySQLConnector()
mongo_connector = MongoDBConnector()
csv_connector = CSVConnector()

# Initialize FastMCP
mcp = FastMCP("data-retrieval-server")


@mcp.tool()
def mysql_query(query: str) -> Dict[str, Any]:
    """
    Execute a MySQL query and return the results.

    Args:
        query: SQL query to execute

    Returns:
        Dictionary containing query results and metadata
    """
    try:
        results = mysql_connector.execute_query(query)
        return {
            "success": True,
            "data": results,
            "count": len(results),
            "source": "mysql",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mysql"}


@mcp.tool()
def mysql_get_tables() -> Dict[str, Any]:
    """
    Get list of all tables in the MySQL database.

    Returns:
        Dictionary containing list of tables
    """
    try:
        tables = mysql_connector.get_tables()
        return {
            "success": True,
            "tables": tables,
            "count": len(tables),
            "source": "mysql",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mysql"}


@mcp.tool()
def mysql_get_schema(table_name: str) -> Dict[str, Any]:
    """
    Get schema information for a specific MySQL table.

    Args:
        table_name: Name of the table

    Returns:
        Dictionary containing table schema information
    """
    try:
        schema = mysql_connector.get_table_schema(table_name)
        return {
            "success": True,
            "schema": schema,
            "table": table_name,
            "source": "mysql",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mysql"}


@mcp.tool()
def mongo_query(
    collection: str,
    query: str,
    projection: Optional[str] = None,
    limit: Optional[int] = None,
) -> Dict[str, Any]:
    """
    Execute a MongoDB query and return the results.

    Args:
        collection: Name of the collection to query
        query: JSON string representing the MongoDB query
        projection: JSON string representing the projection (optional)
        limit: Maximum number of documents to return (optional)

    Returns:
        Dictionary containing query results and metadata
    """
    try:
        query_dict = json.loads(query) if isinstance(query, str) else query
        projection_dict = json.loads(projection) if projection else None

        results = mongo_connector.execute_query(
            collection, query_dict, projection_dict, limit
        )
        return {
            "success": True,
            "data": results,
            "count": len(results),
            "collection": collection,
            "source": "mongodb",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mongodb"}


@mcp.tool()
def mongo_get_collections() -> Dict[str, Any]:
    """
    Get list of all collections in the MongoDB database.

    Returns:
        Dictionary containing list of collections
    """
    try:
        collections = mongo_connector.get_collections()
        return {
            "success": True,
            "collections": collections,
            "count": len(collections),
            "source": "mongodb",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mongodb"}


@mcp.tool()
def mongo_get_schema(collection: str) -> Dict[str, Any]:
    """
    Get schema information for a specific MongoDB collection.

    Args:
        collection: Name of the collection

    Returns:
        Dictionary containing collection schema information
    """
    try:
        schema = mongo_connector.get_collection_schema(collection)
        return {
            "success": True,
            "schema": schema,
            "collection": collection,
            "source": "mongodb",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "mongodb"}


@mcp.tool()
def csv_read(filename: str, limit: Optional[int] = None) -> Dict[str, Any]:
    """
    Read a CSV file and return the data.

    Args:
        filename: Name of the CSV file to read
        limit: Maximum number of rows to return (optional)

    Returns:
        Dictionary containing CSV data and metadata
    """
    try:
        df = csv_connector.read_csv(filename)

        if limit:
            df = df.head(limit)

        return {
            "success": True,
            "data": df.to_dict("records"),
            "columns": df.columns.tolist(),
            "shape": df.shape,
            "filename": filename,
            "source": "csv",
        }
    except Exception as e:
        return {"success": False, "error": str(e), "source": "csv"}


@mcp.tool()
def csv_get_info(filename: str) -> Dict[str, Any]:
    """
    Get information about a CSV file including columns and data types.

    Args:
        filename: Name of the CSV file

    Returns:
        Dictionary containing CSV file information
    """
    try:
        info = csv_connector.get_csv_info(filename)
        return {"success": True, "info": info, "filename": filename, "source": "csv"}
    except Exception as e:
        return {"success": False, "error": str(e), "source": "csv"}


@mcp.tool()
def csv_list_files() -> Dict[str, Any]:
    """
    List all available CSV files.

    Returns:
        Dictionary containing list of CSV files
    """
    try:
        files = csv_connector.list_csv_files()
        return {"success": True, "files": files, "count": len(files), "source": "csv"}
    except Exception as e:
        return {"success": False, "error": str(e), "source": "csv"}


def main():
    """Main function to run the MCP server"""
    mcp.run()


if __name__ == "__main__":
    main()
