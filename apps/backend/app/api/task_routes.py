from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import json
from pathlib import Path
from datetime import datetime
import uuid

router = APIRouter()

DATA_FILE = Path(__file__).parent.parent / "data" / "tasks.json"

class Task(BaseModel):
    id: str = str(uuid.uuid4())
    text: str
    completed: bool = False
    createdAt: str = datetime.utcnow().isoformat()
    completedAt: Optional[str] = None
    updatedAt: str = datetime.utcnow().isoformat()

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

@router.get("/", response_model=List[Task])
def get_tasks():
    return load_tasks()

@router.post("/", response_model=Task)
def create_task(task: Task):
    tasks = load_tasks()
    tasks.append(task)
    save_tasks(tasks)
    return task

@router.put("/{task_id}", response_model=Task)
def update_task(task_id: str, updated_task: Task):
    tasks = load_tasks()
    for i, existing_task in enumerate(tasks):
        if existing_task.id == task_id:
            # Preserve ID & createdAt
            updated_task.id = existing_task.id
            updated_task.createdAt = existing_task.createdAt

            # Auto-set timestamps
            if updated_task.completed and not existing_task.completed:
                updated_task.completedAt = datetime.utcnow().isoformat()
            elif not updated_task.completed:
                updated_task.completedAt = None

            updated_task.updatedAt = datetime.utcnow().isoformat()

            tasks[i] = updated_task
            save_tasks(tasks)
            return updated_task

    raise HTTPException(status_code=404, detail="Task not found")

@router.delete("/{task_id}")
def delete_task(task_id: str):
    tasks = load_tasks()
    for i, task in enumerate(tasks):
        if task.id == task_id:
            tasks.pop(i)
            save_tasks(tasks)
            return {"detail": "Task deleted"}
    raise HTTPException(status_code=404, detail="Task not found")

