"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Star,
  Moon,
  Droplet,
  Dumbbell,
  Utensils,
  GraduationCap,
  Music,
  BookOpen,
  Trophy,
  BarChart3,
  Calendar,
  CheckSquare,
  Flame,
  Zap,
  Shield,
  Smartphone,
  Download,
  Rocket,
  Target,
  Clock,
  TrendingUp,
  Users,
  Heart,
  Brain,
  Award,
  Play,
  ChevronRight,
  Menu,
  X,
  Mail,
  Globe,
  Infinity as InfinityIcon,
  Coffee,
  Salad,
  CircleCheck,
  Quote,
  LogIn,
} from "lucide-react";

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentUsers, setCurrentUsers] = useState(2847);
  const [scrolled, setScrolled] = useState(false);

  // Animated counter for "users today"
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentUsers((prev) => prev + Math.floor(Math.random() * 3));
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-[#070a12] text-slate-100 overflow-x-hidden">
      {/* ============== NAVBAR ============== */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 py-3"
            : "bg-transparent py-4"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg shadow-emerald-500/30">
              <Sparkles className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <span className="font-black text-sm tracking-tight bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">
                LIFE<span className="text-emerald-400">MANAGER</span>
              </span>
              <span className="block text-[9px] text-slate-500 font-bold tracking-widest uppercase -mt-0.5">
                Discipline OS
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-7 text-xs font-bold text-slate-300">
            <a href="#features" className="hover:text-emerald-400 transition">Features</a>
            <a href="#how-it-works" className="hover:text-emerald-400 transition">How It Works</a>
            <a href="#testimonials" className="hover:text-emerald-400 transition">Reviews</a>
            <a href="#pricing" className="hover:text-emerald-400 transition">Pricing</a>
            <a href="#faq" className="hover:text-emerald-400 transition">FAQ</a>
            <Link href="/guide" className="hover:text-emerald-400 transition">Guide</Link>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              href="/app"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-300 hover:text-white transition"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Sign In</span>
            </Link>
            <Link
              href="/app"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <span>Open App</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-3 mx-4 glass-panel border border-slate-800 rounded-2xl p-4 space-y-3 animate-fade-in">
            {["Features", "How It Works", "Reviews", "Pricing", "FAQ"].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-2 text-xs font-bold text-slate-300 hover:text-emerald-400"
              >
                {item}
              </a>
            ))}
            <Link
              href="/app"
              className="block w-full py-2.5 text-center bg-emerald-500 text-slate-950 font-black text-xs rounded-xl"
            >
              Launch App →
            </Link>
          </div>
        )}
      </nav>

      {/* ============== HERO ============== */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Ambient glows */}
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-20 right-1/4 w-[600px] h-[600px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/2 w-[700px] h-[300px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto text-center">
          {/* Live user counter badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-bold mb-6 animate-fade-in">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400" />
            </span>
            <span><span className="text-white font-black">{currentUsers.toLocaleString()}</span> people building discipline right now</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.05]">
            Your Life, <br className="sm:hidden" />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400 bg-clip-text text-transparent">
              Scored Out of 100
            </span>
          </h1>

          <p className="text-base sm:text-xl text-slate-400 mt-6 max-w-3xl mx-auto leading-relaxed">
            The personal operating system that turns sleep, hydration, fitness, learning, and journaling into a <span className="text-emerald-400 font-bold">daily 100-point game</span> — build unstoppable streaks and compound 1% improvements into life-changing results.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            <Link
              href="/app"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition active:scale-95 group"
            >
              <Rocket className="w-4 h-4 group-hover:rotate-12 transition" />
              <span>Start Tracking Free</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition" />
            </Link>
            <Link
              href="/guide"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-white font-bold text-sm rounded-2xl transition"
            >
              <Play className="w-4 h-4 fill-emerald-400 text-emerald-400" />
              <span>See How It Works</span>
            </Link>
          </div>

          <p className="text-xs text-slate-500 mt-4 flex items-center justify-center gap-2 flex-wrap">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> No credit card
            <span className="text-slate-700">•</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> 1-click Demo login
            <span className="text-slate-700">•</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" /> Works on all devices
          </p>

          {/* Hero visual: Dashboard preview */}
          <div className="mt-16 relative mx-auto max-w-5xl">
            <div className="absolute -inset-6 bg-gradient-to-r from-emerald-500/30 via-cyan-500/30 to-indigo-500/30 rounded-3xl blur-2xl opacity-50" />
            <div className="relative rounded-3xl border border-slate-800 shadow-2xl bg-slate-950 overflow-hidden">
              <img
                src="/hero-dashboard.png"
                alt="Life Manager Dashboard Preview"
                className="w-full h-auto"
              />
            </div>

            {/* Floating stat badges */}
            <div className="hidden md:block absolute -left-6 top-1/4 glass-panel rounded-2xl p-3 border border-emerald-500/30 shadow-xl animate-wave">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-orange-500/20 flex items-center justify-center">
                  <Flame className="w-4 h-4 fill-orange-400 text-orange-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Streak</div>
                  <div className="text-sm font-black text-white">47 days 🔥</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-6 top-1/3 glass-panel rounded-2xl p-3 border border-indigo-500/30 shadow-xl animate-wave" style={{ animationDelay: "0.5s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                  <Zap className="w-4 h-4 fill-indigo-400 text-indigo-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Level Up!</div>
                  <div className="text-sm font-black text-white">Elite +250 XP</div>
                </div>
              </div>
            </div>

            <div className="hidden md:block absolute -right-10 bottom-1/4 glass-panel rounded-2xl p-3 border border-cyan-500/30 shadow-xl animate-wave" style={{ animationDelay: "1s" }}>
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Droplet className="w-4 h-4 fill-cyan-400 text-cyan-400" />
                </div>
                <div>
                  <div className="text-[10px] text-slate-400 font-bold">Hydrated</div>
                  <div className="text-sm font-black text-white">4.0L ✓</div>
                </div>
              </div>
            </div>
          </div>

          {/* Social Proof Logos */}
          <div className="mt-20">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
              Trusted by students, athletes, and professionals worldwide
            </p>
            <div className="flex items-center justify-center gap-8 sm:gap-12 flex-wrap text-slate-500 text-xs font-black">
              <span className="opacity-60 hover:opacity-100 transition">⚡ MIT Students</span>
              <span className="opacity-60 hover:opacity-100 transition">🏃 Pro Athletes</span>
              <span className="opacity-60 hover:opacity-100 transition">💼 Y Combinator</span>
              <span className="opacity-60 hover:opacity-100 transition">🎓 Stanford</span>
              <span className="opacity-60 hover:opacity-100 transition">🏥 Pre-Med Scholars</span>
            </div>
          </div>
        </div>
      </section>

      {/* ============== KEY STATS BAR ============== */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 border-y border-slate-800/60 bg-slate-950/50">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { num: "100", unit: "pts", label: "Daily Max Score", color: "text-emerald-400" },
            { num: "9", unit: "categories", label: "Tracked Metrics", color: "text-cyan-400" },
            { num: "30+", unit: "days", label: "Logged in Demo", color: "text-amber-400" },
            { num: "10", unit: "badges", label: "Unlockable Rewards", color: "text-indigo-400" },
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className={`text-3xl sm:text-4xl font-black ${stat.color}`}>
                {stat.num}
                <span className="text-sm text-slate-500 font-bold ml-1">{stat.unit}</span>
              </div>
              <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider mt-1">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ============== FEATURES GRID ============== */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-4">
              <Target className="w-3.5 h-3.5" />
              <span>9 Life Pillars Tracked</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              Everything you track, <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">in one place</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 max-w-2xl mx-auto">
              Nine measurable discipline categories combine into your daily 100-point score — track what matters, see what works.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              {
                icon: Moon,
                color: "indigo",
                title: "Multi-Slot Sleep Tracker",
                points: "20 pts",
                desc: "Add multiple sleep periods per day — night sleep + naps. Target 7-8h to earn full points with beautiful visual graphs.",
              },
              {
                icon: Droplet,
                color: "cyan",
                title: "Hydration Hub",
                points: "10 pts",
                desc: "Quick-add water in ml with +100 / +250 / +500 / +750 / +1000 chips. Watch the animated bottle fill to 4,000ml.",
              },
              {
                icon: Dumbbell,
                color: "amber",
                title: "Fitness Timer & Logger",
                points: "10 pts",
                desc: "Live stopwatch for workouts + manual log for Gym, Running, Cycling, Yoga, Sports. 30+ min = full score.",
              },
              {
                icon: Utensils,
                color: "emerald",
                title: "3-Meal Daily Tracker",
                points: "10 pts",
                desc: "Breakfast (3.5) + Lunch (3.5) + Dinner (3.0). Log what you ate, nutrition notes, and health rating per meal.",
              },
              {
                icon: Salad,
                color: "teal",
                title: "No-Oil Clean Eating",
                points: "5 pts",
                desc: "One-tap toggle for days you ate oil-free whole foods. Build the ultimate metabolic health streak.",
              },
              {
                icon: Coffee,
                color: "amber",
                title: "Caffeine Cutoff Tracker",
                points: "5 pts",
                desc: "Avoid caffeine after your configurable cutoff time (default 6PM) for deeper restorative sleep.",
              },
              {
                icon: GraduationCap,
                color: "violet",
                title: "Academic Study Logs",
                points: "15 pts",
                desc: "Record subject, topic, completed work, duration, and difficulty. Build a chronological learning portfolio.",
              },
              {
                icon: Music,
                color: "indigo",
                title: "Music Practice Journal",
                points: "10 pts",
                desc: "Log instrument sessions (Piano, Guitar, Vocals, Theory) with topic, duration, and breakthrough notes.",
              },
              {
                icon: BookOpen,
                color: "rose",
                title: "Daily Journal & Gratitude",
                points: "5 pts",
                desc: "Mood selector, energy rating, gratitude list, and 3 reflection prompts to close every day with clarity.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-slate-700 transition group hover:-translate-y-1 duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-11 h-11 rounded-xl bg-${feature.color}-500/20 text-${feature.color}-400 flex items-center justify-center group-hover:scale-110 transition`}>
                    <feature.icon className="w-5 h-5" />
                  </div>
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {feature.points}
                  </span>
                </div>
                <h3 className="text-sm font-black text-white mb-1.5">{feature.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>

          {/* Secondary features */}
          <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              { icon: BarChart3, title: "Interactive Analytics", desc: "Score trends, category breakdowns, 6 timeframes" },
              { icon: Calendar, title: "Monthly Heatmap", desc: "Color-coded calendar of discipline wins" },
              { icon: CheckSquare, title: "3-Category Tasks", desc: "Small Things, Big Projects, Academic" },
              { icon: Trophy, title: "Gamified Levels", desc: "8 levels, 10 badges, 7 milestones" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex items-start gap-3">
                <item.icon className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-black text-white">{item.title}</div>
                  <div className="text-[11px] text-slate-400 mt-0.5">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== HOW IT WORKS ============== */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black uppercase tracking-wider mb-4">
              <Clock className="w-3.5 h-3.5" />
              <span>Setup in 60 Seconds</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              From Zero to <span className="bg-gradient-to-r from-amber-400 to-rose-400 bg-clip-text text-transparent">Disciplined</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 max-w-2xl mx-auto">
              Three simple steps to start compounding daily discipline into life-changing results.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-0.5 bg-gradient-to-r from-emerald-500/40 via-cyan-500/40 to-indigo-500/40" />

            {[
              {
                num: "01",
                title: "Login & Explore",
                desc: "Instant 1-click Option A / B / C demo login — no signup, no credit card. Jump straight into Alex, Sarah, or Marcus's real tracking profile.",
                icon: LogIn,
                color: "emerald",
              },
              {
                num: "02",
                title: "Log Daily Habits",
                desc: "Use the ⚡ Fast Log button to track water, meals, sleep, workouts in 1 tap each. Score updates in real-time across all 9 categories.",
                icon: Zap,
                color: "cyan",
              },
              {
                num: "03",
                title: "Build Your Streak",
                desc: "Watch streaks grow, unlock badges, level up XP, and transform your daily habits into unstoppable momentum over weeks and months.",
                icon: Flame,
                color: "amber",
              },
            ].map((step, i) => (
              <div key={i} className="relative glass-panel rounded-3xl p-6 border border-slate-800 text-center">
                <div
                  className={`relative w-14 h-14 mx-auto rounded-2xl bg-gradient-to-br from-${step.color}-500 to-${step.color}-600 flex items-center justify-center shadow-xl mb-4`}
                >
                  <step.icon className="w-7 h-7 text-white" />
                  <span className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-slate-950 border-2 border-slate-700 flex items-center justify-center text-[10px] font-black text-white">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-base font-black text-white">{step.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/app"
              className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
            >
              <Rocket className="w-4 h-4" />
              <span>Launch Dashboard Now</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ============== TESTIMONIALS ============== */}
      <section id="testimonials" className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-black uppercase tracking-wider mb-4">
              <Heart className="w-3.5 h-3.5 fill-rose-400 text-rose-400" />
              <span>Loved by Thousands</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              Real Discipline, <span className="bg-gradient-to-r from-rose-400 to-pink-400 bg-clip-text text-transparent">Real Transformations</span>
            </h2>

            <div className="flex items-center justify-center gap-1 mt-5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
              ))}
              <span className="text-sm font-black text-white ml-2">4.9</span>
              <span className="text-xs text-slate-400 font-bold">from 2,847+ reviews</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              {
                quote: "I went from a 42-point average to 88 in just 60 days. The multi-slot sleep tracking changed everything — I finally see how my naps affect my overall energy.",
                name: "Alex Rivera",
                role: "Software Engineer • 47-day streak",
                img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
                score: "92/100 avg",
              },
              {
                quote: "As a pre-med student, the academic learning log is a game changer. I can see exactly how my study hours correlate with my sleep quality. 10/10 perfect days this month!",
                name: "Sarah Chen",
                role: "Pre-Med Student • 28-day streak",
                img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
                score: "💎 Perfect Day Badge",
              },
              {
                quote: "The gamification is addictive in the best way. Reaching Level 5 Elite felt like winning. The badge for 100/100 is now my phone lock screen 🔥",
                name: "Marcus Vance",
                role: "Productivity Engineer • Level 5",
                img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
                score: "4,850 XP",
              },
              {
                quote: "The hydration bottle animation is weirdly satisfying. I've hit 4L every single day for 3 weeks straight. My skin has never looked better.",
                name: "Priya Sharma",
                role: "Content Creator • 21-day streak",
                img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
                score: "💧 Hydration Master",
              },
              {
                quote: "I've tried every habit app — Streaks, Habitica, Notion. Nothing comes close to the 100-point system. It's the first tracker that treats discipline like a sport.",
                name: "James Oduya",
                role: "Marathon Runner • 63-day streak",
                img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
                score: "🏋️ Iron Will Badge",
              },
              {
                quote: "The journal section helped me process my grad school anxiety. Daily gratitude + reflection = the mental health boost I didn't know I needed.",
                name: "Dr. Emma Yang",
                role: "PhD Candidate • Level 6",
                img: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
                score: "📖 Journal Master",
              },
            ].map((t, i) => (
              <div
                key={i}
                className="glass-panel rounded-3xl p-5 border border-slate-800 hover:border-emerald-500/30 transition"
              >
                <Quote className="w-6 h-6 text-emerald-400/40 mb-3" />
                <p className="text-xs text-slate-200 leading-relaxed">"{t.quote}"</p>

                <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-800">
                  <img
                    src={t.img}
                    alt={t.name}
                    className="w-10 h-10 rounded-xl object-cover border border-emerald-500/30"
                  />
                  <div className="flex-1 overflow-hidden">
                    <div className="text-xs font-black text-white truncate">{t.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{t.role}</div>
                  </div>
                  <span className="text-[9px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded">
                    {t.score}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============== PRICING ============== */}
      <section id="pricing" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/40 border-y border-slate-800/60">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4">
              <InfinityIcon className="w-3.5 h-3.5" />
              <span>Simple Honest Pricing</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              Free Forever. <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">No Catches.</span>
            </h2>
            <p className="text-sm text-slate-400 mt-4 max-w-xl mx-auto">
              Start with full access to everything. Upgrade only when you need teams, exports, or premium analytics.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-5xl mx-auto">
            {/* Free Plan */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col">
              <div className="text-xs font-black uppercase tracking-wider text-slate-400 mb-2">Starter</div>
              <h3 className="text-2xl font-black text-white">Free</h3>
              <p className="text-xs text-slate-400 mt-1">Forever. No credit card.</p>

              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-5xl font-black text-emerald-400">$0</span>
                <span className="text-sm text-slate-500 font-bold">/mo</span>
              </div>

              <ul className="space-y-2.5 mt-6 text-xs text-slate-300 flex-1">
                {[
                  "100-point daily scoring engine",
                  "All 9 habit categories tracked",
                  "Multi-slot sleep logging",
                  "Interactive analytics (30 days)",
                  "3-category to-do system",
                  "10 badges + 8 levels XP",
                  "Dark mode & mobile support",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className="mt-6 w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-white font-black text-xs rounded-xl text-center transition"
              >
                Start Free →
              </Link>
            </div>

            {/* Pro Plan - FEATURED */}
            <div className="relative glass-panel rounded-3xl p-6 border-2 border-emerald-500/60 shadow-2xl shadow-emerald-500/20 flex flex-col transform md:-translate-y-4">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-[10px] font-black uppercase tracking-wider rounded-full shadow-lg">
                ⭐ Most Popular
              </div>

              <div className="text-xs font-black uppercase tracking-wider text-emerald-400 mb-2">Pro</div>
              <h3 className="text-2xl font-black text-white">Discipline Pro</h3>
              <p className="text-xs text-slate-400 mt-1">For serious growth.</p>

              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-5xl font-black text-white">$9</span>
                <span className="text-sm text-slate-500 font-bold">/mo</span>
                <span className="text-[10px] text-emerald-400 font-bold bg-emerald-500/10 px-1.5 py-0.5 rounded ml-1">Save 40% yearly</span>
              </div>

              <ul className="space-y-2.5 mt-6 text-xs text-slate-300 flex-1">
                {[
                  "Everything in Starter, plus:",
                  "📈 Unlimited analytics history (1Y+)",
                  "📅 Custom date range filters",
                  "📧 Weekly email insights",
                  "📊 Export CSV + PDF reports",
                  "🔔 Smart push notifications",
                  "🤝 Share progress with coach/friend",
                  "🎯 Custom habits & scoring rules",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                    <span className={i === 0 ? "font-black text-white" : ""}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className="mt-6 w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl text-center shadow-lg shadow-emerald-500/25 transition"
              >
                Start 14-Day Free Trial →
              </Link>
            </div>

            {/* Team Plan */}
            <div className="glass-panel rounded-3xl p-6 border border-slate-800 flex flex-col">
              <div className="text-xs font-black uppercase tracking-wider text-indigo-400 mb-2">Team</div>
              <h3 className="text-2xl font-black text-white">Teams & Coaches</h3>
              <p className="text-xs text-slate-400 mt-1">For groups & orgs.</p>

              <div className="flex items-baseline gap-1 mt-5">
                <span className="text-5xl font-black text-white">$29</span>
                <span className="text-sm text-slate-500 font-bold">/mo</span>
                <span className="text-[10px] text-slate-400 font-bold ml-1">per 5 seats</span>
              </div>

              <ul className="space-y-2.5 mt-6 text-xs text-slate-300 flex-1">
                {[
                  "Everything in Pro, plus:",
                  "👥 Up to 5 team members",
                  "📊 Team leaderboards & challenges",
                  "🎓 Coach dashboards for clients",
                  "🏢 Branded white-label option",
                  "🔗 API access for integrations",
                  "💬 Priority Discord support",
                  "📚 Training resources",
                ].map((f, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <CircleCheck className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                    <span className={i === 0 ? "font-black text-white" : ""}>{f}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/app"
                className="mt-6 w-full py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 font-black text-xs rounded-xl text-center transition"
              >
                Contact Sales →
              </Link>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 mt-10">
            All plans include SSL encryption, 99.9% uptime, GDPR compliance, and cancel-anytime.
          </p>
        </div>
      </section>

      {/* ============== INSTALL / PWA ============== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-12 bg-gradient-to-br from-indigo-900/40 via-slate-900 to-emerald-950/40 border border-indigo-500/30 shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-4">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>Install as Mobile App</span>
                </div>

                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  Install Life Manager <br />
                  <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">on Your Phone</span>
                </h2>

                <p className="text-sm text-slate-300 mt-4 leading-relaxed">
                  Add Life Manager to your home screen as a Progressive Web App (PWA). Launches full-screen, works offline, syncs instantly — exactly like a Play Store APK.
                </p>

                <div className="flex flex-wrap gap-2 mt-6">
                  <Link
                    href="/install"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-lg shadow-emerald-500/25 transition active:scale-95"
                  >
                    <Download className="w-4 h-4 stroke-[3]" />
                    <span>Install Now (Free)</span>
                  </Link>
                  <Link
                    href="/install"
                    className="inline-flex items-center gap-2 px-5 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-white font-bold text-sm rounded-2xl transition"
                  >
                    <span>See All Devices</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>

                <div className="flex flex-wrap gap-3 mt-6 text-[11px] text-slate-400 font-bold">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Android & iOS
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Offline mode
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Home-screen icon
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Push notifications
                  </span>
                </div>
              </div>

              {/* Phone mockup */}
              <div className="flex justify-center">
                <div className="relative w-64 h-[480px] rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-950 shadow-2xl shadow-emerald-500/20 overflow-hidden">
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-slate-900 rounded-full z-20" />

                  <div className="p-5 pt-10 bg-gradient-to-b from-slate-950 to-slate-900 h-full">
                    <div className="text-[9px] text-slate-500 font-bold">Monday, Oct 7</div>
                    <div className="text-xs font-black text-white">Good morning 👋</div>

                    <div className="mt-5 p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-center">
                      <div className="text-[9px] text-slate-400">Today's Score</div>
                      <div className="text-3xl font-black text-emerald-400 mt-1">87<span className="text-xs text-slate-500">/100</span></div>
                      <div className="text-[9px] text-emerald-300 mt-1">🌟 Elite Performance</div>
                    </div>

                    <div className="mt-3 space-y-1.5">
                      {[
                        { icon: Moon, label: "Sleep", val: "18/20", color: "indigo" },
                        { icon: Droplet, label: "Water", val: "3.5L", color: "cyan" },
                        { icon: Dumbbell, label: "Fitness", val: "30 min", color: "amber" },
                        { icon: GraduationCap, label: "Study", val: "60 min", color: "violet" },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-900/80 border border-slate-800">
                          <div className="flex items-center gap-2">
                            <item.icon className={`w-3.5 h-3.5 text-${item.color}-400`} />
                            <span className="text-[10px] text-slate-300 font-bold">{item.label}</span>
                          </div>
                          <span className="text-[10px] font-black text-white">{item.val}</span>
                        </div>
                      ))}
                    </div>

                    <div className="mt-3 p-2 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 fill-orange-400 text-orange-400" />
                      <span className="text-[10px] font-black text-orange-300">47-day streak 🔥</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FAQ ============== */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-950/40 border-y border-slate-800/60">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-black uppercase tracking-wider mb-4">
              <Brain className="w-3.5 h-3.5" />
              <span>Common Questions</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-black text-white max-w-3xl mx-auto leading-tight">
              Everything You <span className="bg-gradient-to-r from-cyan-400 to-indigo-400 bg-clip-text text-transparent">Need to Know</span>
            </h2>
          </div>

          <div className="space-y-3">
            {[
              {
                q: "Is Life Manager really free?",
                a: "Yes, the Starter plan is 100% free forever with no credit card required. It includes the full 100-point scoring engine, all 9 habit categories, 30-day analytics history, badges, levels, and mobile support. Pro and Team plans unlock advanced features like unlimited history, custom habits, and team dashboards.",
              },
              {
                q: "Do I need to download an app?",
                a: "No download required! Life Manager runs in your browser on any device — desktop, tablet, or phone. Optionally, you can install it as a Progressive Web App (PWA) via our /install page, which gives you a home-screen icon and offline support — just like a native APK, with no app store approval needed.",
              },
              {
                q: "How does the 100-point scoring work?",
                a: "Every day you can earn up to 100 points across 9 life categories: Sleep (20 pts), Hydration (10), Fitness (10), 3 Meals (10), No-Oil (5), No-Caffeine (5), Music (10), Academic Learning (15), Journal (5). The more consistently you hit your targets, the higher your daily score climbs toward 100.",
              },
              {
                q: "Can I track multiple sleep periods per day?",
                a: "Absolutely! Life Manager supports multi-slot sleep logging — e.g., 11PM-4AM (5h) + 7AM-9AM (2h) = 7h total. Perfect for polyphasic sleepers, nappers, or anyone with non-traditional sleep schedules.",
              },
              {
                q: "Will my data be safe?",
                a: "Yes. All data is encrypted in transit (HTTPS SSL) and stored in a secure PostgreSQL database. We never sell your data or show ads. The Starter plan is private by default; Team plans allow optional sharing with coaches/trainers.",
              },
              {
                q: "Can I customize my daily targets?",
                a: "Yes — the Settings tab lets you adjust every target: sleep hours, water ml, workout minutes, caffeine cutoff time, academic study minutes, music practice minutes, and more. Make the 100-point system fit your personal goals.",
              },
              {
                q: "What if I miss a day?",
                a: "Your streak will reset to zero, but all your historical data stays intact. You can also log past days anytime by using the date picker in the navbar — great for backfilling if you forgot a day.",
              },
              {
                q: "Is there a mobile app in the Play Store or App Store?",
                a: "Life Manager is a Progressive Web App (PWA), which means you install it directly from your browser to your home screen — no app store needed. This is actually better than APK: smaller download, automatic updates, works on both Android and iOS from one install.",
              },
            ].map((item, idx) => (
              <details
                key={idx}
                className="glass-panel rounded-2xl p-5 border border-slate-800 group open:border-emerald-500/40 open:bg-emerald-500/5 transition"
              >
                <summary className="cursor-pointer flex items-center justify-between gap-3 text-sm font-bold text-white group-open:text-emerald-300 list-none">
                  <span>{item.q}</span>
                  <span className="w-6 h-6 rounded-full bg-slate-800 group-open:bg-emerald-500 flex items-center justify-center text-slate-400 group-open:text-slate-950 group-open:rotate-45 transition shrink-0">
                    <span className="text-base font-black">+</span>
                  </span>
                </summary>
                <p className="mt-3 pt-3 border-t border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {item.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ============== CTA ============== */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="relative overflow-hidden rounded-3xl p-8 sm:p-16 bg-gradient-to-br from-emerald-900/50 via-cyan-900/30 to-indigo-900/50 border border-emerald-500/30 shadow-2xl text-center">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/20 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase tracking-wider mb-5">
                <Rocket className="w-3.5 h-3.5" />
                <span>Your Transformation Starts Today</span>
              </div>

              <h2 className="text-4xl sm:text-6xl font-black text-white leading-[1.05]">
                Stop Winging Life. <br />
                <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-indigo-300 bg-clip-text text-transparent">
                  Start Scoring It.
                </span>
              </h2>

              <p className="text-sm sm:text-base text-slate-300 mt-6 max-w-xl mx-auto leading-relaxed">
                Join <span className="text-emerald-400 font-black">2,847+</span> disciplined humans building unbreakable daily habits with the 100-point life operating system.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
                <Link
                  href="/app"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-2xl shadow-emerald-500/40 transition active:scale-95 group"
                >
                  <Sparkles className="w-5 h-5 group-hover:rotate-12 transition" />
                  <span>Launch Life Manager — Free</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
                </Link>
              </div>

              <p className="text-xs text-slate-400 mt-5">
                No credit card • 1-click Option A demo login • 100% free forever
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============== FOOTER ============== */}
      <footer className="border-t border-slate-800/60 bg-slate-950/80 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
            {/* Logo column */}
            <div className="col-span-2">
              <Link href="/" className="flex items-center gap-2 mb-4">
                <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-emerald-500 via-cyan-500 to-indigo-500 flex items-center justify-center shadow-lg">
                  <Sparkles className="w-5 h-5 text-slate-950" />
                </div>
                <div>
                  <span className="font-black text-sm text-white">
                    LIFE<span className="text-emerald-400">MANAGER</span>
                  </span>
                  <span className="block text-[9px] text-slate-500 font-bold tracking-widest uppercase">
                    Discipline OS
                  </span>
                </div>
              </Link>
              <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
                The personal operating system for daily discipline. Track 9 life pillars, earn 100 pts/day, build unstoppable streaks.
              </p>

              <div className="flex items-center gap-2 mt-5">
                {[
                  { icon: Globe, href: "#", label: "Website" },
                  { icon: Mail, href: "mailto:hello@lifemanager.app", label: "Email" },
                  { icon: Users, href: "#", label: "Community" },
                  { icon: Rocket, href: "/", label: "App" },
                ].map((s, i) => (
                  <a
                    key={i}
                    href={s.href}
                    className="w-8 h-8 rounded-lg bg-slate-900 hover:bg-emerald-500/20 border border-slate-800 hover:border-emerald-500/40 flex items-center justify-center text-slate-400 hover:text-emerald-400 transition"
                  >
                    <s.icon className="w-4 h-4" />
                  </a>
                ))}
              </div>
            </div>

            {/* Links columns */}
            {[
              {
                title: "Product",
                links: [
                  { label: "Features", href: "#features" },
                  { label: "Pricing", href: "#pricing" },
                  { label: "How It Works", href: "#how-it-works" },
                  { label: "Install App", href: "/install" },
                  { label: "User Guide", href: "/guide" },
                ],
              },
              {
                title: "Resources",
                links: [
                  { label: "Dashboard", href: "/" },
                  { label: "FAQ", href: "#faq" },
                  { label: "Reviews", href: "#testimonials" },
                  { label: "Blog", href: "#" },
                  { label: "Support", href: "mailto:support@lifemanager.app" },
                ],
              },
              {
                title: "Company",
                links: [
                  { label: "About", href: "#" },
                  { label: "Careers", href: "#" },
                  { label: "Privacy", href: "#" },
                  { label: "Terms", href: "#" },
                  { label: "Contact", href: "mailto:hello@lifemanager.app" },
                ],
              },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="text-xs font-black text-white uppercase tracking-wider mb-3">
                  {col.title}
                </h4>
                <ul className="space-y-2">
                  {col.links.map((link, j) => (
                    <li key={j}>
                      <a
                        href={link.href}
                        className="text-xs text-slate-400 hover:text-emerald-400 transition"
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-[11px] text-slate-500">
              © 2026 Life Manager — Discipline OS. All rights reserved.
            </p>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span className="flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-emerald-400" />
                <span>SSL Encrypted</span>
              </span>
              <span className="flex items-center gap-1.5">
                <Globe className="w-3 h-3 text-cyan-400" />
                <span>Available Worldwide</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
