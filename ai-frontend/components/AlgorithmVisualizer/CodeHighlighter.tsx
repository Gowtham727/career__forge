"use client";

import React, { useState } from "react";

export interface CodeSnippet {
  java: string[];
  python: string[];
  cpp: string[];
  javascript: string[];
}

export const ALGORITHM_CODE_SNIPPETS: Record<string, CodeSnippet> = {
  "bubble-sort": {
    java: [
      "public static void bubbleSort(int[] arr) {",
      "    int n = arr.length;",
      "    for (int i = 0; i < n - 1; i++) {",
      "        for (int j = 0; j < n - i - 1; j++) {",
      "            if (arr[j] > arr[j + 1]) {",
      "                int temp = arr[j];",
      "                arr[j] = arr[j + 1];",
      "                arr[j + 1] = temp;",
      "            }",
      "        }",
      "    }",
      "}",
    ],
    python: [
      "def bubble_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n - 1):",
      "        for j in range(0, n - i - 1):",
      "            if arr[j] > arr[j + 1]:",
      "                arr[j], arr[j + 1] = arr[j + 1], arr[j]",
    ],
    cpp: [
      "void bubbleSort(int arr[], int n) {",
      "    for (int i = 0; i < n - 1; i++) {",
      "        for (int j = 0; j < n - i - 1; j++) {",
      "            if (arr[j] > arr[j + 1]) {",
      "                swap(arr[j], arr[j + 1]);",
      "            }",
      "        }",
      "    }",
      "}",
    ],
    javascript: [
      "function bubbleSort(arr) {",
      "  let n = arr.length;",
      "  for (let i = 0; i < n - 1; i++) {",
      "    for (let j = 0; j < n - i - 1; j++) {",
      "      if (arr[j] > arr[j + 1]) {",
      "        [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];",
      "      }",
      "    }",
      "  }",
      "}",
    ],
  },
  "selection-sort": {
    java: [
      "public static void selectionSort(int[] arr) {",
      "    int n = arr.length;",
      "    for (int i = 0; i < n - 1; i++) {",
      "        int minIdx = i;",
      "        for (int j = i + 1; j < n; j++) {",
      "            if (arr[j] < arr[minIdx]) {",
      "                minIdx = j;",
      "            }",
      "        }",
      "        int temp = arr[minIdx];",
      "        arr[minIdx] = arr[i];",
      "        arr[i] = temp;",
      "    }",
      "}",
    ],
    python: [
      "def selection_sort(arr):",
      "    n = len(arr)",
      "    for i in range(n - 1):",
      "        min_idx = i",
      "        for j in range(i + 1, n):",
      "            if arr[j] < arr[min_idx]:",
      "                min_idx = j",
      "        arr[i], arr[min_idx] = arr[min_idx], arr[i]",
    ],
    cpp: [
      "void selectionSort(int arr[], int n) {",
      "    for (int i = 0; i < n - 1; i++) {",
      "        int minIdx = i;",
      "        for (int j = i + 1; j < n; j++) {",
      "            if (arr[j] < arr[minIdx]) minIdx = j;",
      "        }",
      "        swap(arr[i], arr[minIdx]);",
      "    }",
      "}",
    ],
    javascript: [
      "function selectionSort(arr) {",
      "  let n = arr.length;",
      "  for (let i = 0; i < n - 1; i++) {",
      "    let minIdx = i;",
      "    for (let j = i + 1; j < n; j++) {",
      "      if (arr[j] < arr[minIdx]) minIdx = j;",
      "    }",
      "    [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];",
      "  }",
      "}",
    ],
  },
  "insertion-sort": {
    java: [
      "public static void insertionSort(int[] arr) {",
      "    int n = arr.length;",
      "    for (int i = 1; i < n; i++) {",
      "        int key = arr[i];",
      "        int j = i - 1;",
      "        while (j >= 0 && arr[j] > key) {",
      "            arr[j + 1] = arr[j];",
      "            j = j - 1;",
      "        }",
      "        arr[j + 1] = key;",
      "    }",
      "}",
    ],
    python: [
      "def insertion_sort(arr):",
      "    for i in range(1, len(arr)):",
      "        key = arr[i]",
      "        j = i - 1",
      "        while j >= 0 and arr[j] > key:",
      "            arr[j + 1] = arr[j]",
      "            j -= 1",
      "        arr[j + 1] = key",
    ],
    cpp: [
      "void insertionSort(int arr[], int n) {",
      "    for (int i = 1; i < n; i++) {",
      "        int key = arr[i];",
      "        int j = i - 1;",
      "        while (j >= 0 && arr[j] > key) {",
      "            arr[j + 1] = arr[j];",
      "            j--;",
      "        }",
      "        arr[j + 1] = key;",
      "    }",
      "}",
    ],
    javascript: [
      "function insertionSort(arr) {",
      "  for (let i = 1; i < arr.length; i++) {",
      "    let key = arr[i];",
      "    let j = i - 1;",
      "    while (j >= 0 && arr[j] > key) {",
      "      arr[j + 1] = arr[j];",
      "      j--;",
      "    }",
      "    arr[j + 1] = key;",
      "  }",
      "}",
    ],
  },
  "merge-sort": {
    java: [
      "public static void mergeSort(int[] arr, int l, int r) {",
      "    if (l < r) {",
      "        int m = l + (r - l) / 2;",
      "        mergeSort(arr, l, m);",
      "        mergeSort(arr, m + 1, r);",
      "        merge(arr, l, m, r);",
      "    }",
      "}",
    ],
    python: [
      "def merge_sort(arr):",
      "    if len(arr) > 1:",
      "        mid = len(arr) // 2",
      "        L = arr[:mid]",
      "        R = arr[mid:]",
      "        merge_sort(L)",
      "        merge_sort(R)",
    ],
    cpp: [
      "void mergeSort(int arr[], int l, int r) {",
      "    if (l < r) {",
      "        int m = l + (r - l) / 2;",
      "        mergeSort(arr, l, m);",
      "        mergeSort(arr, m + 1, r);",
      "        merge(arr, l, m, r);",
      "    }",
      "}",
    ],
    javascript: [
      "function mergeSort(arr) {",
      "  if (arr.length <= 1) return arr;",
      "  const mid = Math.floor(arr.length / 2);",
      "  const left = mergeSort(arr.slice(0, mid));",
      "  const right = mergeSort(arr.slice(mid));",
      "  return merge(left, right);",
      "}",
    ],
  },
  "quick-sort": {
    java: [
      "public static void quickSort(int[] arr, int low, int high) {",
      "    if (low < high) {",
      "        int pi = partition(arr, low, high);",
      "        quickSort(arr, low, pi - 1);",
      "        quickSort(arr, pi + 1, high);",
      "    }",
      "}",
    ],
    python: [
      "def quick_sort(arr, low, high):",
      "    if low < high:",
      "        pi = partition(arr, low, high)",
      "        quick_sort(arr, low, pi - 1)",
      "        quick_sort(arr, pi + 1, high)",
    ],
    cpp: [
      "void quickSort(int arr[], int low, int high) {",
      "    if (low < high) {",
      "        int pi = partition(arr, low, high);",
      "        quickSort(arr, low, pi - 1);",
      "        quickSort(arr, pi + 1, high);",
      "    }",
      "}",
    ],
    javascript: [
      "function quickSort(arr, low, high) {",
      "  if (low < high) {",
      "    let pi = partition(arr, low, high);",
      "    quickSort(arr, low, pi - 1);",
      "    quickSort(arr, pi + 1, high);",
      "  }",
      "}",
    ],
  },
  "linear-search": {
    java: [
      "public static int linearSearch(int[] arr, int target) {",
      "    for (int i = 0; i < arr.length; i++) {",
      "        if (arr[i] == target) {",
      "            return i;",
      "        }",
      "    }",
      "    return -1;",
      "}",
    ],
    python: [
      "def linear_search(arr, target):",
      "    for i in range(len(arr)):",
      "        if arr[i] == target:",
      "            return i",
      "    return -1",
    ],
    cpp: [
      "int linearSearch(int arr[], int n, int target) {",
      "    for (int i = 0; i < n; i++) {",
      "        if (arr[i] == target) return i;",
      "    }",
      "    return -1;",
      "}",
    ],
    javascript: [
      "function linearSearch(arr, target) {",
      "  for (let i = 0; i < arr.length; i++) {",
      "    if (arr[i] === target) return i;",
      "  }",
      "  return -1;",
      "}",
    ],
  },
  "binary-search": {
    java: [
      "public static int binarySearch(int[] arr, int target) {",
      "    int low = 0, high = arr.length - 1;",
      "    while (low <= high) {",
      "        int mid = low + (high - low) / 2;",
      "        if (arr[mid] == target) return mid;",
      "        if (arr[mid] < target) low = mid + 1;",
      "        else high = mid - 1;",
      "    }",
      "    return -1;",
      "}",
    ],
    python: [
      "def binary_search(arr, target):",
      "    low, high = 0, len(arr) - 1",
      "    while low <= high:",
      "        mid = (low + high) // 2",
      "        if arr[mid] == target: return mid",
      "        elif arr[mid] < target: low = mid + 1",
      "        else: high = mid - 1",
      "    return -1",
    ],
    cpp: [
      "int binarySearch(int arr[], int n, int target) {",
      "    int low = 0, high = n - 1;",
      "    while (low <= high) {",
      "        int mid = low + (high - low) / 2;",
      "        if (arr[mid] == target) return mid;",
      "        if (arr[mid] < target) low = mid + 1;",
      "        else high = mid - 1;",
      "    }",
      "    return -1;",
      "}",
    ],
    javascript: [
      "function binarySearch(arr, target) {",
      "  let low = 0, high = arr.length - 1;",
      "  while (low <= high) {",
      "    let mid = Math.floor((low + high) / 2);",
      "    if (arr[mid] === target) return mid;",
      "    if (arr[mid] < target) low = mid + 1;",
      "    else high = mid - 1;",
      "  }",
      "  return -1;",
      "}",
    ],
  },
};

interface CodeHighlighterProps {
  algorithmKey: string;
  activeLineIndex?: number | null;
}

export default function CodeHighlighter({
  algorithmKey,
  activeLineIndex = null,
}: CodeHighlighterProps) {
  // Default language set to Java as requested
  const [selectedLang, setSelectedLang] = useState<"java" | "python" | "cpp" | "javascript">("java");

  const snippetObj = ALGORITHM_CODE_SNIPPETS[algorithmKey] || ALGORITHM_CODE_SNIPPETS["bubble-sort"];
  const lines = snippetObj[selectedLang] || snippetObj.java;

  return (
    <div className="bg-zinc-950 border border-white/10 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-full">
      {/* Header Bar */}
      <div className="bg-black/60 px-4 py-2.5 border-b border-white/10 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 animate-pulse" />
          <span className="text-white text-xs font-bold font-mono">Synchronized Code Execution</span>
        </div>

        {/* Language Tabs (Java Default) */}
        <div className="flex items-center gap-1 bg-zinc-900 p-1 rounded-xl border border-white/10 text-[11px] font-semibold">
          {[
            { id: "java", label: "Java ☕" },
            { id: "python", label: "Python 🐍" },
            { id: "cpp", label: "C++ ⚡" },
            { id: "javascript", label: "JS 🟨" },
          ].map((lang) => (
            <button
              key={lang.id}
              onClick={() => setSelectedLang(lang.id as any)}
              className={`px-2.5 py-1 rounded-lg transition-all ${
                selectedLang === lang.id
                  ? "bg-indigo-600 text-white shadow-md font-bold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      {/* Code Display Area */}
      <div className="p-4 font-mono text-xs overflow-x-auto leading-relaxed flex-1 space-y-1 bg-zinc-950">
        {lines.map((line, idx) => {
          const isHighlighted = activeLineIndex !== null && activeLineIndex === idx;
          return (
            <div
              key={idx}
              className={`flex items-center gap-4 px-3 py-1 rounded-lg transition-all ${
                isHighlighted
                  ? "bg-indigo-600/30 border border-indigo-500/50 text-indigo-200 font-bold shadow-md shadow-indigo-500/10 scale-[1.01]"
                  : "text-zinc-300 hover:bg-white/5"
              }`}
            >
              <span className="text-zinc-600 select-none text-[11px] w-6 text-right font-sans">
                {idx + 1}
              </span>
              <pre className="flex-1 whitespace-pre">{line}</pre>
              {isHighlighted && (
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-500 text-white font-bold animate-pulse">
                  Executing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
