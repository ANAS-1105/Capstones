from pydantic import BaseModel, EmailStr, Field
from typing import List, Dict, Optional, Any
from datetime import datetime

class UserRegister(BaseModel):
    name: str = Field(..., min_length=2)
    email: EmailStr
    password: str = Field(..., min_length=6)

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: str = Field(..., alias="_id")
    name: str
    email: EmailStr
    created_at: Optional[str] = None

    class Config:
        populate_by_name = True

class Token(BaseModel):
    access_token: str
    token_type: str

class JournalCreate(BaseModel):
    text: str = Field(..., min_length=10)
    hours_studied: float = Field(..., ge=0, le=24)
    sleep_hours: float = Field(..., ge=0, le=24)
    upcoming_exams: int = Field(..., ge=0)
    mood_rating: int = Field(..., ge=1, le=5)
    consistency: int = Field(..., ge=1, le=10)
    distractions: int = Field(..., ge=0, le=10)

class StudyPlan(BaseModel):
    study_duration: int
    break_duration: int
    learning_method: str
    revision_schedule: str
    relaxation_exercise: str
    wellness_tips: List[str]
    productivity_score: int
    focus_score: int
    motivational_quote: str
    burnout_risk: str
    success_probability: int
    priority_subjects: List[str]
    stop_warning: Optional[str] = None

class JournalOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    text: str
    emotion: str
    created_at: str
    study_plan: StudyPlan
    hours_studied: Optional[float] = None
    sleep_hours: Optional[float] = None
    upcoming_exams: Optional[int] = None
    mood_rating: Optional[int] = None
    consistency: Optional[int] = None
    distractions: Optional[int] = None

    class Config:
        populate_by_name = True

class GoalCreate(BaseModel):
    title: str = Field(..., min_length=1)

class GoalUpdate(BaseModel):
    completed: bool

class GoalOut(BaseModel):
    id: str = Field(..., alias="_id")
    user_id: str
    title: str
    completed: bool
    created_at: str

    class Config:
        populate_by_name = True

class MoodTrendPoint(BaseModel):
    date: str
    emotion: str

class AnalyticsOut(BaseModel):
    mood_history: List[MoodTrendPoint]
    weekly_progress_percentage: float
    study_streak: int
    average_focus_score: float
    average_productivity_score: float
    total_goals_completed: int
    emotion_distribution: Dict[str, int]

class StudyDNA(BaseModel):
    learning_style: str
    best_time: str
    most_productive_subject: str
    weakest_subject: str
    most_common_emotion: str
    average_focus: float
    optimal_study_time: int
    ideal_break: int

class FutureSelf(BaseModel):
    current_progress: float
    predicted_progress_30_days: float
    expected_stress_reduction: float
    focus_improvement: str
    exam_readiness: str

class CoachProfileOut(BaseModel):
    dna: StudyDNA
    future_self: FutureSelf
    insights: List[str]

