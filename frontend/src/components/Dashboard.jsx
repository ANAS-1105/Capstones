import React, { useState, useEffect } from "react";
import { 
  Smile, Frown, Sparkles, Brain, CheckSquare, Plus, Trash2, 
  Mic, Clock, AlertTriangle, Coffee, BookOpen, Heart, RefreshCw, Volume2 
} from "lucide-react";

export default function Dashboard({ token, showNotification }) {
  const [journalText, setJournalText] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  
  // Goals State
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  
  // Quick Sample Prompts for ease of testing
  const samplePrompts = [
    { text: "I have three assignments due this week. I keep trying to study, but I can't focus and I feel overwhelmed.", label: "Stressed" },
    { text: "I am feeling really excited to study today. I'm ready to crush my goals!", label: "Motivated" },
    { text: "I don't understand this physics chapter at all. The formulas make no sense.", label: "Confused" },
    { text: "I am so tired. I have no energy to study and I just want to sleep for days.", label: "Burned Out" }
  ];

  const API_URL = "http://127.0.0.1:8000/api";

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

  useEffect(() => {
    fetchGoals();
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
        body: JSON.stringify({ text: textToAnalyze })
      });

      if (res.ok) {
        const data = await res.json();
        setAnalysisResult(data);
        showNotification(`Mood analyzed: ${getEmotionEmoji(data.emotion)} ${capitalize(data.emotion)}!`, "success");
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

  // Text-to-speech option for simulated support
  const handleSpeakText = (text) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      window.speechSynthesis.speak(utterance);
    } else {
      showNotification("Text-to-speech is not supported in this browser.", "error");
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
                
                {/* Motivational Quote Button / Text-to-speech */}
                <button
                  onClick={() => handleSpeakText(analysisResult.study_plan.motivational_quote)}
                  className="px-4 py-2 rounded-xl bg-white/20 dark:bg-black/20 hover:bg-white/30 dark:hover:bg-black/30 border border-white/30 dark:border-black/10 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider transition"
                >
                  <Volume2 className="w-4 h-4" /> Listen Quote
                </button>
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

                {/* Exercises & Scores */}
                <div className="glass-card rounded-3xl p-6 border space-y-4">
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
                    <Coffee className="w-5 h-5 text-amber-500" />
                    Mindfulness & Exercises
                  </h4>
                  <div className="p-4 rounded-2xl bg-amber-50/50 dark:bg-amber-950/10 border border-amber-100 dark:border-amber-950">
                    <div className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Relaxation Method</div>
                    <p className="text-sm text-gray-700 dark:text-gray-300 mt-1 font-medium">
                      {analysisResult.study_plan.relaxation_exercise}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center">
                      <div className="text-xs text-gray-400">Focus Index</div>
                      <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
                        {analysisResult.study_plan.focus_score}/100
                      </div>
                    </div>
                    <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800/40 border border-gray-100 dark:border-gray-800 text-center">
                      <div className="text-xs text-gray-400">Productivity Est.</div>
                      <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
                        {analysisResult.study_plan.productivity_score}%
                      </div>
                    </div>
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
        </div>

      </div>
    </div>
  );
}
