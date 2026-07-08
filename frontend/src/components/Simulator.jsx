import React, { useState, useEffect } from "react";
import { Sliders, HelpCircle, Activity, Heart, ShieldAlert, Sparkles, Smile, RefreshCw } from "lucide-react";

export default function Simulator() {
  // Inputs
  const [sleepHours, setSleepHours] = useState(7);
  const [distractions, setDistractions] = useState(2);
  const [hoursStudied, setHoursStudied] = useState(3);
  const [moodRating, setMoodRating] = useState(4);
  const [consistency, setConsistency] = useState(7);
  const [upcomingExams, setUpcomingExams] = useState(1);

  // Simulated Outputs
  const [focusScore, setFocusScore] = useState(75);
  const [successProb, setSuccessProb] = useState(80);
  const [stressLevel, setStressLevel] = useState(35);
  const [burnoutRisk, setBurnoutRisk] = useState("Low");

  // Run simulation calculation
  useEffect(() => {
    // 1. Focus Score Calculation
    let baseFocus = 75;
    
    // Adjust by Sleep
    if (sleepHours < 6) {
      baseFocus -= (6 - sleepHours) * 12;
    } else if (sleepHours > 7.5) {
      baseFocus += 5;
    }
    
    // Adjust by Distractions
    baseFocus -= distractions * 4.5;
    
    // Adjust by Mood
    baseFocus += (moodRating - 3) * 5;
    
    // Adjust by Study hours (too much drains focus)
    if (hoursStudied > 6) {
      baseFocus -= (hoursStudied - 6) * 7;
    }
    
    const finalFocus = Math.max(10, min(100, Math.round(baseFocus)));
    setFocusScore(finalFocus);

    // 2. Success Probability
    let baseSuccess = 45;
    baseSuccess += consistency * 3.5;
    baseSuccess += (sleepHours - 5.0) * 3;
    baseSuccess -= distractions * 3.5;
    baseSuccess -= upcomingExams * 1.5;
    baseSuccess += (moodRating - 3) * 3;

    const finalSuccess = Math.max(15, min(98, Math.round(baseSuccess)));
    setSuccessProb(finalSuccess);

    // 3. Stress Level Simulation
    let baseStress = 40;
    baseStress += upcomingExams * 15;
    baseStress += distractions * 3.5;
    baseStress -= (sleepHours - 5.0) * 5;
    if (hoursStudied > 6.0) {
      baseStress += (hoursStudied - 6.0) * 8;
    }
    baseStress -= consistency * 1.5;

    const finalStress = Math.max(10, min(95, Math.round(baseStress)));
    setStressLevel(finalStress);

    // 4. Burnout Risk
    if (sleepHours < 5.0 || hoursStudied > 7.0 || (finalStress > 75 && consistency >= 8)) {
      setBurnoutRisk("High");
    } else if (sleepHours < 6.0 || finalStress > 50 || hoursStudied > 5.0) {
      setBurnoutRisk("Moderate");
    } else {
      setBurnoutRisk("Low");
    }
  }, [sleepHours, distractions, hoursStudied, moodRating, consistency, upcomingExams]);

  const min = (a, b) => (a < b ? a : b);

  const getBurnoutColor = (risk) => {
    if (risk === "High") return "text-rose-500 bg-rose-50 dark:bg-rose-950/20 border-rose-200 dark:border-rose-800";
    if (risk === "Moderate") return "text-amber-500 bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800";
    return "text-emerald-500 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-800";
  };

  const getGaugeColor = (score, isLowBetter = false) => {
    if (isLowBetter) {
      if (score < 40) return "bg-emerald-500";
      if (score < 70) return "bg-amber-500";
      return "bg-rose-500";
    } else {
      if (score > 75) return "bg-emerald-500";
      if (score > 45) return "bg-amber-500";
      return "bg-rose-500";
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-outfit">
          "What-If?" Study Habit Simulator
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Tweak your sleep, hours studied, and distractions to see how your focus, stress, and success rates change.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        
        {/* Left Column: Sliders Form (3 cols span) */}
        <div className="lg:col-span-3 glass-card rounded-3xl p-6 border space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 dark:border-gray-800 pb-4">
            <div className="p-2.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-500">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">Adjust Study Variables</h2>
              <p className="text-xs text-gray-400">Drag the sliders to change your simulated day.</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Sleep Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Sleep Duration</span>
                <span className="font-bold text-primary-500">{sleepHours} Hours</span>
              </div>
              <input
                type="range"
                min="3"
                max="10"
                step="0.5"
                value={sleepHours}
                onChange={(e) => setSleepHours(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
              />
              <p className="text-[10px] text-gray-400">Sleep deprivation drastically reduces focus. 7.5+ hours is optimal.</p>
            </div>

            {/* Distractions Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Distraction Level</span>
                <span className="font-bold text-primary-500">{distractions}/10</span>
              </div>
              <input
                type="range"
                min="0"
                max="10"
                value={distractions}
                onChange={(e) => setDistractions(parseInt(e.target.value))}
                className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
              />
              <p className="text-[10px] text-gray-400">Phone notifications, tabs open, or noise during studies.</p>
            </div>

            {/* Hours Studied Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-semibold text-gray-700 dark:text-gray-300">Hours Studied Today</span>
                <span className="font-bold text-primary-500">{hoursStudied} Hours</span>
              </div>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                value={hoursStudied}
                onChange={(e) => setHoursStudied(parseFloat(e.target.value))}
                className="w-full h-2 rounded-lg bg-gray-200 dark:bg-gray-800 appearance-none cursor-pointer accent-primary-500"
              />
              <p className="text-[10px] text-gray-400">Studying over 6 hours without rest triggers severe cognitive overload.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Mood Rating */}
              <div className="space-y-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Mood Rating</label>
                <select
                  value={moodRating}
                  onChange={(e) => setMoodRating(parseInt(e.target.value))}
                  className="w-full text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                >
                  <option value="5">Excellent (5/5)</option>
                  <option value="4">Good (4/5)</option>
                  <option value="3">Neutral (3/5)</option>
                  <option value="2">Low (2/5)</option>
                  <option value="1">Bad (1/5)</option>
                </select>
              </div>

              {/* Consistency */}
              <div className="space-y-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Consistency (1-10)</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={consistency}
                  onChange={(e) => setConsistency(parseInt(e.target.value))}
                  className="w-full text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>

              {/* Upcoming Exams */}
              <div className="space-y-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-900/40 border border-gray-100 dark:border-gray-800">
                <label className="block text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Upcoming Exams</label>
                <input
                  type="number"
                  min="0"
                  max="10"
                  value={upcomingExams}
                  onChange={(e) => setUpcomingExams(parseInt(e.target.value))}
                  className="w-full text-xs font-medium rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 p-2 text-gray-900 dark:text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Output Gauges (2 cols span) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-card rounded-3xl p-6 border space-y-6">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary-500" />
              Simulated Predictions
            </h3>

            {/* Focus level gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Expected Focus Score</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{focusScore}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getGaugeColor(focusScore)}`} 
                  style={{ width: `${focusScore}%` }} 
                />
              </div>
            </div>

            {/* Success probability gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Success Probability (Goals)</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{successProb}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getGaugeColor(successProb)}`} 
                  style={{ width: `${successProb}%` }} 
                />
              </div>
            </div>

            {/* Stress level gauge */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-gray-500 dark:text-gray-400">Estimated Stress Level</span>
                <span className="font-extrabold text-gray-900 dark:text-white">{stressLevel}%</span>
              </div>
              <div className="w-full h-3 rounded-full bg-gray-100 dark:bg-gray-900 overflow-hidden">
                <div 
                  className={`h-full transition-all duration-300 ${getGaugeColor(stressLevel, true)}`} 
                  style={{ width: `${stressLevel}%` }} 
                />
              </div>
            </div>

            {/* Burnout risk badge */}
            <div className={`p-4 rounded-2xl border flex items-center justify-between transition ${getBurnoutColor(burnoutRisk)}`}>
              <span className="text-xs font-bold uppercase tracking-wider">Burnout Risk</span>
              <span className="text-sm font-black">{burnoutRisk}</span>
            </div>
          </div>

          {/* Coach's Advice */}
          <div className="glass-card rounded-3xl p-6 border space-y-3">
            <h4 className="text-sm font-bold text-indigo-500 uppercase tracking-wider flex items-center gap-2">
              <Heart className="w-4 h-4" /> Coach's Simulation Advice
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              {sleepHours < 6.0 && (
                "⚠️ Sleeping under 6 hours lowers your Focus score by at least 15-20%. Sleep is your brain's study booster."
              )}
              {distractions > 4 && (
                " 📳 Cellphone or social media notifications are killing your success probability. Put your phone in another room."
              )}
              {hoursStudied > 6 && (
                " 🛑 Studying 6+ hours consecutively creates high mental fatigue. Take a break to lock in what you've learned."
              )}
              {sleepHours >= 7 && distractions <= 2 && hoursStudied <= 5 && (
                " ✨ Perfect Study Environment! This configuration optimizes memory consolidation and focus index. Excellent job."
              )}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
