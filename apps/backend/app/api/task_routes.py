from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_tasks():
    return {"tasks": ["task1", "task2"]}

@router.post("/")
async def create_task():
    return {"message": "Task created (placeholder)"}
