"use client";

import React, { useState } from "react";
import Link from "next/link";

const domains = [
  {
    name: "Java",
    topics: ["Basics", "OOP", "Collections", "Exception Handling", "Multithreading", "Streams", "JVM", "Memory Management"],
  },
  {
    name: "Spring Boot",
    topics: ["REST APIs", "Spring MVC", "Dependency Injection", "Spring Security", "JPA/Hibernate", "JWT", "Microservices", "Exception Handling"],
  },
  {
    name: "SQL",
    topics: ["Joins", "Indexes", "Normalization", "Subqueries", "Transactions", "Stored Procedures"],
  },
  {
    name: "DBMS",
    topics: ["ACID Properties", "Normalization", "Concurrency Control", "Indexing", "Keys"],
  },
  {
    name: "Operating System",
    topics: ["Processes and Threads", "Scheduling", "Deadlocks", "Memory Management", "File Systems"],
  },
  {
    name: "Computer Networks",
    topics: ["OSI Model", "TCP/IP", "Routing", "DNS", "HTTP/HTTPS"],
  },
  {
    name: "HR Interview",
    topics: ["Introduction", "Strengths and Weaknesses", "Behavioral", "Situational", "Career Goals"],
  },
];

interface Question {
  question: string;
  answer: string;
  explanation: string;
  difficulty: string;
}

export default function InterviewPrep() {
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState<string>("");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const handleDomainSelect = (domain: string) => {
    setSelectedDomain(domain);
    setSelectedTopic("");
    setQuestions([]);
    setError("");
  };

  const handleTopicSelect = (topic: string) => {
    setSelectedTopic(topic);
    setQuestions([]);
    setError("");
  };

  const generateQuestions = async () => {
    if (!selectedDomain || !selectedTopic) return;
    
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8081/interview-prep/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          domain: selectedDomain,
          topic: selectedTopic,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Server Error (${response.status}): ${errorText || response.statusText}`);
      }

      const data = await response.json();
      setQuestions(data);
    } catch (err: any) {
      if (err.name === 'TypeError' && err.message.includes('Failed to fetch')) {
        setError("Network Error: Could not connect to the backend (Is it running on port 8081 and is CORS configured?).");
      } else {
        setError(err.message || "An error occurred while generating questions.");
      }
    } finally {
      setLoading(false);
    }
  };

  const filteredQuestions = questions.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.difficulty.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getDifficultyColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "easy": return "bg-green-100 text-green-800 border-green-200";
      case "medium": return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "hard": return "bg-red-100 text-red-800 border-red-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Top Navbar */}
      <nav className="border-b border-gray-200 bg-white/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/20">
              CF
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Career<span className="text-indigo-600">Forge</span>
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-7 font-medium text-slate-600">
            <Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link>
            <Link href="/resume-analyzer" className="hover:text-indigo-600 transition-colors">Resume Analyzer</Link>
            <Link href="/interview-prep" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5">Interview Prep</Link>
            <Link href="/algorithm-visualizer" className="hover:text-indigo-600 transition-colors font-semibold">Algorithm Visualizer</Link>
            <Link href="/live-interview" className="hover:text-indigo-600 transition-colors text-indigo-700 font-semibold flex items-center gap-1.5 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Live Interview
            </Link>
            <Link href="/profile" className="hover:text-indigo-600 transition-colors font-semibold">
              Profile
            </Link>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto space-y-8 p-6">
        
        {/* Header */}
        <header className="text-center py-10 bg-white rounded-2xl shadow-sm border border-gray-100">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
            Interview Preparation
          </h1>
          <p className="text-gray-500 text-lg">Select a domain and topic to generate AI-curated interview questions.</p>
        </header>

        {/* Selection Area */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          {/* Domains */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded text-sm">1</span> Select Domain
            </h2>
            <div className="grid grid-cols-2 gap-3">
              {domains.map((d) => (
                <button
                  key={d.name}
                  onClick={() => handleDomainSelect(d.name)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedDomain === d.name
                      ? "bg-blue-50 border-blue-500 ring-2 ring-blue-200"
                      : "bg-gray-50 border-gray-200 hover:border-blue-300 hover:bg-white"
                  }`}
                >
                  <span className="font-medium text-gray-700">{d.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Topics */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
             <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center gap-2">
              <span className="bg-indigo-100 text-indigo-600 px-2 py-1 rounded text-sm">2</span> Select Topic
            </h2>
            {selectedDomain ? (
              <div className="flex flex-wrap gap-2">
                {domains
                  .find((d) => d.name === selectedDomain)
                  ?.topics.map((t) => (
                    <button
                      key={t}
                      onClick={() => handleTopicSelect(t)}
                      className={`px-4 py-2 rounded-full border transition-all ${
                        selectedTopic === t
                          ? "bg-indigo-600 text-white border-indigo-600 shadow-md"
                          : "bg-white text-gray-600 border-gray-300 hover:border-indigo-400 hover:text-indigo-600"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-gray-400 italic">
                Please select a domain first.
              </div>
            )}
          </div>
        </div>

        {/* Generate Button */}
        <div className="flex justify-center pt-4">
          <button
            onClick={generateQuestions}
            disabled={!selectedDomain || !selectedTopic || loading}
            className={`px-8 py-4 rounded-full font-bold text-lg transition-all shadow-lg ${
              !selectedDomain || !selectedTopic
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:shadow-xl hover:scale-105 active:scale-95"
            }`}
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Generating AI Questions...
              </span>
            ) : (
              "Generate Questions"
            )}
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center font-medium border border-red-200">
            {error}
          </div>
        )}

        {/* Results Area */}
        {questions.length > 0 && (
          <div className="space-y-6 pt-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">
                  Generated Questions
                </h3>
                <p className="text-gray-500">
                  {selectedDomain} &gt; {selectedTopic}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <input
                  type="text"
                  placeholder="Search questions..."
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <button
                  onClick={generateQuestions}
                  disabled={loading}
                  className="px-4 py-2 bg-gray-100 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                >
                  Generate Again
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {filteredQuestions.map((q, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden transition-all hover:shadow-md">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex gap-4 items-start">
                        <span className="text-xl font-bold text-gray-300">{(index + 1).toString().padStart(2, '0')}</span>
                        <h4 className="text-lg font-semibold text-gray-800 leading-snug">{q.question}</h4>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getDifficultyColor(q.difficulty)}`}>
                        {q.difficulty}
                      </span>
                    </div>
                    
                    <div className="ml-10">
                      <button
                        onClick={() => setExpandedIndex(expandedIndex === index ? null : index)}
                        className="text-blue-600 font-medium hover:text-blue-800 transition-colors flex items-center gap-1"
                      >
                        {expandedIndex === index ? "Hide Answer" : "Show Answer"}
                      </button>

                      {expandedIndex === index && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-xl border border-gray-100 space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
                          <div>
                            <strong className="text-gray-900 block mb-1">Answer:</strong>
                            <p className="text-gray-700 leading-relaxed">{q.answer}</p>
                          </div>
                          {q.explanation && (
                            <div>
                              <strong className="text-gray-900 block mb-1 text-sm">Explanation:</strong>
                              <p className="text-gray-600 text-sm leading-relaxed">{q.explanation}</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              {filteredQuestions.length === 0 && (
                <div className="text-center py-10 text-gray-500">
                  No questions match your search.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
