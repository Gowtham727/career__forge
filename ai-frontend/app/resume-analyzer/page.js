"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const [file, setFile] = useState(null);
  const [jd, setJd] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file || !jd) {
      alert("Please upload your resume and enter the Job Description.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("jd", jd);

    try {
      setLoading(true);

      const startTime = performance.now();
      const res = await fetch("http://localhost:8081/analyze/resume", {
        method: "POST",
        body: formData,
      });
      const endTime = performance.now();

      if (!res.ok) {
        throw new Error("Server error");
      }

      const data = await res.json();
      
      // Inject the frontend roundtrip time
      data.frontendResponseTime = ((endTime - startTime) / 1000).toFixed(2);

      // 👉 Navigate to result page with data
      sessionStorage.setItem("resumeResult", JSON.stringify(data));
      router.push(`/result`);

    } catch {
      alert("Error connecting to the backend. Is your Spring Boot server running on port 8081?");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 font-sans selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Top Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
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
            <Link href="/resume-analyzer" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5">Resume Analyzer</Link>
            <Link href="/interview-prep" className="hover:text-indigo-600 transition-colors">Interview Prep</Link>
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

      {/* Main Container */}
      <div className="flex-1 pt-32 pb-20 px-6 flex items-center justify-center">
        <div className="max-w-3xl w-full bg-white border border-slate-200/80 rounded-3xl shadow-xl shadow-slate-200/50 p-8 sm:p-12 transition-all duration-300">
          
          <div className="text-center mb-10 space-y-3">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 font-semibold text-xs uppercase tracking-wider">
              <span>📄</span> ATS Resume Audit
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-slate-900">
              AI Resume <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Analyzer</span>
            </h1>
            <p className="text-slate-600 text-base font-normal max-w-xl mx-auto leading-relaxed">
              Upload your resume and paste the target Job Description to get an instant ATS compatibility score and tailored recommendations.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col">
            
            {/* File Upload Region */}
            <div className="flex flex-col gap-2 group">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Upload Resume (PDF)
              </label>
              <div className="relative flex items-center justify-center w-full">
                <label 
                  className="flex flex-col items-center justify-center w-full h-36 border-2 border-slate-300 hover:border-indigo-400 border-dashed rounded-2xl cursor-pointer bg-slate-50/80 hover:bg-indigo-50/40 transition-all duration-300"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 px-4 text-center">
                    <svg className="w-10 h-10 mb-3 text-indigo-500 group-hover:scale-110 transition-transform duration-300" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                      <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"/>
                    </svg>
                    <p className="mb-1 text-sm text-slate-700">
                      {file ? (
                        <span className="font-bold text-indigo-700">File attached: {file.name}</span>
                      ) : (
                        <>
                          <span className="font-bold text-indigo-600">Click to upload</span> or drag and drop
                        </>
                      )}
                    </p>
                    <p className="text-xs text-slate-400 font-medium">PDF file format (MAX. 5MB)</p>
                  </div>
                  <input 
                    type="file" 
                    accept="application/pdf" 
                    className="hidden" 
                    onChange={(e) => setFile(e.target.files[0])} 
                  />
                </label>
              </div>
            </div>

            {/* JD Input */}
            <div className="flex flex-col gap-2 group">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-widest">
                Job Description
              </label>
              <div className="relative">
                <textarea
                  placeholder="Paste the requirements, responsibilities, and key skills of the target role here..."
                  value={jd}
                  onChange={(e) => setJd(e.target.value)}
                  className="w-full h-52 p-5 rounded-2xl bg-slate-50 border border-slate-300 text-slate-800 placeholder-slate-400 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all resize-none shadow-sm text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button 
                type="submit"
                disabled={loading}
                className={`relative flex items-center justify-center w-full py-4 rounded-2xl text-base font-bold shadow-lg transition-all duration-300 overflow-hidden ${
                  loading 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed border border-slate-300" 
                    : "bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/25 hover:-translate-y-0.5"
                }`}
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-3 relative z-10">
                    <svg className="animate-spin h-5 w-5 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Evaluating Profile & Generating Insights...
                  </span>
                ) : (
                  <span className="relative z-10 flex items-center gap-2">
                    <span>⚡</span> Analyze Resume Now
                  </span>
                )}
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}