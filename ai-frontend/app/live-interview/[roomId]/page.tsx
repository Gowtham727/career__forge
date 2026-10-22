"use client";

import React, { use, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import useWebRTC from "@/components/WebRTC/useWebRTC";
import VideoGrid from "@/components/WebRTC/VideoGrid";
import CodeEditor from "@/components/WebRTC/CodeEditor";
import SessionTimer from "@/components/WebRTC/SessionTimer";

interface RoomPageProps {
  params: Promise<{ roomId: string }>;
}

export default function RoomSessionPage({ params }: RoomPageProps) {
  const { roomId } = use(params);
  const router = useRouter();
  const userId = useRef("User_" + Math.random().toString(36).substring(2, 7));
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const [redirectCountdown, setRedirectCountdown] = useState<number>(10);

  const {
    localStream,
    peers,
    isScreenSharing,
    isAudioMuted,
    isVideoMuted,
    toggleAudio,
    toggleVideo,
    toggleScreenShare,
    sendFile,
    socket,
  } = useWebRTC(roomId, userId.current);

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    alert("Room ID copied to clipboard!");
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      sendFile(file);
      alert(`Sending ${file.name} to participants via WebRTC data channel.`);
    }
  };

  const handleSessionExpired = () => {
    setIsSessionExpired(true);
    let count = 10;
    const interval = setInterval(() => {
      count -= 1;
      setRedirectCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        router.push("/live-interview");
      }
    }, 1000);
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans flex flex-col relative">
      {/* Header Bar */}
      <header className="border-b border-white/10 bg-black/80 backdrop-blur-xl px-6 py-4 flex flex-wrap items-center justify-between gap-4 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold text-sm">
              CF
            </div>
            <span className="font-extrabold text-white text-lg tracking-tight">CareerForge</span>
          </Link>
          <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
          <button
            onClick={copyRoomId}
            className="flex items-center gap-2 bg-zinc-900 border border-white/10 px-3 py-1.5 rounded-full text-xs font-mono text-indigo-300 hover:bg-zinc-800 transition-colors"
          >
            <span>Room: {roomId}</span>
            <span className="text-zinc-500">📋</span>
          </button>
        </div>

        {/* Synchronized Session Timer & Call Action Bar */}
        <div className="flex flex-wrap items-center gap-3">
          <SessionTimer
            socket={socket}
            roomId={roomId}
            onSessionExpired={handleSessionExpired}
          />

          <button
            onClick={toggleAudio}
            disabled={isSessionExpired}
            className={`px-4 py-2 rounded-xl font-medium text-xs transition-all flex items-center gap-2 border ${
              isAudioMuted
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-zinc-900 text-zinc-200 border-white/10 hover:bg-zinc-800"
            }`}
          >
            {isAudioMuted ? "🎙️ Unmute Mic" : "🎙️ Mute Mic"}
          </button>

          <button
            onClick={toggleVideo}
            disabled={isSessionExpired}
            className={`px-4 py-2 rounded-xl font-medium text-xs transition-all flex items-center gap-2 border ${
              isVideoMuted
                ? "bg-rose-500/20 text-rose-300 border-rose-500/30"
                : "bg-zinc-900 text-zinc-200 border-white/10 hover:bg-zinc-800"
            }`}
          >
            {isVideoMuted ? "📹 Turn On Cam" : "📹 Turn Off Cam"}
          </button>

          <button
            onClick={toggleScreenShare}
            disabled={isSessionExpired}
            className={`px-4 py-2 rounded-xl font-medium text-xs transition-all border ${
              isScreenSharing
                ? "bg-indigo-500 text-white border-indigo-400"
                : "bg-zinc-900 text-zinc-200 border-white/10 hover:bg-zinc-800"
            }`}
          >
            {isScreenSharing ? "🖥️ Stop Share" : "🖥️ Share Screen"}
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isSessionExpired}
            className="px-4 py-2 bg-zinc-900 border border-white/10 hover:bg-zinc-800 text-zinc-200 font-medium text-xs rounded-xl transition-all"
          >
            📁 Share Resume/File
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />

          <button
            onClick={() => router.push("/live-interview")}
            className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-all shadow-lg shadow-rose-600/20"
          >
            Leave Call
          </button>
        </div>
      </header>

      {/* Main Room Layout */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Video Grid Section */}
        <section className="bg-zinc-900/40 border border-white/10 rounded-2xl p-4 backdrop-blur-xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Participants
            </h2>
            <span className="text-xs text-zinc-400 font-mono">
              {Object.keys(peers).length + 1} Connected
            </span>
          </div>
          <VideoGrid localStream={localStream} peers={peers} />
        </section>

        {/* Collaborative Monaco Code Editor */}
        <section>
          <CodeEditor socket={socket} roomId={roomId} isReadOnly={isSessionExpired} />
        </section>
      </main>

      {/* Session Expired Overlay Modal */}
      {isSessionExpired && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-zinc-900 border border-rose-500/40 rounded-3xl p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in duration-300">
            <div className="w-16 h-16 bg-rose-500/20 border border-rose-500/30 rounded-2xl flex items-center justify-center text-3xl mx-auto">
              ⏱️
            </div>

            <div className="space-y-2">
              <h3 className="text-2xl font-extrabold text-white">Interview Session Time Expired</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                The allocated interview time limit has been reached. Code inputs and live media streams are now closed. Your code state has been automatically saved.
              </p>
            </div>

            <div className="bg-black/50 border border-white/10 rounded-2xl p-4 text-xs font-mono text-indigo-300">
              Auto-redirecting to dashboard in <span className="font-bold text-white text-sm">{redirectCountdown}s</span>
            </div>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/live-interview")}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25"
              >
                Return to Live Interview Dashboard
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
