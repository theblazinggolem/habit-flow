from pydantic import BaseModel
from typing import List, Optional, Any
from datetime import date, datetime, time
import uuid

# User Schemas
class UserBase(BaseModel):
    username: str
    email: str
    accent_color: Optional[str] = "blue"

class UserCreate(UserBase):
    password: str

class User(UserBase):
    user_id: uuid.UUID
    created_at: datetime
    class Config:
        orm_mode = True

# Task Schemas
class TaskBase(BaseModel):
    task: str
    tags: Optional[List[str]] = []
    target_date: Optional[date] = None
    note: Optional[str] = None
    status: Optional[str] = "not started"

class TaskCreate(TaskBase):
    pass

class Task(TaskBase):
    task_id: uuid.UUID
    user_id: uuid.UUID
    created_date: datetime
    class Config:
        orm_mode = True

# Goal Schemas
class GoalBase(BaseModel):
    goal: str
    priority: Optional[str] = "medium"
    target_date: Optional[date] = None

class GoalCreate(GoalBase):
    pass

class Goal(GoalBase):
    goal_id: uuid.UUID
    user_id: uuid.UUID
    created_date: datetime
    class Config:
        orm_mode = True

# Reminder Schemas
class ReminderBase(BaseModel):
    reminder: str
    remind_time: Optional[time] = None
    remind_date: Optional[date] = None
    repeat_frequency: Optional[str] = "no repeat"

class ReminderCreate(ReminderBase):
    pass

class Reminder(ReminderBase):
    reminder_id: uuid.UUID
    user_id: uuid.UUID
    created_date: datetime
    class Config:
        orm_mode = True

# Habit Schemas
class HabitBase(BaseModel):
    habit: str
    frequency: Optional[str] = "Daily"
    completed_dates: Optional[List[date]] = []

class HabitCreate(HabitBase):
    pass

class Habit(HabitBase):
    habit_id: uuid.UUID
    user_id: uuid.UUID
    class Config:
        orm_mode = True
