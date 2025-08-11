from fastapi import FastAPI, HTTPException, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from passlib.hash import bcrypt
from jose import jwt
from datetime import datetime, timedelta
from typing import List, Dict
import json
import os
from app.activity_tracker import start_activity_monitor, activity_status
from app.api import task_routes,insights_routes

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Temporarily allow all during dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_users: Dict[WebSocket, Dict[str, str]] = {}

# WebSocket endpoint
@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    try:
        data = await websocket.receive_text()
        user_info = json.loads(data)
        name = user_info.get("name", "Anonymous")
        avatar = user_info.get("avatar", "/assets/icons/user.png")

        connected_users[websocket] = { "name": name, "avatar": avatar }

        await notify_users()  # Notify everyone about new user

        while True:
            await websocket.receive_text()  # Keep connection alive
    except WebSocketDisconnect:
        print(f"Disconnected: {connected_users.get(websocket, {}).get('name')}")
    finally:
        if websocket in connected_users:
            del connected_users[websocket]
        await notify_users()

async def notify_users():
    online_list = list(connected_users.values())
    message = "ONLINE_USERS:" + json.dumps(online_list)
    for connection in connected_users:
        await connection.send_text(message)

async def broadcast_online_users():
    users = [
        {"name": name, "avatar": data["avatar"]}
        for name, data in connected_users.items()
    ]
    for user_data in connected_users.values():
        try:
            await user_data["ws"].send_text(f"ONLINE_USERS:{json.dumps(users)}")
        except:
            pass

start_activity_monitor()  # <-- starts keyboard & mouse tracking

@app.get("/activity_monitor/status")
def get_activity_status():
    return JSONResponse({
        "keystroke_count": activity_status['keystroke_count'],
        "last_keystroke_count": activity_status['last_keystroke_count'],
        "last_mouse_distance": activity_status['last_mouse_distance'],
        "mouse_distance": activity_status['mouse_distance'],
        "last_log": activity_status['last_log']
    })

USERS_FILE = "app/db/users.json"

def save_users_to_file(users):
    with open(USERS_FILE, "w") as f:
        json.dump(users, f, indent=4)

def load_users_from_file():
    if os.path.exists(USERS_FILE):
        with open(USERS_FILE, "r") as f:
            try:
                return json.load(f)
            except json.JSONDecodeError:
                return []
    return []

class UserIn(BaseModel):
    email: str
    password: str

SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

@app.post("/signup")
async def signup(user: UserIn):
    users = load_users_from_file()

    if any(u["email"] == user.email for u in users):
        raise HTTPException(status_code=400, detail="Email already registered")

    hashed_pw = bcrypt.hash(user.password)
    users.append({
        "email": user.email,
        "hashed_password": hashed_pw
    })
    save_users_to_file(users)
    return {"msg": "User created successfully"}

@app.post("/login")
async def login(user: UserIn):
    users = load_users_from_file()

    matched_user = next((u for u in users if u["email"] == user.email), None)
    if not matched_user:
        raise HTTPException(status_code=401, detail="Invalid credentials")

    if not bcrypt.verify(user.password, matched_user["hashed_password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")

    token_payload = {
        "sub": user.email,
        "exp": datetime.utcnow() + timedelta(hours=12)
    }
    token = jwt.encode(token_payload, SECRET_KEY, ALGORITHM)

    return {"access_token": token, "token_type": "bearer"}

app.include_router(task_routes.router, prefix="/tasks", tags=["Tasks"])
app.include_router(insights_routes.router, prefix="/insights", tags=["Insights"])
