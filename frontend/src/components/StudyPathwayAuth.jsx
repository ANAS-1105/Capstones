import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Brain, Sliders, Trophy, Sparkles, ArrowRight, CheckCircle2, 
  Target, ShieldCheck, Zap, TrendingUp, Compass, Award 
} from "lucide-react";

export default function StudyPathwayAuth() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      id: 1,
      tag: "PHASE 1: WHAT THE APP IS ABOUT",
      title: "Emotion & Cognitive State Diagnostics",
      subtitle: "Detects stress, mood, and mental fatigue before you begin studying.",
      description: "MindMentor AI reads your daily reflections and cognitive metrics to understand your emotional state in real time, catching burnout before it stalls your progress.",
      highlights: [
        "Natural Language Emotion Analysis",
        "Cognitive Stress Index Monitoring",
        "Real-time Mental Fatigue Alerts"
      ],
      icon: Brain,
      gradient: "from-sky-500 to-blue-600",
      accentBg: "bg-sky-500/10 dark:bg-sky-500/20",
      accentText: "text-sky-500 dark:text-sky-400",
      badge: "Real-Time Diagnostic"
    },
    {
      id: 2,
      tag: "PHASE 2: ADAPTIVE AI ENGINE",
      title: "Multivariate Habit & Plan Generation",
      subtitle: "Personalizes study techniques, break durations, and subject priority.",
      description: "Instead of rigid static timetables, the AI Coach dynamically adjusts pomodoro intervals, relaxation exercises, and subject focus based on sleep and workload.",
      highlights: [
        "Dynamic Pomodoro & Rest Intervals",
        "Preventative Burnout Guardrails",
        "Targeted Priority Subject Ordering"
      ],
      icon: Compass,
      gradient: "from-indigo-500 to-purple-600",
      accentBg: "bg-indigo-500/10 dark:bg-indigo-500/20",
      accentText: "text-indigo-500 dark:text-indigo-400",
      badge: "Adaptive AI Coach"
    },
    {
      id: 3,
      tag: "PHASE 3: WHAT IT BENEFITS YOU",
      title: "Peak Performance & Habit DNA",
      subtitle: "Unlocks your 30-day future self projection and 85%+ goal completion.",
      description: "Master lifelong academic habits with your custom Study DNA profile, instant habit simulations, and 30-day predicted progress trajectories.",
      highlights: [
        "30-Day Future Self Growth Trajectories",
        "85%+ Goal Completion Probability",
        "Study DNA & Optimal Time Profiling"
      ],
      icon: Trophy,
      gradient: "from-emerald-500 to-teal-600",
      accentBg: "bg-emerald-500/10 dark:bg-emerald-500/20",
      accentText: "text-emerald-500 dark:text-emerald-400",
      badge: "Proven Student Benefits"
    }
  ];

  // Auto advance pathway steps every 4.5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [steps.length]);

  const currentStep = steps[activeStep];
  const IconComponent = currentStep.icon;

  return (
    <div className="w-full flex flex-col justify-between h-full p-6 lg:p-8 space-y-6 relative overflow-hidden">
      
      {/* Background Decorative Gradient Orbs */}
      <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full bg-primary-500/10 blur-[90px] pointer-events-none" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full bg-emerald-500/10 blur-[90px] pointer-events-none" />

      {/* Top Header & Branding */}
      <div className="space-y-3 relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary-500/10 text-primary-500 dark:text-primary-400 border border-primary-500/20 text-xs font-bold tracking-wide uppercase">
          <Sparkles className="w-3.5 h-3.5" />
          AI Study Pathway
        </div>
        <h1 className="text-2xl lg:text-3xl font-black font-outfit text-gray-900 dark:text-white tracking-tight leading-tight">
          How MindMentor AI Transforms Your Academic Success
        </h1>
        <p className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-medium">
          Follow the 3-step AI journey from emotion detection to peak performance.
        </p>
      </div>

      {/* Pathway Node Tabs Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-2 p-1.5 rounded-2xl bg-gray-100/80 dark:bg-gray-900/80 border border-gray-200/60 dark:border-gray-800 backdrop-blur-md">
        {steps.map((step, idx) => {
          const isActive = idx === activeStep;
          const StepIcon = step.icon;
          return (
            <button
              key={step.id}
              onClick={() => setActiveStep(idx)}
              className={`relative flex items-center justify-center gap-2 py-2.5 px-2 rounded-xl text-xs font-bold transition-all duration-300 ${
                isActive 
                  ? "text-white shadow-md shadow-primary-500/20" 
                  : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
              }`}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTabBackground"
                  className={`absolute inset-0 rounded-xl bg-gradient-to-r ${step.gradient}`}
                  transition={{ type: "spring", stiffness: 400, damping: 30 }}
                />
              )}
              <span className="relative z-10 flex items-center gap-1.5">
                <StepIcon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Step {step.id}</span>
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Step Feature Showcase Card */}
      <div className="relative z-10 flex-1 min-h-[250px]">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeStep}
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.35, ease: "easeOut" }}
            className="h-full glass-card rounded-3xl p-6 border shadow-xl flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Card Badge & Icon Header */}
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-extrabold uppercase tracking-widest px-2.5 py-1 rounded-lg ${currentStep.accentBg} ${currentStep.accentText}`}>
                  {currentStep.tag}
                </span>
                <div className={`p-2.5 rounded-2xl bg-gradient-to-r ${currentStep.gradient} text-white shadow-md`}>
                  <IconComponent className="w-5 h-5" />
                </div>
              </div>

              {/* Step Title & Subtitle */}
              <div>
                <h3 className="text-lg font-bold font-outfit text-gray-900 dark:text-white">
                  {currentStep.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                  {currentStep.description}
                </p>
              </div>

              {/* Highlights Bullet List */}
              <div className="space-y-2 pt-1">
                {currentStep.highlights.map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-xs font-semibold text-gray-700 dark:text-gray-300">
                    <CheckCircle2 className={`w-4 h-4 shrink-0 ${currentStep.accentText}`} />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Step Progress Line */}
            <div className="w-full bg-gray-100 dark:bg-gray-800 h-1.5 rounded-full overflow-hidden">
              <motion.div
                key={activeStep}
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 4.5, ease: "linear" }}
                className={`h-full bg-gradient-to-r ${currentStep.gradient}`}
              />
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Bottom Proof Metrics Bar */}
      <div className="relative z-10 grid grid-cols-3 gap-3 pt-2">
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 text-center">
          <div className="text-sm lg:text-base font-extrabold text-primary-500 font-outfit">85%+</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Goal Success</div>
        </div>
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 text-center">
          <div className="text-sm lg:text-base font-extrabold text-indigo-500 font-outfit">3.5x</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Focus Boost</div>
        </div>
        <div className="p-3 rounded-2xl bg-white/60 dark:bg-gray-900/60 border border-gray-200/50 dark:border-gray-800 text-center">
          <div className="text-sm lg:text-base font-extrabold text-emerald-500 font-outfit">0%</div>
          <div className="text-[10px] text-gray-500 dark:text-gray-400 font-semibold">Burnout Risk</div>
        </div>
      </div>

    </div>
  );
}
