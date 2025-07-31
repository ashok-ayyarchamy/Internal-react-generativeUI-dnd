"""
Component service for business logic related to components.
"""

from typing import List, Optional, Dict, Any
from sqlalchemy.orm import Session
from fastapi import HTTPException
from fastapi_server.repositories.component_repository import ComponentRepository
from fastapi_server.schemas import ComponentCreate, ComponentUpdate, ComponentResponse


class ComponentService:
    """Service for component-related business logic."""
    
    def __init__(self):
        self.repository = ComponentRepository()
    
    def create_component(
        self, 
        db: Session, 
        component_data: ComponentCreate
    ) -> ComponentResponse:
        """Create a new component."""
        try:
            # Check if component with same name already exists
            existing = self.repository.get_by_name(db, component_data.name)
            if existing:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Component with name '{component_data.name}' already exists"
                )
            
            # Create component
            component = self.repository.create(db, component_data.dict())
            return ComponentResponse(**component.to_dict())
            
        except HTTPException:
            raise
        except Exception as e:
            raise HTTPException(
                status_code=500, 
                detail=f"Error creating component: {str(e)}"
            )
    
    def get_component(self, db: Session, component_id: int) -> ComponentResponse:
        """Get a component by ID."""
        component = self.repository.get(db, component_id)
        if not component:
            raise HTTPException(status_code=404, detail="Component not found")
        
        return ComponentResponse(**component.to_dict())
    
    def get_components(
        self, 
        db: Session, 
        skip: int = 0, 
        limit: int = 100
    ) -> List[ComponentResponse]:
        """Get all components with pagination."""
        components = self.repository.get_multi(db, skip=skip, limit=limit)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def update_component(
        self, 
        db: Session, 
        component_id: int, 
        component_data: ComponentUpdate
    ) -> ComponentResponse:
        """Update a component."""
        # Check if component exists
        existing = self.repository.get(db, component_id)
        if not existing:
            raise HTTPException(status_code=404, detail="Component not found")
        
        # Check for name conflicts if name is being updated
        if component_data.name and component_data.name != existing.name:
            name_conflict = self.repository.get_by_name(db, component_data.name)
            if name_conflict:
                raise HTTPException(
                    status_code=400, 
                    detail=f"Component with name '{component_data.name}' already exists"
                )
        
        # Update component
        updated = self.repository.update(db, component_id, component_data.dict(exclude_unset=True))
        if not updated:
            raise HTTPException(status_code=500, detail="Error updating component")
        
        return ComponentResponse(**updated.to_dict())
    
    def delete_component(self, db: Session, component_id: int) -> Dict[str, str]:
        """Delete a component."""
        if not self.repository.exists(db, component_id):
            raise HTTPException(status_code=404, detail="Component not found")
        
        success = self.repository.delete(db, component_id)
        if not success:
            raise HTTPException(status_code=500, detail="Error deleting component")
        
        return {"message": "Component deleted successfully"}
    
    def get_components_by_type(
        self, 
        db: Session, 
        component_type: str
    ) -> List[ComponentResponse]:
        """Get components by type."""
        components = self.repository.get_by_type(db, component_type)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def get_components_by_source(
        self, 
        db: Session, 
        data_source: str
    ) -> List[ComponentResponse]:
        """Get components by data source."""
        components = self.repository.get_by_data_source(db, data_source)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def search_components(
        self, 
        db: Session, 
        search_term: str,
        skip: int = 0,
        limit: int = 100
    ) -> List[ComponentResponse]:
        """Search components by name or description."""
        components = self.repository.search_components(db, search_term, skip, limit)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def get_recent_components(
        self, 
        db: Session, 
        limit: int = 10
    ) -> List[ComponentResponse]:
        """Get recently created components."""
        components = self.repository.get_recent_components(db, limit)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def get_components_with_interval(
        self, 
        db: Session, 
        interval: str
    ) -> List[ComponentResponse]:
        """Get components with specific update interval."""
        components = self.repository.get_components_with_interval(db, interval)
        return [ComponentResponse(**component.to_dict()) for component in components]
    
    def get_component_statistics(self, db: Session) -> Dict[str, Any]:
        """Get statistics about components."""
        total_components = self.repository.count(db)
        
        # Count by type
        chart_components = len(self.repository.get_by_type(db, "chart"))
        table_components = len(self.repository.get_by_type(db, "table"))
        metric_components = len(self.repository.get_by_type(db, "metric"))
        
        # Count by data source
        mysql_components = len(self.repository.get_by_data_source(db, "mysql"))
        mongodb_components = len(self.repository.get_by_data_source(db, "mongodb"))
        csv_components = len(self.repository.get_by_data_source(db, "csv"))
        
        return {
            "total_components": total_components,
            "by_type": {
                "chart": chart_components,
                "table": table_components,
                "metric": metric_components
            },
            "by_data_source": {
                "mysql": mysql_components,
                "mongodb": mongodb_components,
                "csv": csv_components
            }
        } 