from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def read_sessions():
    return {"sessions": ["session1", "session2", "session3"]}

@router.post("/")
async def create_session():
    return {"message": "Session created (placeholder)"}

@router.put("/{session_id}")
async def update_session(session_id: int):
    return {
        "message": f"Session {session_id} updated (placeholder)",
        "session_id": session_id
    }

# ✅ New: Start a session
@router.post("/start")
async def start_session():
    return {"message": "Session started", "session_id": 1}

# ✅ New: End a session
@router.post("/end")
async def end_session():
    return {"message": "Session ended", "session_id": 1}
