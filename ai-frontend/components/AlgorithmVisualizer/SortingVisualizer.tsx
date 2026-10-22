"use client";

import React from "react";

export interface SortingStep {
  array: number[];
  comparing: number[];
  swapping: number[];
  sorted: number[];
  pivot?: number | null;
  codeLine: number;
  explanation: string;
}

interface SortingVisualizerProps {
  currentFrame: SortingStep;
}

export default function SortingVisualizer({ currentFrame }: SortingVisualizerProps) {
  const { array, comparing, swapping, sorted, pivot, explanation } = currentFrame;
  const maxValue = Math.max(...array, 100);

  const getBarColor = (index: number) => {
    if (swapping.includes(index)) {
      return "bg-rose-500 border-rose-400 text-white shadow-lg shadow-rose-500/30 scale-105";
    }
    if (comparing.includes(index)) {
      return "bg-amber-400 border-amber-300 text-black shadow-lg shadow-amber-400/30 scale-105";
    }
    if (sorted.includes(index)) {
      return "bg-emerald-500 border-emerald-400 text-black shadow-md shadow-emerald-500/20";
    }
    if (pivot === index) {
      return "bg-purple-500 border-purple-400 text-white shadow-lg shadow-purple-500/30 scale-105";
    }
    return "bg-indigo-600/80 hover:bg-indigo-500 border-indigo-400/30 text-white";
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-6 flex flex-col justify-between min-h-[420px]">
      {/* Dynamic Visual Array Bar Chart */}
      <div className="flex-1 flex items-end justify-center gap-2 sm:gap-3 px-4 pt-8 pb-4 min-h-[260px] border-b border-white/10">
        {array.map((value, idx) => {
          const heightPercent = Math.max(12, Math.round((value / maxValue) * 100));
          return (
            <div key={idx} className="flex-1 flex flex-col items-center gap-2 max-w-[50px]">
              {/* Value Label */}
              <span className="text-[11px] font-mono font-bold text-zinc-300">
                {value}
              </span>

              {/* Bar Element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-xl border transition-all duration-300 flex items-center justify-center font-mono font-bold text-xs ${getBarColor(
                  idx
                )}`}
              >
                {/* Index badge at bottom of bar if height permits */}
                {heightPercent > 20 && (
                  <span className="text-[10px] opacity-75 font-sans">[{idx}]</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Dynamic Legend Badges */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
        <div className="flex flex-wrap items-center gap-3 text-xs font-semibold">
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-indigo-600 border border-indigo-400" />
            <span className="text-zinc-400">Unsorted</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-amber-400 border border-amber-300" />
            <span className="text-amber-300">Comparing</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-rose-500 border border-rose-400" />
            <span className="text-rose-300">Swapping</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-3 h-3 rounded-full bg-emerald-500 border border-emerald-400" />
            <span className="text-emerald-300">Sorted</span>
          </div>
          {pivot !== undefined && pivot !== null && (
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-purple-500 border border-purple-400" />
              <span className="text-purple-300">Pivot</span>
            </div>
          )}
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
// ALGORITHM STEP GENERATOR UTILITIES
// ==========================================

export function generateBubbleSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 0,
    explanation: "Initial array state. Ready to perform Bubble Sort.",
  });

  for (let i = 0; i < n - 1; i++) {
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      codeLine: 2,
      explanation: `Pass ${i + 1}: Starting inner comparison loop up to index ${n - i - 1}.`,
    });

    for (let j = 0; j < n - i - 1; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [],
        sorted: [...sorted],
        codeLine: 4,
        explanation: `Comparing arr[${j}] (${arr[j]}) and arr[${j + 1}] (${arr[j + 1]}).`,
      });

      if (arr[j] > arr[j + 1]) {
        steps.push({
          array: [...arr],
          comparing: [j, j + 1],
          swapping: [j, j + 1],
          sorted: [...sorted],
          codeLine: 5,
          explanation: `Since ${arr[j]} > ${arr[j + 1]}, swapping arr[${j}] and arr[${j + 1}].`,
        });

        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;

        steps.push({
          array: [...arr],
          comparing: [],
          swapping: [j, j + 1],
          sorted: [...sorted],
          codeLine: 7,
          explanation: `Swapped! Array is now [${arr.join(", ")}].`,
        });
      }
    }
    sorted.push(n - i - 1);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      codeLine: 2,
      explanation: `Element at index ${n - i - 1} (${arr[n - i - 1]}) is now placed in its sorted position.`,
    });
  }

  sorted.push(0);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    codeLine: 11,
    explanation: "Bubble Sort Complete! The entire array is sorted.",
  });

  return steps;
}

export function generateSelectionSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [],
    codeLine: 0,
    explanation: "Initial array state. Ready to perform Selection Sort.",
  });

  for (let i = 0; i < n - 1; i++) {
    let minIdx = i;
    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      codeLine: 3,
      explanation: `Pass ${i + 1}: Assuming minimum element is at index ${i} (${arr[i]}).`,
    });

    for (let j = i + 1; j < n; j++) {
      steps.push({
        array: [...arr],
        comparing: [j, minIdx],
        swapping: [],
        sorted: [...sorted],
        codeLine: 5,
        explanation: `Comparing arr[${j}] (${arr[j]}) with current minimum arr[${minIdx}] (${arr[minIdx]}).`,
      });

      if (arr[j] < arr[minIdx]) {
        minIdx = j;
        steps.push({
          array: [...arr],
          comparing: [minIdx],
          swapping: [],
          sorted: [...sorted],
          codeLine: 6,
          explanation: `Found new minimum element (${arr[minIdx]}) at index ${minIdx}.`,
        });
      }
    }

    if (minIdx !== i) {
      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [i, minIdx],
        sorted: [...sorted],
        codeLine: 10,
        explanation: `Swapping arr[${i}] (${arr[i]}) with minimum element arr[${minIdx}] (${arr[minIdx]}).`,
      });

      const temp = arr[minIdx];
      arr[minIdx] = arr[i];
      arr[i] = temp;
    }

    sorted.push(i);
    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [],
      sorted: [...sorted],
      codeLine: 11,
      explanation: `Index ${i} (${arr[i]}) is now sorted.`,
    });
  }

  sorted.push(n - 1);
  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    codeLine: 13,
    explanation: "Selection Sort Complete! The array is fully sorted.",
  });

  return steps;
}

export function generateInsertionSortSteps(initialArray: number[]): SortingStep[] {
  const steps: SortingStep[] = [];
  const arr = [...initialArray];
  const n = arr.length;
  const sorted: number[] = [0];

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: [0],
    codeLine: 0,
    explanation: "Initial array state. Index 0 is trivially sorted.",
  });

  for (let i = 1; i < n; i++) {
    const key = arr[i];
    let j = i - 1;

    steps.push({
      array: [...arr],
      comparing: [i],
      swapping: [],
      sorted: [...sorted],
      codeLine: 3,
      explanation: `Picking key element arr[${i}] (${key}) to insert into sorted sub-array [0..${i - 1}].`,
    });

    while (j >= 0 && arr[j] > key) {
      steps.push({
        array: [...arr],
        comparing: [j, j + 1],
        swapping: [j, j + 1],
        sorted: [...sorted],
        codeLine: 6,
        explanation: `arr[${j}] (${arr[j]}) > key (${key}). Shifting arr[${j}] right to index ${j + 1}.`,
      });

      arr[j + 1] = arr[j];
      j--;

      steps.push({
        array: [...arr],
        comparing: [],
        swapping: [],
        sorted: [...sorted],
        codeLine: 7,
        explanation: `Shifted! Sub-array state: [${arr.join(", ")}].`,
      });
    }

    arr[j + 1] = key;
    sorted.push(i);

    steps.push({
      array: [...arr],
      comparing: [],
      swapping: [j + 1],
      sorted: [...sorted],
      codeLine: 9,
      explanation: `Inserted key (${key}) at position ${j + 1}.`,
    });
  }

  steps.push({
    array: [...arr],
    comparing: [],
    swapping: [],
    sorted: Array.from({ length: n }, (_, i) => i),
    codeLine: 11,
    explanation: "Insertion Sort Complete! Array is sorted.",
  });

  return steps;
}
