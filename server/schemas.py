from pydantic import BaseModel
from typing import List, Optional
from datetime import date, time, datetime

# User Schemas
class UserBase(BaseModel):
    username: str
    email: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    class Config:
        from_attributes = True

# Task Schemas
class TaskBase(BaseModel):
    task: str
    tags: List[str] = []
    date: date
    note: Optional[str] = None
    status: str = "not started"

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    id: int
    created_date: datetime
    user_id: int
    class Config:
        from_attributes = True

# Goal Schemas
class GoalBase(BaseModel):
    goal: str
    priority: str
    date: date
    completed: bool = False

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    id: int
    created_date: datetime
    user_id: int
    class Config:
        from_attributes = True

# Reminder Schemas
class ReminderBase(BaseModel):
    reminder: str
    time: time
    date: date
    repeat: str = "no repeat"

class ReminderCreate(ReminderBase):
    pass

class Reminder(ReminderBase):
    id: int
    created_date: datetime
    user_id: int
    class Config:
        from_attributes = True

# Habit Schemas
class HabitBase(BaseModel):
    habit: str
    frequency: str

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    id: int
    completed_dates: List[date] = []
    user_id: int
    class Config:
        from_attributes = True

# Token Schema
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None
