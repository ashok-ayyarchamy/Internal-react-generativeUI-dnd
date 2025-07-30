from sqlalchemy import Column, Integer, String, Text, DateTime, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.sql import func
from typing import Optional, Dict, Any

Base = declarative_base()


class Component(Base):
    __tablename__ = "components"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    component_type = Column(String(100), nullable=False)  # chart, table, metric, etc.
    query = Column(Text, nullable=False)  # The query logic
    fields = Column(JSON, nullable=True)  # Fields to display/configure
    interval = Column(
        String(50), nullable=True
    )  # Update interval (e.g., "10 min", "1 hour")
    data_source = Column(String(50), nullable=False)  # mysql, mongodb, csv
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "name": self.name,
            "component_type": self.component_type,
            "query": self.query,
            "fields": self.fields,
            "interval": self.interval,
            "data_source": self.data_source,
            "description": self.description,
            "created_at": self.created_at.isoformat() if self.created_at else None,
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
