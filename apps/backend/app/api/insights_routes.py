from fastapi import APIRouter
import json
from pathlib import Path

router = APIRouter()

DATA_FILE = Path(__file__).parent.parent / "data" / "test_sessions.json"

# ---------- Helper Function ----------
def load_sessions():
    print(f"📂 Attempting to load data from: {DATA_FILE.resolve()}")
    try:
        with open(DATA_FILE, "r") as f:
            data = json.load(f)
            print(f"✅ Successfully loaded {len(data)} records from {DATA_FILE.name}")
            return data
    except FileNotFoundError:
        print(f"❌ ERROR: File not found at {DATA_FILE.resolve()}")
        return []
    except json.JSONDecodeError as e:
        print(f"❌ ERROR: Invalid JSON format in {DATA_FILE.name}: {e}")
        return []

# ---------- API Endpoint ----------
@router.get("/summary")
def get_insights_summary():
    data = load_sessions()
    print("📤 Sending raw JSON data to frontend...")
    return {"data": data}



# from fastapi import APIRouter, Query
# from fastapi.middleware.cors import CORSMiddleware
# import json
# from pathlib import Path
# from datetime import datetime, timedelta
# from collections import defaultdict

# router = APIRouter()

# DATA_FILE = Path(__file__).parent.parent / "data" / "test_sessions.json"

# # ---------- Helper Functions ----------
# # def load_sessions():
# #     with open(DATA_FILE, "r") as f:
# #         return json.load(f)

# def load_sessions():
#     print(f"📂 Attempting to load data from: {DATA_FILE.resolve()}")
#     try:
#         with open(DATA_FILE, "r") as f:
#             data = json.load(f)
#             print(f"✅ Successfully loaded {len(data)} records from {DATA_FILE.name}")
#             return data
#     except FileNotFoundError:
#         print(f"❌ ERROR: File not found at {DATA_FILE.resolve()}")
#         return []
#     except json.JSONDecodeError as e:
#         print(f"❌ ERROR: Invalid JSON format in {DATA_FILE.name}: {e}")
#         return []

# def filter_by_range(data, range_type: str):
#     """Filter sessions based on selected range (day/week/month/year)."""
#     now = datetime.now()
#     if range_type == "day":
#         cutoff = now.replace(hour=0, minute=0, second=0, microsecond=0)
#     elif range_type == "week":
#         cutoff = now - timedelta(days=7)
#     elif range_type == "month":
#         cutoff = now - timedelta(days=30)
#     elif range_type == "year":
#         cutoff = now - timedelta(days=365)
#     else:
#         cutoff = datetime.min

#     filtered = [
#         d for d in data 
#         if datetime.strptime(d["date"], "%Y-%m-%d") >= cutoff
#     ]
#     return filtered

# def find_most_productive_hour(filtered_data):
#     """Find the hour of day with the most total focus time."""
#     hour_focus = defaultdict(int)  # hour -> total minutes
#     for day in filtered_data:
#         for session in day["sessions"]:
#             start = datetime.fromisoformat(session["start"])
#             hour_focus[start.hour] += session["totalFocusTimeMin"]

#     if not hour_focus:
#         return None

#     best_hour = max(hour_focus, key=hour_focus.get)
#     return f"{best_hour}:00 - {best_hour+1}:00"

# def build_trend_data(filtered_data):
#     """Build chart data: total focus time per day."""
#     trend = []
#     for day in filtered_data:
#         trend.append({
#             "date": day["date"],
#             "focusMinutes": day["totalFocusTimeMin"],
#             "sessions": day["totalSessions"]
#         })
#     return trend

# # ---------- API Endpoints ----------

# @router.get("/summary")
# def get_insights_summary(range: str = Query("week", enum=["day", "week", "month", "year"])):
#     data = load_sessions()

#     print(f"🔍 Loaded sessions data: {data}")
#     filtered = filter_by_range(data, range)

#     total_focus = sum(d["totalFocusTimeMin"] for d in filtered)
#     total_sessions = sum(d["totalSessions"] for d in filtered)
#     best_hour = find_most_productive_hour(filtered)
#     trend_data = build_trend_data(filtered)

#     response_data = {
#         "range": range,
#         "totalFocusTimeMin": total_focus,
#         "totalSessions": total_sessions,
#         "bestHour": best_hour,
#         "trend": trend_data
#     }

#     print("Sending response data:", response_data)
#     return response_data



