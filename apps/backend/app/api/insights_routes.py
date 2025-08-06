from datetime import datetime, timedelta
from fastapi import APIRouter, Query
import json
from pathlib import Path
from pydantic import BaseModel

router = APIRouter()

DATA_FILE = Path(__file__).parent.parent / "data" / "test_sessions.json"

# ---------- Helper Function ----------
def load_sessions():
    print(f"Attempting to load data from: {DATA_FILE.resolve()}")
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            print(f"Successfully loaded {len(data)} records from {DATA_FILE.name}")
            return data
    except FileNotFoundError:
        print(f"ERROR: File not found at {DATA_FILE.resolve()}")
        return []
    except json.JSONDecodeError as e:
        print(f"ERROR: Invalid JSON format in {DATA_FILE.name}: {e}")
        return []
    
class RangeRequest(BaseModel):
    range: str  # expects "day", "week", "month", or "year"

# ---------- Streak Calculation ----------
def calculate_streak(data: list) -> int:
    if not data:
        return 0

    # Sort dates in descending order (most recent first)
    sorted_dates = sorted(
        [datetime.strptime(day["date"], "%Y-%m-%d") for day in data],
        reverse=True,
    )

    streak = 0
    current_date = datetime.now().date()

    for date in sorted_dates:
        date_only = date.date()

        # If today, count it as part of streak
        if date_only == current_date:
            streak += 1
            current_date -= timedelta(days=1)
        # If it's exactly the previous day, continue streak
        elif date_only == current_date - timedelta(days=1):
            streak += 1
            current_date -= timedelta(days=1)
        else:
            break  # streak broken if there's a gap

    return streak

# ---------- API Endpoint ----------
@router.post("/summary")
def get_insights_summary(request: RangeRequest):
    data = load_sessions()
    today = datetime.now()

    if request.range == "day":
        cutoff_date = today.replace(hour=0, minute=0, second=0, microsecond=0)
    elif request.range == "week":
        cutoff_date = today - timedelta(weeks=1)
    elif request.range == "month":
        cutoff_date = today - timedelta(days=30)
    elif request.range == "year":
        cutoff_date = today - timedelta(days=365)

    filtered_data = [
        day for day in data 
        if datetime.strptime(day["date"], "%Y-%m-%d") >= cutoff_date
    ]

    streak = calculate_streak(data)

    return {
        "range": request.range,
        "totalFocusTimeMin": sum(d.get("totalFocusTimeMin", 0) for d in filtered_data),
        "totalSessions": sum(d.get("totalSessions", 0) for d in filtered_data),
        "bestHour": "10 AM",
        "streak": streak,
        "trend": filtered_data
    }
