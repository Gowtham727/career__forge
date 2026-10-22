"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import SortingVisualizer, {
  SortingStep,
  generateBubbleSortSteps,
  generateSelectionSortSteps,
  generateInsertionSortSteps,
} from "@/components/AlgorithmVisualizer/SortingVisualizer";
import SearchingVisualizer, {
  SearchingStep,
  generateLinearSearchSteps,
  generateBinarySearchSteps,
} from "@/components/AlgorithmVisualizer/SearchingVisualizer";
import CodeHighlighter from "@/components/AlgorithmVisualizer/CodeHighlighter";
import ControlPanel from "@/components/AlgorithmVisualizer/ControlPanel";
import TheoryCard from "@/components/AlgorithmVisualizer/TheoryCard";

const TEST_CASES: Record<string, number[]> = {
  random: [45, 12, 89, 34, 67, 23, 90, 11],
  "nearly-sorted": [10, 20, 30, 50, 40, 60, 70, 80],
  reversed: [90, 80, 70, 60, 50, 40, 30, 20],
  duplicates: [25, 50, 25, 75, 50, 10, 25, 90],
};

export default function AlgorithmVisualizerPage() {
  const [selectedAlg, setSelectedAlg] = useState<string>("bubble-sort");
  const [selectedTestCase, setSelectedTestCase] = useState<string>("random");
  const [customInput, setCustomInput] = useState<string>("45, 12, 89, 34, 67, 23");
  const [searchTarget, setSearchTarget] = useState<number>(34);

  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<number>(1);

  const isSearching = selectedAlg.includes("search");

  // Get active array based on selected test case
  const activeArray = useMemo(() => {
    if (selectedTestCase === "custom") {
      const parsed = customInput
        .split(",")
        .map((s) => parseInt(s.trim()))
        .filter((n) => !isNaN(n));
      return parsed.length > 0 ? parsed : [10, 20, 30, 40, 50];
    }
    return TEST_CASES[selectedTestCase] || TEST_CASES.random;
  }, [selectedTestCase, customInput]);

  // Generate steps based on selected algorithm and array
  const steps = useMemo(() => {
    switch (selectedAlg) {
      case "bubble-sort":
        return generateBubbleSortSteps(activeArray);
      case "selection-sort":
        return generateSelectionSortSteps(activeArray);
      case "insertion-sort":
        return generateInsertionSortSteps(activeArray);
      case "linear-search":
        return generateLinearSearchSteps(activeArray, searchTarget);
      case "binary-search":
        return generateBinarySearchSteps(activeArray, searchTarget);
      default:
        return generateBubbleSortSteps(activeArray);
    }
  }, [selectedAlg, activeArray, searchTarget]);

  // Reset playback step index when algorithm or test case changes
  useEffect(() => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  }, [selectedAlg, selectedTestCase, customInput, searchTarget]);

  // Playback timer ticker
  useEffect(() => {
    if (!isPlaying) return;

    const intervalTime = Math.max(100, Math.floor(1000 / speed));
    const timer = setInterval(() => {
      setCurrentStepIndex((prev) => {
        if (prev >= steps.length - 1) {
          setIsPlaying(false);
          return prev;
        }
        return prev + 1;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, speed, steps.length]);

  const handlePlayPause = () => {
    if (currentStepIndex >= steps.length - 1) {
      setCurrentStepIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  const handleStepForward = () => {
    if (currentStepIndex < steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBackward = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentStepIndex(0);
  };

  const handleCustomArraySubmit = (inputStr: string) => {
    setCustomInput(inputStr);
    setSelectedTestCase("custom");
  };

  const currentFrame = steps[currentStepIndex] || steps[0];

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans flex flex-col">
      {/* Navigation Header */}
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
            <Link href="/algorithm-visualizer" className="text-indigo-400 font-bold border-b-2 border-indigo-500 pb-0.5">Algorithm Visualizer</Link>
            <Link href="/live-interview" className="hover:text-white transition-colors">Live Interview</Link>
            <Link href="/profile" className="hover:text-white transition-colors">Profile</Link>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-6 space-y-6">
        {/* Page Banner & Algorithm Selector */}
        <div className="bg-zinc-900/60 border border-white/10 rounded-3xl p-6 backdrop-blur-xl flex flex-wrap items-center justify-between gap-6 shadow-2xl">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/30 bg-indigo-500/10 text-indigo-300 font-medium text-xs mb-2">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              Interactive Code Execution & Visual Learning
            </div>
            <h1 className="text-3xl font-extrabold text-white">Algorithm Visualizer</h1>
            <p className="text-zinc-400 text-sm mt-1">
              Learn sorting & searching algorithms visually with step-by-step test cases and synchronized Java code execution.
            </p>
          </div>

          {/* Algorithm Type Tabs & Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="bg-black/60 p-1.5 rounded-2xl border border-white/10 flex flex-wrap gap-1">
              {[
                { id: "bubble-sort", name: "Bubble Sort", cat: "Sorting" },
                { id: "selection-sort", name: "Selection Sort", cat: "Sorting" },
                { id: "insertion-sort", name: "Insertion Sort", cat: "Sorting" },
                { id: "linear-search", name: "Linear Search", cat: "Searching" },
                { id: "binary-search", name: "Binary Search", cat: "Searching" },
              ].map((alg) => (
                <button
                  key={alg.id}
                  onClick={() => setSelectedAlg(alg.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    selectedAlg === alg.id
                      ? "bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-lg shadow-indigo-500/25 scale-105"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {alg.name}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Visualizer & Code Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column (Visual Canvas & Controls) */}
          <div className="lg:col-span-7 space-y-6">
            {/* Visual Canvas (Sorting or Searching) */}
            {isSearching ? (
              <SearchingVisualizer currentFrame={currentFrame as SearchingStep} />
            ) : (
              <SortingVisualizer currentFrame={currentFrame as SortingStep} />
            )}

            {/* Playback Control Panel */}
            <ControlPanel
              isPlaying={isPlaying}
              speed={speed}
              currentStepIndex={currentStepIndex}
              totalSteps={steps.length}
              selectedTestCase={selectedTestCase}
              isSearchingAlgorithm={isSearching}
              searchTarget={searchTarget}
              customArrayInput={customInput}
              onPlayPauseToggle={handlePlayPause}
              onStepForward={handleStepForward}
              onStepBackward={handleStepBackward}
              onReset={handleReset}
              onSpeedChange={setSpeed}
              onTestCaseChange={setSelectedTestCase}
              onCustomArraySubmit={handleCustomArraySubmit}
              onSearchTargetChange={setSearchTarget}
            />

            {/* Algorithm Theory & Complexity Card */}
            <TheoryCard algorithmKey={selectedAlg} />
          </div>

          {/* Right Column (Synchronized Java Code Line Highlighter) */}
          <div className="lg:col-span-5 h-full">
            <CodeHighlighter
              algorithmKey={selectedAlg}
              activeLineIndex={currentFrame ? currentFrame.codeLine : 0}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
