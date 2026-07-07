import random

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

def generate_study_plan(emotion: str) -> dict:
    emotion = emotion.lower()
    if emotion not in MOTIVATIONAL_QUOTES:
        emotion = "calm"
        
    quote = random.choice(MOTIVATIONAL_QUOTES[emotion])
    
    if emotion == "motivated":
        return {
            "study_duration": 50,
            "break_duration": 10,
            "learning_method": "Feynman Technique & Practice Quizzes",
            "revision_schedule": "Standard Active Recall (1-day, 3-day, 7-day review)",
            "relaxation_exercise": "Victory lap walk or dynamic stretching",
            "wellness_tips": [
                "Write down your learnings immediately to solidify them.",
                "Maintain this high momentum but don't overwork.",
                "Share your positive energy with a peer or classmate."
            ],
            "productivity_score": random.randint(85, 98),
            "focus_score": random.randint(85, 96),
            "motivational_quote": quote
        }
    elif emotion == "stressed":
        return {
            "study_duration": 25,
            "break_duration": 10,
            "learning_method": "Pomodoro Technique (Single Task Focus)",
            "revision_schedule": "Light summary review cards",
            "relaxation_exercise": "4-7-8 Breathing Exercise (Inhale 4s, Hold 7s, Exhale 8s)",
            "wellness_tips": [
                "Take a step back. Your mental health is more valuable than any grade.",
                "Hydrate and do a quick 2-minute physical body scan to release tension.",
                "Divide your massive task into 3 tiny, bite-sized micro-steps."
            ],
            "productivity_score": random.randint(45, 65),
            "focus_score": random.randint(40, 60),
            "motivational_quote": quote
        }
    elif emotion == "burned_out":
        return {
            "study_duration": 15,
            "break_duration": 15,
            "learning_method": "Low-Intensity Reading / Flashcards",
            "revision_schedule": "No heavy revision today, prioritize recovery",
            "relaxation_exercise": "Progressive Muscle Relaxation or a 20-minute power nap",
            "wellness_tips": [
                "You have worked incredibly hard. Give yourself permission to do the bare minimum today.",
                "Spend at least 30 minutes entirely away from screens and devices.",
                "Engage in a relaxing, non-academic activity tonight (e.g. read fiction, warm bath)."
            ],
            "productivity_score": random.randint(15, 35),
            "focus_score": random.randint(20, 40),
            "motivational_quote": quote
        }
    elif emotion == "confused":
        return {
            "study_duration": 30,
            "break_duration": 5,
            "learning_method": "Mind Mapping & Visual Video Tutorials",
            "revision_schedule": "Immediate review after clarifying basic terms",
            "relaxation_exercise": "Eye-strain relief exercises and a cool glass of water",
            "wellness_tips": [
                "Being confused is the first step of learning. Do not panic, it's progress.",
                "Search for a simple 5-minute explanation video (like ELI5) on the topic.",
                "Write down your specific questions to ask a peer, mentor, or AI assistant."
            ],
            "productivity_score": random.randint(50, 70),
            "focus_score": random.randint(45, 65),
            "motivational_quote": quote
        }
    elif emotion == "calm":
        return {
            "study_duration": 40,
            "break_duration": 10,
            "learning_method": "SQ3R Method (Survey, Question, Read, Recite, Review)",
            "revision_schedule": "Spaced Repetition System (SRS) review",
            "relaxation_exercise": "Mindful listening to a calming low-fi track",
            "wellness_tips": [
                "Your mind is in a prime learning state. Enjoy the natural focus.",
                "Set up a clean, tidy workspace to sustain this calm energy.",
                "Keep a steady, unhurried pace; you are doing fantastic."
            ],
            "productivity_score": random.randint(75, 90),
            "focus_score": random.randint(80, 92),
            "motivational_quote": quote
        }
    else:  # anxious
        return {
            "study_duration": 20,
            "break_duration": 10,
            "learning_method": "Practice Quizzes (low stakes) & Verbal Recall",
            "revision_schedule": "Daily revision summary cards",
            "relaxation_exercise": "5-4-3-2-1 Grounding Technique (Name 5 sights, 4 feels, 3 sounds...)",
            "wellness_tips": [
                "Acknowledge the worry, then bring focus back to the present moment.",
                "You know more than you think. Trust your preparation and ability.",
                "Do not compare your progress to others. Focus solely on your page."
            ],
            "productivity_score": random.randint(40, 60),
            "focus_score": random.randint(35, 55),
            "motivational_quote": quote
        }
