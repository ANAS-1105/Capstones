import os
import pickle
import datetime
from typing import List, Dict
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordRequestForm

from database import db
from schemas import (
    UserRegister, UserLogin, UserOut, Token,
    JournalCreate, JournalOut, GoalCreate, GoalOut, GoalUpdate, AnalyticsOut
)
from auth import hash_password, verify_password, create_access_token, get_current_user
from recommendations import generate_study_plan

app = FastAPI(title="MindMentor AI Backend", version="1.0.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For local development ease
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load ML Model
BASE_DIR = "d:\\PROJECT capstone\\MindMentor-AI"
MODEL_PATH = os.path.join(BASE_DIR, "ml", "model.pkl")
VECTORIZER_PATH = os.path.join(BASE_DIR, "ml", "vectorizer.pkl")

model = None
vectorizer = None

try:
    if os.path.exists(MODEL_PATH) and os.path.exists(VECTORIZER_PATH):
        with open(MODEL_PATH, "rb") as f:
            model = pickle.load(f)
        with open(VECTORIZER_PATH, "rb") as f:
            vectorizer = pickle.load(f)
        print("ML Model loaded successfully.")
    else:
        print("ML Model files not found. Using fallback keyword predictor.")
except Exception as e:
    print(f"Error loading model files: {e}. Using fallback keyword predictor.")

def predict_emotion(text: str) -> str:
    # 1. Try ML Model
    if model is not None and vectorizer is not None:
        try:
            vec = vectorizer.transform([text])
            pred = model.predict(vec)[0]
            return pred
        except Exception as e:
            print(f"Error in model prediction: {e}")
            
    # 2. Fallback Keyword Classifier
    text_lower = text.lower()
    if any(w in text_lower for w in ["stressed", "overwhelm", "pressure", "deadline", "pile", "coping", "too much", "worry"]):
        return "stressed"
    elif any(w in text_lower for w in ["tired", "exhaust", "burnout", "sleep", "drain", "energy", "zombie", "empty", "fried"]):
        return "burned_out"
    elif any(w in text_lower for w in ["confuse", "lost", "understand", "stuck", "baffled", "explain", "clear", "error"]):
        return "confused"
    elif any(w in text_lower for w in ["calm", "relax", "peace", "steady", "tranquil", "composed", "music"]):
        return "calm"
    elif any(w in text_lower for w in ["anxious", "worry", "nervous", "scared", "fear", "dread", "panic", "shaking"]):
        return "anxious"
    elif any(w in text_lower for w in ["motivated", "excited", "happy", "crush", "goal", "inspired", "zone", "learn", "eager"]):
        return "motivated"
    return "calm"

def check_and_update_badges(user_id: str):
    journals = db.get_journal_entries(user_id)
    goals = db.get_goals(user_id)
    current_badges = db.get_user_badges(user_id)
    
    unlocked_badges = list(current_badges)
    
    # 1. 7-Day Focus Streak badge
    # Count unique days logged
    unique_dates = {j["created_at"][:10] for j in journals}
    if len(unique_dates) >= 7 and "7-Day Focus Streak" not in unlocked_badges:
        unlocked_badges.append("7-Day Focus Streak")
    elif len(journals) >= 3 and "7-Day Focus Streak" not in unlocked_badges:
        # Provide a 3-entry helper badge in local testing to make it feel responsive
        unlocked_badges.append("7-Day Focus Streak")
        
    # 2. Consistency Champion badge
    completed_goals = [g for g in goals if g["completed"]]
    if len(completed_goals) >= 5 and "Consistency Champion" not in unlocked_badges:
        unlocked_badges.append("Consistency Champion")
        
    # 3. Stress Buster badge (Calm/Motivated after Stressed/Anxious)
    if len(journals) >= 2:
        sorted_journals = sorted(journals, key=lambda x: x["created_at"])
        last_emotion = sorted_journals[-1]["emotion"]
        prev_emotion = sorted_journals[-2]["emotion"]
        if last_emotion in ["calm", "motivated"] and prev_emotion in ["stressed", "anxious"]:
            if "Stress Buster" not in unlocked_badges:
                unlocked_badges.append("Stress Buster")
                
    # 4. Early Bird badge (Logged between 4:00 AM and 8:00 AM)
    for j in journals:
        try:
            # Format: 2026-07-07T14:18:40
            time_str = j["created_at"].split("T")[1]
            hour = int(time_str.split(":")[0])
            if 4 <= hour < 8 and "Early Bird" not in unlocked_badges:
                unlocked_badges.append("Early Bird")
                break
        except Exception:
            pass
            
    # Always unlock a beginner badge if they write their first journal
    if len(journals) >= 1 and "Consistency Champion" not in unlocked_badges and len(completed_goals) >= 1:
        # Give them Consistency Champion early for completing their first goal
        unlocked_badges.append("Consistency Champion")
        
    if set(unlocked_badges) != set(current_badges):
        db.save_user_badges(user_id, unlocked_badges)

# --- Authentication Routes ---

@app.post("/api/auth/register", response_model=UserOut)
def register(user_data: UserRegister):
    existing_user = db.find_user_by_email(user_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
        
    user_dict = {
        "name": user_data.name,
        "email": user_data.email.lower(),
        "hashed_password": hash_password(user_data.password),
        "created_at": datetime.datetime.now().isoformat()
    }
    created_user = db.create_user(user_dict)
    return created_user

@app.post("/api/auth/login", response_model=Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = db.find_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": user["email"]})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/api/auth/me", response_model=UserOut)
def get_me(current_user: dict = Depends(get_current_user)):
    return current_user

# --- Journal & Emotion Analysis Routes ---

@app.post("/api/analyze", response_model=JournalOut)
def analyze_journal(entry: JournalCreate, current_user: dict = Depends(get_current_user)):
    emotion = predict_emotion(entry.text)
    study_plan = generate_study_plan(emotion)
    
    journal_entry = {
        "text": entry.text,
        "emotion": emotion,
        "created_at": datetime.datetime.now().isoformat(),
        "study_plan": study_plan
    }
    
    saved_entry = db.save_journal_entry(current_user["_id"], journal_entry)
    
    # Check for new badge unlocks
    check_and_update_badges(current_user["_id"])
    
    return saved_entry

@app.get("/api/journals", response_model=List[JournalOut])
def get_journals(current_user: dict = Depends(get_current_user)):
    return db.get_journal_entries(current_user["_id"])

# --- Goals Routes ---

@app.get("/api/goals", response_model=List[GoalOut])
def get_goals(current_user: dict = Depends(get_current_user)):
    return db.get_goals(current_user["_id"])

@app.post("/api/goals", response_model=GoalOut)
def create_goal(goal_data: GoalCreate, current_user: dict = Depends(get_current_user)):
    goal = {
        "title": goal_data.title,
        "completed": False,
        "created_at": datetime.datetime.now().isoformat()
    }
    saved_goal = db.save_goal(current_user["_id"], goal)
    check_and_update_badges(current_user["_id"])
    return saved_goal

@app.put("/api/goals/{goal_id}", response_model=bool)
def toggle_goal(goal_id: str, payload: GoalUpdate, current_user: dict = Depends(get_current_user)):
    success = db.update_goal(current_user["_id"], goal_id, payload.completed)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    check_and_update_badges(current_user["_id"])
    return True

@app.delete("/api/goals/{goal_id}", response_model=bool)
def delete_goal(goal_id: str, current_user: dict = Depends(get_current_user)):
    success = db.delete_goal(current_user["_id"], goal_id)
    if not success:
        raise HTTPException(status_code=404, detail="Goal not found")
    return True

# --- Analytics Route ---

@app.get("/api/analytics", response_model=AnalyticsOut)
def get_analytics(current_user: dict = Depends(get_current_user)):
    user_id = current_user["_id"]
    journals = db.get_journal_entries(user_id)
    goals = db.get_goals(user_id)
    
    # 1. Mood history
    sorted_journals = sorted(journals, key=lambda x: x["created_at"])
    mood_history = [
        {"date": j["created_at"][:10], "emotion": j["emotion"]} 
        for j in sorted_journals
    ][-7:]  # Last 7 logs
    
    # 2. Total goals completed
    total_goals_completed = sum(1 for g in goals if g["completed"])
    
    # 3. Weekly progress percentage
    weekly_progress = 0.0
    if goals:
        completed = sum(1 for g in goals if g["completed"])
        weekly_progress = (completed / len(goals)) * 100
        
    # 4. Focus & Productivity Averages
    avg_focus = 0.0
    avg_prod = 0.0
    if journals:
        avg_focus = sum(j["study_plan"]["focus_score"] for j in journals) / len(journals)
        avg_prod = sum(j["study_plan"]["productivity_score"] for j in journals) / len(journals)
        
    # 5. Emotion distribution
    emotion_dist = {}
    for j in journals:
        emo = j["emotion"]
        emotion_dist[emo] = emotion_dist.get(emo, 0) + 1
        
    # 6. Study streak (consecutive days of journal logging)
    unique_dates = sorted(list({j["created_at"][:10] for j in journals}))
    streak = 0
    if unique_dates:
        streak = 1
        current_streak = 1
        for i in range(1, len(unique_dates)):
            d1 = datetime.datetime.strptime(unique_dates[i-1], "%Y-%m-%d")
            d2 = datetime.datetime.strptime(unique_dates[i], "%Y-%m-%d")
            if (d2 - d1).days == 1:
                current_streak += 1
                streak = max(streak, current_streak)
            elif (d2 - d1).days > 1:
                current_streak = 1
                
    return {
        "mood_history": mood_history,
        "weekly_progress_percentage": round(weekly_progress, 1),
        "study_streak": streak,
        "average_focus_score": round(avg_focus, 1),
        "average_productivity_score": round(avg_prod, 1),
        "total_goals_completed": total_goals_completed,
        "emotion_distribution": emotion_dist
    }

# --- Badges Route ---

@app.get("/api/badges", response_model=List[str])
def get_badges(current_user: dict = Depends(get_current_user)):
    return db.get_user_badges(current_user["_id"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
