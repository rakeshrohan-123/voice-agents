from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship
from .base import Base

class Call(Base):
    __tablename__ = "calls"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    agent_id = Column(Integer, ForeignKey("agents.id"), nullable=False)
    phone_number_id = Column(Integer, ForeignKey("phone_numbers.id"), nullable=True)
    interaction_id = Column(String, nullable=False, unique=True)
    direction = Column(String, nullable=False)  # inbound / outbound
    from_number = Column(String, nullable=False)
    to_number = Column(String, nullable=False)
    duration_seconds = Column(Integer, nullable=False, default=0)
    status = Column(String, nullable=False, default="completed")
    transcript = Column(String, nullable=True)  # JSON stringified
    recording_available = Column(Boolean, default=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    raw_payload = Column(String, nullable=True)

    client = relationship("Client", back_populates="calls")
    agent = relationship("Agent", back_populates="calls")
    phone_number = relationship("PhoneNumber", back_populates="calls")
