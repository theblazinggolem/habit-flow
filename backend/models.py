from sqlalchemy import Column, String, Integer, Date, Boolean, TIMESTAMP, ForeignKey, ARRAY, Time
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship
from .database import Base
import uuid
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    user_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(TIMESTAMP, default=datetime.utcnow)
    accent_color = Column(String, default="blue")

class Task(Base):
    __tablename__ = "tasks"

    task_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    task = Column(String, nullable=False)
    tags = Column(ARRAY(String))
    target_date = Column(Date)
    note = Column(String)
    status = Column(String, default="not started")
    created_date = Column(TIMESTAMP, default=datetime.utcnow)

class Goal(Base):
    __tablename__ = "goals"

    goal_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    goal = Column(String, nullable=False)
    priority = Column(String)
    target_date = Column(Date)
    created_date = Column(TIMESTAMP, default=datetime.utcnow)

class Reminder(Base):
    __tablename__ = "reminders"

    reminder_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    reminder = Column(String, nullable=False)
    remind_time = Column(Time)
    remind_date = Column(Date)
    repeat_frequency = Column(String)
    created_date = Column(TIMESTAMP, default=datetime.utcnow)

class Habit(Base):
    __tablename__ = "habits"

    habit_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.user_id"))
    habit = Column(String, nullable=False)
    frequency = Column(String)
    completed_dates = Column(ARRAY(Date), default=[])
