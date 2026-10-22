"use client";

import React from "react";
import Link from "next/link";

interface SkillGapCardProps {
  roleTitle: string;
  domainScores: Array<{
    domainName: string;
    percentage: number;
    requiredTopics: string[];
    moduleLink: string;
    moduleName: string;
  }>;
  completedTopics: string[];
}

export default function SkillGapCard({
  roleTitle,
  domainScores,
  completedTopics,
}: SkillGapCardProps) {
  // Find topics that are not yet completed
  const uncompletedItems = domainScores.flatMap((domain) =>
    domain.requiredTopics
      .filter((t) => !completedTopics.includes(t))
      .map((t) => ({
        topic: t,
        domainName: domain.domainName,
        moduleLink: domain.moduleLink,
        moduleName: domain.moduleName,
      }))
  );

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            Tailored Skill Gap Analysis
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">Recommended Action Plan</h3>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">
        To reach 100% readiness for <strong className="text-white">{roleTitle}</strong>, complete the following key skill competencies:
      </p>

      {uncompletedItems.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          {uncompletedItems.slice(0, 4).map((item, idx) => (
            <div
              key={idx}
              className="bg-black/50 border border-indigo-500/20 rounded-2xl p-3.5 space-y-2 flex flex-col justify-between hover:border-indigo-500/40 transition-colors"
            >
              <div className="space-y-1">
                <span className="text-[10px] text-zinc-500 uppercase font-mono font-bold block">
                  {item.domainName}
                </span>
                <span className="text-xs font-bold text-white block">{item.topic}</span>
              </div>

              <Link
                href={item.moduleLink}
                className="mt-2 py-1.5 px-3 bg-indigo-600/30 hover:bg-indigo-600 border border-indigo-500/40 text-indigo-200 hover:text-white font-bold text-[11px] rounded-xl text-center transition-all"
              >
                Start Practice on {item.moduleName} →
              </Link>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-emerald-950/40 border border-emerald-500/40 p-4 rounded-2xl text-center space-y-2">
          <span className="text-2xl">🎉</span>
          <h4 className="font-bold text-emerald-300 text-sm">Target Requirements 100% Complete!</h4>
          <p className="text-xs text-zinc-300">
            You have satisfied all core requirements for <strong>{roleTitle}</strong>. Ready for live interviews!
          </p>
        </div>
      )}
    </div>
  );
}
