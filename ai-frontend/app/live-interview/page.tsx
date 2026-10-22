"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LiveInterviewDashboard() {
  const [roomIdInput, setRoomIdInput] = useState("");
  const router = useRouter();

  const createNewRoom = () => {
    const newId = Math.random().toString(36).substring(2, 9);
    router.push(`/live-interview/${newId}`);
  };

  const joinRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (roomIdInput.trim()) {
      router.push(`/live-interview/${roomIdInput.trim()}`);
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
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
            <Link href="/live-interview" className="text-indigo-400 font-bold border-b-2 border-indigo-500 pb-0.5">Live Interview</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-6 py-20">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
            Real-Time Code Collaboration & Execution
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tight">
            Live Technical Interview & <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
              Monaco Code Editor & Compiler
            </span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-xl mx-auto">
            Conduct live video mock interviews, write & compile code in real time with multi-language online compiler support, and manage synchronized interview session timers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Card 1: Start Instant Room */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-indigo-500/40 transition-all group shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-indigo-500/30 group-hover:scale-110 transition-transform">
                💻
              </div>
              <h3 className="text-2xl font-bold text-white">Start New Code Session</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Create an instant HD video meeting room with collaborative Monaco Code Editor, multi-language compiler API execution, auto-saved code state, and synchronized interview timers.
              </p>
            </div>
            <button
              onClick={createNewRoom}
              className="mt-8 w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              Create Interview Room
            </button>
          </div>

          {/* Card 2: Join via Room ID */}
          <div className="bg-zinc-900/80 border border-white/10 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-between hover:border-purple-500/40 transition-all group shadow-xl">
            <div className="space-y-4">
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform">
                🔑
              </div>
              <h3 className="text-2xl font-bold text-white">Join Existing Room</h3>
              <p className="text-zinc-400 leading-relaxed text-sm">
                Have a room code or link from your interviewer or peer? Enter it below to join the live coding session directly.
              </p>
            </div>

            <form onSubmit={joinRoom} className="mt-8 space-y-3">
              <input
                type="text"
                placeholder="Enter Room Code (e.g. abc1234)"
                value={roomIdInput}
                onChange={(e) => setRoomIdInput(e.target.value)}
                className="w-full px-4 py-3.5 bg-black/50 border border-white/10 rounded-xl text-white placeholder-zinc-500 focus:outline-none focus:border-purple-500 transition-colors"
                required
              />
              <button
                type="submit"
                className="w-full py-3.5 bg-zinc-800 border border-zinc-700 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                Join Interview Session
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
