from fastapi import APIRouter

router = APIRouter()


@router.get("/")
async def health_check():
    """Basic health check endpoint."""
    return {
        "status": "healthy",
        "message": "AI SDK Backend is running",
        "timestamp": "2024-01-01T00:00:00Z"
    }


@router.get("/detailed")
async def detailed_health_check():
    """Detailed health check."""
    return {
        "status": "healthy",
        "message": "Detailed health check completed",
        "timestamp": "2024-01-01T00:00:00Z",
        "services": {
            "api": "healthy",
            "authentication": "disabled",
            "database": "disabled"
        }
    } 