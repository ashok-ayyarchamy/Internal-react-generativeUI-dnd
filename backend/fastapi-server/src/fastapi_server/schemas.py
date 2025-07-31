from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime


class ComponentBase(BaseModel):
    name: str
    component_type: str
    query: str
    fields: Optional[Dict[str, Any]] = None
    interval: Optional[str] = None
    data_source: str
    description: Optional[str] = None


class ComponentCreate(ComponentBase):
    pass


class ComponentUpdate(BaseModel):
    name: Optional[str] = None
    component_type: Optional[str] = None
    query: Optional[str] = None
    fields: Optional[Dict[str, Any]] = None
    interval: Optional[str] = None
    data_source: Optional[str] = None
    description: Optional[str] = None


class ComponentResponse(ComponentBase):
    id: int
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ChatRequest(BaseModel):
    message: str
    session_id: Optional[str] = None


class ChatResponse(BaseModel):
    response: str
    component_suggestion: Optional[Dict[str, Any]] = None
    data: Optional[Dict[str, Any]] = None
    session_id: Optional[str] = None
    chat_id: Optional[int] = None
    processing_time: Optional[int] = None


class ChatHistoryResponse(BaseModel):
    chats: List[Dict[str, Any]]
    total_count: int
    session_id: str


class ChatStatisticsResponse(BaseModel):
    total_chats: int
    average_processing_time_ms: float
    chats_with_suggestions: int
    suggestion_rate: float
