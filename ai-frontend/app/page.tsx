"use client";

import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

export default function LandingPage() {
  const { user, isAuthenticated, logout } = useAuth();
  return (
    <div className="min-h-screen bg-[#fafaf9] text-slate-800 font-sans overflow-x-hidden selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* ------------------------------------------------------- */}
      {/* Navbar */}
      {/* ------------------------------------------------------- */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/80 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md shadow-indigo-600/20">
              CF
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              Career<span className="text-indigo-600">Forge</span>
            </span>
          </div>
          <div className="hidden md:flex items-center gap-7 font-medium text-slate-600">
            <Link href="/" className="text-indigo-600 font-bold border-b-2 border-indigo-600 pb-0.5">Home</Link>
            <Link href="/resume-analyzer" className="hover:text-indigo-600 transition-colors">Resume Analyzer</Link>
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
          <div className="flex items-center gap-4">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/profile"
                  className="flex items-center gap-2 bg-indigo-50 border border-indigo-200 px-3 py-1.5 rounded-full hover:bg-indigo-100 transition-colors"
                >
                  <div className="w-7 h-7 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-xs">
                    {user.name ? user.name[0].toUpperCase() : "U"}
                  </div>
                  <span className="text-xs font-bold text-indigo-900">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors px-2 py-1"
                >
                  Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="hidden md:block px-5 py-2.5 text-slate-600 font-medium hover:text-slate-900 transition-colors text-sm"
                >
                  Sign In
                </Link>
                <Link
                  href="/register"
                  className="px-6 py-2.5 bg-indigo-600 text-white font-semibold rounded-full hover:bg-indigo-700 transition-all shadow-md shadow-indigo-600/20 hover:shadow-lg text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* ------------------------------------------------------- */}
      {/* Hero Section */}
      {/* ------------------------------------------------------- */}
      <section className="relative pt-40 pb-24 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-16">
        <div className="absolute top-20 left-10 w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[140px] pointer-events-none -z-10"></div>
        <div className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-violet-200/30 rounded-full blur-[160px] pointer-events-none -z-10"></div>
        
        <div className="flex-1 space-y-8 z-10 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-indigo-200 bg-indigo-50/80 text-indigo-700 font-semibold text-sm shadow-sm">
            <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse"></span>
            Your AI Career Assistant
          </div>
          <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tight leading-tight text-slate-900">
            Prepare Smarter. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600">
              Build Better Careers.
            </span>
          </h1>
          <p className="text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
            One comprehensive platform to analyze resumes, master technical interviews, and connect through real-time HD video calls with interactive whiteboards.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start pt-4 flex-wrap">
            <Link href="/resume-analyzer" className="w-full sm:w-auto px-8 py-4 bg-indigo-600 text-white font-bold rounded-full hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95 text-center">
              Analyze Resume
            </Link>
            <Link href="/interview-prep" className="w-full sm:w-auto px-8 py-4 bg-white border border-slate-300 text-slate-800 font-bold rounded-full hover:bg-slate-50 hover:border-slate-400 transition-all shadow-sm hover:scale-105 active:scale-95 text-center">
              Start Interview Prep
            </Link>
            <Link href="/live-interview" className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 text-white font-bold rounded-full hover:opacity-95 transition-all shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 text-center flex items-center justify-center gap-2">
              <span>📹</span> Real-Time Call
            </Link>
          </div>
        </div>
        
        <div className="flex-1 relative z-10 w-full max-w-lg mx-auto lg:max-w-none">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl shadow-indigo-950/10 border border-slate-200/80 bg-white p-3 group">
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-violet-500/10 mix-blend-overlay z-10 group-hover:opacity-0 transition-opacity duration-700"></div>
            <Image 
              src="/career_boost.jpg" 
              alt="Career Growth & Transferable Skills Framework" 
              width={800} 
              height={600} 
              className="w-full h-auto object-cover rounded-2xl transform group-hover:scale-105 transition-transform duration-700"
              priority
            />
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* Statistics Section */}
      {/* ------------------------------------------------------- */}
      <section className="py-16 border-y border-slate-200/80 bg-white/70 backdrop-blur-md shadow-sm">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-slate-200/60">
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold text-slate-900">50k+</h3>
            <p className="text-slate-500 font-semibold tracking-wide uppercase text-xs">Resume Analyses</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold text-indigo-600">10k+</h3>
            <p className="text-slate-500 font-semibold tracking-wide uppercase text-xs">Interview Questions</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold text-violet-600">100+</h3>
            <p className="text-slate-500 font-semibold tracking-wide uppercase text-xs">Topics Covered</p>
          </div>
          <div className="space-y-2">
            <h3 className="text-4xl font-extrabold text-slate-900">10k+</h3>
            <p className="text-slate-500 font-semibold tracking-wide uppercase text-xs">Students Prepared</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* Features Section */}
      {/* ------------------------------------------------------- */}
      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl font-extrabold text-slate-900">Powerful Features</h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">Everything you need to land your dream job in one unified platform.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl transition-all shadow-md group">
            <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Resume Analysis</h3>
            <p className="text-slate-600 leading-relaxed">Upload your resume and get an instant ATS score, missing skills identification, and actionable suggestions tailored to your target job description.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-violet-300 hover:shadow-xl transition-all shadow-md group">
            <div className="w-14 h-14 bg-violet-50 text-violet-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Interview Preparation</h3>
            <p className="text-slate-600 leading-relaxed">Dynamically generate topic-specific technical and behavioral questions using advanced AI models. View answers, explanations, and difficulty levels.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-purple-300 hover:shadow-xl transition-all shadow-md group">
            <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Job Description Matching</h3>
            <p className="text-slate-600 leading-relaxed">Ensure your profile perfectly aligns with what recruiters are looking for by running comprehensive gap analysis against real JD requirements.</p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 hover:border-emerald-300 hover:shadow-xl transition-all shadow-md group">
            <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"></path></svg>
            </div>
            <h3 className="text-2xl font-bold text-slate-900 mb-3">Real-Time Mock Interviews</h3>
            <p className="text-slate-600 leading-relaxed">Conduct live peer-to-peer WebRTC video calls, share screen, send resumes, and collaborate on a live interactive whiteboard in real time.</p>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* How It Works */}
      {/* ------------------------------------------------------- */}
      <section className="py-24 bg-white border-y border-slate-200/80 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16 space-y-4">
            <h2 className="text-4xl font-extrabold text-slate-900">How It Works</h2>
            <p className="text-slate-600 text-lg">A simple 4-step workflow to placement success.</p>
          </div>
          
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative">
            <div className="hidden md:block absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-slate-200 via-indigo-400 to-slate-200 -translate-y-1/2 z-0"></div>
            
            {[
              { num: "1", title: "Upload Resume", desc: "Share your latest PDF resume." },
              { num: "2", title: "Get AI Feedback", desc: "Receive ATS score & gap analysis." },
              { num: "3", title: "Practice Interview", desc: "Generate domain questions." },
              { num: "4", title: "Improve & Apply", desc: "Boost your placement chances." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center bg-[#fafaf9] p-6 rounded-3xl border border-slate-200/80 w-full md:w-64 shadow-md hover:shadow-xl transition-all">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-2xl font-bold text-white mb-6 shadow-md shadow-indigo-600/20">
                  {step.num}
                </div>
                <h4 className="text-xl font-bold mb-2 text-slate-900">{step.title}</h4>
                <p className="text-slate-600 text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* Master Technical Domains */}
      {/* ------------------------------------------------------- */}
      <section className="py-24 px-6 max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-extrabold text-slate-900 mb-4">Master Technical Domains</h2>
        <p className="text-slate-600 text-lg mb-12 max-w-2xl mx-auto">Prepare with highly relevant questions spanning core computer science topics.</p>
        
        <div className="flex flex-wrap justify-center gap-4 max-w-4xl mx-auto">
          {["Java", "Spring Boot", "SQL", "DBMS", "Operating System", "Computer Networks", "OOPS", "HR Interview", "Aptitude", "Behavioral"].map((domain) => (
            <span key={domain} className="px-6 py-3 rounded-full bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 hover:scale-105 transition-all cursor-pointer shadow-sm">
              {domain}
            </span>
          ))}
        </div>
        <div className="mt-12">
           <Link href="/interview-prep" className="text-indigo-600 hover:text-indigo-700 font-bold flex items-center justify-center gap-2 transition-colors">
              View All Topics <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
           </Link>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* Call To Action */}
      {/* ------------------------------------------------------- */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 rounded-3xl p-12 md:p-20 text-center text-white shadow-2xl shadow-indigo-600/20 relative overflow-hidden">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-8 relative z-10 text-white">
            Ready to crack your next interview?
          </h2>
          <Link href="/resume-analyzer" className="relative z-10 inline-block px-10 py-5 bg-white text-indigo-900 font-extrabold text-lg rounded-full hover:bg-slate-100 transition-all shadow-xl hover:scale-105 active:scale-95">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* ------------------------------------------------------- */}
      {/* Footer */}
      {/* ------------------------------------------------------- */}
      <footer className="border-t border-slate-200 bg-white pt-16 pb-8 px-6 text-slate-600">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
          <div className="flex items-center gap-3">
             <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-violet-600 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md shadow-indigo-600/20">
              CF
            </div>
            <span className="text-xl font-bold text-slate-900">CareerForge</span>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-slate-600 font-medium text-sm">
            <Link href="#" className="hover:text-indigo-600 transition-colors">About</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Contact</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">Privacy</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">GitHub</Link>
            <Link href="#" className="hover:text-indigo-600 transition-colors">LinkedIn</Link>
          </div>
        </div>
        <div className="text-center text-slate-400 text-sm">
          © {new Date().getFullYear()} CareerForge. Built for placement preparation.
        </div>
      </footer>
      
    </div>
  );
}
