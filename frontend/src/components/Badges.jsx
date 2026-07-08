import React, { useState, useEffect } from "react";
import { Award, Lock, ShieldCheck, Flame, Compass, Star, Sunset } from "lucide-react";

export default function Badges({ token, showNotification }) {
  const [unlockedBadges, setUnlockedBadges] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = import.meta.env.VITE_API_URL || `http://${window.location.hostname}:8000/api`;

  const fetchBadges = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/badges`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.ok ? await res.json() : [];
        setUnlockedBadges(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBadges();
  }, [token]);

  const allBadges = [
    {
      name: "7-Day Focus Streak",
      description: "Log your academic journal on 7 distinct days to build a robust habit.",
      icon: Flame,
      color: "from-orange-500 to-amber-500 text-orange-500",
      bg: "bg-orange-50 dark:bg-orange-950/10 border-orange-200 dark:border-orange-950"
    },
    {
      name: "Consistency Champion",
      description: "Complete 5 or more goals from your daily study checklist.",
      icon: ShieldCheck,
      color: "from-emerald-500 to-teal-500 text-emerald-500",
      bg: "bg-emerald-50 dark:bg-emerald-950/10 border-emerald-200 dark:border-emerald-950"
    },
    {
      name: "Stress Buster",
      description: "Transition successfully from a Stressed/Anxious mood state to a Calm/Motivated state.",
      icon: Compass,
      color: "from-sky-500 to-indigo-500 text-sky-500",
      bg: "bg-sky-50 dark:bg-sky-950/10 border-sky-200 dark:border-sky-950"
    },
    {
      name: "Early Bird",
      description: "Submit a reflection early in the morning (between 4 AM and 8 AM) to start the day.",
      icon: Sunset,
      color: "from-rose-500 to-purple-500 text-rose-500",
      bg: "bg-rose-50 dark:bg-rose-950/10 border-rose-200 dark:border-rose-950"
    }
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-outfit">
          Achievement Badges
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Complete daily actions, study logs, and goals to unlock gamified awards.
        </p>
      </div>

      {/* Badges Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {allBadges.map((badge, idx) => {
          const isUnlocked = unlockedBadges.includes(badge.name);
          const Icon = badge.icon;
          
          return (
            <div 
              key={idx}
              className={`rounded-3xl p-6 border flex gap-5 transition duration-300 relative overflow-hidden group ${
                isUnlocked 
                  ? `${badge.bg} hover:shadow-lg hover:shadow-gray-200/20` 
                  : "bg-gray-50/50 dark:bg-gray-900/10 border-gray-200 dark:border-gray-900/60"
              }`}
            >
              {/* Colored background blob for unlocked ones */}
              {isUnlocked && (
                <div className="absolute -right-12 -bottom-12 w-28 h-28 bg-gradient-to-br from-primary-400 to-sky-400 rounded-full blur-2xl opacity-10 group-hover:scale-125 transition duration-500" />
              )}

              {/* Badge Icon */}
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center border shadow-sm ${
                  isUnlocked 
                    ? `bg-white dark:bg-gray-800 border-white dark:border-gray-700 shadow-gray-200/50` 
                    : "bg-gray-100 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-400"
                }`}>
                  {isUnlocked ? (
                    <Icon className={`w-8 h-8 ${badge.color.split(" ").slice(-1)[0]}`} />
                  ) : (
                    <Lock className="w-6 h-6 text-gray-400 dark:text-gray-700" />
                  )}
                </div>
              </div>

              {/* Badge details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className={`font-bold font-outfit text-lg ${
                    isUnlocked ? "text-gray-900 dark:text-white" : "text-gray-400 dark:text-gray-600"
                  }`}>
                    {badge.name}
                  </h3>
                  {isUnlocked && (
                    <span className="text-[10px] uppercase tracking-wider font-extrabold bg-primary-100 dark:bg-primary-950/40 text-primary-600 dark:text-primary-400 px-2 py-0.5 rounded-full">
                      Unlocked
                    </span>
                  )}
                </div>
                <p className={`text-sm leading-relaxed ${
                  isUnlocked ? "text-gray-600 dark:text-gray-400" : "text-gray-400 dark:text-gray-700"
                }`}>
                  {badge.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Helper Tips */}
      <div className="p-6 rounded-3xl bg-primary-50/50 dark:bg-primary-950/10 border border-primary-100 dark:border-primary-950/60 max-w-2xl">
        <h4 className="text-sm font-bold text-primary-700 dark:text-primary-400 uppercase tracking-wider flex items-center gap-2">
          <Award className="w-4 h-4" /> Gamification Hint
        </h4>
        <p className="text-sm text-primary-900/80 dark:text-primary-300 mt-2 leading-relaxed">
          Complete a single checklist goal and submit your first reflection to immediately claim your beginner consistency rewards! The system recalculates your statuses on every single action.
        </p>
      </div>

    </div>
  );
}
