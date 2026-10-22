"use client";

import React, { useEffect, useRef, useState } from "react";
import Editor, { OnMount } from "@monaco-editor/react";
import { Socket } from "socket.io-client";

interface CodeEditorProps {
  socket: Socket | null;
  roomId: string;
  isReadOnly?: boolean;
}

const LANGUAGE_TEMPLATES: Record<string, string> = {
  python: `# CareerForge Live Technical Interview
def solution(nums, target):
    """
    Find two numbers in nums that add up to target.
    """
    seen = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in seen:
            return [seen[diff], i]
        seen[num] = i
    return []

# Test execution
if __name__ == "__main__":
    nums = [2, 7, 11, 15]
    target = 9
    result = solution(nums, target)
    print(f"Result for target {target}:", result)
`,
  javascript: `// CareerForge Live Technical Interview
function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log("TwoSum Result:", twoSum([2, 7, 11, 15], 9));
`,
  typescript: `// CareerForge Live Technical Interview
function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log("TwoSum Result:", twoSum([2, 7, 11, 15], 9));
`,
  java: `// CareerForge Live Technical Interview
import java.util.HashMap;
import java.util.Arrays;

public class Main {
    public static int[] twoSum(int[] nums, int target) {
        HashMap<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int complement = target - nums[i];
            if (map.containsKey(complement)) {
                return new int[] { map.get(complement), i };
            }
            map.put(nums[i], i);
        }
        return new int[] {};
    }

    public static void main(String[] args) {
        int[] result = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("Result: " + Arrays.toString(result));
    }
}
`,
  cpp: `// CareerForge Live Technical Interview
#include <iostream>
#include <vector>
#include <unordered_map>

using namespace std;

vector<int> twoSum(vector<int>& nums, int target) {
    unordered_map<int, int> mp;
    for (int i = 0; i < nums.size(); i++) {
        int complement = target - nums[i];
        if (mp.count(complement)) {
            return {mp[complement], i};
        }
        mp[nums[i]] = i;
    }
    return {};
}

int main() {
    vector<int> nums = {2, 7, 11, 15};
    vector<int> res = twoSum(nums, 9);
    cout << "Result: [" << res[0] << ", " << res[1] << "]" << endl;
    return 0;
}
`,
  csharp: `// CareerForge Live Technical Interview
using System;
using System.Collections.Generic;

class Program {
    static int[] TwoSum(int[] nums, int target) {
        var map = new Dictionary<int, int>();
        for (int i = 0; i < nums.Length; i++) {
            int comp = target - nums[i];
            if (map.ContainsKey(comp)) return new int[] { map[comp], i };
            map[nums[i]] = i;
        }
        return new int[0];
    }

    static void Main() {
        var res = TwoSum(new int[] { 2, 7, 11, 15 }, 9);
        Console.WriteLine($"Result: [{res[0]}, {res[1]}]");
    }
}
`,
  go: `// CareerForge Live Technical Interview
package main

import "fmt"

func twoSum(nums []int, target int) []int {
    m := make(map[int]int)
    for i, num := range nums {
        diff := target - num
        if idx, ok := m[diff]; ok {
            return []int{idx, i}
        }
        m[num] = i
    }
    return nil
}

func main() {
    res := twoSum([]int{2, 7, 11, 15}, 9)
    fmt.Printf("Result: %v\\n", res)
}
`,
  rust: `// CareerForge Live Technical Interview
use std::collections::HashMap;

fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let diff = target - num;
        if let Some(&prev_i) = map.get(&diff) {
            return vec![prev_i as i32, i as i32];
        }
        map.insert(num, i);
    }
    vec![]
}

fn main() {
    let result = two_sum(vec![2, 7, 11, 15], 9);
    println!("Result: {:?}", result);
}
`,
};

export default function CodeEditor({ socket, roomId, isReadOnly = false }: CodeEditorProps) {
  const [language, setLanguage] = useState<string>("python");
  const [code, setCode] = useState<string>(LANGUAGE_TEMPLATES.python);
  const [theme, setTheme] = useState<string>("vs-dark");
  const [fontSize, setFontSize] = useState<number>(14);

  // Terminal & Execution States
  const [activeTab, setActiveTab] = useState<"output" | "stdin">("output");
  const [stdin, setStdin] = useState<string>("");
  const [output, setOutput] = useState<string>("");
  const [stderr, setStderr] = useState<string>("");
  const [executionTime, setExecutionTime] = useState<number | null>(null);
  const [exitCode, setExitCode] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copyNotice, setCopyNotice] = useState<boolean>(false);

  const isRemoteChangeRef = useRef<boolean>(false);
  const editorRef = useRef<any>(null);

  const storageKey = `interview_code_${roomId}`;

  // Load auto-saved local code on initial mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.code) setCode(parsed.code);
        if (parsed.language) setLanguage(parsed.language);
      }
    } catch (e) {
      console.warn("Failed to load local saved code", e);
    }
  }, [storageKey]);

  // Handle Socket Events for Code & Language Synchronization
  useEffect(() => {
    if (!socket) return;

    // Request latest code state from room
    socket.emit("request-code-sync", roomId);

    socket.on("code-change", (data: { code: string; language?: string }) => {
      isRemoteChangeRef.current = true;
      setCode(data.code);
      if (data.language && data.language !== language) {
        setLanguage(data.language);
      }
      setTimeout(() => {
        isRemoteChangeRef.current = false;
      }, 50);
    });

    socket.on("language-change", (newLang: string) => {
      setLanguage(newLang);
    });

    socket.on("code-sync-response", (data: { code: string; language: string }) => {
      if (data.code) {
        isRemoteChangeRef.current = true;
        setCode(data.code);
        setLanguage(data.language || "python");
        setTimeout(() => {
          isRemoteChangeRef.current = false;
        }, 50);
      }
    });

    return () => {
      socket.off("code-change");
      socket.off("language-change");
      socket.off("code-sync-response");
    };
  }, [socket, roomId, language]);

  // Local auto-save to localStorage
  const handleCodeChange = (val: string | undefined) => {
    const newCode = val || "";
    setCode(newCode);

    if (!isRemoteChangeRef.current) {
      // Broadcast to peers via socket
      if (socket) {
        socket.emit("code-change", roomId, { code: newCode, language });
      }
      // Save locally
      try {
        localStorage.setItem(storageKey, JSON.stringify({ code: newCode, language }));
      } catch (e) {
        console.error("Failed to auto-save code to localStorage", e);
      }
    }
  };

  const handleLanguageChange = (newLang: string) => {
    setLanguage(newLang);
    const template = LANGUAGE_TEMPLATES[newLang] || `// Welcome to ${newLang}\n`;
    setCode(template);

    if (socket) {
      socket.emit("language-change", roomId, newLang);
      socket.emit("code-change", roomId, { code: template, language: newLang });
    }

    try {
      localStorage.setItem(storageKey, JSON.stringify({ code: template, language: newLang }));
    } catch (e) {}
  };

  const handleEditorMount: OnMount = (editor) => {
    editorRef.current = editor;
  };

  // Run Code via /api/execute API
  const runCode = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setActiveTab("output");
    setOutput("");
    setStderr("");
    setExecutionTime(null);
    setExitCode(null);

    try {
      const res = await fetch("/api/execute", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          language,
          code,
          stdin,
        }),
      });

      const data = await res.json();
      setOutput(data.output || "");
      setStderr(data.stderr || "");
      setExitCode(data.exitCode ?? 0);
      setExecutionTime(data.executionTime || 0);
    } catch (err: any) {
      setStderr(`Execution request failed: ${err.message}`);
      setExitCode(1);
    } finally {
      setIsRunning(false);
    }
  };

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopyNotice(true);
    setTimeout(() => setCopyNotice(false), 2000);
  };

  const downloadCode = () => {
    const extMap: Record<string, string> = {
      python: "py",
      javascript: "js",
      typescript: "ts",
      java: "java",
      cpp: "cpp",
      csharp: "cs",
      go: "go",
      rust: "rs",
    };
    const ext = extMap[language] || "txt";
    const blob = new Blob([code], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `interview_solution.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const resetTemplate = () => {
    if (confirm("Reset editor to default language boilerplate?")) {
      handleLanguageChange(language);
    }
  };

  return (
    <div className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl p-4 flex flex-col gap-4 shadow-2xl backdrop-blur-xl">
      {/* Editor Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
        {/* Left: Language & Theme Selectors */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-white font-extrabold text-sm tracking-wide">Collaborative Code Editor</span>
          </div>

          <select
            value={language}
            onChange={(e) => handleLanguageChange(e.target.value)}
            disabled={isReadOnly}
            className="px-3 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs font-semibold text-indigo-300 focus:outline-none focus:border-indigo-500 transition-colors"
          >
            <option value="python">Python 3</option>
            <option value="javascript">JavaScript (Node.js)</option>
            <option value="typescript">TypeScript</option>
            <option value="java">Java 17</option>
            <option value="cpp">C++ (GCC)</option>
            <option value="csharp">C# (.NET)</option>
            <option value="go">Go</option>
            <option value="rust">Rust</option>
          </select>

          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
            className="px-2.5 py-1.5 bg-black/60 border border-white/15 rounded-xl text-xs font-medium text-zinc-300 focus:outline-none"
          >
            <option value="vs-dark">Dark (VS Dark)</option>
            <option value="light">Light</option>
          </select>

          <div className="flex items-center gap-1 bg-black/40 px-2 py-1 rounded-xl border border-white/10 text-xs text-zinc-400">
            <span>Font:</span>
            <button
              onClick={() => setFontSize((f) => Math.max(10, f - 1))}
              className="px-1.5 hover:text-white font-bold"
            >
              -
            </button>
            <span className="font-mono text-white">{fontSize}px</span>
            <button
              onClick={() => setFontSize((f) => Math.min(24, f + 1))}
              className="px-1.5 hover:text-white font-bold"
            >
              +
            </button>
          </div>
        </div>

        {/* Right Actions: Copy, Download, Reset, Run Code */}
        <div className="flex items-center gap-2">
          <button
            onClick={copyCode}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all"
          >
            {copyNotice ? "✓ Copied!" : "📋 Copy"}
          </button>

          <button
            onClick={downloadCode}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 border border-white/10 rounded-xl text-xs font-semibold transition-all"
          >
            💾 Download
          </button>

          <button
            onClick={resetTemplate}
            disabled={isReadOnly}
            className="px-3 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-white border border-white/10 rounded-xl text-xs font-semibold transition-all"
          >
            🔄 Reset
          </button>

          <button
            onClick={runCode}
            disabled={isRunning || isReadOnly}
            className={`px-5 py-1.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold text-xs rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all flex items-center gap-2 ${
              isRunning ? "opacity-75 cursor-wait" : ""
            }`}
          >
            {isRunning ? (
              <>
                <span className="w-3 h-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Executing...
              </>
            ) : (
              <>
                <span>▶️ Run Code</span>
                <span className="text-[10px] opacity-75 font-mono">(Ctrl+Enter)</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco Editor Container */}
      <div className="w-full h-[400px] bg-zinc-950 rounded-xl overflow-hidden border border-white/10 shadow-inner">
        <Editor
          height="100%"
          language={language}
          value={code}
          theme={theme}
          onMount={handleEditorMount}
          onChange={handleCodeChange}
          options={{
            readOnly: isReadOnly,
            fontSize,
            minimap: { enabled: false },
            automaticLayout: true,
            scrollBeyondLastLine: false,
            wordWrap: "on",
            lineNumbers: "on",
            fontFamily: "'Fira Code', 'Cascadia Code', Consolas, monospace",
            formatOnType: true,
            padding: { top: 12, bottom: 12 },
          }}
        />
      </div>

      {/* Interactive Compiler Output / Stdin Terminal */}
      <div className="w-full bg-zinc-950 border border-white/10 rounded-xl overflow-hidden flex flex-col">
        {/* Terminal Header Tabs */}
        <div className="flex items-center justify-between bg-black/60 px-4 py-2 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveTab("output")}
              className={`text-xs font-bold transition-colors flex items-center gap-2 ${
                activeTab === "output" ? "text-indigo-400 border-b-2 border-indigo-500 pb-0.5" : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>💻 Output Window</span>
              {exitCode !== null && (
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                    exitCode === 0 ? "bg-emerald-500/20 text-emerald-300" : "bg-rose-500/20 text-rose-300"
                  }`}
                >
                  Exit Code: {exitCode}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab("stdin")}
              className={`text-xs font-bold transition-colors ${
                activeTab === "stdin" ? "text-indigo-400 border-b-2 border-indigo-500 pb-0.5" : "text-zinc-400 hover:text-white"
              }`}
            >
              📥 Standard Input (stdin)
            </button>
          </div>

          {executionTime !== null && (
            <span className="text-[11px] font-mono text-zinc-500">
              Execution Time: <span className="text-zinc-300 font-bold">{executionTime}ms</span>
            </span>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-4 min-h-[120px] max-h-[220px] overflow-y-auto font-mono text-xs">
          {activeTab === "output" ? (
            <div className="space-y-2">
              {!output && !stderr && !isRunning && (
                <div className="text-zinc-500 italic">
                  Press "Run Code" to compile and execute program output...
                </div>
              )}

              {isRunning && (
                <div className="text-indigo-400 flex items-center gap-2 animate-pulse">
                  <span>⚙️ Compiling code with online platform container...</span>
                </div>
              )}

              {output && (
                <div>
                  <div className="text-zinc-400 text-[10px] uppercase font-sans tracking-wider mb-1 font-bold">
                    Standard Output (stdout):
                  </div>
                  <pre className="text-emerald-300 whitespace-pre-wrap leading-relaxed">{output}</pre>
                </div>
              )}

              {stderr && (
                <div className="mt-2 pt-2 border-t border-rose-500/20">
                  <div className="text-rose-400 text-[10px] uppercase font-sans tracking-wider mb-1 font-bold">
                    Standard Error / Traceback (stderr):
                  </div>
                  <pre className="text-rose-300 whitespace-pre-wrap leading-relaxed">{stderr}</pre>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <label className="text-zinc-400 text-[11px] font-sans block font-medium">
                Provide custom inputs for interactive programs (e.g., input() or Scanner):
              </label>
              <textarea
                value={stdin}
                onChange={(e) => setStdin(e.target.value)}
                placeholder="Enter input values line by line..."
                rows={4}
                className="w-full bg-black border border-white/10 rounded-xl p-3 text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 font-mono text-xs"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
