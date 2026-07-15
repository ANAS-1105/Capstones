import React, { useState, useEffect } from "react";
import { 
  Smile, Frown, Sparkles, Brain, CheckSquare, Plus, Trash2, 
  Mic, Clock, AlertTriangle, Coffee, BookOpen, Heart, RefreshCw, Volume2,
  Sliders, Activity, ShieldAlert
} from "lucide-react";

const METHOD_EXPLAINERS = {
  // Learning Methods
  "Feynman Technique & Practice Quizzes": {
    title: "Feynman Technique",
    desc: "Explain the topic aloud in very simple terms, as if teaching a 10-year-old child. This exposes gaps in your memory, which you review in your textbooks, followed by testing yourself with practice questions."
  },
  "Pomodoro Technique (Single Task Focus)": {
    title: "Pomodoro Technique",
    desc: "Set a timer. Work with absolute focus on a single task for 25 minutes, then stop. Take a 10-minute restorative break. Repeat this cycle to prevent mental burnout."
  },
  "Low-Intensity Reading / Flashcards": {
    title: "Low-Intensity Active Recall",
    desc: "Due to exhaustion, avoid long lectures. Instead, look at small chunks of text or flashcards. Test your memory briefly without pushing your brain too hard."
  },
  "Mind Mapping & Visual Video Tutorials": {
    title: "Mind Mapping",
    desc: "Draw a central topic on a page, and branch it into sub-concepts using colors and drawings. Then, watch a simple 5-minute video tutorial to visually connect the terms."
  },
  "SQ3R Method (Survey, Question, Read, Recite, Review)": {
    title: "SQ3R Method",
    desc: "Survey (scan headings), Question (turn headings into questions), Read (look for answers), Recite (summarize key paragraphs out loud), and Review (quiz yourself on the concepts)."
  },
  "Practice Quizzes (low stakes) & Verbal Recall": {
    title: "Practice Quizzing",
    desc: "Close your notes and write down everything you remember, or answer mock questions. Forcing your brain to retrieve answers builds stronger neural pathways."
  },
  
  // Revision schedules
  "Standard Active Recall (1-day, 3-day, 7-day review)": {
    title: "Standard Active Recall",
    desc: "Review your notes 1 day after learning, then 3 days, and then 7 days later. This timing forces information into your long-term memory."
  },
  "Light summary review cards": {
    title: "Light Summary Review",
    desc: "Do not read full textbooks. Read a 1-page cheat sheet or bullet points to refresh your mind without building stress."
  },
  "No heavy revision today, prioritize recovery": {
    title: "Prioritize Recovery",
    desc: "Close all textbooks. Your brain is currently overloaded. Give it a full day off to rest, sleep, and rebuild cognitive capacity."
  },
  "Immediate review after clarifying basic terms": {
    title: "Immediate Review",
    desc: "As soon as you find a simple definition for a confusing term, review the chapter immediately so the new knowledge sets in."
  },
  "Spaced Repetition System (SRS) review": {
    title: "Spaced Repetition (SRS)",
    desc: "Study cards using software or folders. Cards you get wrong are reviewed frequently; cards you get right are pushed days away."
  },
  "Daily revision summary cards": {
    title: "Daily Summary Cards",
    desc: "Spend just 5 minutes before bed scanning a quick summary card of today's key ideas to strengthen retention."
  },

  // Relaxation Methods
  "Victory lap walk or dynamic stretching": {
    title: "Victory Lap Walk",
    desc: "Walk around the room or stretch your shoulders, neck, and back dynamically for 5 minutes. Moving your body spikes oxygen flow to your brain."
  },
  "4-7-8 Breathing Exercise (Inhale 4s, Hold 7s, Exhale 8s)": {
    title: "4-7-8 Breathing",
    desc: "Inhale quietly through your nose for 4 seconds. Hold your breath for 7 seconds. Exhale audibly through your mouth for 8 seconds. Repeat 4 times to stop panic."
  },
  "Progressive Muscle Relaxation or a 20-minute power nap": {
    title: "Progressive Muscle Relaxation",
    desc: "Tense a muscle group (like your shoulders) for 5 seconds, then release it completely. Repeat for all muscles or take a quick 20-minute power nap."
  },
  "Eye-strain relief exercises and a cool glass of water": {
    title: "Eye-Strain Relief",
    desc: "Look away from screens at an object 20 feet away for 20 seconds. Drink a cool glass of water to refresh your body."
  },
  "Mindful listening to a calming low-fi track": {
    title: "Mindful Listening",
    desc: "Close your eyes, put on a calming background track, and focus entirely on the instruments for 3 minutes to silence racing academic thoughts."
  },
  "5-4-3-2-1 Grounding Technique (Name 5 sights, 4 feels, 3 sounds...)": {
    title: "5-4-3-2-1 Grounding",
    desc: "Acknowledge 5 things you see, 4 you feel physically, 3 you hear, 2 you smell, and 1 you taste. This grounds your mind back to safety."
  }
};

export default function Dashboard({ token, showNotification }) {
  const [journalText, setJournalText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Goals State
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);

  // Multivariate Coach Inputs
  const [hoursStudied, setHoursStudied] = useState(2);
  const [sleepHours, setSleepHours] = useState(7);
  const [upcomingExams, setUpcomingExams] = useState(0);
  const [moodRating, setMoodRating] = useState(4);
  const [consistency, setConsistency] = useState(7);
  const [distractions, setDistractions] = useState(2);

  // Coach Profile States (Study DNA / Future Self / Insights)
  const [coachProfile, setCoachProfile] = useState(null);
  const [isLoadingProfile, setIsLoadingProfile] = useState(true);
  
  // Quick Sample Prompts for ease of testing
  const samplePrompts = [
    { text: "I have three assignments due this week. I keep trying to study, but I can't focus and I feel overwhelmed.", label: "Stressed" },
    { text: "I am feeling really excited to study today. I'm ready to crush my goals!", label: "Motivated" },
    { text: "I don't understand this physics chapter at all. The formulas make no sense.", label: "Confused" },
    { text: "I am so tired. I have no energy to study and I just want to sleep for days.", label: "Burned Out" }
  ];

  const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;

  // Fetch Goals
  const fetchGoals = async () => {
    try {
      const res = await fetch(`${API_URL}/goals`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setGoals(data);
      }
    } catch (err) {
      console.error("Failed to fetch goals:", err);
    }
  };

  // Fetch Coach Profile (Study DNA, Projections, Insights)
  const fetchCoachProfile = async () => {
    try {
      const res = await fetch(`${API_URL}/coach/profile`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setCoachProfile(data);
      }
    } catch (err) {
      console.error("Failed to fetch coach profile:", err);
    } finally {
      setIsLoadingProfile(false);
    }
  };

  useEffect(() => {
    fetchGoals();
    fetchCoachProfile();
  }, [token]);

  // Handle Journal Submission
  const handleAnalyze = async (textToAnalyze = journalText) => {
    if (!textToAnalyze.trim()) {
      showNotification("Please write something about how you are feeling.", "error");
      return;
    }
    if (textToAnalyze.length < 10) {
      showNotification("Please write at least 10 characters so the AI can understand.", "error");
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          text: textToAnalyze,
          hours_studied: Number(hoursStudied),
          sleep_hours: Number(sleepHours),
          upcoming_exams: Number(upcomingExams),
          mood_rating: Number(moodRating),
          consistency: Number(consistency),
          distractions: Number(distractions)
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        showNotification(`Mood analyzed: ${getEmotionEmoji(data.emotion)} ${capitalize(data.emotion)}!`, "success");
        // Update Coach Profile and insights in real time!
        fetchCoachProfile();
      } else {
        const errData = await res.json();
        showNotification(errData.detail || "Analysis failed", "error");
      }
    } catch (err) {
      showNotification("Unable to connect to the backend server.", "error");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Add Goal
  const handleAddGoal = async (e) => {
    e.preventDefault();
    if (!newGoal.trim()) return;
    setIsAddingGoal(true);
    try {
      const res = await fetch(`${API_URL}/goals`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title: newGoal })
      });
      if (res.ok) {
        setNewGoal("");
        fetchGoals();
        showNotification("Goal added successfully!", "success");
      }
    } catch (err) {
      showNotification("Failed to add goal", "error");
    } finally {
      setIsAddingGoal(false);
    }
  };

  // Toggle Goal Status
  const handleToggleGoal = async (goalId, currentStatus) => {
    try {
      const res = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ completed: !currentStatus })
      });
      if (res.ok) {
        setGoals(goals.map(g => g._id === goalId ? { ...g, completed: !currentStatus } : g));
        showNotification("Goal status updated!", "success");
      }
    } catch (err) {
      showNotification("Failed to update goal", "error");
    }
  };

  // Delete Goal
  const handleDeleteGoal = async (goalId) => {
    try {
      const res = await fetch(`${API_URL}/goals/${goalId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setGoals(goals.filter(g => g._id !== goalId));
        showNotification("Goal deleted", "info");
      }
    } catch (err) {
      showNotification("Failed to delete goal", "error");
    }
  };



  // Simulated Voice-to-Text
  const handleVoiceInput = () => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = 'en-US';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      showNotification("Listening... Speak now.", "info");
      recognition.start();

      recognition.onresult = (event) => {
        const speechResult = event.results[0][0].transcript;
        setJournalText(speechResult);
        showNotification("Voice capture successful!", "success");
      };

      recognition.onerror = (event) => {
        console.error(event.error);
        showNotification("Voice recognition failed: " + event.error, "error");
      };
    } else {
      // Fallback description for local environment
      const demo = "I have a big final exam tomorrow and my heart is beating fast. I feel so nervous and anxious about failing.";
      setJournalText(demo);
      showNotification("SpeechRecognition API not supported. Inserted mock speech text.", "info");
    }
  };

  const getEmotionEmoji = (emotion) => {
    const emojis = {
      motivated: "😊",
      stressed: "😰",
      burned_out: "😔",
      confused: "😕",
      calm: "😌",
      anxious: "😟"
    };
    return emojis[emotion.toLowerCase()] || "😌";
  };

  const getEmotionColor = (emotion) => {
    const colors = {
      motivated: "text-emerald-500 bg-emerald-50 border-emerald-200 dark:bg-emerald-950/20 dark:border-emerald-800",
      stressed: "text-rose-500 bg-rose-50 border-rose-200 dark:bg-rose-950/20 dark:border-rose-800",
      burned_out: "text-indigo-500 bg-indigo-50 border-indigo-200 dark:bg-indigo-950/20 dark:border-indigo-800",
      confused: "text-amber-500 bg-amber-50 border-amber-200 dark:bg-amber-950/20 dark:border-amber-800",
      calm: "text-sky-500 bg-sky-50 border-sky-200 dark:bg-sky-950/20 dark:border-sky-800",
      anxious: "text-purple-500 bg-purple-50 border-purple-200 dark:bg-purple-950/20 dark:border-purple-800"
    };
    return colors[emotion.toLowerCase()] || "text-gray-500 bg-gray-50 border-gray-200";
  };

  const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1).replace("_", " ");

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Intro Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-outfit">
            Study Space Dashboard
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Track your emotions, set goals, and unlock customized study systems.
          </p>
        </div>
        
        {/* Streak & Active Info */}
        <div className="flex gap-4">
          <div className="px-4 py-2 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-500 animate-pulse" />
            <div>
              <div className="text-xs text-amber-600 dark:text-amber-400 font-medium">Daily Streak</div>
              <div className="text-sm font-bold text-gray-900 dark:text-white">Active session</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid: Journaling vs Goals */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Emotion Tracker & Journal (2 cols span on large screens) */}
        <div className="lg:col-span-2 space-y-8">
          <div className="glass-card rounded-3xl p-6 shadow-sm border">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 rounded-2xl bg-primary-100 dark:bg-primary-950/30 text-primary-500">
                <Brain className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">How are you feeling today?</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">Write a reflection or record your thoughts to analyze your emotional state.</p>
              </div>
            </div>

            {/* Input area */}
            <div className="relative">
              <textarea
                value={journalText}
                onChange={(e) => setJournalText(e.target.value)}
                placeholder="Write your study mood... (e.g., I'm feeling really stressed because of the maths exam tomorrow and I keep losing focus.)"
                rows={5}
                className="w-full rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 p-4 pr-12 text-sm text-gray-950 dark:text-white placeholder-gray-400 dark:placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 transition"
              />
              
              {/* Mic Icon for voice-to-text simulation */}
              <button
                onClick={handleVoiceInput}
                type="button"
                title="Voice Input"
                className="absolute right-3 top-3 p-2 rounded-xl text-gray-400 hover:text-primary-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
              >
                <Mic className="w-5 h-5" />
              </button>
            </div>

            {/* Demo buttons */}
            <div className="mt-3">
              <div className="text-xs font-semibold text-gray-400 dark:text-gray-600 uppercase tracking-wider mb-2">Try a sample input:</div>
              <div className="flex flex-wrap gap-2">
                {samplePrompts.map((prompt, i) => (
                  <button
                    key={i}
                    onClick={() => {
                      setJournalText(prompt.text);
                      handleAnalyze(prompt.text);
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 border border-transparent hover:border-gray-300 dark:hover:border-gray-600 transition"
                  >
                    {prompt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Coach Inputs Panel */}
            <div className="mt-6 border-t border-gray-100 dark:border-gray-800 pt-6 space-y-4">
              <h3 className="text-sm font-bold text-gray-800 dark:text-gray-200 font-outfit uppercase tracking-wider flex items-center gap-2">
                <Sliders className="w-4 h-4 text-indigo-500" />
                Daily Habits (AI Study Coach Inputs)
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hours Studied */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-500">Hours Studied Today</span>
                    <span className="font-bold text-indigo-500">{hoursStudied} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="12"
                    step="0.5"
                    value={hoursStudied}
                    onChange={(e) => setHoursStudied(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Sleep Hours */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-500">Sleep Duration</span>
                    <span className="font-bold text-indigo-500">{sleepHours} hrs</span>
                  </div>
                  <input
                    type="range"
                    min="3"
                    max="10"
                    step="0.5"
                    value={sleepHours}
                    onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                    className="w-full h-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Distractions Index */}
                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-gray-500">Distractions Level</span>
                    <span className="font-bold text-indigo-500">{distractions}/10</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    value={distractions}
                    onChange={(e) => setDistractions(parseInt(e.target.value))}
                    className="w-full h-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 appearance-none cursor-pointer accent-indigo-500"
                  />
                </div>

                {/* Mood Dropdown */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Mood Rating</label>
                  <select
                    value={moodRating}
                    onChange={(e) => setMoodRating(parseInt(e.target.value))}
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                  >
                    <option value="5">Excellent (5/5)</option>
                    <option value="4">Good (4/5)</option>
                    <option value="3">Neutral (3/5)</option>
                    <option value="2">Low (2/5)</option>
                    <option value="1">Bad (1/5)</option>
                  </select>
                </div>

                {/* Consistency */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Consistency (1-10)</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={consistency}
                    onChange={(e) => setConsistency(parseInt(e.target.value))}
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>

                {/* Upcoming Exams */}
                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-gray-400 uppercase">Upcoming Exams</label>
                  <input
                    type="number"
                    min="0"
                    max="10"
                    value={upcomingExams}
                    onChange={(e) => setUpcomingExams(parseInt(e.target.value))}
                    className="w-full text-xs font-semibold rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Submit button */}
            <div className="mt-5 flex justify-end">
              <button
                onClick={() => handleAnalyze()}
                disabled={isAnalyzing}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-primary-500 to-sky-500 hover:from-primary-600 hover:to-sky-600 text-white font-medium text-sm flex items-center gap-2 shadow-sm shadow-primary-500/10 hover:shadow-primary-600/20 disabled:opacity-50 disabled:cursor-not-allowed transition"
              >
                {isAnalyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Analyzing emotions...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Analyze Mood & Generate Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Analysis output Section */}
          {analysisResult && (
            <div className="space-y-6">
              {/* Cognitive Fatigue / Stop Warning */}
              {analysisResult.study_plan.stop_warning && (
                <div className="p-4 rounded-2xl bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 text-xs font-semibold flex items-center gap-3 animate-pulse">
                  <ShieldAlert className="w-5 h-5 flex-shrink-0 text-rose-500" />
                  <span>{analysisResult.study_plan.stop_warning}</span>
                </div>
              )}

              {/* Emotion Indicator Header */}
              <div className={`p-6 rounded-3xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 ${getEmotionColor(analysisResult.emotion)}`}>
                <div className="flex items-center gap-4">
                  <span className="text-5xl">{getEmotionEmoji(analysisResult.emotion)}</span>
                  <div>
                    <h3 className="text-2xl font-bold font-outfit">
                      Detected Emotion: {capitalize(analysisResult.emotion)}
                    </h3>
                    <p className="text-sm opacity-80 mt-0.5">
                      Your journal was successfully processed by our AI Model.
                    </p>
                  </div>
                </div>
              </div>

              {/* Study Plan Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Recommendations */}
                <div className="glass-card rounded-3xl p-6 border space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                    <Clock className="w-5 h-5 text-primary-500" />
                    Recommended Schedule
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Study Block</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {analysisResult.study_plan.study_duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Break Duration</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white">
                        {analysisResult.study_plan.break_duration} minutes
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Learning Method</span>
                      <span className="text-sm font-bold text-gray-900 dark:text-white text-right">
                        {analysisResult.study_plan.learning_method}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-500 dark:text-gray-400">Revision Track</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-white text-right">
                        {analysisResult.study_plan.revision_schedule}
                      </span>
                    </div>
                  </div>
                </div>

                {/* AI Coach Diagnostics */}
                <div className="glass-card rounded-3xl p-6 border space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                    <Activity className="w-5 h-5 text-indigo-500" />
                    AI Coach Diagnostics
                  </h4>
                  <div className="space-y-3">
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2 text-sm">
                      <span className="text-gray-500">Burnout Risk</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                        analysisResult.study_plan.burnout_risk === "High" ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20" :
                        analysisResult.study_plan.burnout_risk === "Moderate" ? "text-amber-600 bg-amber-50 dark:bg-amber-950/20" :
                        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                      }`}>
                        {analysisResult.study_plan.burnout_risk}
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2 text-sm">
                      <span className="text-gray-500">Stress Level</span>
                      <span className={`font-bold px-2 py-0.5 rounded-lg text-xs ${
                        (analysisResult.study_plan.stress_level ?? 45) > 70 ? "text-rose-600 bg-rose-50 dark:bg-rose-950/20" :
                        (analysisResult.study_plan.stress_level ?? 45) > 40 ? "text-amber-600 bg-amber-50 dark:bg-amber-950/20" :
                        "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20"
                      }`}>
                        {analysisResult.study_plan.stress_level ?? 45}%
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2 text-sm">
                      <span className="text-gray-500">Today's Success Probability</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">
                        {analysisResult.study_plan.success_probability}%
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-2 text-sm">
                      <span className="text-gray-500">Focus Index</span>
                      <span className="font-extrabold text-gray-900 dark:text-white">
                        {analysisResult.study_plan.focus_score}/100
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider block">Priority Subjects Today</span>
                      <div className="flex flex-wrap gap-1.5 mt-1">
                        {analysisResult.study_plan.priority_subjects.map((sub, idx) => (
                          <span key={idx} className="text-xs px-2.5 py-1 rounded-xl bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 font-semibold">
                            {sub}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Method Explainer Card */}
                <div className="glass-card rounded-3xl p-6 border md:col-span-2 space-y-4">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    How to Apply Your Study Plan (Decoded)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Learn method explain */}
                    {METHOD_EXPLAINERS[analysisResult.study_plan.learning_method] && (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                          📚 {METHOD_EXPLAINERS[analysisResult.study_plan.learning_method].title}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                          {METHOD_EXPLAINERS[analysisResult.study_plan.learning_method].desc}
                        </p>
                      </div>
                    )}
                    
                    {/* Revision method explain */}
                    {METHOD_EXPLAINERS[analysisResult.study_plan.revision_schedule] && (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                          🔄 {METHOD_EXPLAINERS[analysisResult.study_plan.revision_schedule].title}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                          {METHOD_EXPLAINERS[analysisResult.study_plan.revision_schedule].desc}
                        </p>
                      </div>
                    )}

                    {/* Relaxation method explain */}
                    {METHOD_EXPLAINERS[analysisResult.study_plan.relaxation_exercise] && (
                      <div className="space-y-1">
                        <div className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                          😌 {METHOD_EXPLAINERS[analysisResult.study_plan.relaxation_exercise].title}
                        </div>
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mt-1">
                          {METHOD_EXPLAINERS[analysisResult.study_plan.relaxation_exercise].desc}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* Wellness Tips & Advice */}
                <div className="glass-card rounded-3xl p-6 border md:col-span-2 space-y-3">
                  <h4 className="text-md font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500" />
                    Wellness Tips
                  </h4>
                  <ul className="space-y-2">
                    {analysisResult.study_plan.wellness_tips.map((tip, idx) => (
                      <li key={idx} className="text-sm text-gray-600 dark:text-gray-300 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary-500 mt-1.5 flex-shrink-0" />
                        {tip}
                      </li>
                    ))}
                  </ul>
                  
                  {/* Quote Banner */}
                  <div className="mt-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800 italic text-sm text-gray-500 dark:text-gray-400 text-center">
                    "{analysisResult.study_plan.motivational_quote}"
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* Right Column: Daily Goals Tracker */}
        <div className="space-y-6">
          <div className="glass-card rounded-3xl p-6 shadow-sm border h-fit space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-500">
                <CheckSquare className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">Daily Goal Sheet</h2>
                <p className="text-xs text-gray-500 dark:text-gray-400">Lock in your daily targets.</p>
              </div>
            </div>

            {/* Goal Input form */}
            <form onSubmit={handleAddGoal} className="flex gap-2">
              <input
                type="text"
                value={newGoal}
                onChange={(e) => setNewGoal(e.target.value)}
                placeholder="Enter study goal..."
                className="flex-1 text-sm rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900/80 px-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500"
              />
              <button
                type="submit"
                disabled={isAddingGoal || !newGoal.trim()}
                className="p-2.5 rounded-xl bg-primary-500 hover:bg-primary-600 text-white disabled:opacity-50 transition"
              >
                <Plus className="w-5 h-5" />
              </button>
            </form>

            {/* Goals list */}
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {goals.length === 0 ? (
                <div className="text-center py-6 text-gray-400 dark:text-gray-600 text-xs">
                  No goals defined. Add some above to keep consistent!
                </div>
              ) : (
                goals.map((g) => (
                  <div 
                    key={g._id}
                    className="flex justify-between items-center p-3 rounded-xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800/80 transition"
                  >
                    <label className="flex items-center gap-3 cursor-pointer flex-1 min-w-0">
                      <input
                        type="checkbox"
                        checked={g.completed}
                        onChange={() => handleToggleGoal(g._id, g.completed)}
                        className="w-4.5 h-4.5 rounded text-primary-500 border-gray-300 dark:border-gray-700 focus:ring-primary-500"
                      />
                      <span className={`text-sm text-gray-700 dark:text-gray-300 truncate ${g.completed ? "line-through opacity-50" : ""}`}>
                        {g.title}
                      </span>
                    </label>
                    
                    <button
                      onClick={() => handleDeleteGoal(g._id)}
                      className="text-gray-400 hover:text-rose-500 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Statistics */}
            {goals.length > 0 && (
              <div className="pt-2 border-t border-gray-100 dark:border-gray-800 flex justify-between text-xs text-gray-400">
                <span>Completed Tasks</span>
                <span className="font-bold text-gray-700 dark:text-gray-300">
                  {goals.filter(g => g.completed).length} / {goals.length} ({Math.round((goals.filter(g => g.completed).length / goals.length) * 100)}%)
                </span>
              </div>
            )}
          </div>

          {/* Study DNA Card */}
          {coachProfile && (
            <div className="glass-card rounded-3xl p-6 shadow-sm border space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-500">
                  <Brain className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">Your Study DNA</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Personalized profile based on your logs.</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Learning Style</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{coachProfile.dna.learning_style}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Best Time</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{coachProfile.dna.best_time}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Productive Subject</div>
                  <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">{coachProfile.dna.most_productive_subject}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Weakest Subject</div>
                  <div className="text-xs font-bold text-rose-500 mt-0.5">{coachProfile.dna.weakest_subject}</div>
                </div>
                <div className="p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 col-span-2">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider">Most Common Emotion</div>
                  <div className="text-xs font-bold text-gray-900 dark:text-white mt-0.5">{coachProfile.dna.most_common_emotion}</div>
                </div>
              </div>
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900 text-[11px] text-indigo-700 dark:text-indigo-400 leading-relaxed font-medium">
                💡 Optimal study session is <b>{coachProfile.dna.optimal_study_time} mins</b> with a <b>{coachProfile.dna.ideal_break} min</b> break.
              </div>
            </div>
          )}

          {/* Future Self Projection Card */}
          {coachProfile && (
            <div className="glass-card rounded-3xl p-6 shadow-sm border space-y-4 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500">
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">Future Self (30 Days)</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Projection if you maintain current habits.</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Current Progress</span>
                  <span className="font-bold text-gray-900 dark:text-white">{coachProfile.future_self.current_progress}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Projected (30 Days)</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{coachProfile.future_self.predicted_progress_30_days}%</span>
                </div>
                <div className="flex justify-between text-xs border-b border-gray-100 dark:border-gray-800 pb-2">
                  <span className="text-gray-500">Expected Stress Reduction</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">-{coachProfile.future_self.expected_stress_reduction}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Focus Potential</span>
                  <span className="font-bold text-gray-900 dark:text-white">{coachProfile.future_self.focus_improvement}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-gray-500">Exam Readiness</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{coachProfile.future_self.exam_readiness}</span>
                </div>
              </div>
            </div>
          )}

          {/* Coach Insights Panel */}
          {coachProfile && coachProfile.insights && (
            <div className="glass-card rounded-3xl p-6 shadow-sm border space-y-3 animate-fade-in">
              <h4 className="text-xs font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Coach Pattern Insights
              </h4>
              <ul className="space-y-2">
                {coachProfile.insights.map((insight, idx) => (
                  <li key={idx} className="text-xs text-gray-600 dark:text-gray-300 leading-relaxed flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                    {insight}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
