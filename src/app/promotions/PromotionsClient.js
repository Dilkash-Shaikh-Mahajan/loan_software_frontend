"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {
  FiSun,
  FiMoon,
  FiArrowRight,
  FiShield,
  FiTrendingUp,
  FiMapPin,
  FiBarChart2,
  FiUsers,
  FiClock,
  FiCheckCircle,
  FiSmartphone,
  FiDatabase,
  FiLock,
  FiGlobe,
  FiBriefcase,
  FiActivity,
  FiFileText,
  FiCpu
} from "react-icons/fi";

function WebDashboardMockup() {
  return (
    <div className="relative w-full max-w-2xl mx-auto hidden lg:block -rotate-1 hover:rotate-0 animate-float transition-all duration-700 hover:z-10 group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[100%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none transition-all duration-700 group-hover:bg-blue-500/20" />
      
      <div className="absolute -top-6 -right-6 bg-white dark:bg-zinc-800 border border-border-main p-3 rounded-2xl shadow-2xl z-20 flex items-center gap-3 transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-100">
        <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-2">
          <FiTrendingUp className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Recovery Rate</div>
          <div className="text-sm font-extrabold text-text-main">+24% MoM</div>
        </div>
      </div>

      <div className="relative rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 shadow-2xl shadow-blue-900/10 overflow-hidden backdrop-blur-xl z-10 transition-colors duration-500">
        <div className="flex items-center gap-2 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 px-4 py-3">
          <div className="h-2.5 w-2.5 rounded-full bg-rose-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-amber-400" />
          <div className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
          <span className="ml-3 text-[11px] font-semibold text-zinc-500 tracking-wide">ApexLoan Command Center</span>
        </div>
        <div className="p-5 flex gap-5 h-64">
          <div className="w-1/4 space-y-3">
            <div className="h-7 rounded bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800/30 flex items-center px-2 gap-2">
              <FiBarChart2 className="text-blue-600 dark:text-blue-400 h-3 w-3" />
              <div className="h-1.5 w-10 bg-blue-200 dark:bg-blue-800 rounded-full" />
            </div>
            <div className="h-7 rounded bg-zinc-50 dark:bg-zinc-800/50 flex items-center px-2 gap-2">
              <FiUsers className="text-zinc-400 h-3 w-3" />
              <div className="h-1.5 w-14 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>
            <div className="h-7 rounded bg-zinc-50 dark:bg-zinc-800/50 flex items-center px-2 gap-2">
              <FiMapPin className="text-zinc-400 h-3 w-3" />
              <div className="h-1.5 w-8 bg-zinc-200 dark:bg-zinc-700 rounded-full" />
            </div>
          </div>
          
          <div className="w-3/4 flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 p-4 border border-zinc-100 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-medium">Active Field Agents</div>
                <div className="text-lg font-bold text-zinc-900 dark:text-zinc-100">142<span className="text-xs text-emerald-500 ml-1">↑ 12</span></div>
              </div>
              <div className="flex-1 rounded-lg bg-zinc-50 dark:bg-zinc-800/30 p-4 border border-zinc-100 dark:border-zinc-800">
                <div className="text-[10px] text-zinc-500 font-medium">Today's Collections</div>
                <div className="text-lg font-bold text-blue-600 dark:text-blue-400">₹12.5L</div>
              </div>
            </div>
            
            <div className="flex-1 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-800/30 p-4 flex items-end justify-between gap-2 px-6">
              {[40, 70, 45, 90, 65, 100, 80].map((height, i) => (
                <div key={i} className="w-full max-w-[24px] bg-blue-100 dark:bg-blue-900/30 rounded-t-sm relative group/bar hover:bg-blue-200 dark:hover:bg-blue-800/50 transition-colors" style={{ height: `${height}%` }}>
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-zinc-800 dark:bg-zinc-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded shadow-sm opacity-0 group-hover/bar:opacity-100 transition-opacity">
                    {height}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MobileAppMockup() {
  return (
    <div className="relative w-64 mx-auto rotate-2 hover:rotate-0 animate-float-delayed transition-all duration-700 z-20 -mt-10 lg:-mt-32 lg:-ml-16 shadow-2xl shadow-blue-900/20 group">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[100%] bg-blue-400/10 blur-[80px] rounded-full pointer-events-none transition-all duration-500 group-hover:bg-blue-400/20" />
      
      <div className="absolute top-1/3 -left-24 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 p-3 rounded-xl shadow-2xl z-30 flex items-center gap-3 transform -translate-x-8 opacity-0 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500 delay-200">
        <div className="bg-emerald-500/10 text-emerald-500 rounded-full p-2">
          <FiCheckCircle className="h-4 w-4" />
        </div>
        <div>
          <div className="text-[10px] text-zinc-500 font-bold">Sync Complete</div>
          <div className="text-xs font-extrabold text-zinc-900 dark:text-zinc-100">Location Logged</div>
        </div>
      </div>

      <div className="relative rounded-[2rem] border-[6px] border-zinc-800 dark:border-zinc-900 bg-zinc-50 dark:bg-zinc-900 overflow-hidden h-[500px]">
        <div className="absolute top-0 inset-x-0 h-5 bg-zinc-800 dark:bg-zinc-900 rounded-b-xl w-28 mx-auto z-50" />
        
        <div className="bg-blue-600 dark:bg-blue-700 pt-10 pb-4 px-5 text-white shadow-sm">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm font-semibold tracking-wide">Field Tasks</div>
              <div className="text-[10px] text-blue-100">3 Pending</div>
            </div>
            <div className="bg-black/10 p-1.5 rounded-full">
              <FiMapPin className="h-4 w-4" />
            </div>
          </div>
        </div>

        <div className="p-4 space-y-3">
          <div className="rounded-xl bg-white dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 shadow-sm relative">
            <div className="absolute top-0 right-0 p-1.5 text-[8px] font-bold bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400 rounded-bl-lg border-l border-b border-rose-100 dark:border-rose-500/20">
              HIGH PRIORITY
            </div>
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Rahul Mehta</div>
            <div className="text-[10px] text-zinc-500 mb-2">EMI ₹12,500 • 30 Days Overdue</div>
            
            <div className="flex items-start gap-2 text-[10px] text-zinc-500 mb-3 bg-zinc-50 dark:bg-zinc-900 p-2 rounded border border-zinc-100 dark:border-zinc-800">
              <FiMapPin className="h-3 w-3 mt-0.5 text-blue-500 flex-shrink-0" />
              <span>42/B, MG Road, Phase 1</span>
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-2 rounded shadow-sm transition-colors flex items-center justify-center gap-1.5">
              Log Visit
            </button>
          </div>

          <div className="rounded-xl bg-white dark:bg-zinc-800 p-4 border border-zinc-200 dark:border-zinc-700 shadow-sm opacity-70">
            <div className="text-xs font-bold text-zinc-900 dark:text-zinc-100">Sarah Connor</div>
            <div className="text-[10px] text-zinc-500 mb-2">EMI ₹8,400 • 15 Days Overdue</div>
            <button className="w-full bg-zinc-100 dark:bg-zinc-700 text-zinc-600 dark:text-zinc-300 text-[11px] font-bold py-2 rounded mt-1 flex items-center justify-center gap-1.5">
              Navigate
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PromotionsClient() {
  const { theme, toggleTheme, t, language } = useApp();
  const [mounted, setMounted] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-300 font-sans overflow-x-hidden selection:bg-blue-500/20 selection:text-blue-900 dark:selection:text-blue-100">
      
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
          scrolled ? "border-b border-zinc-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-950/80 backdrop-blur-md shadow-sm" : "bg-transparent py-2"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white shadow-sm">
              <FiBriefcase className="h-5 w-5" />
            </div>
            <div>
              <span className="font-bold text-lg leading-none block tracking-tight">
                ApexLoan
              </span>
              <span className="text-[9px] text-blue-600 dark:text-blue-400 font-bold uppercase tracking-wider block mt-0.5">
                Enterprise SaaS
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              {mounted && theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>
            <LanguageDropdown compact />
            <Link
              href="/login"
              className="hidden md:flex items-center gap-2 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 px-5 py-2 text-sm font-semibold hover:bg-zinc-800 dark:hover:bg-white transition-colors"
            >
              Request Demo
            </Link>
          </div>
        </div>
      </header>

      {/* ── HERO SECTION ──────────────────────────────────────────────── */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28 overflow-hidden">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]" />
        
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 dark:border-blue-900/50 bg-blue-50 dark:bg-blue-900/20 px-4 py-1.5 text-xs font-semibold text-blue-700 dark:text-blue-300 mb-8">
            <FiShield className="h-3.5 w-3.5" />
            SOC2 Compliant Recovery Platform
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight mb-6 max-w-4xl mx-auto text-zinc-900 dark:text-zinc-50">
            Intelligent Field Recovery <br className="hidden md:block" />
            <span className="text-blue-600 dark:text-blue-500">Built for Enterprise.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Unify your collection operations. Track agents in real-time, automate case allocation, and ensure compliance with our offline-first mobile app and powerful admin dashboard.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-20">
            <Link
              href="/login"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors shadow-sm"
            >
              Start Free Trial
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-lg bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 px-8 py-3.5 text-base font-semibold text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm"
            >
              Explore Features
            </Link>
          </div>

          <div className="flex flex-col lg:flex-row items-center justify-center max-w-5xl mx-auto perspective-[1000px]">
             <WebDashboardMockup />
             <MobileAppMockup />
          </div>
        </div>
      </section>

      {/* ── TRUSTED BY (SOCIAL PROOF) ─────────────────────────────────── */}
      <section className="py-10 border-y border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900/50 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-glow-1 absolute top-1/2 left-1/4 h-32 w-32 rounded-full bg-indigo-500/20 blur-[50px]" />
          <div className="animate-glow-2 absolute top-1/2 right-1/4 h-32 w-32 rounded-full bg-emerald-500/20 blur-[50px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <p className="text-sm font-medium text-zinc-500 dark:text-zinc-400 mb-6 uppercase tracking-widest">
            Trusted by Leading Financial Institutions
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 opacity-50 grayscale">
            {/* Placeholders for logos */}
            <div className="flex items-center gap-2 font-bold text-xl"><FiGlobe className="h-6 w-6"/> GlobalBank</div>
            <div className="flex items-center gap-2 font-bold text-xl"><FiShield className="h-6 w-6"/> SecureTrust</div>
            <div className="flex items-center gap-2 font-bold text-xl"><FiTrendingUp className="h-6 w-6"/> ApexFinance</div>
            <div className="flex items-center gap-2 font-bold text-xl"><FiBriefcase className="h-6 w-6"/> CapitalPartners</div>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS (WORKFLOW) ───────────────────────────────────── */}
      <section id="how-it-works" className="py-24 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-glow-2 absolute top-1/3 -left-32 h-[500px] w-[500px] rounded-full bg-blue-500/10 blur-[120px]" />
          <div className="animate-glow-1 absolute bottom-0 right-0 h-[400px] w-[400px] rounded-full bg-purple-500/10 blur-[100px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Streamlined Collection Workflow</h2>
            <p className="text-zinc-500 dark:text-zinc-400">From bank allocation to field resolution, completely automated.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-zinc-200 dark:bg-zinc-800" />
            
            {[
              { icon: FiDatabase, title: "1. Allocation", desc: "Cases securely imported from banks via API." },
              { icon: FiSmartphone, title: "2. Assignment", desc: "Auto-routed to the nearest field agent's mobile app." },
              { icon: FiMapPin, title: "3. Field Visit", desc: "Agent navigates offline and logs customer feedback." },
              { icon: FiBarChart2, title: "4. Resolution", desc: "Data syncs to admin dashboard instantly for reporting." }
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-col items-center text-center">
                <div className="w-16 h-16 rounded-2xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 shadow-sm flex items-center justify-center mb-6 text-blue-600 dark:text-blue-400">
                  <step.icon className="h-6 w-6" />
                </div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── BENTO BOX FEATURE GRID ─────────────────────────────────────── */}
      <section className="py-24 bg-zinc-100 dark:bg-zinc-900 border-y border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-glow-1 absolute top-0 right-1/4 h-[600px] w-[600px] rounded-full bg-amber-500/5 blur-[150px]" />
          <div className="animate-glow-2 absolute bottom-0 left-1/4 h-[600px] w-[600px] rounded-full bg-emerald-500/5 blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="mb-16 max-w-2xl">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Enterprise-grade capabilities</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-lg">Robust tools designed specifically for the rigorous demands of debt recovery and compliance.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center mb-6">
                  <FiMapPin className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Live Geolocation Tracking</h3>
                <p className="text-zinc-500 dark:text-zinc-400 mb-8 max-w-md">Monitor your entire workforce on a live map. View historical routes, idle times, and verify visits through geo-fenced check-ins.</p>
              </div>
              <div className="h-40 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-100 dark:border-zinc-800 relative overflow-hidden">
                 {/* Abstract map visual */}
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />
                 <div className="absolute top-1/2 left-1/3 w-3 h-3 bg-blue-500 rounded-full shadow-[0_0_15px_rgba(59,130,246,0.8)] animate-pulse" />
                 <div className="absolute top-1/3 left-2/3 w-3 h-3 bg-emerald-500 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.8)]" />
              </div>
            </div>

            <div className="rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-6">
                <FiLock className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">Bank-level Security</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">End-to-end encryption, SOC2 compliance, and strict Role-Based Access Control (RBAC) ensures sensitive borrower data never leaks.</p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 flex items-center justify-center mb-6">
                <FiFileText className="h-5 w-5" />
              </div>
              <h3 className="text-xl font-bold mb-3">1-Click Reporting</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm">Generate automated PDF MIS reports for your partner banks with zero manual data entry.</p>
            </div>

            <div className="md:col-span-2 rounded-3xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mb-6">
                  <FiCpu className="h-5 w-5" />
                </div>
                <h3 className="text-2xl font-bold mb-3">Offline-First Architecture</h3>
                <p className="text-zinc-500 dark:text-zinc-400 max-w-md">Agents often visit remote areas with poor connectivity. Our app stores data locally and auto-syncs securely the moment a connection is restored.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── ENTERPRISE ROI METRICS ────────────────────────────────────── */}
      <section className="py-24 border-b border-zinc-200 dark:border-zinc-800 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="animate-glow-1 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[600px] w-[1000px] rounded-full bg-indigo-500/10 blur-[150px]" />
        </div>
        <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl font-bold tracking-tight mb-16">Proven impact on recovery operations</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div>
              <div className="text-5xl font-black text-blue-600 dark:text-blue-500 mb-2">40%</div>
              <div className="font-semibold text-lg mb-2">Faster Turnaround</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Reduction in case resolution time via automated allocation.</div>
            </div>
            <div>
              <div className="text-5xl font-black text-emerald-600 dark:text-emerald-500 mb-2">99%</div>
              <div className="font-semibold text-lg mb-2">Audit Compliance</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Maintained through strict geofencing and timestamped logs.</div>
            </div>
            <div>
              <div className="text-5xl font-black text-purple-600 dark:text-purple-500 mb-2">+25%</div>
              <div className="font-semibold text-lg mb-2">Recovery Yield</div>
              <div className="text-sm text-zinc-500 dark:text-zinc-400">Increase in total recoveries due to improved agent efficiency.</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING PLANS ─────────────────────────────────────────────── */}
      <section className="py-24 bg-zinc-50 dark:bg-zinc-950">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Transparent Pricing</h2>
            <p className="text-zinc-500 dark:text-zinc-400">Predictable scaling for agencies of all sizes.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Starter */}
            <div className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-8 shadow-sm">
              <h3 className="text-xl font-bold mb-1">Starter Agency</h3>
              <div className="text-sm text-zinc-500 mb-6">Up to 15 Field Agents</div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold">₹9,999</span>
                <span className="text-zinc-500">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {["Live Tracking", "Basic MIS Reports", "Email Support", "Android Agent App"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <FiCheckCircle className="text-blue-500 h-4 w-4" /> {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 py-2.5 text-sm font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">Contact Sales</button>
            </div>

            {/* Enterprise */}
            <div className="rounded-2xl border-2 border-blue-500 bg-white dark:bg-zinc-900 p-8 shadow-lg relative">
              <div className="absolute top-0 right-8 -translate-y-1/2 bg-blue-500 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">Recommended</div>
              <h3 className="text-xl font-bold mb-1">Enterprise Partner</h3>
              <div className="text-sm text-zinc-500 mb-6">Up to 100 Field Agents</div>
              
              <div className="mb-8 flex items-baseline gap-1">
                <span className="text-4xl font-bold text-blue-600 dark:text-blue-400">₹24,999</span>
                <span className="text-zinc-500">/mo</span>
              </div>
              
              <ul className="space-y-4 mb-8">
                {["Advanced Analytics", "Bank APIs & Webhooks", "24/7 Priority Support", "White-label Options", "Dedicated Account Manager"].map((feat, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-zinc-700 dark:text-zinc-300">
                    <FiCheckCircle className="text-blue-500 h-4 w-4" /> {feat}
                  </li>
                ))}
              </ul>
              <button className="w-full rounded-lg bg-blue-600 hover:bg-blue-700 text-white py-2.5 text-sm font-semibold transition-colors">Start Free Trial</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── CALL TO ACTION ────────────────────────────────────────────── */}
      <section className="py-24 border-t border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Digitize your recovery operations today.</h2>
          <p className="text-zinc-500 dark:text-zinc-400 mb-10 text-lg">
            Join the leading agencies using ApexLoan to recover faster and smarter.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/login" className="w-full sm:w-auto rounded-lg bg-blue-600 px-8 py-3.5 text-base font-semibold text-white hover:bg-blue-700 transition-colors">
              Request a Demo
            </Link>
            <Link href="/login" className="w-full sm:w-auto rounded-lg border border-zinc-200 dark:border-zinc-700 px-8 py-3.5 text-base font-semibold hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
      
      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 py-8 text-center text-sm text-zinc-500">
        <p>© {new Date().getFullYear()} ApexLoan SaaS. All rights reserved.</p>
      </footer>
    </div>
  );
}
