"use client";

import React from "react";

interface AchievementBadgesProps {
  overallScore: number;
  completedTopicsCount: number;
  liveSessionsCount: number;
  resumeScore: number;
}

export default function AchievementBadges({
  overallScore,
  completedTopicsCount,
  liveSessionsCount,
  resumeScore,
}: AchievementBadgesProps) {
  const BADGES = [
    {
      id: "resume-pro",
      title: "Resume Perfectionist",
      desc: "Scored 80%+ on Resume Analyzer",
      icon: "🏆",
      unlocked: resumeScore >= 80,
    },
    {
      id: "algo-master",
      title: "Algorithm Specialist",
      desc: "Completed 5+ data structure visualizers",
      icon: "⚡",
      unlocked: completedTopicsCount >= 3,
    },
    {
      id: "live-interviewer",
      title: "Mock Interview Pro",
      desc: "Conducted live mock interview sessions",
      icon: "🎙️",
      unlocked: liveSessionsCount >= 1,
    },
    {
      id: "candidate-ready",
      title: "Interview Ready",
      desc: "Achieved 75%+ overall readiness score",
      icon: "🌟",
      unlocked: overallScore >= 75,
    },
  ];

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <span>🏅</span>
          <span>Milestone Achievement Badges</span>
        </h3>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {BADGES.map((b) => (
          <div
            key={b.id}
            className={`p-4 rounded-2xl border flex flex-col items-center text-center space-y-2 transition-all ${
              b.unlocked
                ? "bg-gradient-to-b from-indigo-950/60 to-purple-950/60 border-indigo-500/40 shadow-lg shadow-indigo-500/10 scale-105"
                : "bg-black/40 border-white/5 opacity-50 grayscale"
            }`}
          >
            <span className="text-3xl">{b.icon}</span>
            <span className="text-xs font-extrabold text-white block">{b.title}</span>
            <span className="text-[10px] text-zinc-400 leading-tight block">{b.desc}</span>
            <span
              className={`text-[9px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                b.unlocked ? "bg-emerald-500/20 text-emerald-300" : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {b.unlocked ? "Unlocked ✓" : "Locked 🔒"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
