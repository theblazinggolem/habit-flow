from sqlalchemy.orm import Session
from . import models, schemas
import uuid

def get_user(db: Session, user_id: uuid.UUID):
    return db.query(models.User).filter(models.User.user_id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    # In a real app, hash the password
    fake_hashed_password = user.password + "notreallyhashed"
    db_user = models.User(email=user.email, username=user.username, password_hash=fake_hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Tasks
def get_tasks(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Task).filter(models.Task.user_id == user_id).offset(skip).limit(limit).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: uuid.UUID):
    db_task = models.Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: uuid.UUID):
    db_task = db.query(models.Task).filter(models.Task.task_id == task_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

# Goals
def get_goals(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).offset(skip).limit(limit).all()

def create_goal(db: Session, goal: schemas.GoalCreate, user_id: uuid.UUID):
    db_goal = models.Goal(**goal.dict(), user_id=user_id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

# Reminders
def get_reminders(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Reminder).filter(models.Reminder.user_id == user_id).offset(skip).limit(limit).all()

def create_reminder(db: Session, reminder: schemas.ReminderCreate, user_id: uuid.UUID):
    db_reminder = models.Reminder(**reminder.dict(), user_id=user_id)
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

# Habits
def get_habits(db: Session, user_id: uuid.UUID, skip: int = 0, limit: int = 100):
    return db.query(models.Habit).filter(models.Habit.user_id == user_id).offset(skip).limit(limit).all()

def create_habit(db: Session, habit: schemas.HabitCreate, user_id: uuid.UUID):
    db_habit = models.Habit(**habit.dict(), user_id=user_id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit
