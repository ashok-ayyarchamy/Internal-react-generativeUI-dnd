#!/usr/bin/env python3
"""
Setup script for the AI SDK Backend.
"""

import os
import sys
from pathlib import Path


def create_env_file():
    """Create .env file from env.example if it doesn't exist."""
    env_example = Path("env.example")
    env_file = Path(".env")
    
    if not env_file.exists() and env_example.exists():
        print("Creating .env file from env.example...")
        with open(env_example, "r") as f:
            content = f.read()
        
        with open(env_file, "w") as f:
            f.write(content)
        
        print("✅ .env file created successfully!")
        print("⚠️  Please edit .env file with your configuration.")
    elif env_file.exists():
        print("✅ .env file already exists.")
    else:
        print("❌ env.example file not found!")


def main():
    """Main setup function."""
    print("🚀 Setting up AI SDK Backend...")
    
    # Check if we're in the backend directory
    if not Path("pyproject.toml").exists():
        print("❌ Please run this script from the backend directory!")
        sys.exit(1)
    
    # Create .env file
    create_env_file()
    
    print("\n🎉 Setup completed!")
    print("\nNext steps:")
    print("1. Edit .env file with your configuration")
    print("2. Run: poetry install")
    print("3. Run: poetry shell")
    print("4. Run: poetry run python run.py")
    print("\nAPI will be available at: http://localhost:8000")
    print("Documentation: http://localhost:8000/docs")


if __name__ == "__main__":
    main() 