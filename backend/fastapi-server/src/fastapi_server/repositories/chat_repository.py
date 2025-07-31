"""
Chat repository for chat-specific database operations.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi_server.models import Chat
from .base_repository import BaseRepository
from sqlalchemy import func


class ChatRepository(BaseRepository[Chat]):
    """Repository for Chat model operations."""

    def __init__(self):
        super().__init__(Chat)

    def get_by_session_id(
        self, db: Session, session_id: str, limit: int = 50
    ) -> List[Chat]:
        """Get chats for a specific session with limit."""
        return (
            db.query(Chat)
            .filter(Chat.session_id == session_id)
            .order_by(Chat.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_by_session(self, db: Session, session_id: str) -> List[Chat]:
        """Get all chats for a specific session."""
        return (
            db.query(Chat)
            .filter(Chat.session_id == session_id)
            .order_by(Chat.created_at.asc())
            .all()
        )

    def get_recent_chats(
        self, db: Session, session_id: str, limit: int = 10
    ) -> List[Chat]:
        """Get recent chats for a session."""
        return (
            db.query(Chat)
            .filter(Chat.session_id == session_id)
            .order_by(Chat.created_at.desc())
            .limit(limit)
            .all()
        )

    def get_chats_with_component_suggestion(
        self, db: Session, session_id: Optional[str] = None
    ) -> List[Chat]:
        """Get chats that resulted in component suggestions."""
        query = db.query(Chat).filter(Chat.component_suggestion.isnot(None))

        if session_id:
            query = query.filter(Chat.session_id == session_id)

        return query.order_by(Chat.created_at.desc()).all()

    def get_chats_by_model(self, db: Session, model_used: str) -> List[Chat]:
        """Get chats processed by a specific model."""
        return (
            db.query(Chat)
            .filter(Chat.model_used == model_used)
            .order_by(Chat.created_at.desc())
            .all()
        )

    def get_slow_chats(self, db: Session, threshold_ms: int = 5000) -> List[Chat]:
        """Get chats that took longer than threshold to process."""
        return (
            db.query(Chat)
            .filter(Chat.processing_time > threshold_ms)
            .order_by(Chat.processing_time.desc())
            .all()
        )

    def get_chat_statistics(
        self, db: Session, session_id: Optional[str] = None
    ) -> dict:
        """Get statistics for chats."""
        query = db.query(Chat)

        if session_id:
            query = query.filter(Chat.session_id == session_id)

        total_chats = query.count()
        avg_processing_time = db.query(func.avg(Chat.processing_time)).scalar() or 0
        chats_with_suggestions = query.filter(
            Chat.component_suggestion.isnot(None)
        ).count()

        return {
            "total_chats": total_chats,
            "average_processing_time_ms": round(avg_processing_time, 2),
            "chats_with_suggestions": chats_with_suggestions,
            "suggestion_rate": (
                round((chats_with_suggestions / total_chats * 100), 2)
                if total_chats > 0
                else 0
            ),
        }

    def get_count_with_suggestions(self, db: Session) -> int:
        """Get count of chats that have component suggestions."""
        return db.query(Chat).filter(Chat.component_suggestion.isnot(None)).count()

    def get_total_count(self, db: Session) -> int:
        """Get total count of all chats."""
        return db.query(Chat).count()

    def get_average_processing_time(self, db: Session) -> float:
        """Get average processing time of all chats."""
        result = db.query(func.avg(Chat.processing_time)).scalar()
        return float(result) if result else 0.0

    def search_chats(
        self,
        db: Session,
        search_term: str,
        session_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Chat]:
        """Search chats by user message or agent response."""
        query = db.query(Chat).filter(
            (Chat.user_message.ilike(f"%{search_term}%"))
            | (Chat.agent_response.ilike(f"%{search_term}%"))
        )

        if session_id:
            query = query.filter(Chat.session_id == session_id)

        return query.offset(skip).limit(limit).order_by(Chat.created_at.desc()).all()
