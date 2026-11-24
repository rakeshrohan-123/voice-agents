from sqlalchemy import Column, Integer, String, Boolean, DateTime, func
from sqlalchemy.orm import relationship
from .base import Base

class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to users (each client can have many users, but in this simplified version a client has a single owner user)
    users = relationship("User", back_populates="client")
    agents = relationship("Agent", back_populates="client")
    phone_numbers = relationship("PhoneNumber", back_populates="client")
    calls = relationship("Call", back_populates="client")
