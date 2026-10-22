"use client";

import React from "react";

export interface AlgorithmInfo {
  name: string;
  category: "Sorting" | "Searching";
  bestTime: string;
  avgTime: string;
  worstTime: string;
  spaceComplexity: string;
  description: string;
  interviewTip: string;
}

export const ALGORITHM_DETAILS: Record<string, AlgorithmInfo> = {
  "bubble-sort": {
    name: "Bubble Sort",
    category: "Sorting",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.",
    interviewTip: "Bubble sort is stable and operates in-place. An optimized version can terminate early if no swaps occur during a pass.",
  },
  "selection-sort": {
    name: "Selection Sort",
    category: "Sorting",
    bestTime: "O(n²)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Divides the array into a sorted and unsorted region, repeatedly finding the minimum element from the unsorted region.",
    interviewTip: "Selection sort minimizes the total number of swaps (at most O(n) swaps), making it useful when write ops are expensive.",
  },
  "insertion-sort": {
    name: "Insertion Sort",
    category: "Sorting",
    bestTime: "O(n)",
    avgTime: "O(n²)",
    worstTime: "O(n²)",
    spaceComplexity: "O(1)",
    description: "Builds the final sorted array one item at a time by inserting each element into its proper position.",
    interviewTip: "Efficient for small datasets or nearly-sorted arrays. Often used as the base case in hybrid algorithms like Timsort.",
  },
  "merge-sort": {
    name: "Merge Sort",
    category: "Sorting",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n log n)",
    spaceComplexity: "O(n)",
    description: "A divide-and-conquer algorithm that recursively splits the array into halves, sorts them, and merges them.",
    interviewTip: "Guaranteed O(n log n) time performance and stable sort. Requires O(n) extra space for auxiliary arrays.",
  },
  "quick-sort": {
    name: "Quick Sort",
    category: "Sorting",
    bestTime: "O(n log n)",
    avgTime: "O(n log n)",
    worstTime: "O(n²)",
    spaceComplexity: "O(log n)",
    description: "Picks a pivot element and partitions array elements into items smaller than pivot and items greater than pivot.",
    interviewTip: "In-place and cache-friendly. Randomized pivot selection avoids worst-case O(n²) behavior on pre-sorted data.",
  },
  "linear-search": {
    name: "Linear Search",
    category: "Searching",
    bestTime: "O(1)",
    avgTime: "O(n)",
    worstTime: "O(n)",
    spaceComplexity: "O(1)",
    description: "Sequentially checks each element of the array from beginning to end until a match is found.",
    interviewTip: "Works on unsorted arrays. Does not require pre-sorted data, making it the simplest search algorithm.",
  },
  "binary-search": {
    name: "Binary Search",
    category: "Searching",
    bestTime: "O(1)",
    avgTime: "O(log n)",
    worstTime: "O(log n)",
    spaceComplexity: "O(1)",
    description: "Repeatedly divides the search interval in half on a sorted array by comparing target with middle element.",
    interviewTip: "Requires the array to be sorted first. Reduces search space by half at every step.",
  },
};

interface TheoryCardProps {
  algorithmKey: string;
}

export default function TheoryCard({ algorithmKey }: TheoryCardProps) {
  const info = ALGORITHM_DETAILS[algorithmKey] || ALGORITHM_DETAILS["bubble-sort"];

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
            {info.category} Theory & Analysis
          </span>
          <h3 className="text-xl font-extrabold text-white mt-1">{info.name}</h3>
        </div>
      </div>

      <p className="text-xs text-zinc-300 leading-relaxed">{info.description}</p>

      {/* Complexity Badges Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="bg-black/50 border border-white/10 p-2.5 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-medium">Best Time</span>
          <span className="text-xs font-mono font-bold text-emerald-400">{info.bestTime}</span>
        </div>
        <div className="bg-black/50 border border-white/10 p-2.5 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-medium">Average Time</span>
          <span className="text-xs font-mono font-bold text-amber-400">{info.avgTime}</span>
        </div>
        <div className="bg-black/50 border border-white/10 p-2.5 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-medium">Worst Time</span>
          <span className="text-xs font-mono font-bold text-rose-400">{info.worstTime}</span>
        </div>
        <div className="bg-black/50 border border-white/10 p-2.5 rounded-xl text-center">
          <span className="text-[10px] text-zinc-400 block font-medium">Space Complexity</span>
          <span className="text-xs font-mono font-bold text-purple-400">{info.spaceComplexity}</span>
        </div>
      </div>

      {/* Interview Tip Box */}
      <div className="bg-indigo-950/40 border border-indigo-500/30 p-3 rounded-xl text-xs space-y-1">
        <span className="font-bold text-indigo-300 flex items-center gap-1.5">
          <span>💡 Technical Interview Insight</span>
        </span>
        <p className="text-zinc-300 text-[11px] leading-relaxed">{info.interviewTip}</p>
      </div>
    </div>
  );
}
