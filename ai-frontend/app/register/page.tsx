"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { JOB_ROLES } from "@/components/Profile/RoleCurriculum";

export default function RegisterPage() {
  const router = useRouter();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [targetRole, setTargetRole] = useState("java-developer");

  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");
    setLoading(true);

    const result = await register({
      name,
      email,
      username,
      password,
      targetRole,
    });

    setLoading(false);

    if (result.success) {
      setSuccessMsg(result.message || "Registration successful! Redirecting to login...");
      setTimeout(() => {
        router.push("/login?registered=true");
      }, 1500);
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-black text-zinc-200 font-sans flex flex-col justify-between">
      {/* Navbar */}
      <nav className="border-b border-white/10 bg-black/60 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-500/20">
              CF
            </div>
            <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-zinc-100 to-zinc-400">
              CareerForge
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm font-medium text-zinc-400">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <Link href="/login" className="px-4 py-2 bg-indigo-600/30 text-indigo-300 border border-indigo-500/40 rounded-xl hover:bg-indigo-600 hover:text-white transition-all font-bold">
              Sign In
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Registration Form Body */}
      <main className="flex-1 max-w-lg w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-indigo-500/30">
              ✨
            </div>
            <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Candidate Account</h1>
            <p className="text-zinc-400 text-xs">
              Register to set up your personalized target job title & career preparation dashboard.
            </p>
          </div>

          {/* Notifications */}
          {error && (
            <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-semibold text-center">
              ⚠️ {error}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center animate-pulse">
              ✓ {successMsg}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">Full Name:</label>
              <input
                type="text"
                placeholder="e.g. Gowtham"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-zinc-300 block">Email Address:</label>
              <input
                type="email"
                placeholder="e.g. candidate@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-xs"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Username:</label>
                <input
                  type="text"
                  placeholder="e.g. gowtham_dev"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-xs"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-zinc-300 block">Password:</label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 text-xs"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-indigo-300 block font-semibold">
                Target Job Title / Career Goal:
              </label>
              <select
                value={targetRole}
                onChange={(e) => setTargetRole(e.target.value)}
                className="w-full px-4 py-3 bg-black/80 border border-indigo-500/40 rounded-xl text-white text-xs font-bold focus:outline-none focus:border-indigo-400"
              >
                {Object.values(JOB_ROLES).map((role) => (
                  <option key={role.id} value={role.id}>
                    🎯 {role.title}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white font-bold rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-indigo-500/25 text-xs hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Account...
                </>
              ) : (
                "Create Candidate Account"
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
            Already registered?{" "}
            <Link href="/login" className="text-indigo-400 font-bold hover:underline">
              Sign In Here
            </Link>
          </div>
        </div>
      </main>

      <footer className="py-6 text-center text-xs text-zinc-500 border-t border-white/5">
        CareerForge © 2026 • AI Career & Technical Interview Platform
      </footer>
    </div>
  );
}
