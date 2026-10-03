"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Smartphone,
  Download,
  Share2,
  Globe,
  Apple,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Flame,
  Zap,
  Monitor,
  Plus,
  Home,
  MoreVertical,
  QrCode,
  Copy,
  Check,
  Shield,
  Wifi,
  Bell,
  ArrowRight,
  Package,
} from "lucide-react";

export default function InstallPage() {
  const [currentUrl, setCurrentUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [canInstall, setCanInstall] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const [platform, setPlatform] = useState<"android" | "ios" | "desktop" | "unknown">("unknown");

  useEffect(() => {
    if (typeof window === "undefined") return;
    setCurrentUrl(window.location.origin + "/app");

    // Detect platform
    const ua = navigator.userAgent.toLowerCase();
    if (/android/.test(ua)) setPlatform("android");
    else if (/iphone|ipad|ipod/.test(ua)) setPlatform("ios");
    else setPlatform("desktop");

    // Check if already installed
    const isStandalone = window.matchMedia("(display-mode: standalone)").matches ||
      // @ts-ignore
      window.navigator.standalone === true;
    if (isStandalone) setIsInstalled(true);

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setCanInstall(true);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);
    return () => window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setIsInstalled(true);
        setCanInstall(false);
      }
      setDeferredPrompt(null);
    } catch (err) {
      console.warn(err);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const qrUrl = currentUrl
    ? `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(currentUrl)}&bgcolor=0f172a&color=10b981&margin=12`
    : "";

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-40 glass-panel border-b border-slate-800/80 px-4 lg:px-8 py-3 backdrop-blur-xl">
        <div className="flex items-center justify-between max-w-5xl mx-auto">
          <Link
            href="/app"
            className="flex items-center gap-2 text-slate-300 hover:text-white text-sm font-bold transition"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to App</span>
          </Link>

          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center shadow-lg">
              <Sparkles className="w-4 h-4 text-slate-950" />
            </div>
            <span className="font-extrabold text-sm text-white hidden sm:inline">
              LIFE<span className="text-emerald-400">MANAGER</span>
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20 space-y-8">
        {/* Hero Install Banner */}
        <div className="relative overflow-hidden rounded-3xl p-6 sm:p-10 bg-gradient-to-br from-emerald-900/40 via-slate-900 to-indigo-950/40 border border-emerald-500/30 shadow-2xl">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 flex flex-col lg:flex-row items-center gap-8">
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-[11px] font-black uppercase tracking-wider mb-3">
                <Package className="w-3.5 h-3.5" />
                <span>Install as Native App (APK Alternative)</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
                Get <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Life Manager</span>
                <br />
                on your Phone 📱
              </h1>

              <p className="text-sm text-slate-300 mt-4 leading-relaxed max-w-xl">
                Install the full Discipline OS directly on your Android, iOS, or desktop device as a <span className="text-emerald-400 font-bold">Progressive Web App (PWA)</span>. Launches full-screen, works offline, syncs instantly — exactly like a Play Store APK.
              </p>

              {isInstalled ? (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-black text-sm rounded-2xl">
                  <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                  <span>App Installed ✓ Ready to launch from home screen</span>
                </div>
              ) : canInstall ? (
                <button
                  onClick={handleInstall}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-sm rounded-2xl shadow-xl shadow-emerald-500/30 transition active:scale-95 cursor-pointer"
                >
                  <Download className="w-5 h-5 stroke-[3]" />
                  <span>Install Now (1-Tap)</span>
                </button>
              ) : (
                <div className="mt-6 inline-flex items-center gap-2 px-4 py-2.5 bg-slate-800/80 border border-slate-700 text-slate-300 text-xs rounded-2xl">
                  <Smartphone className="w-4 h-4 text-cyan-400" />
                  <span>Follow the step-by-step install guide below for your device</span>
                </div>
              )}

              <div className="flex flex-wrap gap-2 mt-5 justify-center lg:justify-start">
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <Wifi className="w-3 h-3 text-cyan-400" /> Works Offline
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <Home className="w-3 h-3 text-emerald-400" /> Home Screen Icon
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <Shield className="w-3 h-3 text-amber-400" /> Secure HTTPS
                </span>
                <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-slate-900/80 border border-slate-700 text-slate-300 flex items-center gap-1">
                  <Bell className="w-3 h-3 text-rose-400" /> Push Reminders
                </span>
              </div>
            </div>

            {/* QR Code */}
            <div className="shrink-0 flex flex-col items-center gap-3">
              <div className="p-3 rounded-3xl bg-white shadow-2xl shadow-emerald-500/20">
                {qrUrl && <img src={qrUrl} alt="Scan to install" width={240} height={240} className="rounded-2xl" />}
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <QrCode className="w-3.5 h-3.5 text-emerald-400" />
                <span>Scan with your phone camera</span>
              </div>
            </div>
          </div>
        </div>

        {/* URL Copy Bar */}
        <div className="glass-panel rounded-2xl p-4 border border-slate-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="flex-1 w-full">
            <div className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-1">
              App URL (Share or type in your mobile browser)
            </div>
            <div className="font-mono text-sm text-emerald-300 break-all">{currentUrl || "Loading..."}</div>
          </div>
          <button
            onClick={handleCopy}
            className="shrink-0 w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/40 text-emerald-300 font-bold text-xs rounded-xl transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copy Link</span>
              </>
            )}
          </button>
        </div>

        {/* Why Not a Real APK Section */}
        <div className="glass-panel rounded-3xl p-6 border border-amber-500/30 bg-amber-500/5">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
              <Package className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black text-white">About the APK Format</h3>
              <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">
                Life Manager is built as a modern <span className="text-emerald-400 font-bold">Progressive Web App (PWA)</span> instead of a traditional APK. This gives you <span className="text-amber-300 font-bold">better advantages</span> than a signed APK:
              </p>
              <ul className="text-xs text-slate-400 space-y-1.5 mt-3">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>No Play Store approval needed — install in 10 seconds</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Works on Android, iOS, Windows, Mac, and Linux from a single install</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Automatic updates — no re-downloading when new features ship</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>5x smaller download size than an APK (~250 KB vs ~15 MB)</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                  <span>Launches full-screen with its own home-screen icon just like a native APK</span>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Platform-Specific Install Guides */}
        <div>
          <h2 className="text-xl font-black text-white mb-4">
            📲 Installation Guide for All Devices
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Android Install */}
            <div className={`glass-panel rounded-3xl p-5 border ${platform === "android" ? "border-emerald-500/60 shadow-lg shadow-emerald-500/10" : "border-slate-800"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Android</h3>
                    <p className="text-[10px] text-slate-400">Chrome, Edge, Samsung Internet</p>
                  </div>
                </div>
                {platform === "android" && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                    YOUR DEVICE
                  </span>
                )}
              </div>

              <ol className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">1</span>
                  <span className="text-slate-300">Open this page in <span className="text-emerald-400 font-bold">Chrome</span> on your Android</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">2</span>
                  <span className="text-slate-300">Tap the <MoreVertical className="w-3.5 h-3.5 inline text-emerald-400" /> menu (top-right)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">3</span>
                  <span className="text-slate-300">Select <span className="text-emerald-400 font-bold">"Install app"</span> or <span className="text-emerald-400 font-bold">"Add to Home Screen"</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">4</span>
                  <span className="text-slate-300">Tap <span className="text-emerald-400 font-bold">"Install"</span> in the popup</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-emerald-500 text-slate-950 font-black text-[10px] flex items-center justify-center">5</span>
                  <span className="text-slate-300">🎉 Launch from your home screen — looks and feels like a native APK</span>
                </li>
              </ol>

              {platform === "android" && canInstall && (
                <button
                  onClick={handleInstall}
                  className="mt-4 w-full py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>Install Now on This Device</span>
                </button>
              )}
            </div>

            {/* iOS Install */}
            <div className={`glass-panel rounded-3xl p-5 border ${platform === "ios" ? "border-cyan-500/60 shadow-lg shadow-cyan-500/10" : "border-slate-800"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
                    <Apple className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">iPhone / iPad</h3>
                    <p className="text-[10px] text-slate-400">Safari browser required</p>
                  </div>
                </div>
                {platform === "ios" && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                    YOUR DEVICE
                  </span>
                )}
              </div>

              <ol className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center">1</span>
                  <span className="text-slate-300">Open this page in <span className="text-cyan-400 font-bold">Safari</span> (not Chrome)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center">2</span>
                  <span className="text-slate-300">Tap the <Share2 className="w-3.5 h-3.5 inline text-cyan-400" /> <span className="text-cyan-400 font-bold">Share</span> button (bottom center)</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center">3</span>
                  <span className="text-slate-300">Scroll and tap <span className="text-cyan-400 font-bold">"Add to Home Screen"</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center">4</span>
                  <span className="text-slate-300">Confirm the app name and tap <span className="text-cyan-400 font-bold">"Add"</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-cyan-500 text-slate-950 font-black text-[10px] flex items-center justify-center">5</span>
                  <span className="text-slate-300">🎉 Life Manager icon now appears on your iOS home screen</span>
                </li>
              </ol>
            </div>

            {/* Desktop Install */}
            <div className={`glass-panel rounded-3xl p-5 border ${platform === "desktop" ? "border-indigo-500/60 shadow-lg shadow-indigo-500/10" : "border-slate-800"}`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-white">Desktop</h3>
                    <p className="text-[10px] text-slate-400">Windows, Mac, Chromebook</p>
                  </div>
                </div>
                {platform === "desktop" && (
                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                    YOUR DEVICE
                  </span>
                )}
              </div>

              <ol className="space-y-3 text-xs">
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">1</span>
                  <span className="text-slate-300">Open in <span className="text-indigo-400 font-bold">Chrome</span>, <span className="text-indigo-400 font-bold">Edge</span>, or <span className="text-indigo-400 font-bold">Brave</span></span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">2</span>
                  <span className="text-slate-300">Click the <Download className="w-3.5 h-3.5 inline text-indigo-400" /> install icon in the address bar</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">3</span>
                  <span className="text-slate-300">Click <span className="text-indigo-400 font-bold">"Install"</span> in the confirmation popup</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">4</span>
                  <span className="text-slate-300">App launches in standalone window with taskbar/dock icon</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="w-5 h-5 shrink-0 rounded-full bg-indigo-500 text-white font-black text-[10px] flex items-center justify-center">5</span>
                  <span className="text-slate-300">🎉 Pin to taskbar for 1-click daily access</span>
                </li>
              </ol>

              {platform === "desktop" && canInstall && (
                <button
                  onClick={handleInstall}
                  className="mt-4 w-full py-2.5 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs rounded-xl transition cursor-pointer flex items-center justify-center gap-2"
                >
                  <Download className="w-4 h-4 stroke-[3]" />
                  <span>Install on This Computer</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Advanced: TWA / Real APK Build Info */}
        <div className="glass-panel rounded-3xl p-6 border border-slate-800">
          <h3 className="text-base font-black text-white flex items-center gap-2">
            <Package className="w-5 h-5 text-emerald-400" />
            <span>Advanced: Want a Real Signed .apk File?</span>
          </h3>
          <p className="text-xs text-slate-400 mt-2 leading-relaxed">
            You can wrap this PWA into a real signed Android APK/AAB for Play Store distribution using Google's official <span className="text-emerald-400 font-bold">PWA Builder</span> or <span className="text-emerald-400 font-bold">Bubblewrap CLI</span>. Both tools convert this exact URL into a Trusted Web Activity (TWA) APK in minutes.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
            <a
              href={currentUrl ? `https://www.pwabuilder.com/reportcard?site=${encodeURIComponent(currentUrl)}` : "https://www.pwabuilder.com"}
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition cursor-pointer flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white group-hover:text-emerald-300">PWA Builder</h4>
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Microsoft's free online tool. Paste your URL, click "Package for Android" → get a signed APK/AAB file.
                </p>
              </div>
            </a>

            <a
              href="https://github.com/GoogleChromeLabs/bubblewrap"
              target="_blank"
              rel="noreferrer"
              className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition cursor-pointer flex items-start gap-3 group"
            >
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-white group-hover:text-indigo-300">Bubblewrap CLI</h4>
                  <ArrowRight className="w-3.5 h-3.5 text-indigo-400" />
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Google's open-source CLI. Run <code className="text-emerald-400">npx @bubblewrap/cli init</code> to generate an Android Studio project.
                </p>
              </div>
            </a>
          </div>

          <div className="mt-4 p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-[11px] text-slate-400 font-mono">
            <span className="text-emerald-400"># Quick Bubblewrap APK build (3 commands):</span><br />
            npm i -g @bubblewrap/cli<br />
            bubblewrap init --manifest={currentUrl}/manifest.json<br />
            bubblewrap build  <span className="text-slate-500"># → outputs app-release-signed.apk</span>
          </div>
        </div>

        {/* Option B Info Card */}
        <div className="glass-panel rounded-3xl p-6 border border-cyan-500/30 bg-cyan-500/5">
          <div className="flex items-start gap-3">
            <img
              src="https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80"
              alt="Sarah Chen"
              className="w-14 h-14 rounded-2xl object-cover border-2 border-cyan-500/40 shrink-0"
            />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base font-black text-white">Option B Pre-Loaded</h3>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
                  Sarah Chen
                </span>
                <span className="text-[10px] font-bold text-cyan-400 flex items-center gap-0.5">
                  <Flame className="w-3 h-3 fill-cyan-400" /> 28-day streak
                </span>
                <span className="text-[10px] font-bold text-indigo-400 flex items-center gap-0.5">
                  <Zap className="w-3 h-3 fill-indigo-400" /> 6,200 XP • Lv 6
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1.5">
                Once installed, open the app and tap <span className="text-cyan-400 font-bold">Option B</span> on the login screen to instantly access Sarah's Pre-Med & Athlete profile with 30 days of real tracking data.
              </p>
              <Link
                href="/app"
                className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/40 text-cyan-300 font-bold text-xs rounded-xl transition cursor-pointer"
              >
                <ArrowRight className="w-3.5 h-3.5" />
                <span>Open App & Login as Option B</span>
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
