"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login } = useAuth();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [registrationNotice, setRegistrationNotice] = useState(false);

  useEffect(() => {
    if (searchParams.get("registered") === "true") {
      setRegistrationNotice(true);
    }
  }, [searchParams]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(username, password);
    setLoading(false);

    if (result.success) {
      router.push("/profile");
    } else {
      setError(result.error || "Invalid username or password.");
    }
  };

  return (
    <div className="bg-zinc-900/90 border border-white/10 rounded-3xl p-8 backdrop-blur-xl shadow-2xl space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white font-bold text-2xl mx-auto shadow-lg shadow-purple-500/30">
          🔑
        </div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Candidate Sign In</h1>
        <p className="text-zinc-400 text-xs">
          Access your saved career profile, progress metrics, and interview practice dashboard.
        </p>
      </div>

      {/* Registration Success Banner */}
      {registrationNotice && (
        <div className="p-3.5 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-bold text-center animate-pulse">
          ✓ Registration completed successfully! Sign in below to access your profile.
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="p-3.5 bg-rose-500/20 border border-rose-500/40 rounded-xl text-rose-300 text-xs font-semibold text-center">
          ⚠️ {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleLogin} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-zinc-300 block">Username or Email:</label>
          <input
            type="text"
            placeholder="Enter username or email address"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 text-xs"
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
            className="w-full px-4 py-3 bg-black/60 border border-white/10 rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:border-purple-500 text-xs"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-bold rounded-2xl hover:opacity-95 transition-all shadow-lg shadow-purple-500/25 text-xs hover:scale-[1.01] active:scale-[0.99] flex items-center justify-center gap-2"
        >
          {loading ? (
            <>
              <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Authenticating...
            </>
          ) : (
            "Sign In to Profile"
          )}
        </button>
      </form>

      {/* Footer Navigation */}
      <div className="pt-4 border-t border-white/10 text-center text-xs text-zinc-400">
        Don't have an account yet?{" "}
        <Link href="/register" className="text-purple-400 font-bold hover:underline">
          Register Here
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
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
            <Link href="/register" className="px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold rounded-xl hover:opacity-95 transition-all shadow-md">
              Create Account
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Login Form Body with Suspense */}
      <main className="flex-1 max-w-md w-full mx-auto px-6 py-12 flex flex-col justify-center">
        <Suspense fallback={
          <div className="text-center text-zinc-400 text-xs font-mono py-12">
            Loading Login Form...
          </div>
        }>
          <LoginForm />
        </Suspense>
      </main>

      <footer className="py-6 text-center text-xs text-zinc-500 border-t border-white/5">
        CareerForge © 2026 • AI Career & Technical Interview Platform
      </footer>
    </div>
  );
}
