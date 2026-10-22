"use client";

import React from "react";

export interface SearchingStep {
  array: number[];
  target: number;
  currentIndex?: number | null;
  low?: number | null;
  mid?: number | null;
  high?: number | null;
  foundIndex?: number | null;
  checkedIndices: number[];
  codeLine: number;
  explanation: string;
}

interface SearchingVisualizerProps {
  currentFrame: SearchingStep;
}

export default function SearchingVisualizer({ currentFrame }: SearchingVisualizerProps) {
  const { array, target, currentIndex, low, mid, high, foundIndex, checkedIndices, explanation } =
    currentFrame;

  const getItemStyle = (index: number) => {
    if (foundIndex === index) {
      return "bg-emerald-500 border-emerald-300 text-black shadow-xl shadow-emerald-500/40 scale-110 ring-4 ring-emerald-400/50 font-black";
    }
    if (currentIndex === index || mid === index) {
      return "bg-amber-400 border-amber-300 text-black shadow-xl shadow-amber-400/40 scale-105 font-bold";
    }
    if (checkedIndices.includes(index)) {
      return "bg-zinc-950 border-white/5 text-zinc-600 opacity-60";
    }
    if (low === index || high === index) {
      return "bg-indigo-600 border-indigo-400 text-white font-bold shadow-lg shadow-indigo-500/20";
    }
    return "bg-zinc-900 border-white/10 text-white hover:border-white/20";
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6 flex flex-col justify-between min-h-[420px]">
      {/* Search Header Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-white text-xs font-bold font-mono">Target Search Value:</span>
          <span className="px-3 py-1 bg-indigo-600/30 border border-indigo-500/50 text-indigo-300 rounded-full font-mono font-extrabold text-sm">
            {target}
          </span>
        </div>

        {foundIndex !== null && foundIndex !== undefined && (
          <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 rounded-full font-bold text-xs animate-pulse">
            ✓ Target Found at Index [{foundIndex}]
          </span>
        )}
      </div>

      {/* Dynamic Array Elements Grid */}
      <div className="flex-1 flex flex-wrap items-center justify-center gap-3 p-4 min-h-[200px]">
        {array.map((value, idx) => (
          <div key={idx} className="flex flex-col items-center gap-1.5 relative">
            {/* Pointer Indicators */}
            <div className="h-6 flex items-center gap-1 text-[10px] font-mono font-extrabold">
              {low === idx && (
                <span className="px-1.5 py-0.5 rounded bg-indigo-500 text-white shadow">LOW</span>
              )}
              {mid === idx && (
                <span className="px-1.5 py-0.5 rounded bg-amber-400 text-black shadow">MID</span>
              )}
              {high === idx && (
                <span className="px-1.5 py-0.5 rounded bg-purple-500 text-white shadow">HIGH</span>
              )}
            </div>

            {/* Element Box */}
            <div
              className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 ${getItemStyle(
                idx
              )}`}
            >
              <span className="text-base sm:text-lg font-mono font-extrabold">{value}</span>
            </div>

            {/* Index Label */}
            <span className="text-[10px] font-mono text-zinc-500 font-semibold">[{idx}]</span>
          </div>
        ))}
      </div>

      {/* Dynamic Legend */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300" />
            <span className="text-amber-300">Comparing / Mid</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400" />
            <span className="text-emerald-300">Target Match</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-500 border border-indigo-400" />
            <span className="text-indigo-300">Low / Active</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400" />
            <span className="text-purple-300">High</span>
          </div>
        </div>
      </div>

      {/* Plain English Step Explanation Box */}
      <div className="bg-black/60 border border-white/10 rounded-xl p-4 space-y-1">
        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 block">
          Current Step Explanation:
        </span>
        <p className="text-xs text-zinc-200 font-medium leading-relaxed">{explanation}</p>
      </div>
    </div>
  );
}

// ==========================================
// SEARCHING STEP GENERATOR UTILITIES
// ==========================================

export function generateLinearSearchSteps(
  array: number[],
  target: number
): SearchingStep[] {
  const steps: SearchingStep[] = [];
  const checked: number[] = [];

  steps.push({
    array,
    target,
    currentIndex: null,
    foundIndex: null,
    checkedIndices: [],
    codeLine: 0,
    explanation: `Initial array state. Starting Linear Search for target value ${target}.`,
  });

  for (let i = 0; i < array.length; i++) {
    steps.push({
      array,
      target,
      currentIndex: i,
      foundIndex: null,
      checkedIndices: [...checked],
      codeLine: 1,
      explanation: `Checking index [${i}] (value: ${array[i]}).`,
    });

    steps.push({
      array,
      target,
      currentIndex: i,
      foundIndex: null,
      checkedIndices: [...checked],
      codeLine: 2,
      explanation: `Comparing arr[${i}] (${array[i]}) == target (${target}).`,
    });

    if (array[i] === target) {
      steps.push({
        array,
        target,
        currentIndex: i,
        foundIndex: i,
        checkedIndices: [...checked],
        codeLine: 3,
        explanation: `Match found! Target ${target} is located at index [${i}].`,
      });
      return steps;
    }

    checked.push(i);
  }

  steps.push({
    array,
    target,
    currentIndex: null,
    foundIndex: null,
    checkedIndices: [...checked],
    codeLine: 6,
    explanation: `Search complete. Target value ${target} was NOT found in array. Returning -1.`,
  });

  return steps;
}

export function generateBinarySearchSteps(
  initialArray: number[],
  target: number
): SearchingStep[] {
  const steps: SearchingStep[] = [];
  // Ensure array is sorted for binary search
  const array = [...initialArray].sort((a, b) => a - b);
  const checked: number[] = [];

  let low = 0;
  let high = array.length - 1;

  steps.push({
    array,
    target,
    low,
    high,
    mid: null,
    foundIndex: null,
    checkedIndices: [],
    codeLine: 0,
    explanation: `Initial sorted array state. Starting Binary Search for target value ${target}.`,
  });

  while (low <= high) {
    const mid = Math.floor(low + (high - low) / 2);

    steps.push({
      array,
      target,
      low,
      high,
      mid,
      foundIndex: null,
      checkedIndices: [...checked],
      codeLine: 2,
      explanation: `Set low = [${low}], high = [${high}]. Calculating mid = Math.floor((${low} + ${high}) / 2) -> index [${mid}] (value: ${array[mid]}).`,
    });

    steps.push({
      array,
      target,
      low,
      high,
      mid,
      foundIndex: null,
      checkedIndices: [...checked],
      codeLine: 3,
      explanation: `Comparing arr[mid] (${array[mid]}) == target (${target}).`,
    });

    if (array[mid] === target) {
      steps.push({
        array,
        target,
        low,
        high,
        mid,
        foundIndex: mid,
        checkedIndices: [...checked],
        codeLine: 3,
        explanation: `Target match found at index [${mid}]! Binary Search successful.`,
      });
      return steps;
    }

    if (array[mid] < target) {
      steps.push({
        array,
        target,
        low,
        high,
        mid,
        foundIndex: null,
        checkedIndices: [...checked],
        codeLine: 4,
        explanation: `arr[mid] (${array[mid]}) < target (${target}). Target must be in right half. Adjusting low = mid + 1 -> [${mid + 1}].`,
      });
      for (let k = low; k <= mid; k++) checked.push(k);
      low = mid + 1;
    } else {
      steps.push({
        array,
        target,
        low,
        high,
        mid,
        foundIndex: null,
        checkedIndices: [...checked],
        codeLine: 5,
        explanation: `arr[mid] (${array[mid]}) > target (${target}). Target must be in left half. Adjusting high = mid - 1 -> [${mid - 1}].`,
      });
      for (let k = mid; k <= high; k++) checked.push(k);
      high = mid - 1;
    }
  }

  steps.push({
    array,
    target,
    low: null,
    high: null,
    mid: null,
    foundIndex: null,
    checkedIndices: Array.from({ length: array.length }, (_, i) => i),
    codeLine: 7,
    explanation: `Search range exhausted (low > high). Target ${target} is not present in array. Returning -1.`,
  });

  return steps;
}
