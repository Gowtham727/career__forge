"use client";

import React from "react";
import { ActivityItem } from "./useUserProfile";

interface ActivityFeedProps {
  activities: ActivityItem[];
}

export default function ActivityFeed({ activities }: ActivityFeedProps) {
  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <span>📜</span>
          <span>Recent Activity & Achievements Log</span>
        </h3>
        <span className="text-xs text-zinc-500 font-mono">{activities.length} Total Logs</span>
      </div>

      <div className="space-y-3 max-h-[320px] overflow-y-auto pr-1">
        {activities.map((item) => (
          <div
            key={item.id}
            className="flex items-start gap-3 bg-black/40 border border-white/5 p-3 rounded-2xl hover:border-white/15 transition-all"
          >
            <div className="w-9 h-9 bg-zinc-800 border border-white/10 rounded-xl flex items-center justify-center text-lg shrink-0">
              {item.icon}
            </div>

            <div className="flex-1 space-y-0.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-indigo-400 font-mono tracking-wide">
                  {item.category}
                </span>
                <span className="text-[10px] text-zinc-500 font-mono">{item.timestamp}</span>
              </div>
              <p className="text-xs font-semibold text-zinc-200 leading-snug">{item.title}</p>
            </div>
          </div>
        ))}

        {activities.length === 0 && (
          <div className="text-center py-8 text-zinc-500 text-xs italic">
            No activities logged yet. Practice on Interview Prep or Algorithm Visualizer to record progress!
          </div>
        )}
      </div>
    </div>
  );
}
