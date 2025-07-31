"""
Chat service for processing user messages and managing chat history.
"""

import time
import uuid
from typing import Dict, Any, Optional, List
from sqlalchemy.orm import Session
from fastapi_server.chat_agent import ChatAgent
from fastapi_server.repositories.chat_repository import ChatRepository
from fastapi_server.schemas import ChatRequest, ChatResponse


class ChatService:
    """Service for chat-related business logic and AI agent integration."""

    def __init__(self):
        self.repository = ChatRepository()
        self.crew = ChatAgent()

    async def process_chat_message(
        self, db: Session, chat_request: ChatRequest, session_id: Optional[str] = None
    ) -> ChatResponse:
        """
        Process a chat message through the AI crew and store the result.

        Args:
            db: Database session
            chat_request: The chat request containing the message
            session_id: Optional session ID for conversation tracking

        Returns:
            ChatResponse with AI-generated response and component suggestions
        """
        start_time = time.time()

        try:
            # Generate session ID if not provided
            if not session_id:
                session_id = str(uuid.uuid4())

            # Get chat history for context
            chat_history = await self.get_chat_history(db, session_id, limit=10)
            print(
                f"📚 Retrieved {len(chat_history['chats'])} previous messages for session {session_id}"
            )

            # Process message through AI crew with chat history
            result = await self.crew.process_message(
                chat_request.message,
                session_id=session_id,
                chat_history=chat_history["chats"],
            )

            # Calculate processing time
            processing_time = int(
                (time.time() - start_time) * 1000
            )  # Convert to milliseconds

            # Store chat in database
            chat_data = {
                "session_id": session_id,
                "user_message": chat_request.message,
                "agent_response": result["response"],
                "intent": result.get("intent"),
                "component_suggestion": result.get("component_suggestion"),
                "data_preview": result.get("data"),
                "processing_time": processing_time,
                "model_used": self._extract_model_used(result),
            }

            stored_chat = self.repository.create(db, chat_data)

            return ChatResponse(
                response=result["response"],
                component_suggestion=result.get("component_suggestion"),
                data=result.get("data"),
                session_id=session_id,
                chat_id=stored_chat.id,
                processing_time=processing_time,
            )

        except Exception as e:
            # Log the error and return a fallback response
            print(f"Error processing chat message: {e}")
            return ChatResponse(
                response=f"Sorry, I encountered an error processing your request: {str(e)}",
                component_suggestion=None,
                data=None,
                session_id=session_id,
                chat_id=None,
                processing_time=0,
            )

    async def get_chat_history(
        self, db: Session, session_id: str, limit: int = 50
    ) -> Dict[str, Any]:
        """
        Get chat history for a specific session.

        Args:
            db: Database session
            session_id: The session ID to get history for
            limit: Maximum number of chats to return

        Returns:
            Dict containing chat history and metadata
        """
        try:
            print(f"🔍 Retrieving chat history for session: {session_id}")
            chats = self.repository.get_by_session_id(db, session_id, limit)
            print(f"📊 Found {len(chats)} chats in database for session {session_id}")

            # Debug: Print first few chats if any exist
            if chats:
                print(
                    f"📝 Sample chat data: {chats[0].to_dict() if chats else 'No chats'}"
                )

            result = {
                "session_id": session_id,
                "chats": [chat.to_dict() for chat in chats],
                "total_count": len(chats),
            }

            print(f"✅ Chat history retrieval completed: {result['total_count']} chats")
            return result

        except Exception as e:
            print(f"❌ Error getting chat history: {e}")
            import traceback

            traceback.print_exc()
            return {"session_id": session_id, "chats": [], "total_count": 0}

    async def get_chat_statistics(
        self, db: Session, session_id: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Get chat statistics for analytics.

        Args:
            db: Database session
            session_id: Optional session ID to filter statistics

        Returns:
            Dict containing chat statistics
        """
        try:
            total_chats = self.repository.get_total_count(db)
            avg_processing_time = self.repository.get_average_processing_time(db)
            chats_with_suggestions = self.repository.get_count_with_suggestions(db)

            suggestion_rate = 0
            if total_chats > 0:
                suggestion_rate = (chats_with_suggestions / total_chats) * 100

            return {
                "total_chats": total_chats,
                "average_processing_time_ms": avg_processing_time,
                "chats_with_suggestions": chats_with_suggestions,
                "suggestion_rate": suggestion_rate,
            }

        except Exception as e:
            print(f"Error getting chat statistics: {e}")
            return {
                "total_chats": 0,
                "average_processing_time_ms": 0,
                "chats_with_suggestions": 0,
                "suggestion_rate": 0,
            }

    def _extract_model_used(self, result: Dict[str, Any]) -> str:
        """
        Extract the model used from the result.
        This is a placeholder - in a real implementation,
        you'd track which model was actually used in the crew
        """
        # For now, return a default value
        # In a real implementation, you'd track which model was actually used
        return "dashboard_crew"

    async def search_chats(
        self,
        db: Session,
        search_term: str,
        session_id: Optional[str] = None,
        skip: int = 0,
        limit: int = 100,
    ) -> List[Dict[str, Any]]:
        """
        Search chats by user message or agent response.

        Args:
            db: Database session
            search_term: The search term to look for
            session_id: Optional session ID to filter by
            skip: Number of records to skip
            limit: Maximum number of records to return

        Returns:
            List of chat dictionaries
        """
        try:
            chats = self.repository.search_chats(
                db, search_term, session_id, skip, limit
            )
            return [chat.to_dict() for chat in chats]
        except Exception as e:
            print(f"Error searching chats: {e}")
            return []

    async def get_chat_by_id(
        self, db: Session, chat_id: int
    ) -> Optional[Dict[str, Any]]:
        """
        Get a specific chat by ID.

        Args:
            db: Database session
            chat_id: The chat ID to retrieve

        Returns:
            Chat dictionary or None if not found
        """
        try:
            chat = self.repository.get(db, chat_id)
            return chat.to_dict() if chat else None
        except Exception as e:
            print(f"Error getting chat by ID: {e}")
            return None

    async def delete_chat(self, db: Session, chat_id: int) -> bool:
        """
        Delete a specific chat by ID.

        Args:
            db: Database session
            chat_id: The chat ID to delete

        Returns:
            True if deleted successfully, False otherwise
        """
        try:
            return self.repository.delete(db, chat_id)
        except Exception as e:
            print(f"Error deleting chat: {e}")
            return False
