from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey, Text, Date, Time, JSON, ARRAY
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    
    tasks = relationship("Task", back_populates="owner")
    goals = relationship("Goal", back_populates="owner")
    reminders = relationship("Reminder", back_populates="owner")
    habits = relationship("Habit", back_populates="owner")

class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    task = Column(String, index=True)
    tags = Column(ARRAY(String))
    date = Column(Date)
    note = Column(Text, nullable=True)
    created_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, default="not started")
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="tasks")

class Goal(Base):
    __tablename__ = "goals"

    id = Column(Integer, primary_key=True, index=True)
    goal = Column(String, index=True)
    priority = Column(String)
    date = Column(Date)
    created_date = Column(DateTime, default=datetime.utcnow)
    completed = Column(Boolean, default=False)
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="goals")

class Reminder(Base):
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    reminder = Column(String, index=True)
    time = Column(Time)
    date = Column(Date)
    created_date = Column(DateTime, default=datetime.utcnow)
    repeat = Column(String, default="no repeat")
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="reminders")

class Habit(Base):
    __tablename__ = "habits"

    id = Column(Integer, primary_key=True, index=True)
    habit = Column(String, index=True)
    frequency = Column(String)
    completed_dates = Column(ARRAY(Date), default=[])
    user_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="habits")
