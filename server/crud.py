from sqlalchemy.orm import Session
from sqlalchemy import func
import models, schemas, auth
from datetime import datetime

# User
def get_user(db: Session, username: str):
    return db.query(models.User).filter(models.User.username == username).first()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = auth.get_password_hash(user.password)
    db_user = models.User(username=user.username, email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

# Tasks
def get_tasks(db: Session, user_id: int):
    return db.query(models.Task).filter(models.Task.user_id == user_id).all()

def create_task(db: Session, task: schemas.TaskCreate, user_id: int):
    db_task = models.Task(**task.dict(), user_id=user_id)
    db.add(db_task)
    db.commit()
    db.refresh(db_task)
    return db_task

def update_task(db: Session, task_id: int, task_update: schemas.TaskCreate, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()
    if db_task:
        for key, value in task_update.dict().items():
            setattr(db_task, key, value)
        db.commit()
        db.refresh(db_task)
    return db_task

def delete_task(db: Session, task_id: int, user_id: int):
    db_task = db.query(models.Task).filter(models.Task.id == task_id, models.Task.user_id == user_id).first()
    if db_task:
        db.delete(db_task)
        db.commit()
    return db_task

# Goals
def get_goals(db: Session, user_id: int):
    return db.query(models.Goal).filter(models.Goal.user_id == user_id).all()

def create_goal(db: Session, goal: schemas.GoalCreate, user_id: int):
    db_goal = models.Goal(**goal.dict(), user_id=user_id)
    db.add(db_goal)
    db.commit()
    db.refresh(db_goal)
    return db_goal

def update_goal(db: Session, goal_id: int, goal_update: schemas.GoalCreate, user_id: int):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == user_id).first()
    if db_goal:
        for key, value in goal_update.dict().items():
            setattr(db_goal, key, value)
        db.commit()
        db.refresh(db_goal)
    return db_goal

def delete_goal(db: Session, goal_id: int, user_id: int):
    db_goal = db.query(models.Goal).filter(models.Goal.id == goal_id, models.Goal.user_id == user_id).first()
    if db_goal:
        db.delete(db_goal)
        db.commit()
    return db_goal

# Reminders
def get_reminders(db: Session, user_id: int):
    return db.query(models.Reminder).filter(models.Reminder.user_id == user_id).all()

def create_reminder(db: Session, reminder: schemas.ReminderCreate, user_id: int):
    db_reminder = models.Reminder(**reminder.dict(), user_id=user_id)
    db.add(db_reminder)
    db.commit()
    db.refresh(db_reminder)
    return db_reminder

def update_reminder(db: Session, reminder_id: int, reminder_update: schemas.ReminderCreate, user_id: int):
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id, models.Reminder.user_id == user_id).first()
    if db_reminder:
        for key, value in reminder_update.dict().items():
            setattr(db_reminder, key, value)
        db.commit()
        db.refresh(db_reminder)
    return db_reminder

def delete_reminder(db: Session, reminder_id: int, user_id: int):
    db_reminder = db.query(models.Reminder).filter(models.Reminder.id == reminder_id, models.Reminder.user_id == user_id).first()
    if db_reminder:
        db.delete(db_reminder)
        db.commit()
    return db_reminder

# Habits
def get_habits(db: Session, user_id: int):
    return db.query(models.Habit).filter(models.Habit.user_id == user_id).all()

def create_habit(db: Session, habit: schemas.HabitCreate, user_id: int):
    db_habit = models.Habit(**habit.dict(), user_id=user_id)
    db.add(db_habit)
    db.commit()
    db.refresh(db_habit)
    return db_habit

def update_habit(db: Session, habit_id: int, habit_update: schemas.HabitCreate, user_id: int):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.user_id == user_id).first()
    if db_habit:
        # Special handling for completed_dates could be needed, but for now simple replacement
        for key, value in habit_update.dict().items():
            setattr(db_habit, key, value)
        db.commit()
        db.refresh(db_habit)
    return db_habit

def delete_habit(db: Session, habit_id: int, user_id: int):
    db_habit = db.query(models.Habit).filter(models.Habit.id == habit_id, models.Habit.user_id == user_id).first()
    if db_habit:
        db.delete(db_habit)
        db.commit()
    return db_habit
