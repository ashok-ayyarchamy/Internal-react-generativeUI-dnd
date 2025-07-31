"""
Component repository for component-specific database operations.
"""

from typing import List, Optional
from sqlalchemy.orm import Session
from fastapi_server.models import Component
from .base_repository import BaseRepository


class ComponentRepository(BaseRepository[Component]):
    """Repository for Component model operations."""
    
    def __init__(self):
        super().__init__(Component)
    
    def get_by_type(self, db: Session, component_type: str) -> List[Component]:
        """Get components by type."""
        return db.query(Component).filter(Component.component_type == component_type).all()
    
    def get_by_data_source(self, db: Session, data_source: str) -> List[Component]:
        """Get components by data source."""
        return db.query(Component).filter(Component.data_source == data_source).all()
    
    def get_by_name(self, db: Session, name: str) -> Optional[Component]:
        """Get component by name."""
        return db.query(Component).filter(Component.name == name).first()
    
    def search_components(
        self, 
        db: Session, 
        search_term: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[Component]:
        """Search components by name or description."""
        return (
            db.query(Component)
            .filter(
                (Component.name.ilike(f"%{search_term}%")) |
                (Component.description.ilike(f"%{search_term}%"))
            )
            .offset(skip)
            .limit(limit)
            .all()
        )
    
    def get_recent_components(
        self, 
        db: Session, 
        limit: int = 10
    ) -> List[Component]:
        """Get recently created components."""
        return (
            db.query(Component)
            .order_by(Component.created_at.desc())
            .limit(limit)
            .all()
        )
    
    def get_components_with_interval(
        self, 
        db: Session, 
        interval: str
    ) -> List[Component]:
        """Get components with specific update interval."""
        return (
            db.query(Component)
            .filter(Component.interval == interval)
            .all()
        ) 