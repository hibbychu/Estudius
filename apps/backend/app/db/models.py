from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey
from sqlalchemy.orm import declarative_base  # ✅ New
from sqlalchemy.orm import relationship
import datetime

Base = declarative_base()

class SessionLog(Base):
    __tablename__ = "session_logs"
    id = Column(Integer, primary_key=True, index=True)
    start_time = Column(DateTime, default=datetime.datetime.utcnow)
    end_time = Column(DateTime)
    task_id = Column(Integer, ForeignKey("tasks.id"))

class Task(Base):
    __tablename__ = "tasks"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    description = Column(String)

class UserPreferences(Base):
    __tablename__ = "user_preferences"
    id = Column(Integer, primary_key=True, index=True)
    theme = Column(String)
    notifications_enabled = Column(Boolean, default=True)

class MoodCheckin(Base):
    __tablename__ = "mood_checkins"
    id = Column(Integer, primary_key=True, index=True)
    mood = Column(String)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)
