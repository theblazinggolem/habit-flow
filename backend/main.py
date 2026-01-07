from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from . import crud, models, schemas
from .database import SessionLocal, engine, get_db
from typing import List
import uuid

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency to get current user ID (Mocked for now)
def get_current_user_id():
    # In a real app, decode JWT token here
    # strict hardcoded UUID for testing ease if needed, or query a default user
    return uuid.UUID("00000000-0000-0000-0000-000000000000") 

# Users
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    return crud.create_user(db=db, user=user)

# Tasks
@app.post("/tasks/", response_model=schemas.Task)
def create_task(task: schemas.TaskCreate, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.create_task(db=db, task=task, user_id=user_id)

@app.get("/tasks/", response_model=List[schemas.Task])
def read_tasks(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.get_tasks(db, user_id=user_id, skip=skip, limit=limit)

@app.delete("/tasks/{task_id}")
def delete_task(task_id: uuid.UUID, db: Session = Depends(get_db)):
    return crud.delete_task(db, task_id)

# Goals
@app.post("/goals/", response_model=schemas.Goal)
def create_goal(goal: schemas.GoalCreate, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.create_goal(db=db, goal=goal, user_id=user_id)

@app.get("/goals/", response_model=List[schemas.Goal])
def read_goals(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.get_goals(db, user_id=user_id, skip=skip, limit=limit)

# Reminders
@app.post("/reminders/", response_model=schemas.Reminder)
def create_reminder(reminder: schemas.ReminderCreate, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.create_reminder(db=db, reminder=reminder, user_id=user_id)

@app.get("/reminders/", response_model=List[schemas.Reminder])
def read_reminders(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.get_reminders(db, user_id=user_id, skip=skip, limit=limit)

# Habits
@app.post("/habits/", response_model=schemas.Habit)
def create_habit(habit: schemas.HabitCreate, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.create_habit(db=db, habit=habit, user_id=user_id)

@app.get("/habits/", response_model=List[schemas.Habit])
def read_habits(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), user_id: uuid.UUID = Depends(get_current_user_id)):
    return crud.get_habits(db, user_id=user_id, skip=skip, limit=limit)

@app.get("/")
def read_root():
    return {"Hello": "Habit Flow"}
