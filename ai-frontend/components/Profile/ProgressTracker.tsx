"use client";

import React from "react";
import Link from "next/link";

interface DomainScore {
  domainId: string;
  domainName: string;
  weight: number;
  completedCount: number;
  totalRequired: number;
  percentage: number;
  weightedPoints: number;
  requiredTopics: string[];
  moduleLink: string;
  moduleName: string;
}

interface ProgressTrackerProps {
  overallScore: number;
  domainScores: DomainScore[];
  completedTopics: string[];
  onToggleTopic: (topic: string) => void;
  roleTitle: string;
}

export default function ProgressTracker({
  overallScore,
  domainScores,
  completedTopics,
  onToggleTopic,
  roleTitle,
}: ProgressTrackerProps) {
  // SVG Ring calculation
  const radius = 60;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (overallScore / 100) * circumference;

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-emerald-400 stroke-emerald-400";
    if (score >= 50) return "text-amber-400 stroke-amber-400";
    return "text-indigo-400 stroke-indigo-400";
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      {/* Title & Score Overview */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-6 border-b border-white/10 pb-6">
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-xs">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
            Dynamic Skill Curriculum
          </div>
          <h3 className="text-2xl font-extrabold text-white">
            Target Readiness Score: <span className="text-indigo-400">{overallScore}%</span>
          </h3>
          <p className="text-zinc-400 text-xs max-w-md leading-relaxed">
            Tailored completion status for <strong className="text-white">{roleTitle}</strong>. Mark required competencies as completed to boost your readiness.
          </p>
        </div>

        {/* Dynamic Progress Ring Gauge */}
        <div className="relative w-36 h-36 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90" viewBox="0 0 140 140">
            {/* Background Ring */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              className="text-zinc-800"
            />
            {/* Progress Stroke */}
            <circle
              cx="70"
              cy="70"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={`transition-all duration-700 ease-out ${getScoreColor(overallScore)}`}
            />
          </svg>

          {/* Centered Score Label */}
          <div className="absolute flex flex-col items-center justify-center">
            <span className="text-3xl font-black text-white">{overallScore}%</span>
            <span className="text-[10px] uppercase font-bold text-zinc-400">Ready</span>
          </div>
        </div>
      </div>

      {/* Domain Breakdown Bars */}
      <div className="space-y-6">
        <h4 className="text-xs uppercase font-extrabold tracking-wider text-zinc-400">
          Role Requirement Domains ({roleTitle}):
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {domainScores.map((domain) => (
            <div
              key={domain.domainId}
              className="bg-black/50 border border-white/10 rounded-2xl p-4 space-y-3 shadow-inner"
            >
              {/* Domain Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h5 className="font-bold text-white text-xs">{domain.domainName}</h5>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    Weight: {domain.weight}% | Completed: {domain.completedCount}/{domain.totalRequired}
                  </span>
                </div>
                <span className="text-xs font-mono font-extrabold text-indigo-400">
                  {domain.percentage}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="w-full bg-zinc-800 h-2.5 rounded-full overflow-hidden">
                <div
                  style={{ width: `${domain.percentage}%` }}
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500 rounded-full"
                />
              </div>

              {/* Required Competency Checkboxes */}
              <div className="space-y-1.5 pt-1">
                <span className="text-[10px] text-zinc-400 font-medium block">Required Topics:</span>
                <div className="flex flex-wrap gap-1.5">
                  {domain.requiredTopics.map((topic) => {
                    const isChecked = completedTopics.includes(topic);
                    return (
                      <button
                        key={topic}
                        onClick={() => onToggleTopic(topic)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1.5 border ${
                          isChecked
                            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                            : "bg-zinc-900 text-zinc-400 border-white/10 hover:text-white"
                        }`}
                      >
                        <span>{isChecked ? "✓" : "○"}</span>
                        <span>{topic}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Module Action Link */}
              <div className="pt-2 border-t border-white/5 flex justify-end">
                <Link
                  href={domain.moduleLink}
                  className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors flex items-center gap-1"
                >
                  <span>Practice on {domain.moduleName}</span>
                  <span>→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
