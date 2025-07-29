import logging
import sys
from typing import Any

from app.core.config import settings


def setup_logger(name: str = "ai_sdk_backend") -> logging.Logger:
    """Setup and configure logger."""
    
    logger = logging.getLogger(name)
    
    if not logger.handlers:
        logger.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
        
        # Create console handler
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setLevel(getattr(logging, settings.LOG_LEVEL.upper()))
        
        # Create formatter
        formatter = logging.Formatter(
            "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        )
        console_handler.setFormatter(formatter)
        
        # Add handler to logger
        logger.addHandler(console_handler)
    
    return logger


def get_logger(name: str = "ai_sdk_backend") -> logging.Logger:
    """Get logger instance."""
    return setup_logger(name)


# Default logger
logger = get_logger() 