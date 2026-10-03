"use client";

import React, { useState } from "react";
import {
  X,
  User,
  Sparkles,
  Lock,
  Mail,
  ShieldCheck,
  Flame,
  Zap,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  KeyRound,
  Crown,
} from "lucide-react";
import { UserProfile } from "@/types";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: UserProfile | null;
  onLoginSuccess: (user: UserProfile) => void;
}

export function AuthModal({
  isOpen,
  onClose,
  currentUser,
  onLoginSuccess,
}: AuthModalProps) {
  const [activeTab, setActiveTab] = useState<"demo" | "login" | "register">("demo");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regTitle, setRegTitle] = useState("Discipline Architect");
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Handle Quick Demo / Option A Login
  const handleQuickDemoLogin = async (optionKey: "option_a" | "option_b" | "option_c") => {
    setLoadingAction(optionKey);
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ option: optionKey }),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setSuccessMessage(`Welcome back, ${json.user.name}!`);
        onLoginSuccess(json.user);
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMessage(json.error || "Login failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Network error logging in.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Email & Password Login
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoadingAction("email_login");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), password }),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setSuccessMessage(`Logged in as ${json.user.name}!`);
        onLoginSuccess(json.user);
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMessage(json.error || "Login failed. Check your email or use Option A Quick Demo.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to log in.");
    } finally {
      setLoadingAction(null);
    }
  };

  // Handle Register New User
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim()) return;

    setLoadingAction("register");
    setErrorMessage(null);
    setSuccessMessage(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: regName.trim(),
          email: regEmail.trim(),
          password: regPassword || "password123",
          title: regTitle.trim() || "Discipline Architect",
        }),
      });
      const json = await res.json();
      if (json.success && json.user) {
        setSuccessMessage(`Account created! Welcome, ${json.user.name}!`);
        onLoginSuccess(json.user);
        setTimeout(() => {
          onClose();
        }, 600);
      } else {
        setErrorMessage(json.error || "Registration failed.");
      }
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to create account.");
    } finally {
      setLoadingAction(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-lg glass-panel rounded-3xl p-6 border border-slate-700 shadow-2xl relative overflow-hidden">
        {/* Glow ambient */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-emerald-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
              <KeyRound className="w-5 h-5 text-slate-950 font-black" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-white">Account Access & Profiles</h3>
              <p className="text-xs text-slate-400">Sign in, switch accounts, or use 1-click Demo Logins</p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close auth modal"
            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Alerts */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2 animate-fade-in">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2 animate-fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-2xl bg-slate-900 border border-slate-800 mb-5">
          <button
            type="button"
            onClick={() => setActiveTab("demo")}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === "demo"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🚀 1-Click Demo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("login")}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === "login"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            🔑 Email Login
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("register")}
            className={`py-2 text-xs font-bold rounded-xl transition cursor-pointer ${
              activeTab === "register"
                ? "bg-emerald-500 text-slate-950 font-black shadow-md shadow-emerald-500/20"
                : "text-slate-400 hover:text-white"
            }`}
          >
            ✨ New Account
          </button>
        </div>

        {/* TAB 1: 1-Click Demo Profiles (Option A / Option B / Option C) */}
        {activeTab === "demo" && (
          <div className="space-y-3">
            <div className="text-xs font-semibold text-slate-400 mb-1">
              Select any profile to log in immediately with realistic 30-day tracking history:
            </div>

            {/* OPTION A: Alex Rivera (Primary Master Profile) */}
            <button
              onClick={() => handleQuickDemoLogin("option_a")}
              disabled={loadingAction !== null}
              className="w-full p-3.5 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950/40 border-2 border-emerald-500/50 hover:border-emerald-400 text-left transition active:scale-98 cursor-pointer flex items-center justify-between group shadow-lg shadow-emerald-500/10"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                    alt="Alex"
                    className="w-11 h-11 rounded-2xl object-cover border border-emerald-400"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-slate-950 text-[9px] font-black px-1 rounded-md">
                    L5
                  </span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black text-white group-hover:text-emerald-300">
                      Option A: Alex Rivera
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded">
                      ★ Recommended
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-400">alex@discipline.os • Discipline Architect</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold">
                    <span className="text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-orange-400" /> 14-day streak
                    </span>
                    <span className="text-indigo-400 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-indigo-400" /> 4,850 XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-emerald-500/20 group-hover:bg-emerald-500 text-emerald-300 group-hover:text-slate-950 text-xs font-black transition flex items-center gap-1">
                <span>{loadingAction === "option_a" ? "Logging in..." : "Log In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* OPTION B: Sarah Chen (Pre-Med Scholar) */}
            <button
              onClick={() => handleQuickDemoLogin("option_b")}
              disabled={loadingAction !== null}
              className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500/40 text-left transition active:scale-98 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
                    alt="Sarah"
                    className="w-11 h-11 rounded-2xl object-cover border border-indigo-400/50"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-indigo-500 text-white text-[9px] font-black px-1 rounded-md">
                    L6
                  </span>
                </div>

                <div>
                  <div className="text-xs font-black text-white group-hover:text-indigo-300">
                    Option B: Sarah Chen
                  </div>
                  <div className="text-[11px] text-slate-400">sarah@discipline.os • Pre-Med & Athlete</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold">
                    <span className="text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-orange-400" /> 28-day streak
                    </span>
                    <span className="text-indigo-400 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-indigo-400" /> 6,200 XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-indigo-500/20 group-hover:bg-indigo-500 text-indigo-300 group-hover:text-white text-xs font-bold transition flex items-center gap-1">
                <span>{loadingAction === "option_b" ? "Logging in..." : "Log In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>

            {/* OPTION C: Marcus Vance (Productivity Starter) */}
            <button
              onClick={() => handleQuickDemoLogin("option_c")}
              disabled={loadingAction !== null}
              className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 text-left transition active:scale-98 cursor-pointer flex items-center justify-between group"
            >
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
                    alt="Marcus"
                    className="w-11 h-11 rounded-2xl object-cover border border-cyan-400/50"
                  />
                  <span className="absolute -bottom-1 -right-1 bg-cyan-500 text-slate-950 text-[9px] font-black px-1 rounded-md">
                    L2
                  </span>
                </div>

                <div>
                  <div className="text-xs font-black text-white group-hover:text-cyan-300">
                    Option C: Marcus Vance
                  </div>
                  <div className="text-[11px] text-slate-400">marcus@discipline.os • Productivity Engineer</div>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] font-bold">
                    <span className="text-orange-400 flex items-center gap-0.5">
                      <Flame className="w-3 h-3 fill-orange-400" /> 5-day streak
                    </span>
                    <span className="text-cyan-400 flex items-center gap-0.5">
                      <Zap className="w-3 h-3 fill-cyan-400" /> 950 XP
                    </span>
                  </div>
                </div>
              </div>

              <div className="px-3 py-1.5 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500 text-cyan-300 group-hover:text-slate-950 text-xs font-bold transition flex items-center gap-1">
                <span>{loadingAction === "option_c" ? "Logging in..." : "Log In"}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </button>
          </div>
        )}

        {/* TAB 2: Email & Password Sign In */}
        {activeTab === "login" && (
          <form onSubmit={handleEmailLogin} className="space-y-3.5">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. alex@discipline.os or your email"
                  required
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-3" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password (default: password123)"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1">Hint: Demo password is `password123`.</p>
            </div>

            <button
              type="submit"
              disabled={loadingAction !== null}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20"
            >
              {loadingAction === "email_login" ? "Authenticating..." : "Sign In to Life Manager"}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin("option_a")}
                className="text-xs text-emerald-400 hover:underline font-bold"
              >
                Or click here for instant 1-tap Option A login
              </button>
            </div>
          </form>
        )}

        {/* TAB 3: Register New Custom User */}
        {activeTab === "register" && (
          <form onSubmit={handleRegister} className="space-y-3">
            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Full Name</label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="e.g. Jordan Blake"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-300 mb-1">Email</label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="e.g. jordan@example.com"
                required
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Discipline Title</label>
                <input
                  type="text"
                  value={regTitle}
                  onChange={(e) => setRegTitle(e.target.value)}
                  placeholder="e.g. Daily Optimizer"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-1">Password</label>
                <input
                  type="password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  placeholder="password123"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loadingAction !== null}
              className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs transition cursor-pointer shadow-lg shadow-emerald-500/20 mt-2"
            >
              {loadingAction === "register" ? "Creating Profile..." : "Create Account & Start Tracking"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
