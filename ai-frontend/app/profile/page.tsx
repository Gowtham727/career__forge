"use client";

import React from "react";
import Link from "next/link";
import { useUserProfile } from "@/components/Profile/useUserProfile";
import ProfileHeader from "@/components/Profile/ProfileHeader";
import ProgressTracker from "@/components/Profile/ProgressTracker";
import SkillGapCard from "@/components/Profile/SkillGapCard";
import ActivityFeed from "@/components/Profile/ActivityFeed";
import AchievementBadges from "@/components/Profile/AchievementBadges";

export default function UserProfilePage() {
  const {
    profile,
    isLoaded,
    currentRoleDef,
    domainScores,
    overallReadinessScore,
    updateTargetRole,
    updateCredentials,
    toggleTopicCompletion,
  } = useUserProfile();

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3">
          <span className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <span className="text-sm font-mono text-zinc-400">Loading Candidate Profile...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans flex flex-col">
      {/* Navbar Header */}
      <nav className="border-b border-white/10 bg-black/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              CF
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">
              CareerForge
            </span>
          </Link>

          <div className="flex items-center gap-7 font-medium text-zinc-400 text-sm">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/resume-analyzer" className="hover:text-white transition-colors">Resume Analyzer</Link>
            <Link href="/interview-prep" className="hover:text-white transition-colors">Interview Prep</Link>
            <Link href="/algorithm-visualizer" className="hover:text-white transition-colors">Algorithm Visualizer</Link>
            <Link href="/live-interview" className="hover:text-white transition-colors">Live Interview</Link>
            <Link href="/profile" className="text-indigo-400 font-bold border-b-2 border-indigo-500 pb-0.5 flex items-center gap-1.5">
              <span>👤 Profile</span>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Profile Dashboard Body */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Header Profile Credentials Card */}
        <ProfileHeader
          profile={profile}
          overallScore={overallReadinessScore}
          onTargetRoleChange={updateTargetRole}
          onUpdateCredentials={updateCredentials}
        />

        {/* Grid Layout: Progress Ring & Skill Gap Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-7 space-y-6">
            {/* Dynamic Role-Adapted Progress Tracker */}
            <ProgressTracker
              overallScore={overallReadinessScore}
              domainScores={domainScores}
              completedTopics={profile.completedTopics}
              onToggleTopic={toggleTopicCompletion}
              roleTitle={currentRoleDef.title}
            />

            {/* Skill Gap Analysis Card */}
            <SkillGapCard
              roleTitle={currentRoleDef.title}
              domainScores={domainScores}
              completedTopics={profile.completedTopics}
            />
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Milestone Badges */}
            <AchievementBadges
              overallScore={overallReadinessScore}
              completedTopicsCount={profile.completedTopics.length}
              liveSessionsCount={profile.liveSessionsCount}
              resumeScore={profile.resumeScore}
            />

            {/* Activity Feed Log */}
            <ActivityFeed activities={profile.activityFeed} />
          </div>
        </div>
      </main>
    </div>
  );
}
