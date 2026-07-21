import os
import csv

# Target emotions: motivated, stressed, burned_out, confused, calm, anxious
data = [
    # Motivated
    ("I am feeling really excited to study today. I'm ready to crush my goals!", "motivated"),
    ("I just finished my math homework and I feel so productive and happy.", "motivated"),
    ("I want to learn as much as possible today, feeling super energized.", "motivated"),
    ("Let's do this! Ready to ace my upcoming tests and study hard.", "motivated"),
    ("I have a clear plan for studying today and I am eager to start.", "motivated"),
    ("I feel highly inspired to work on my project. I know I can do it.", "motivated"),
    ("Learning new concepts today was so satisfying and fun.", "motivated"),
    ("I feel focused, determined, and ready to get top marks.", "motivated"),
    ("Study streak is active! Feeling excited to keep it going.", "motivated"),
    ("I am in the zone today, ready to learn and make progress.", "motivated"),
    ("I have a lot of energy to study and complete all my assignments.", "motivated"),
    ("My motivation is super high. I love studying when I feel like this.", "motivated"),
    ("Ready to learn! Let's get through this study plan.", "motivated"),
    ("I'm feeling positive about my exams and excited to prepare.", "motivated"),
    ("Crushed my goals today, feeling awesome and eager for tomorrow.", "motivated"),
    ("I am feeling good and ready to study.", "motivated"),
    ("Feeling good and ready to get top marks today.", "motivated"),

    # Stressed
    ("I have three assignments due this week. I keep trying to study, but I can't focus and I feel overwhelmed.", "stressed"),
    ("There is too much work to do. I feel so pressured and stressed out.", "stressed"),
    ("The deadline is tomorrow and I haven't even started. I am panicking.", "stressed"),
    ("My head hurts from studying so much, but I can't stop. So much pressure.", "stressed"),
    ("I have so many exams coming up and I don't have enough time. I'm drowning.", "stressed"),
    ("I feel overwhelmed by the sheer volume of material I need to cover.", "stressed"),
    ("I'm trying to manage my time, but everything is piling up and I'm stressed.", "stressed"),
    ("Too many deadlines, too little time. I feel so anxious and tense.", "stressed"),
    ("I can't cope with this heavy workload anymore. It is too stressful.", "stressed"),
    ("My parents expect so much from me, and the academic pressure is killing me.", "stressed"),
    ("I keep thinking about all the things I have to finish and it's making me crazy.", "stressed"),
    ("Stressed about my math final. I don't feel ready at all.", "stressed"),
    ("My schedule is packed and I have no breathing room. Feeling highly stressed.", "stressed"),
    ("I have to submit this project in two hours and nothing is working.", "stressed"),
    ("I feel completely overloaded with homework and chores.", "stressed"),
    ("Things are not going good. I feel so overwhelmed.", "stressed"),

    # Burned Out
    ("I am so tired. I have no energy to study and I just want to sleep for days.", "burned_out"),
    ("I feel completely exhausted and drained. I don't care about my grades anymore.", "burned_out"),
    ("No matter how much I sleep, I still feel tired and unmotivated to study.", "burned_out"),
    ("I have lost all interest in my classes. I feel totally burned out.", "burned_out"),
    ("My brain is completely fried. I can't absorb any more information.", "burned_out"),
    ("I've been studying non-stop for weeks and now I just feel empty and numb.", "burned_out"),
    ("I feel like I'm running on empty. Studying feels completely pointless.", "burned_out"),
    ("I just want to quit. I have zero motivation and zero energy.", "burned_out"),
    ("Exhausted by this semester. I'm physically and mentally drained.", "burned_out"),
    ("I can't bring myself to open my books. I'm totally checked out.", "burned_out"),
    ("I feel like a zombie. I have no drive or passion left for learning.", "burned_out"),
    ("Chronic fatigue and lack of interest. Classic burnout from studying too much.", "burned_out"),
    ("My brain refuses to cooperate. I am completely depleted.", "burned_out"),
    ("I am sick of studying. I need a massive break from school.", "burned_out"),
    ("I feel totally disengaged and tired of all these endless exams.", "burned_out"),
    ("I feel so dull today, nothing seems interesting.", "burned_out"),
    ("Everything feels dull and boring. I have no drive to study.", "burned_out"),
    ("I am feeling dull and empty inside. Just exhausted.", "burned_out"),
    ("Studying feels so monotonous and dull. I can't focus.", "burned_out"),
    ("My mind is feeling dull and lazy. I have no energy.", "burned_out"),
    ("I feel extremely dull, uninspired, and sluggish today.", "burned_out"),
    ("I am not feeling good today. Everything is hard.", "burned_out"),
    ("I'm not doing well, feel very down and tired.", "burned_out"),
    ("Not feeling good at all. Brain is exhausted.", "burned_out"),

    # Confused
    ("I don't understand this physics chapter at all. The formulas make no sense.", "confused"),
    ("I am so lost in class. The professor is teaching too fast and I am confused.", "confused"),
    ("I've been trying to solve this coding problem for hours, but I'm totally stuck.", "confused"),
    ("The textbook explanations are so confusing. I don't know what to do.", "confused"),
    ("I feel baffled by this chemistry topic. None of the steps are clear.", "confused"),
    ("I am stuck on this step and don't know how to proceed. It's so frustrating.", "confused"),
    ("The lecture was super complicated today. I have no idea what the assignment is asking.", "confused"),
    ("I'm confused about the difference between these two concepts.", "confused"),
    ("I need help. The instructions for this project are extremely unclear.", "confused"),
    ("Nothing is making sense today. My mind feels scattered and muddled.", "confused"),
    ("I'm trying to follow the tutorial, but I'm getting errors and don't understand why.", "confused"),
    ("I feel completely puzzled by this theorem. Can someone explain it?", "confused"),
    ("I keep getting different answers for the same math problem. I'm so lost.", "confused"),
    ("This assignment prompt is written in a very confusing way. I'm stuck.", "confused"),
    ("I don't know where to start or what formulas to apply here.", "confused"),

    # Calm
    ("I feel peaceful and relaxed today. I'm ready to study at a steady pace.", "calm"),
    ("I have finished my tasks and feel very content and calm.", "calm"),
    ("Listening to low-fi music while studying. Feeling relaxed and at peace.", "calm"),
    ("I have a good plan, there is no rush, and I am studying calmly.", "calm"),
    ("My mind is clear, and I feel relaxed about my upcoming exams.", "calm"),
    ("I'm taking things one step at a time. Feeling patient and steady.", "calm"),
    ("It's a quiet afternoon, and I feel very tranquil and ready to read.", "calm"),
    ("I feel balanced, focused, and composed today.", "calm"),
    ("Studying is going smoothly. No stress, just calm progress.", "calm"),
    ("I took a deep breath, and now I feel centered and peaceful.", "calm"),
    ("My preparation is on track. I feel relaxed and confident.", "calm"),
    ("I am enjoying my study session. The environment is so quiet and peaceful.", "calm"),
    ("Taking a slow study session today. Feeling serene and content.", "calm"),
    ("I'm in a good headspace. Calm, focused, and ready to learn.", "calm"),
    ("Everything is under control. Feeling very relaxed and steady.", "calm"),
    ("I am feeling good, calm, and relaxed.", "calm"),
    ("Everything is going fine and I am feeling good.", "calm"),
    ("Taking a quiet study session, feeling good.", "calm"),

    # Anxious
    ("I am so worried about my final grades. I can't stop thinking about failing.", "anxious"),
    ("My heart is racing because I have a presentation tomorrow. I feel so nervous.", "anxious"),
    ("I feel extremely anxious about my performance. What if I make a mistake?", "anxious"),
    ("I can't sleep because I'm terrified of this math exam. I feel so uneasy.", "anxious"),
    ("I am so nervous about the results. I'm shaking just thinking about it.", "anxious"),
    ("I feel a constant sense of dread and anxiety about my academic future.", "anxious"),
    ("I'm scared I won't get into my dream college. The anxiety is paralyzing.", "anxious"),
    ("I have a panic feeling in my chest about this test. I'm not ready.", "anxious"),
    ("I feel very tense, jittery, and anxious about the upcoming presentation.", "anxious"),
    ("I keep worrying that I will forget everything during the exam.", "anxious"),
    ("I'm feeling very insecure and anxious about my test-taking abilities.", "anxious"),
    ("The thought of public speaking in class makes me feel so anxious and scared.", "anxious"),
    ("I am worried sick about this grading scale. I feel so apprehensive.", "anxious"),
    ("I feel restless and anxious, my hands are sweaty, and I can't concentrate.", "anxious"),
    ("What if I fail this semester? I feel so nervous and anxious about the outcome.", "anxious"),
    ("I don't feel good. I'm too anxious to study.", "anxious")
]

# Write to CSV
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
dataset_dir = os.path.join(base_dir, "dataset")
os.makedirs(dataset_dir, exist_ok=True)
csv_path = os.path.join(dataset_dir, "emotion_data.csv")

with open(csv_path, mode="w", newline="", encoding="utf-8") as f:
    writer = csv.writer(f)
    writer.writerow(["text", "label"])
    writer.writerows(data)

print(f"Dataset generated with {len(data)} rows at: {csv_path}")
