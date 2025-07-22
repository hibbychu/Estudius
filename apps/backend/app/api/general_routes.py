from fastapi import APIRouter

router = APIRouter()

# ✅ Placeholder for check-in
@router.get("/checkin")
async def checkin():
    return {"status": "Checked in", "timestamp": "2025-07-22T10:00:00Z"}

# ✅ Placeholder for insights
@router.get("/insights")
async def insights():
    return {
        "total_focus_time": "2h 30m",
        "tasks_completed": 5,
        "current_streak": 3
    }
