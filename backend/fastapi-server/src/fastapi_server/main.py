from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from .database import get_db, create_tables
from .models import Component
from .schemas import (
    ComponentCreate,
    ComponentUpdate,
    ComponentResponse,
    ChatRequest,
    ChatResponse,
)
from .chat_agent import ChatAgent
from .config import Config

# Create tables
create_tables()

app = FastAPI(title="Component Management API", version="1.0.0")
chat_agent = ChatAgent()


@app.get("/")
async def root():
    return {"message": "Component Management API"}


@app.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Chat endpoint that processes natural language requests and suggests components.
    """
    try:
        result = await chat_agent.process_message(request.message)
        return ChatResponse(
            response=result["response"],
            component_suggestion=result.get("component_suggestion"),
            data=result.get("data"),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat processing error: {str(e)}")


@app.post("/components", response_model=ComponentResponse)
async def create_component(component: ComponentCreate, db: Session = Depends(get_db)):
    """
    Create a new component.
    """
    try:
        db_component = Component(
            name=component.name,
            component_type=component.component_type,
            query=component.query,
            fields=component.fields,
            interval=component.interval,
            data_source=component.data_source,
            description=component.description,
        )
        db.add(db_component)
        db.commit()
        db.refresh(db_component)
        return ComponentResponse(**db_component.to_dict())
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Error creating component: {str(e)}"
        )


@app.get("/components", response_model=List[ComponentResponse])
async def get_components(
    skip: int = 0, limit: int = 100, db: Session = Depends(get_db)
):
    """
    Get all components with pagination.
    """
    try:
        components = db.query(Component).offset(skip).limit(limit).all()
        return [ComponentResponse(**component.to_dict()) for component in components]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving components: {str(e)}"
        )


@app.get("/components/{component_id}", response_model=ComponentResponse)
async def get_component(component_id: int, db: Session = Depends(get_db)):
    """
    Get a specific component by ID.
    """
    try:
        component = db.query(Component).filter(Component.id == component_id).first()
        if component is None:
            raise HTTPException(status_code=404, detail="Component not found")
        return ComponentResponse(**component.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving component: {str(e)}"
        )


@app.put("/components/{component_id}", response_model=ComponentResponse)
async def update_component(
    component_id: int, component: ComponentUpdate, db: Session = Depends(get_db)
):
    """
    Update a component.
    """
    try:
        db_component = db.query(Component).filter(Component.id == component_id).first()
        if db_component is None:
            raise HTTPException(status_code=404, detail="Component not found")

        update_data = component.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_component, field, value)

        db.commit()
        db.refresh(db_component)
        return ComponentResponse(**db_component.to_dict())
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=400, detail=f"Error updating component: {str(e)}"
        )


@app.delete("/components/{component_id}")
async def delete_component(component_id: int, db: Session = Depends(get_db)):
    """
    Delete a component.
    """
    try:
        db_component = db.query(Component).filter(Component.id == component_id).first()
        if db_component is None:
            raise HTTPException(status_code=404, detail="Component not found")

        db.delete(db_component)
        db.commit()
        return {"message": "Component deleted successfully"}
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=500, detail=f"Error deleting component: {str(e)}"
        )


@app.get("/components/type/{component_type}", response_model=List[ComponentResponse])
async def get_components_by_type(component_type: str, db: Session = Depends(get_db)):
    """
    Get components by type (chart, table, metric, etc.).
    """
    try:
        components = (
            db.query(Component).filter(Component.component_type == component_type).all()
        )
        return [ComponentResponse(**component.to_dict()) for component in components]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving components: {str(e)}"
        )


@app.get("/components/source/{data_source}", response_model=List[ComponentResponse])
async def get_components_by_source(data_source: str, db: Session = Depends(get_db)):
    """
    Get components by data source (mysql, mongodb, csv).
    """
    try:
        components = (
            db.query(Component).filter(Component.data_source == data_source).all()
        )
        return [ComponentResponse(**component.to_dict()) for component in components]
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Error retrieving components: {str(e)}"
        )


def main():
    uvicorn.run(
        "fastapi_server.main:app",
        host=Config.API_HOST,
        port=Config.API_PORT,
        reload=False,
    )


if __name__ == "__main__":
    main()
