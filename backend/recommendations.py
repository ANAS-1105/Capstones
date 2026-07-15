import random
from typing import List, Optional

MOTIVATIONAL_QUOTES = {
    "motivated": [
        "Success is not final, failure is not fatal: it is the courage to continue that counts.",
        "Your passion and focus will lead you to amazing achievements today!",
        "Keep crushing your goals, you are on an incredible path!"
    ],
    "stressed": [
        "Stressing will not change the outcome. Take a deep breath and take one step at a time.",
        "It is okay to not have it all figured out right now. Just do what you can.",
        "Don't worry about how much is left. Just focus on the small section in front of you."
    ],
    "burned_out": [
        "Rest is not laziness. Rest is an essential part of success and recovery.",
        "Give yourself permission to pause. A rested mind learns better.",
        "You are more than your productivity. Take time to heal and recharge."
    ],
    "confused": [
        "Confusion is the welcome mat at the door of creativity and learning.",
        "Every master was once a confused beginner. Keep questioning and exploring.",
        "If you are confused, it means your brain is actively working to build new pathways."
    ],
    "calm": [
        "Calm mind brings inner strength and self-confidence, which is key for deep learning.",
        "In the middle of difficulty lies opportunity. Work steadily and peacefully.",
        "Peace is the best workspace. Enjoy this beautiful flow."
    ],
    "anxious": [
        "You know more than you think. Trust your mind, you are fully capable.",
        "Worrying about tomorrow only steals the strength from your today.",
        "Focus on your breath. You are safe, you are here, and you can take it one page at a time."
    ]
}

def generate_study_plan(
    emotion: str, 
    hours_studied: float, 
    sleep_hours: float, 
    upcoming_exams: int, 
    mood_rating: int, 
    consistency: int, 
    distractions: int
) -> dict:
    emotion = emotion.lower()
    if emotion not in MOTIVATIONAL_QUOTES:
        emotion = "calm"
        
    quote = random.choice(MOTIVATIONAL_QUOTES[emotion])
    
    # 1. Focus Score Calculation (Multivariate prediction)
    # Baseline by emotion
    base_focus = {
        "motivated": 88,
        "calm": 82,
        "confused": 62,
        "anxious": 50,
        "stressed": 45,
        "burned_out": 28
    }.get(emotion, 70)
    
    # Adjustments
    sleep_penalty = max(0.0, 6.0 - sleep_hours) * 12.0  # -12% per hour of sleep missed below 6 hours
    distraction_penalty = distractions * 4.5           # -4.5% per distraction level
    mood_bonus = (mood_rating - 3) * 4.0               # Up to +8% or -8% based on mood rating
    
    focus_score = int(base_focus - sleep_penalty - distraction_penalty + mood_bonus)
    focus_score = max(10, min(100, focus_score))
    
    # 2. Burnout Risk Calculation
    if emotion == "burned_out" or (sleep_hours < 5.0 and consistency >= 8) or (hours_studied > 8.0):
        burnout_risk = "High"
    elif emotion in ["stressed", "anxious"] or sleep_hours < 6.0 or hours_studied > 5.0:
        burnout_risk = "Moderate"
    else:
        burnout_risk = "Low"
        
    # 3. Success Probability Calculation
    # Baseline
    success_probability = 45
    success_probability += consistency * 3.5            # Up to +35% for consistency
    success_probability += (sleep_hours - 5.0) * 3.0    # Add for sleep, deduct for deprivation
    success_probability -= distractions * 3.5           # Deduct for distractions
    success_probability -= upcoming_exams * 1.5         # Deduct for stress of upcoming exams
    
    if emotion in ["motivated", "calm"]:
        success_probability += 8
    elif emotion in ["stressed", "burned_out"]:
        success_probability -= 12
        
    success_probability = int(max(15, min(98, success_probability)))
    
    # 3.5. Stress Level Calculation
    base_stress = {
        "stressed": 85,
        "anxious": 75,
        "burned_out": 70,
        "confused": 55,
        "calm": 25,
        "motivated": 30
    }.get(emotion, 50)
    
    exam_stress = upcoming_exams * 10
    sleep_stress = max(0.0, 6.0 - sleep_hours) * 8.0
    distraction_stress = distractions * 2.0
    
    stress_level = int(base_stress + exam_stress + sleep_stress + distraction_stress)
    stress_level = max(10, min(98, stress_level))
    
    # 4. Best Study & Break Durations
    if burnout_risk == "High":
        study_duration = 15
        break_duration = 15
    elif burnout_risk == "Moderate":
        study_duration = 30
        break_duration = 10
    else:
        if emotion == "motivated":
            study_duration = 50
            break_duration = 10
        elif emotion == "calm":
            study_duration = 45
            break_duration = 10
        else:
            study_duration = 25
            break_duration = 5
            
    # 5. Subjects to Prioritize
    subject_map = {
        "motivated": ["Biology", "Chemistry", "Social Studies"],
        "calm": ["Computer Science", "Programming", "Essay Writing"],
        "confused": ["Mathematics", "Physics", "Mechanics"],
        "stressed": ["Concept Summary Cards", "Key Formula Review"],
        "anxious": ["Mock Tests", "Vocabulary Recalls", "Previous Year Papers"],
        "burned_out": ["Low-pressure Reading", "Study Video Summaries"]
    }
    priority_subjects = subject_map.get(emotion, ["General Revision"])
    
    # 6. Stop Warning
    stop_warning = None
    if hours_studied >= 6.0:
        stop_warning = "Cognitive Fatigue Warning: You have studied 6+ hours today. Close your textbooks and take a rest now."
    elif sleep_hours < 5.0:
        stop_warning = "Sleep Deprivation Warning: You had less than 5 hours of sleep. Prioritize rest over extra study blocks."
    elif burnout_risk == "High" and emotion == "burned_out":
        stop_warning = "Severe Burnout Detected: Stop all study sessions immediately. Spend the day recovering."
        
    # 7. Core Plan Mapping
    if emotion == "motivated":
        learning_method = "Feynman Technique & Practice Quizzes"
        revision_schedule = "Standard Active Recall (1-day, 3-day, 7-day review)"
        relaxation_exercise = "Victory lap walk or dynamic stretching"
        wellness_tips = [
            "Write down your learnings immediately to solidify them.",
            "Maintain this high momentum but don't overwork.",
            "Share your positive energy with a peer or classmate."
        ]
    elif emotion == "stressed":
        learning_method = "Pomodoro Technique (Single Task Focus)"
        revision_schedule = "Light summary review cards"
        relaxation_exercise = "4-7-8 Breathing Exercise (Inhale 4s, Hold 7s, Exhale 8s)"
        wellness_tips = [
            "Take a step back. Your mental health is more valuable than any grade.",
            "Hydrate and do a quick 2-minute physical body scan to release tension.",
            "Divide your massive task into 3 tiny, bite-sized micro-steps."
        ]
    elif emotion == "burned_out":
        learning_method = "Low-Intensity Reading / Flashcards"
        revision_schedule = "No heavy revision today, prioritize recovery"
        relaxation_exercise = "Progressive Muscle Relaxation or a 20-minute power nap"
        wellness_tips = [
            "You have worked incredibly hard. Give yourself permission to do the bare minimum today.",
            "Spend at least 30 minutes entirely away from screens and devices.",
            "Engage in a relaxing, non-academic activity tonight (e.g. read fiction, warm bath)."
        ]
    elif emotion == "confused":
        learning_method = "Mind Mapping & Visual Video Tutorials"
        revision_schedule = "Immediate review after clarifying basic terms"
        relaxation_exercise = "Eye-strain relief exercises and a cool glass of water"
        wellness_tips = [
            "Being confused is the first step of learning. Do not panic, it's progress.",
            "Search for a simple 5-minute explanation video (like ELI5) on the topic.",
            "Write down your specific questions to ask a peer, mentor, or AI assistant."
        ]
    elif emotion == "calm":
        learning_method = "SQ3R Method (Survey, Question, Read, Recite, Review)"
        revision_schedule = "Spaced Repetition System (SRS) review"
        relaxation_exercise = "Mindful listening to a calming low-fi track"
        wellness_tips = [
            "Your mind is in a prime learning state. Enjoy the natural focus.",
            "Set up a clean, tidy workspace to sustain this calm energy.",
            "Keep a steady, unhurried pace; you are doing fantastic."
        ]
    else:  # anxious
        learning_method = "Practice Quizzes (low stakes) & Verbal Recall"
        revision_schedule = "Daily revision summary cards"
        relaxation_exercise = "5-4-3-2-1 Grounding Technique (Name 5 sights, 4 feels, 3 sounds...)"
        wellness_tips = [
            "Acknowledge the worry, then bring focus back to the present moment.",
            "You know more than you think. Trust your preparation and ability.",
            "Do not compare your progress to others. Focus solely on your page."
        ]
        
    return {
        "study_duration": study_duration,
        "break_duration": break_duration,
        "learning_method": learning_method,
        "revision_schedule": revision_schedule,
        "relaxation_exercise": relaxation_exercise,
        "wellness_tips": wellness_tips,
        "productivity_score": int(focus_score * 0.95),  # Estimated productivity
        "focus_score": focus_score,
        "motivational_quote": quote,
        "burnout_risk": burnout_risk,
        "success_probability": success_probability,
        "priority_subjects": priority_subjects,
        "stop_warning": stop_warning,
        "stress_level": stress_level
    }
