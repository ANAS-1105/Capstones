import React from "react";
import { 
  Brain, Heart, ShieldAlert, CheckCircle, Sparkles, 
  Target, Zap, Compass, Users, Smile, HelpCircle 
} from "lucide-react";

export default function About() {
  return (
    <div className="space-y-12 animate-fade-in max-w-5xl mx-auto">
      
      {/* Hero Section */}
      <div className="text-center space-y-4 py-6">
        <div className="inline-flex p-3.5 rounded-3xl bg-primary-100 dark:bg-primary-950/30 text-primary-500 mb-2">
          <Brain className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white font-outfit">
          About MindMentor AI
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 max-w-2xl mx-auto font-medium">
          "Helping students learn smarter by understanding how they feel."
        </p>
      </div>

      {/* Grid: Need vs Benefit */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Why We Need It (The Problem) */}
        <div className="glass-card rounded-3xl p-8 border space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-50 dark:bg-rose-950/20 text-rose-500 border border-rose-100 dark:border-rose-950">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-gray-900 dark:text-white">
              The Need
            </h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            Many students struggle with academic pressure, deadlines, anxiety, and burnout. Existing study platforms recommend schedules based solely on subject topics or deadlines, completely ignoring the student's current mental and emotional state. 
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Mental Exhaustion & Burnout</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Students are forced into long study blocks when they actually need rest and recovery.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Anxiety-Induced Distraction</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Worrying about grades causes cognitive overload, making standard timelines ineffective.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Confusion & Feeling Lost</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Complex material prompts frustration, requiring visual frameworks or bite-sized videos rather than reading guides.</p>
              </div>
            </div>
          </div>
        </div>

        {/* What We Deliver (The Benefits) */}
        <div className="glass-card rounded-3xl p-8 border space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-500 border border-emerald-100 dark:border-emerald-950">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-bold font-outfit text-gray-900 dark:text-white">
              The Benefits
            </h2>
          </div>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
            MindMentor AI addresses these challenges by introducing local machine learning to evaluate student reflections and structure study environments optimized for emotional well-being.
          </p>

          <div className="space-y-4 pt-2">
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Adaptive Study Cycles</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Adapts focus times (e.g. 15 mins for Burned Out, 50 mins for Motivated) to preserve your energy.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Mindfulness & Recovery Integrations</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Offers progressive muscle relaxation, 4-7-8 breathing, and grounding steps built right into breaks.</p>
              </div>
            </div>
            <div className="flex gap-3">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-gray-800 dark:text-gray-200">Gamification & Streak Motivation</h4>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Provides a checklist and badges like "Stress Buster" to celebrate small study victories.</p>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* How it Works Workflow */}
      <div className="glass-card rounded-3xl p-8 border space-y-8">
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-bold font-outfit text-gray-900 dark:text-white">How MindMentor AI Works</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">Our seamless workflow is completed in under 1 second.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {/* Step 1 */}
          <div className="space-y-3 relative p-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-950/30 text-primary-500 flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Reflect & Log</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Write down how you're feeling about your upcoming exams or assignments.</p>
          </div>

          {/* Step 2 */}
          <div className="space-y-3 relative p-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-950/30 text-purple-500 flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">AI Analysis</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Local TF-IDF & Logistic Regression model classifies your dominant study emotion.</p>
          </div>

          {/* Step 3 */}
          <div className="space-y-3 relative p-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-950/30 text-amber-500 flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Get Recommends</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Receive customized study/break lengths, wellness tips, and study methodologies.</p>
          </div>

          {/* Step 4 */}
          <div className="space-y-3 relative p-4">
            <div className="mx-auto w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/30 text-emerald-500 flex items-center justify-center font-bold text-lg">
              4
            </div>
            <h4 className="font-bold text-sm text-gray-900 dark:text-white">Track Progress</h4>
            <p className="text-xs text-gray-500 dark:text-gray-400">Complete checklist goals, track focus history, and unlock achievement badges.</p>
          </div>
        </div>
      </div>
      
    </div>
  );
}
