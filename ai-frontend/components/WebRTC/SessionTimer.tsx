"use client";

import React, { useEffect, useState, useRef } from "react";
import { Socket } from "socket.io-client";

interface SessionTimerProps {
  socket: Socket | null;
  roomId: string;
  onSessionExpired: () => void;
  initialMinutes?: number;
}

export default function SessionTimer({
  socket,
  roomId,
  onSessionExpired,
  initialMinutes = 30,
}: SessionTimerProps) {
  const [secondsRemaining, setSecondsRemaining] = useState<number | null>(initialMinutes * 60);
  const [isRunning, setIsRunning] = useState<boolean>(true);
  const [showConfigModal, setShowConfigModal] = useState<boolean>(false);
  const [customMinutes, setCustomMinutes] = useState<number>(initialMinutes);

  const endTimeRef = useRef<number | null>(Date.now() + initialMinutes * 60 * 1000);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const expiredTriggeredRef = useRef<boolean>(false);

  // Sync timer with room members via Socket
  useEffect(() => {
    if (!socket) return;

    // Request initial timer state when joining
    socket.emit("request-timer-sync", roomId);

    socket.on(
      "timer-sync",
      (data: { endTime: number | null; isRunning: boolean; durationMinutes?: number }) => {
        if (data.endTime) {
          endTimeRef.current = data.endTime;
          setIsRunning(data.isRunning);
          const remaining = Math.max(0, Math.floor((data.endTime - Date.now()) / 1000));
          setSecondsRemaining(remaining);
          if (remaining === 0 && data.isRunning && !expiredTriggeredRef.current) {
            expiredTriggeredRef.current = true;
            onSessionExpired();
          }
        }
      }
    );

    socket.on("timer-start", (data: { endTime: number; durationMinutes: number }) => {
      endTimeRef.current = data.endTime;
      setIsRunning(true);
      expiredTriggeredRef.current = false;
      const remaining = Math.max(0, Math.floor((data.endTime - Date.now()) / 1000));
      setSecondsRemaining(remaining);
    });

    socket.on("timer-pause", () => {
      setIsRunning(false);
    });

    return () => {
      socket.off("timer-sync");
      socket.off("timer-start");
      socket.off("timer-pause");
    };
  }, [socket, roomId, onSessionExpired]);

  // Local interval ticker
  useEffect(() => {
    if (!isRunning || !endTimeRef.current) {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      if (!endTimeRef.current) return;
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((endTimeRef.current - now) / 1000));
      setSecondsRemaining(diffSec);

      if (diffSec <= 0) {
        setIsRunning(false);
        if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        if (!expiredTriggeredRef.current) {
          expiredTriggeredRef.current = true;
          onSessionExpired();
        }
      }
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [isRunning, onSessionExpired]);

  const startNewTimer = (minutes: number) => {
    const newEndTime = Date.now() + minutes * 60 * 1000;
    endTimeRef.current = newEndTime;
    setSecondsRemaining(minutes * 60);
    setIsRunning(true);
    expiredTriggeredRef.current = false;

    if (socket) {
      socket.emit("timer-start", roomId, {
        endTime: newEndTime,
        durationMinutes: minutes,
      });
    }
    setShowConfigModal(false);
  };

  const togglePause = () => {
    const nextRunning = !isRunning;
    setIsRunning(nextRunning);
    if (socket) {
      if (nextRunning) {
        // Resume with current secondsRemaining
        const newEndTime = Date.now() + (secondsRemaining || 0) * 1000;
        endTimeRef.current = newEndTime;
        socket.emit("timer-start", roomId, {
          endTime: newEndTime,
          durationMinutes: Math.ceil((secondsRemaining || 0) / 60),
        });
      } else {
        socket.emit("timer-pause", roomId);
      }
    }
  };

  const formatTime = (totalSeconds: number | null): string => {
    if (totalSeconds === null) return "--:--";
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    const formattedMins = String(mins).padStart(2, "0");
    const formattedSecs = String(secs).padStart(2, "0");
    return `${formattedMins}:${formattedSecs}`;
  };

  // Color dynamics based on remaining time
  const getBadgeStyle = () => {
    if (secondsRemaining === null) return "bg-zinc-800 text-zinc-400 border-zinc-700";
    if (secondsRemaining <= 60)
      return "bg-rose-950/80 text-rose-300 border-rose-500/50 animate-pulse shadow-lg shadow-rose-500/20";
    if (secondsRemaining <= 300)
      return "bg-amber-950/70 text-amber-300 border-amber-500/40 shadow-lg shadow-amber-500/10";
    return "bg-emerald-950/70 text-emerald-300 border-emerald-500/40 shadow-lg shadow-emerald-500/10";
  };

  return (
    <div className="relative inline-flex items-center gap-2">
      {/* Main Timer Display Badge */}
      <button
        onClick={() => setShowConfigModal(!showConfigModal)}
        title="Click to manage session timer"
        className={`px-3 py-1.5 rounded-xl border text-xs font-mono font-bold flex items-center gap-2 transition-all hover:scale-105 ${getBadgeStyle()}`}
      >
        <span className="text-sm">⏱️</span>
        <span>{formatTime(secondsRemaining)}</span>
        <span className="text-[10px] uppercase font-sans tracking-wider opacity-75">
          {isRunning ? "Live" : "Paused"}
        </span>
      </button>

      {/* Timer Settings Dropdown Modal */}
      {showConfigModal && (
        <div className="absolute right-0 top-11 z-50 w-72 bg-zinc-900 border border-white/10 rounded-2xl p-4 shadow-2xl backdrop-blur-2xl space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-2">
            <h4 className="font-bold text-white text-xs">Interview Session Timer</h4>
            <button
              onClick={() => setShowConfigModal(false)}
              className="text-zinc-400 hover:text-white text-xs"
            >
              ✕
            </button>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-zinc-400 font-medium">Quick Preset Durations:</label>
            <div className="grid grid-cols-4 gap-1.5">
              {[15, 30, 45, 60].map((m) => (
                <button
                  key={m}
                  onClick={() => startNewTimer(m)}
                  className="py-1.5 bg-zinc-800 hover:bg-indigo-600 text-white rounded-lg text-xs font-bold transition-colors"
                >
                  {m}m
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[11px] text-zinc-400 font-medium">Custom Minutes:</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="1"
                max="180"
                value={customMinutes}
                onChange={(e) => setCustomMinutes(Number(e.target.value))}
                className="w-full bg-black border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white focus:outline-none focus:border-indigo-500"
              />
              <button
                onClick={() => startNewTimer(customMinutes)}
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold whitespace-nowrap"
              >
                Set
              </button>
            </div>
          </div>

          <div className="pt-2 border-t border-white/10 flex items-center justify-between">
            <button
              onClick={togglePause}
              className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold rounded-lg w-full transition-colors"
            >
              {isRunning ? "⏸️ Pause Timer" : "▶️ Resume Timer"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
