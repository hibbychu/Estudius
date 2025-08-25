# app/api/task_routes.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel, Field
from typing import List, Optional
from pathlib import Path
from datetime import datetime
import uuid
import json
from jose import jwt, JWTError

# ------------------------
# JWT AUTH
# ------------------------
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")

def get_current_user_email(token: str = Depends(oauth2_scheme)) -> str:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# ------------------------
# TASK DATA FILE
# ------------------------
router = APIRouter()
DATA_FILE = Path(__file__).parent.parent / "data" / "tasks.json"

class Task(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    text: str
    completed: bool = False
    createdAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    completedAt: Optional[str] = None
    updatedAt: str = Field(default_factory=lambda: datetime.utcnow().isoformat())
    user_email: str  # linked to the logged-in user

class TaskCreate(BaseModel):
    text: str
    completed: bool = False

# ------------------------
# HELPER FUNCTIONS
# ------------------------
def load_tasks() -> List[Task]:
    try:
        with open(DATA_FILE, "r") as f:
            tasks_data = json.load(f)
            return [Task(**t) for t in tasks_data]
    except (FileNotFoundError, json.JSONDecodeError):
        return []

def save_tasks(tasks: List[Task]):
    with open(DATA_FILE, "w") as f:
        json.dump([t.dict() for t in tasks], f, indent=2)

# ------------------------
# ROUTES
# ------------------------

@router.get("/", response_model=List[Task])
def get_tasks(current_user_email: str = Depends(get_current_user_email)):
    tasks = load_tasks()
    # Return only tasks for the current user
    return [t for t in tasks if t.user_email == current_user_email]

@router.post("/", response_model=Task)
def create_task(task: TaskCreate, current_user_email: str = Depends(get_current_user_email)):
    tasks = load_tasks()
    new_task = Task(**task.dict(), user_email=current_user_email)
    tasks.append(new_task)
    save_tasks(tasks)
    return new_task

@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, updated_task: Task, current_user_email: str = Depends(get_current_user_email)):
    tasks = load_tasks()
    for i, existing_task in enumerate(tasks):
        if existing_task.id == task_id and existing_task.user_email == current_user_email:
            # Preserve ID & createdAt
            updated_task.id = existing_task.id
            updated_task.createdAt = existing_task.createdAt

            # Auto-set timestamps
            if updated_task.completed and not existing_task.completed:
                updated_task.completedAt = datetime.utcnow().isoformat()
            elif not updated_task.completed:
                updated_task.completedAt = None

            updated_task.updatedAt = datetime.utcnow().isoformat()
            updated_task.user_email = current_user_email

            tasks[i] = updated_task
            save_tasks(tasks)
            return updated_task

    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{task_id}")
def delete_task(task_id: str, current_user_email: str = Depends(get_current_user_email)):
    tasks = load_tasks()
    for i, task in enumerate(tasks):
        if task.id == task_id and task.user_email == current_user_email:
            tasks.pop(i)
            save_tasks(tasks)
            return {"detail": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")



