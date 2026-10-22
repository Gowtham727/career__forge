"use client";

import React, { useState } from "react";

interface ControlPanelProps {
  isPlaying: boolean;
  speed: number;
  currentStepIndex: number;
  totalSteps: number;
  selectedTestCase: string;
  isSearchingAlgorithm: boolean;
  searchTarget: number;
  customArrayInput: string;
  onPlayPauseToggle: () => void;
  onStepForward: () => void;
  onStepBackward: () => void;
  onReset: () => void;
  onSpeedChange: (speed: number) => void;
  onTestCaseChange: (testCase: string) => void;
  onCustomArraySubmit: (arrayStr: string) => void;
  onSearchTargetChange: (target: number) => void;
}

export default function ControlPanel({
  isPlaying,
  speed,
  currentStepIndex,
  totalSteps,
  selectedTestCase,
  isSearchingAlgorithm,
  searchTarget,
  customArrayInput,
  onPlayPauseToggle,
  onStepForward,
  onStepBackward,
  onReset,
  onSpeedChange,
  onTestCaseChange,
  onCustomArraySubmit,
  onSearchTargetChange,
}: ControlPanelProps) {
  const [customInput, setCustomInput] = useState(customArrayInput);

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCustomArraySubmit(customInput);
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-5 shadow-2xl backdrop-blur-xl space-y-4">
      {/* Top Bar: Playback Controls & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
        {/* Playback Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={onReset}
            title="Reset to Start"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-bold transition-all border border-white/10 hover:scale-105"
          >
            🔄 Reset
          </button>

          <button
            onClick={onStepBackward}
            disabled={currentStepIndex <= 0 || isPlaying}
            title="Previous Step"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            ⏮ Step Back
          </button>

          <button
            onClick={onPlayPauseToggle}
            className={`px-6 py-2.5 rounded-xl font-bold text-xs shadow-lg transition-all flex items-center gap-2 hover:scale-105 active:scale-95 ${
              isPlaying
                ? "bg-amber-500 text-black shadow-amber-500/20"
                : "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-indigo-500/25"
            }`}
          >
            {isPlaying ? "⏸ Pause" : "▶ Play Animation"}
          </button>

          <button
            onClick={onStepForward}
            disabled={currentStepIndex >= totalSteps - 1 || isPlaying}
            title="Next Step"
            className="p-2.5 bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-zinc-200 rounded-xl text-xs font-bold transition-all border border-white/10"
          >
            Step Next ⏭
          </button>
        </div>

        {/* Step Counter & Speed Controls */}
        <div className="flex items-center gap-4">
          <div className="text-xs font-mono text-zinc-400">
            Step: <span className="text-white font-bold">{Math.min(currentStepIndex + 1, totalSteps)}</span> / {totalSteps}
          </div>

          <div className="flex items-center gap-2 bg-black/60 px-3 py-1.5 rounded-xl border border-white/10">
            <span className="text-xs text-zinc-400 font-medium">Speed:</span>
            {[0.5, 1, 2, 4].map((s) => (
              <button
                key={s}
                onClick={() => onSpeedChange(s)}
                className={`px-2 py-0.5 rounded text-xs font-bold transition-all ${
                  speed === s ? "bg-indigo-600 text-white" : "text-zinc-400 hover:text-white"
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Bar: Test Case & Custom Input Controls */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Test Case Selectors */}
        <div className="space-y-1.5">
          <label className="text-xs text-zinc-400 font-medium flex items-center gap-1.5">
            <span>🧪 Select Test Case Preset:</span>
          </label>
          <select
            value={selectedTestCase}
            onChange={(e) => onTestCaseChange(e.target.value)}
            className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-indigo-300 font-semibold focus:outline-none focus:border-indigo-500"
          >
            <option value="random">Random Array (Default Test Case)</option>
            <option value="nearly-sorted">Nearly Sorted Array</option>
            <option value="reversed">Reversed Array (Worst Case)</option>
            <option value="duplicates">Array with Duplicates</option>
            <option value="custom">Custom Input Array</option>
          </select>
        </div>

        {/* Custom Input or Target Input */}
        {selectedTestCase === "custom" ? (
          <form onSubmit={handleCustomSubmit} className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium block">
              Enter Custom Array (comma-separated):
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customInput}
                onChange={(e) => setCustomInput(e.target.value)}
                placeholder="e.g. 45, 12, 89, 34, 67"
                className="flex-1 px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-xl transition-all"
              >
                Apply
              </button>
            </div>
          </form>
        ) : isSearchingAlgorithm ? (
          <div className="space-y-1.5">
            <label className="text-xs text-zinc-400 font-medium block">
              Target Value to Search:
            </label>
            <input
              type="number"
              value={searchTarget}
              onChange={(e) => onSearchTargetChange(Number(e.target.value))}
              className="w-full px-3 py-2 bg-black/60 border border-white/15 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-indigo-500"
            />
          </div>
        ) : (
          <div className="flex items-center justify-end text-xs text-zinc-500 italic pt-6">
            Tip: Click "Step Next" or "Play" to watch algorithm execution line by line.
          </div>
        )}
      </div>
    </div>
  );
}
