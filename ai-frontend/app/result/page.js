"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  RadialBarChart,
  RadialBar,
  PolarAngleAxis,
} from "recharts";

/* ───────────────────────────────────────────────────────────────── */
/*  Recursive Roadmap Node                                          */
/* ───────────────────────────────────────────────────────────────── */
function RoadmapNode({ node, depth = 0 }) {
  const [expanded, setExpanded] = useState(depth < 2);
  const hasChildren = node.children && node.children.length > 0;

  const difficultyColors = {
    Beginner: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
    Intermediate: { bg: "bg-amber-500/10", text: "text-amber-400", border: "border-amber-500/20" },
    Advanced: { bg: "bg-rose-500/10", text: "text-rose-400", border: "border-rose-500/20" },
  };

  const colors = difficultyColors[node.difficulty] || difficultyColors.Beginner;

  // Accent colors that rotate based on depth
  const depthAccents = [
    "border-indigo-500/30",
    "border-purple-500/30",
    "border-pink-500/30",
    "border-blue-500/30",
    "border-cyan-500/30",
    "border-teal-500/30",
  ];
  const accent = depthAccents[depth % depthAccents.length];

  return (
    <div className={`relative ${depth > 0 ? "ml-6 md:ml-8" : ""}`}>
      {/* Connector line */}
      {depth > 0 && (
        <div className="absolute left-[-20px] md:left-[-24px] top-0 bottom-0 w-px bg-gradient-to-b from-white/10 to-transparent" />
      )}
      {depth > 0 && (
        <div className="absolute left-[-20px] md:left-[-24px] top-6 w-5 md:w-6 h-px bg-white/10" />
      )}

      <div
        className={`group rounded-2xl border ${accent} bg-zinc-900/40 backdrop-blur-sm hover:bg-zinc-900/70 transition-all duration-300 mb-3 overflow-hidden ${
          hasChildren ? "cursor-pointer" : ""
        }`}
        onClick={() => hasChildren && setExpanded(!expanded)}
      >
        {/* Header */}
        <div className="flex items-start gap-4 p-5">
          {/* Expand/collapse indicator */}
          {hasChildren ? (
            <button
              className="mt-1 flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-white/10 transition-all"
              onClick={(e) => {
                e.stopPropagation();
                setExpanded(!expanded);
              }}
            >
              <svg
                className={`w-4 h-4 transition-transform duration-300 ${expanded ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <div className="mt-1 flex-shrink-0 w-7 h-7 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-white/30" />
            </div>
          )}

          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <h4 className="text-white font-bold text-base md:text-lg leading-tight">
                {node.title}
              </h4>
              {node.difficulty && (
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${colors.bg} ${colors.text} ${colors.border}`}>
                  {node.difficulty}
                </span>
              )}
              {node.estimatedHours > 0 && (
                <span className="text-xs font-medium text-zinc-500 flex items-center gap-1">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {node.estimatedHours}h
                </span>
              )}
            </div>
            {node.description && (
              <p className="text-zinc-400 text-sm leading-relaxed font-light">
                {node.description}
              </p>
            )}
            {hasChildren && (
              <span className="text-xs text-zinc-600 mt-2 inline-block">
                {node.children.length} subtopic{node.children.length > 1 ? "s" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Children */}
      {hasChildren && expanded && (
        <div className="pb-2 transition-all duration-500">
          {node.children.map((child, idx) => (
            <RoadmapNode key={idx} node={child} depth={depth + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

/* ───────────────────────────────────────────────────────────────── */
/*  Main Result Page                                                */
/* ───────────────────────────────────────────────────────────────── */
export default function ResultPage() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(false);
  
  const [questions, setQuestions] = useState(null);
  const [loadingQuestions, setLoadingQuestions] = useState(false);
  const [roadmapData, setRoadmapData] = useState([]);
  const [loadingRoadmap, setLoadingRoadmap] = useState(false);
  const questionsRef = useRef(null);
  const roadmapRef = useRef(null);

  const router = useRouter();

  useEffect(() => {
    const storedData = sessionStorage.getItem("resumeResult");
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setData(parsedData);
        if (parsedData.roadmap && parsedData.roadmap !== "[]") {
          setRoadmapData(safeParse(parsedData.roadmap));
        }
      } catch (e) {
        setError(true);
      }
    } else {
      setError(true);
    }
  }, []);

  const handleGenerateQuestions = async () => {
    if (!data?.id) {
      alert("Error: Analysis ID not found. Please try analyzing again.");
      return;
    }

    setLoadingQuestions(true);
    try {
      const res = await fetch(`http://localhost:8081/analyze/resume/${data.id}/questions`);
      if (!res.ok) throw new Error("Failed to fetch");
      
      const text = await res.text();
      let parsedQuestions = [];
      try {
        parsedQuestions = JSON.parse(text);
      } catch(e) {
        // Fallback if the backend returns a single string instead of a valid JSON array
        parsedQuestions = text.split("\n").filter(q => q.trim().length > 0);
      }
      
      setQuestions(parsedQuestions);
      setTimeout(() => {
        questionsRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } catch (err) {
      alert("Error generating questions. Please try again.");
    } finally {
      setLoadingQuestions(false);
    }
  };

  const handleGenerateRoadmap = async () => {
    if (!data?.id) return;
    setLoadingRoadmap(true);
    try {
      const res = await fetch(`http://localhost:8081/analyze/resume/${data.id}/roadmap`, {
        method: "POST"
      });
      if (!res.ok) throw new Error("Failed to fetch");
      const text = await res.text();
      
      let parsed = [];
      try { parsed = JSON.parse(text); } catch(e) {}
      
      setRoadmapData(parsed);
      const updatedData = { ...data, roadmap: text };
      sessionStorage.setItem("resumeResult", JSON.stringify(updatedData));
      
      setTimeout(() => roadmapRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    } catch (e) {
      alert("Error generating roadmap.");
    } finally {
      setLoadingRoadmap(false);
    }
  };

  /* ── Helpers ──────────────────────────────────────────────────── */
  const safeParse = (content) => {
    if (!content) return [];
    if (Array.isArray(content)) return content;
    if (typeof content === "string") {
      try { return JSON.parse(content); } catch { return []; }
    }
    return [];
  };

  if (error) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center p-6 text-zinc-100">
        <div className="bg-red-950/20 backdrop-blur-2xl border border-red-500/20 p-10 rounded-3xl text-center shadow-2xl max-w-lg w-full">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-3xl font-extrabold text-zinc-100 mb-4 tracking-tight">Data Not Found</h2>
          <p className="text-zinc-400 mb-8 leading-relaxed">We couldn't retrieve your analysis results. Please return to the standard upload page and try submitting your resume again.</p>
          <button 
            onClick={() => router.push('/')}
            className="w-full py-4 bg-white hover:bg-zinc-200 text-black rounded-xl transition-all font-bold shadow-lg hover:-translate-y-1"
          >
             Back to Scanner
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-zinc-100">
        <svg className="animate-spin h-14 w-14 text-white mb-6 drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-zinc-400 text-2xl font-light tracking-wide animate-pulse">Loading amazing insights...</p>
      </div>
    );
  }

  // Dynamic colors adjusted for black and white styling
  const scoreColor = data.atsScore >= 80 ? "#ffffff" : data.atsScore >= 50 ? "#a1a1aa" : "#52525b";

  const chartData = [
    {
      name: "Score",
      value: data.atsScore || 0,
      fill: scoreColor,
    },
  ];

  // Parse all structured fields
  const strengths = safeParse(data.strengths);
  const weaknesses = safeParse(data.weaknesses);
  const existingSkills = safeParse(data.existingSkills);
  const missingSkills = safeParse(data.missingSkills);
  const suggestions = safeParse(data.suggestions);
  const roadmap = safeParse(data.roadmap);

  const Card = ({ title, icon, children, className = "" }) => (
    <div className={`bg-zinc-900/50 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 p-6 sm:p-8 hover:bg-zinc-900/80 hover:border-white/20 transition-all duration-300 ease-in-out relative overflow-hidden group ${className}`}>
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
      <h3 className="flex items-center gap-4 font-bold text-xl mb-6 text-zinc-100 tracking-wide">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-xl border border-white/10 shadow-[0_0_15px_rgba(255,255,255,0.05)]">
          {icon}
        </div>
        {title}
      </h3>
      <div className="text-zinc-300 text-base leading-relaxed font-normal">
        {children}
      </div>
    </div>
  );

  const TagList = ({ items, colorClass = "bg-white/5 border-white/10 text-zinc-300" }) => (
    <div className="flex flex-wrap gap-2">
      {items.map((item, i) => (
        <span key={i} className={`px-4 py-2 rounded-full border text-sm font-medium ${colorClass}`}>
          {typeof item === "object" ? Object.values(item).filter(v => typeof v === 'string').join(' - ') : item}
        </span>
      ))}
    </div>
  );

  const BulletList = ({ items }) => (
    <ul className="space-y-3">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-3">
          <span className="text-zinc-500 mt-[2px] flex-shrink-0 text-sm">✦</span>
          <span className="text-zinc-300 leading-relaxed font-light">
            {typeof item === "object" ? Object.values(item).filter(v => typeof v === 'string').join(' - ') : item}
          </span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="min-h-screen bg-black p-6 md:p-10 lg:p-16 font-sans text-zinc-200 selection:bg-white/30">
      
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-6 relative">
          
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 px-5 py-2.5 rounded-full backdrop-blur-md border border-white/5 hover:border-white/20 transition-all duration-300 z-10"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            <span className="font-medium text-sm tracking-wide">Analyze Another</span>
          </button>
          
          <div className="flex flex-col items-center justify-center md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
            <h1 className="text-4xl lg:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 via-white to-zinc-500 drop-shadow-sm text-center tracking-tight">
              Analysis Results
            </h1>
            {(data.aiModel || data.frontendResponseTime) && (
              <div className="flex items-center gap-2 text-[10px] sm:text-xs font-medium bg-white/5 border border-white/10 text-zinc-400 px-3 py-1 sm:px-4 sm:py-1.5 rounded-full mt-3 backdrop-blur-md">
                <span className="flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                {data.aiModel ? (
                  <span>
                    Powered by <span className="text-zinc-200 font-bold">{data.aiModel}</span> 
                    <span className="mx-1.5 opacity-50">|</span>
                    AI Time: <span className="text-zinc-200">{data.aiResponseTime ? data.aiResponseTime.toFixed(2) : '--'}s</span>
                    <span className="mx-1.5 opacity-50">|</span>
                    Total Request: <span className="text-zinc-200">{data.frontendResponseTime || '--'}s</span>
                  </span>
                ) : (
                  <span>
                    Total Request Time: <span className="text-zinc-200">{data.frontendResponseTime}s</span>
                  </span>
                )}
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center w-32 justify-end">
            {/* Spacer */}
          </div>
        </div>

        {/* ────────────── Score + Summary Row ────────────── */}
        <div className="grid lg:grid-cols-12 gap-8 mb-8">
          
          {/* Chart Section */}
          <div className="lg:col-span-4 bg-zinc-950/80 backdrop-blur-md rounded-3xl shadow-2xl border border-white/5 p-8 flex flex-col items-center justify-center hover:bg-zinc-900/50 hover:border-white/10 transition-all duration-300 relative overflow-hidden group h-full max-h-[500px]">
             
            <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-b from-white/5 to-transparent"></div>
            
            <h2 className="text-sm font-semibold tracking-widest text-zinc-400 uppercase mb-8 z-10">Overall ATS Match</h2>
            
            <div className="relative z-10 flex items-center justify-center">
              <RadialBarChart
                width={280}
                height={280}
                cx="50%"
                cy="50%"
                innerRadius="75%"
                outerRadius="100%"
                data={chartData}
                startAngle={225}
                endAngle={-45}
              >
                <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} angle={0} tick={false} />
                <RadialBar 
                  minAngle={15} 
                  background={{ fill: 'rgba(255,255,255,0.03)' }} 
                  clockWise 
                  dataKey="value" 
                  cornerRadius={15} 
                />
              </RadialBarChart>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-6xl font-extrabold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-400 drop-shadow-sm">
                  {data.atsScore}
                </span>
                <span className="text-xs font-bold text-zinc-500 uppercase tracking-[0.2em] mt-2 opacity-80">out of 100</span>
              </div>
            </div>
            
            <div className="mt-8 text-center px-4 z-10 w-full mb-2">
              <div className={`text-sm font-medium py-2 px-4 rounded-lg inline-block border ${
                data.atsScore >= 80 ? "bg-white/10 text-white border-white/20" : 
                data.atsScore >= 50 ? "bg-zinc-700/20 text-zinc-300 border-zinc-600/30" : 
                "bg-zinc-800/30 text-zinc-400 border-zinc-700/40"
              }`}>
                {data.atsScore >= 80 ? "Excellent Match" : data.atsScore >= 50 ? "Moderate Foundation" : "Significant Gaps"}
              </div>
            </div>
            
            <div className="mt-6 w-full z-10">
              <button 
                onClick={handleGenerateQuestions}
                disabled={loadingQuestions}
                className="w-full relative flex items-center justify-center py-3.5 rounded-xl text-sm font-bold shadow-lg transition-all duration-300 overflow-hidden bg-white text-black hover:bg-zinc-200 hover:-translate-y-1"
              >
                {loadingQuestions ? (
                  <span className="flex items-center gap-2">
                    <svg className="animate-spin h-4 w-4 text-zinc-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Generating...
                  </span>
                ) : (
                  <span>View Interview Questions ✨</span>
                )}
              </button>
            </div>
          </div>

          {/* Summary + Skills */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            
            {/* Summary */}
            {data.summary && (
              <Card title="Summary" icon="📋">
                <p className="text-zinc-300 leading-relaxed font-light">{data.summary}</p>
              </Card>
            )}

            {/* Strengths & Weaknesses side by side */}
            <div className="grid md:grid-cols-2 gap-8">
              {strengths.length > 0 && (
                <Card title="Strengths" icon="💪">
                  <BulletList items={strengths} />
                </Card>
              )}
              {weaknesses.length > 0 && (
                <Card title="Weaknesses" icon="⚡">
                  <BulletList items={weaknesses} />
                </Card>
              )}
            </div>

            {/* Existing Skills */}
            {existingSkills.length > 0 && (
              <Card title="Existing Skills" icon="✅">
                <TagList items={existingSkills} colorClass="bg-emerald-500/10 border-emerald-500/20 text-emerald-400" />
              </Card>
            )}

            {/* Missing Skills */}
            {missingSkills.length > 0 && (
              <Card title="Missing Skills" icon="🎯">
                <TagList items={missingSkills} colorClass="bg-rose-500/10 border-rose-500/20 text-rose-400" />
              </Card>
            )}

            {/* Suggestions */}
            {suggestions.length > 0 && (
              <Card title="Tailored Suggestions" icon="💡">
                <BulletList items={suggestions} />
              </Card>
            )}
          </div>
        </div>

        {/* ────────────── Personalized Learning Roadmap ────────────── */}
        <div ref={roadmapRef} className="mt-12">
            <div className="bg-zinc-950/60 backdrop-blur-md rounded-3xl shadow-2xl border border-white/5 p-8 sm:p-10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500/50 via-purple-500/50 to-pink-500/50"></div>
              <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-indigo-900/10 rounded-full blur-[120px] pointer-events-none -z-0"></div>

              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 gap-4 relative z-10">
                <div>
                  <h3 className="flex items-center gap-4 font-extrabold text-2xl md:text-3xl text-zinc-100 tracking-tight">
                    <div className="w-12 h-12 flex items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-2xl border border-indigo-500/20 shadow-lg shadow-indigo-500/10">
                      🗺️
                    </div>
                    Personalized Learning Roadmap
                  </h3>
                  <p className="text-zinc-500 text-sm mt-2 ml-16">
                    A step-by-step path from your current skills to mastery. Click nodes to expand.
                  </p>
                </div>
                {roadmapData.length > 0 && (
                  <div className="flex items-center gap-4 flex-shrink-0 ml-16 sm:ml-0">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <div className="w-2 h-2 rounded-full bg-emerald-400"></div> Beginner
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-amber-400">
                      <div className="w-2 h-2 rounded-full bg-amber-400"></div> Intermediate
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-rose-400">
                      <div className="w-2 h-2 rounded-full bg-rose-400"></div> Advanced
                    </div>
                  </div>
                )}
              </div>

              <div className="relative z-10">
                {roadmapData.length === 0 ? (
                  <div className="text-center py-12">
                    <h4 className="text-xl font-bold mb-3 text-zinc-200">Ready to level up?</h4>
                    <p className="text-zinc-400 mb-6 max-w-md mx-auto">Generate a highly detailed, step-by-step roadmap to master your missing skills. This takes approximately 10-15 seconds.</p>
                    <button 
                      onClick={handleGenerateRoadmap}
                      disabled={loadingRoadmap}
                      className={`relative flex items-center justify-center py-3.5 px-8 mx-auto rounded-xl text-sm font-bold shadow-lg transition-all duration-300 overflow-hidden ${
                        loadingRoadmap 
                          ? "bg-zinc-800 text-zinc-400 cursor-not-allowed border border-white/5" 
                          : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25 hover:-translate-y-1"
                      }`}
                    >
                      {loadingRoadmap ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-zinc-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Generating...
                        </span>
                      ) : (
                        <span>Generate Learning Roadmap ✨</span>
                      )}
                    </button>
                  </div>
                ) : (
                  roadmapData.map((node, idx) => (
                    <RoadmapNode key={idx} node={node} depth={0} />
                  ))
                )}
              </div>
            </div>
        </div>

        {/* ────────────── Generated Questions Section ────────────── */}
        {questions && (
          <div ref={questionsRef} className="mt-12 opacity-100 transition-opacity duration-1000">
            <div className="bg-zinc-900/40 backdrop-blur-md rounded-3xl shadow-xl border border-white/5 p-8 sm:p-10 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-8">
                <h3 className="flex items-center gap-4 font-extrabold text-3xl text-zinc-100 tracking-wide">
                   Top Expected Interview Questions
                </h3>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                {questions.map((q, idx) => (
                  <div key={idx} className="bg-black/40 border border-white/5 rounded-2xl p-5 hover:border-white/20 transition-all hover:-translate-y-1">
                    <div className="flex gap-4">
                      <span className="text-zinc-600 font-black text-xl leading-none">{idx + 1}</span>
                      <p className="text-zinc-300 font-light leading-relaxed">{q}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}