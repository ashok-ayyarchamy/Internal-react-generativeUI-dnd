import mysql.connector
import pandas as pd
from pymongo import MongoClient
from typing import Dict, List, Any, Optional
from .config import Config
import os


class MySQLConnector:
    def __init__(self):
        self.config = Config()
        self.connection = None

    def connect(self):
        if not self.connection or not self.connection.is_connected():
            self.connection = mysql.connector.connect(
                host=self.config.MYSQL_HOST,
                port=self.config.MYSQL_PORT,
                user=self.config.MYSQL_USER,
                password=self.config.MYSQL_PASSWORD,
                database=self.config.MYSQL_DATABASE,
            )
        return self.connection

    def execute_query(self, query: str) -> List[Dict[str, Any]]:
        """Execute a SQL query and return results as list of dictionaries"""
        try:
            connection = self.connect()
            cursor = connection.cursor(dictionary=True)
            cursor.execute(query)
            results = cursor.fetchall()
            cursor.close()
            return results
        except Exception as e:
            raise Exception(f"MySQL query error: {str(e)}")

    def get_table_schema(self, table_name: str) -> List[Dict[str, Any]]:
        """Get schema information for a specific table"""
        query = f"DESCRIBE {table_name}"
        return self.execute_query(query)

    def get_tables(self) -> List[str]:
        """Get list of all tables in the database"""
        query = "SHOW TABLES"
        results = self.execute_query(query)
        return [list(table.values())[0] for table in results]


class MongoDBConnector:
    def __init__(self):
        self.config = Config()
        self.client = None
        self.db = None

    def connect(self):
        if not self.client:
            self.client = MongoClient(self.config.MONGO_URI)
            self.db = self.client[self.config.MONGO_DATABASE]
        return self.db

    def execute_query(
        self,
        collection: str,
        query: Dict[str, Any],
        projection: Optional[Dict[str, Any]] = None,
        limit: Optional[int] = None,
    ) -> List[Dict[str, Any]]:
        """Execute a MongoDB query and return results"""
        try:
            db = self.connect()
            collection_obj = db[collection]

            cursor = collection_obj.find(query, projection)
            if limit:
                cursor = cursor.limit(limit)

            results = list(cursor)
            return results
        except Exception as e:
            raise Exception(f"MongoDB query error: {str(e)}")

    def get_collections(self) -> List[str]:
        """Get list of all collections in the database"""
        db = self.connect()
        return db.list_collection_names()

    def get_collection_schema(self, collection: str) -> Dict[str, Any]:
        """Get sample document to understand schema"""
        db = self.connect()
        sample = db[collection].find_one()
        if sample:
            return {key: type(value).__name__ for key, value in sample.items()}
        return {}


class CSVConnector:
    def __init__(self):
        self.config = Config()

    def read_csv(self, filename: str, **kwargs) -> pd.DataFrame:
        """Read a CSV file and return as DataFrame"""
        try:
            file_path = os.path.join(self.config.CSV_BASE_PATH, filename)
            if not os.path.exists(file_path):
                raise FileNotFoundError(f"CSV file not found: {file_path}")

            df = pd.read_csv(file_path, **kwargs)
            return df
        except Exception as e:
            raise Exception(f"CSV read error: {str(e)}")

    def get_csv_info(self, filename: str) -> Dict[str, Any]:
        """Get information about a CSV file including columns and data types"""
        try:
            df = self.read_csv(filename)
            return {
                "columns": df.columns.tolist(),
                "dtypes": df.dtypes.to_dict(),
                "shape": df.shape,
                "head": df.head().to_dict("records"),
            }
        except Exception as e:
            raise Exception(f"CSV info error: {str(e)}")

    def list_csv_files(self) -> List[str]:
        """List all CSV files in the base directory"""
        try:
            csv_files = []
            for file in os.listdir(self.config.CSV_BASE_PATH):
                if file.endswith(".csv"):
                    csv_files.append(file)
            return csv_files
        except Exception as e:
            raise Exception(f"Error listing CSV files: {str(e)}")
