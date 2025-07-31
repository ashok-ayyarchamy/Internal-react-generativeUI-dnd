#!/usr/bin/env python
"""
Simple script to create the components.db database file.
"""

import sys
import os

# Add the src directory to the path
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "src"))

from fastapi_server.database import create_tables
from fastapi_server.models import Component, Chat  # Import models to register them


def main():
    """Create the database and tables."""
    print("Creating components.db database...")

    try:
        # Create tables
        create_tables()
        print("✅ Database created successfully!")
        print("📁 File: components.db")
        print("📋 Tables created:")
        print("   - components")
        print("   - chats")

    except Exception as e:
        print(f"❌ Error creating database: {e}")


if __name__ == "__main__":
    main()
