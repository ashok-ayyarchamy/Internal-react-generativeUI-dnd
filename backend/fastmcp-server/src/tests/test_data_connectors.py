"""
Tests for data connectors
"""

import pytest
from data_connectors import MySQLConnector, MongoDBConnector, CSVConnector


class TestMySQLConnector:
    def test_connector_initialization(self):
        """Test MySQL connector can be initialized"""
        connector = MySQLConnector()
        assert connector is not None
        assert hasattr(connector, "config")


class TestMongoDBConnector:
    def test_connector_initialization(self):
        """Test MongoDB connector can be initialized"""
        connector = MongoDBConnector()
        assert connector is not None
        assert hasattr(connector, "config")


class TestCSVConnector:
    def test_connector_initialization(self):
        """Test CSV connector can be initialized"""
        connector = CSVConnector()
        assert connector is not None
        assert hasattr(connector, "config")
