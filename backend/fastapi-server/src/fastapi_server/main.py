from fastapi import FastAPI, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
import uvicorn

from .database import get_db, create_tables
from .models import Component, Chat
from .schemas import (
    ComponentCreate,
    ComponentUpdate,
    ComponentResponse,
    ChatRequest,
    ChatResponse,
    ChatHistoryResponse,
    ChatStatisticsResponse,
)
from .services.component_service import ComponentService
from .services.chat_service import ChatService
from .config import Config

# Create tables
create_tables()

app = FastAPI(title="Component Management API", version="1.0.0")

# Create a proper ASGI application
asgi_app = app

# Initialize services
component_service = ComponentService()
chat_service = ChatService()


@app.get("/")
async def root():
    return {"message": "Component Management API"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest, db: Session = Depends(get_db)):
    """
    Chat endpoint that processes natural language requests and suggests components.
    Stores chat history in database.
    """
    print(f"Chat request: {request}")
    return await chat_service.process_chat_message(db, request, request.session_id)


@app.get("/chat/history/{session_id}", response_model=ChatHistoryResponse)
async def get_chat_history(
    session_id: str, limit: int = Query(50, ge=1, le=100), db: Session = Depends(get_db)
):
    """
    Get chat history for a specific session.
    """
    chats = chat_service.get_chat_history(db, session_id, limit)
    return ChatHistoryResponse(
        chats=chats, total_count=len(chats), session_id=session_id
    )


@app.get("/chat/statistics", response_model=ChatStatisticsResponse)
async def get_chat_statistics(
    session_id: Optional[str] = Query(None), db: Session = Depends(get_db)
):
    """
    Get chat statistics.
    """
    stats = chat_service.get_chat_statistics(db, session_id)
    return ChatStatisticsResponse(**stats)


@app.get("/chat/search")
async def search_chats(
    search_term: str = Query(..., min_length=1),
    session_id: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Search chats by user message or agent response.
    """
    chats = chat_service.search_chats(db, search_term, session_id, skip, limit)
    return {"chats": chats, "total": len(chats)}


@app.get("/chat/{chat_id}")
async def get_chat(chat_id: int, db: Session = Depends(get_db)):
    """
    Get a specific chat by ID.
    """
    return chat_service.get_chat_by_id(db, chat_id)


@app.delete("/chat/{chat_id}")
async def delete_chat(chat_id: int, db: Session = Depends(get_db)):
    """
    Delete a specific chat.
    """
    return chat_service.delete_chat(db, chat_id)


@app.post("/components", response_model=ComponentResponse)
async def create_component(component: ComponentCreate, db: Session = Depends(get_db)):
    """
    Create a new component.
    """
    return component_service.create_component(db, component)


@app.get("/components", response_model=List[ComponentResponse])
async def get_components(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Get all components with pagination.
    """
    return component_service.get_components(db, skip, limit)


@app.get("/components/{component_id}", response_model=ComponentResponse)
async def get_component(component_id: int, db: Session = Depends(get_db)):
    """
    Get a specific component by ID.
    """
    return component_service.get_component(db, component_id)


@app.put("/components/{component_id}", response_model=ComponentResponse)
async def update_component(
    component_id: int, component: ComponentUpdate, db: Session = Depends(get_db)
):
    """
    Update a component.
    """
    return component_service.update_component(db, component_id, component)


@app.delete("/components/{component_id}")
async def delete_component(component_id: int, db: Session = Depends(get_db)):
    """
    Delete a component.
    """
    return component_service.delete_component(db, component_id)


@app.get("/components/type/{component_type}", response_model=List[ComponentResponse])
async def get_components_by_type(component_type: str, db: Session = Depends(get_db)):
    """
    Get components by type (chart, table, metric, etc.).
    """
    return component_service.get_components_by_type(db, component_type)


@app.get("/components/source/{data_source}", response_model=List[ComponentResponse])
async def get_components_by_source(data_source: str, db: Session = Depends(get_db)):
    """
    Get components by data source (mysql, mongodb, csv).
    """
    return component_service.get_components_by_source(db, data_source)


@app.get("/components/search")
async def search_components(
    search_term: str = Query(..., min_length=1),
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    db: Session = Depends(get_db),
):
    """
    Search components by name or description.
    """
    components = component_service.search_components(db, search_term, skip, limit)
    return {"components": components, "total": len(components)}


@app.get("/components/recent", response_model=List[ComponentResponse])
async def get_recent_components(
    limit: int = Query(10, ge=1, le=50), db: Session = Depends(get_db)
):
    """
    Get recently created components.
    """
    return component_service.get_recent_components(db, limit)


@app.get("/components/statistics")
async def get_component_statistics(db: Session = Depends(get_db)):
    """
    Get component statistics.
    """
    return component_service.get_component_statistics(db)
