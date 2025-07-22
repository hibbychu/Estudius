from fastapi import FastAPI
from app.db.database import Base, engine
from app.db import models  # This registers the models
from app.api import session_routes, task_routes, general_routes  # NEW

# Create all DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI()

# Include modular routers
app.include_router(session_routes.router, prefix="/sessions", tags=["Sessions"])
app.include_router(task_routes.router, prefix="/tasks", tags=["Tasks"])
app.include_router(general_routes.router, tags=["General"])  # NEW

# Base health route
@app.get("/")
def read_root():
    return {"Hello": "World"}
