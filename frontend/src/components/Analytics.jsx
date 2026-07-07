import React, { useState, useEffect } from "react";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { 
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, 
  LineElement, BarElement, Title, Tooltip, Legend, ArcElement, Filler 
} from "chart.js";
import { TrendingUp, Award, Zap, Activity, CheckCircle, HelpCircle } from "lucide-react";

// Register ChartJS elements
ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement, BarElement, 
  ArcElement, Title, Tooltip, Legend, Filler
);

export default function Analytics({ token, showNotification }) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const API_URL = `http://${window.location.hostname}:8000/api`;

  const fetchAnalytics = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/analytics`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const result = await res.json();
        setData(result);
      } else {
        showNotification("Failed to fetch analytics", "error");
      }
    } catch (err) {
      showNotification("Could not retrieve analytics metrics.", "error");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [token]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  if (!data || data.mood_history.length === 0) {
    return (
      <div className="glass-card rounded-3xl p-10 border text-center max-w-xl mx-auto space-y-4">
        <HelpCircle className="w-16 h-16 text-gray-300 mx-auto" />
        <h2 className="text-xl font-bold text-gray-900 dark:text-white font-outfit">No Analytics Available Yet</h2>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          You need to write at least one journal reflection in the Dashboard before we can compute your analytics dashboard.
        </p>
      </div>
    );
  }

  // Map emotions to numeric scores for line chart visualization
  const emotionScores = {
    motivated: 6,
    calm: 5,
    anxious: 4,
    confused: 3,
    stressed: 2,
    burned_out: 1
  };

  const getEmotionLabel = (score) => {
    const labels = {
      6: "Motivated",
      5: "Calm",
      4: "Anxious",
      3: "Confused",
      2: "Stressed",
      1: "Burned Out"
    };
    return labels[score] || "Unknown";
  };

  // 1. Mood Trend Line Chart Setup
  const moodChartData = {
    labels: data.mood_history.map(item => item.date),
    datasets: [
      {
        label: "Academic Mood Level",
        data: data.mood_history.map(item => emotionScores[item.emotion] || 3),
        borderColor: "#0ea5e9",
        backgroundColor: "rgba(14, 165, 233, 0.15)",
        fill: true,
        tension: 0.4,
        pointBackgroundColor: "#0284c7",
        pointBorderColor: "#fff",
        pointRadius: 6
      }
    ]
  };

  const moodChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (context) => {
            const val = context.raw;
            return `Emotion: ${getEmotionLabel(val)}`;
          }
        }
      }
    },
    scales: {
      y: {
        min: 1,
        max: 6,
        ticks: {
          stepSize: 1,
          callback: (value) => getEmotionLabel(value)
        },
        grid: { color: "rgba(156, 163, 175, 0.1)" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  // 2. Emotion Distribution Doughnut Chart Setup
  const emotionLabels = Object.keys(data.emotion_distribution).map(key => key.charAt(0).toUpperCase() + key.slice(1).replace("_", " "));
  const emotionValues = Object.values(data.emotion_distribution);
  
  const emotionColors = {
    motivated: "#10b981", // green
    calm: "#0ea5e9", // blue
    anxious: "#a855f7", // purple
    confused: "#f59e0b", // yellow
    stressed: "#f43f5e", // red
    burned_out: "#6366f1" // indigo
  };
  
  const doughnutColors = Object.keys(data.emotion_distribution).map(key => emotionColors[key.toLowerCase()] || "#9ca3af");

  const distributionData = {
    labels: emotionLabels,
    datasets: [
      {
        data: emotionValues,
        backgroundColor: doughnutColors,
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.8)"
      }
    ]
  };

  const distributionOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          boxWidth: 12,
          font: { family: "Outfit" }
        }
      }
    }
  };

  // 3. Focus vs Productivity Bar Chart Setup
  const statsBarData = {
    labels: ["Average Focus Index", "Average Productivity Est."],
    datasets: [
      {
        label: "Index Score",
        data: [data.average_focus_score, data.average_productivity_score],
        backgroundColor: ["#6366f1", "#10b981"],
        borderRadius: 8,
        barThickness: 40
      }
    ]
  };

  const statsBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: { color: "rgba(156, 163, 175, 0.1)" }
      },
      x: {
        grid: { display: false }
      }
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white font-outfit">
          Progress & Mood Analytics
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">
          Historical overview of your study metrics and emotional stability.
        </p>
      </div>

      {/* Stats Widgets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Streak */}
        <div className="glass-card rounded-3xl p-5 border flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-amber-100 dark:bg-amber-950/30 text-amber-500">
            <Zap className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Study Streak</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white font-outfit mt-0.5">
              {data.study_streak} Days
            </div>
          </div>
        </div>

        {/* Goals Completed */}
        <div className="glass-card rounded-3xl p-5 border flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500">
            <CheckCircle className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Goals Completed</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white font-outfit mt-0.5">
              {data.total_goals_completed} Tasks
            </div>
          </div>
        </div>

        {/* Focus index */}
        <div className="glass-card rounded-3xl p-5 border flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-indigo-100 dark:bg-indigo-950/30 text-indigo-500">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Focus Index</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white font-outfit mt-0.5">
              {data.average_focus_score}%
            </div>
          </div>
        </div>

        {/* Completion rate */}
        <div className="glass-card rounded-3xl p-5 border flex items-center gap-4">
          <div className="p-3.5 rounded-2xl bg-sky-100 dark:bg-sky-950/30 text-sky-500">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <div className="text-xs text-gray-400 font-semibold uppercase tracking-wider">Task Completion</div>
            <div className="text-2xl font-black text-gray-900 dark:text-white font-outfit mt-0.5">
              {data.weekly_progress_percentage}%
            </div>
          </div>
        </div>

      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Mood history trend */}
        <div className="glass-card rounded-3xl p-6 border lg:col-span-2 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary-500" />
            Emotional Trend Chart
          </h3>
          <div className="h-[280px]">
            <Line data={moodChartData} options={moodChartOptions} />
          </div>
        </div>

        {/* Emotion Distribution */}
        <div className="glass-card rounded-3xl p-6 border space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">
            Mood Distribution
          </h3>
          <div className="h-[280px] flex justify-center items-center">
            {Object.keys(data.emotion_distribution).length === 0 ? (
              <span className="text-gray-400 text-xs">No entries.</span>
            ) : (
              <Doughnut data={distributionData} options={distributionOptions} />
            )}
          </div>
        </div>

        {/* Productivity vs Focus comparison */}
        <div className="glass-card rounded-3xl p-6 border lg:col-span-3 space-y-4">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white font-outfit">
            Academic Performance Indices
          </h3>
          <div className="h-[200px]">
            <Bar data={statsBarData} options={statsBarOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}
