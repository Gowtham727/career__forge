"use client";

import React, { useState } from "react";
import { JOB_ROLES } from "./RoleCurriculum";
import { UserProfileData } from "./useUserProfile";

interface ProfileHeaderProps {
  profile: UserProfileData;
  overallScore: number;
  onTargetRoleChange: (roleId: string) => void;
  onUpdateCredentials: (name: string, email: string, experience: string) => void;
}

export default function ProfileHeader({
  profile,
  overallScore,
  onTargetRoleChange,
  onUpdateCredentials,
}: ProfileHeaderProps) {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState(profile.name);
  const [emailInput, setEmailInput] = useState(profile.email);
  const [expInput, setExpInput] = useState(profile.experienceLevel);

  const activeRole = JOB_ROLES[profile.targetRole] || JOB_ROLES["java-developer"];

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCredentials(nameInput, emailInput, expInput);
    setIsEditing(false);
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-6 border-b border-white/10 pb-6">
        {/* User Info & Avatar */}
        <div className="flex items-center gap-5">
          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-indigo-500 via-purple-600 to-pink-500 rounded-2xl flex items-center justify-center text-white font-extrabold text-2xl sm:text-3xl shadow-lg shadow-indigo-500/30 border border-white/20">
            {getInitials(profile.name)}
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">{profile.name}</h2>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                Active Candidate
              </span>
            </div>

            <p className="text-zinc-400 text-xs sm:text-sm font-mono">{profile.email}</p>

            <div className="flex flex-wrap items-center gap-2 pt-1">
              <span className="text-xs text-zinc-300 font-medium bg-black/50 px-3 py-1 rounded-lg border border-white/10">
                Experience: <strong className="text-indigo-400">{profile.experienceLevel}</strong>
              </span>

              <button
                onClick={() => setIsEditing(true)}
                className="text-xs text-zinc-400 hover:text-white underline font-medium pl-1"
              >
                ✏️ Edit Profile
              </button>
            </div>
          </div>
        </div>

        {/* Target Job Role Selector Card */}
        <div className="bg-black/60 border border-indigo-500/30 rounded-2xl p-4 space-y-2 min-w-[280px] shadow-inner">
          <label className="text-[11px] uppercase font-extrabold tracking-wider text-indigo-400 block">
            Target Job Title / Role:
          </label>

          <select
            value={profile.targetRole}
            onChange={(e) => onTargetRoleChange(e.target.value)}
            className="w-full bg-zinc-900 border border-indigo-500/40 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold focus:outline-none focus:border-indigo-400 transition-colors shadow-md"
          >
            {Object.values(JOB_ROLES).map((role) => (
              <option key={role.id} value={role.id}>
                🎯 {role.title}
              </option>
            ))}
          </select>

          <p className="text-[11px] text-zinc-400 leading-relaxed italic">
            Progress status & required skills adapt dynamically for <strong className="text-zinc-200">{activeRole.title}</strong>.
          </p>
        </div>
      </div>

      {/* Target Role Tech Stack Badges */}
      <div className="space-y-2">
        <span className="text-[11px] uppercase font-bold text-zinc-400 tracking-wider block">
          Required Tech Stack for {activeRole.title}:
        </span>
        <div className="flex flex-wrap items-center gap-2">
          {activeRole.recommendedKeywords.map((kw) => (
            <span
              key={kw}
              className="px-3 py-1 bg-indigo-950/60 border border-indigo-500/30 text-indigo-300 rounded-xl text-xs font-semibold"
            >
              {kw}
            </span>
          ))}
        </div>
      </div>

      {/* Edit Credentials Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveCredentials}
            className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white">Edit Candidate Credentials</h3>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="text-zinc-400 hover:text-white text-xs"
              >
                ✕
              </button>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Full Name:</label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Email Address:</label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-zinc-300 font-medium">Experience Level:</label>
              <select
                value={expInput}
                onChange={(e) => setExpInput(e.target.value)}
                className="w-full bg-black border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
              >
                <option value="Entry-Level / Fresher (0-1 yr)">Entry-Level / Fresher (0-1 yr)</option>
                <option value="Mid-Level (2-4 yrs)">Mid-Level (2-4 yrs)</option>
                <option value="Senior Developer (5+ yrs)">Senior Developer (5+ yrs)</option>
              </select>
            </div>

            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-zinc-800 text-zinc-300 rounded-xl text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg"
              >
                Save Profile
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
