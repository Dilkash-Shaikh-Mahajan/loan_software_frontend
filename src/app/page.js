"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { useApp } from "@/context/AppContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {
  FiAward,
  FiSun,
  FiMoon,
  FiGlobe,
  FiArrowRight,
  FiTrendingUp,
  FiShield,
  FiActivity,
  FiPercent,
  FiChevronDown,
  FiMenu,
  FiX,
  FiDollarSign,
  FiCheckCircle,
  FiBarChart2,
  FiZap,
} from "react-icons/fi";

/* ─── Compound-interest EMI helper ─────────────────────────────── */
function calcEMI(principal, annualRate, months) {
  if (!principal || !months)
    return { emi: 0, totalPayback: 0, totalInterest: 0 };
  const r = annualRate / 100 / 12;
  if (r === 0) {
    const emi = principal / months;
    return { emi, totalPayback: principal, totalInterest: 0 };
  }
  const emi =
    (principal * r * Math.pow(1 + r, months)) / (Math.pow(1 + r, months) - 1);
  const totalPayback = emi * months;
  return { emi, totalPayback, totalInterest: totalPayback - principal };
}

function fmt(n) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
  }).format(n);
}

/* ─── Floating dashboard mockup ─────────────────────────────────── */
function DashboardMockup() {
  const rows = [
    {
      name: "Rahul Mehta",
      type: "Business",
      amount: "₹37,50,000",
      status: "Approved",
      color: "emerald",
    },
    {
      name: "Sarah Connor",
      type: "Personal",
      amount: "₹10,00,000",
      status: "Processing",
      color: "amber",
    },
    {
      name: "James Patel",
      type: "Mortgage",
      amount: "₹1,54,00,000",
      status: "Active",
      color: "indigo",
    },
    {
      name: "Li Wei",
      type: "Auto",
      amount: "₹26,65,000",
      status: "Pending",
      color: "violet",
    },
  ];
  const statusStyle = {
    Approved: "bg-emerald-500/15 text-emerald-500",
    Processing: "bg-amber-500/15 text-amber-500",
    Active: "bg-indigo-500/15 text-indigo-400",
    Pending: "bg-violet-500/15 text-violet-400",
  };

  return (
    <div className="relative w-full max-w-xl mx-auto lg:mx-0">
      {/* Glow blobs */}
      <div className="absolute -top-16 -right-16 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none animate-glow-1" />
      <div className="absolute -bottom-12 -left-12 h-56 w-56 rounded-full bg-purple-600/20 blur-3xl pointer-events-none animate-glow-2" />

      {/* Card */}
      <div className="relative rounded-2xl border border-border-main bg-bg-card shadow-2xl shadow-black/30 overflow-hidden backdrop-blur-sm">
        {/* Header bar */}
        <div className="flex items-center gap-2 border-b border-border-main bg-bg-main/60 px-5 py-3">
          <div className="h-3 w-3 rounded-full bg-red-400" />
          <div className="h-3 w-3 rounded-full bg-amber-400" />
          <div className="h-3 w-3 rounded-full bg-emerald-400" />
          <span className="ml-3 text-xs font-medium text-text-muted">
            ApexLoan Dashboard
          </span>
        </div>

        {/* Stat pills */}
        <div className="grid grid-cols-3 gap-3 border-b border-border-main bg-bg-card/50 px-5 py-4">
          {[
            {
              label: "Total Disbursed",
              value: "₹450Cr+",
              accent: "text-indigo-500",
            },
            {
              label: "Active Loans",
              value: "1,847",
              accent: "text-emerald-500",
            },
            {
              label: "Collection Rate",
              value: "98.3%",
              accent: "text-violet-500",
            },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl border border-border-main bg-bg-main/50 px-3 py-2.5"
            >
              <div className={`text-sm font-bold ${s.accent}`}>{s.value}</div>
              <div className="text-[10px] text-text-muted mt-0.5 leading-tight">
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mini table */}
        <div className="px-5 py-3">
          <div className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Recent Applications
          </div>
          <div className="space-y-2">
            {rows.map((r) => (
              <div
                key={r.name}
                className="flex items-center justify-between rounded-xl border border-border-main bg-bg-main/40 px-3 py-2"
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-7 w-7 rounded-full bg-${r.color}-500/15 flex items-center justify-center text-${r.color}-500 text-[10px] font-bold`}
                  >
                    {r.name[0]}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-text-main leading-tight">
                      {r.name}
                    </div>
                    <div className="text-[10px] text-text-muted">{r.type}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-semibold text-text-main">
                    {r.amount}
                  </span>
                  <span
                    className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${statusStyle[r.status]}`}
                  >
                    {r.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Progress bar footer */}
        <div className="border-t border-border-main bg-bg-main/40 px-5 py-3">
          <div className="flex items-center justify-between text-[10px] text-text-muted mb-1.5">
            <span>Monthly Target Progress</span>
            <span className="font-semibold text-indigo-500">84%</span>
          </div>
          <div className="h-1.5 w-full rounded-full bg-border-main">
            <div className="h-1.5 w-[84%] rounded-full bg-gradient-to-r from-indigo-500 to-purple-500" />
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Feature Card ───────────────────────────────────────────────── */
function FeatureCard({ icon: Icon, title, desc, accent }) {
  return (
    <div className="group relative rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden">
      <div
        className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br ${accent} to-transparent`}
      />
      <div className="relative">
        <div
          className={`mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${accent.replace("from-", "from-").split(" ")[0]} to-transparent border border-border-main shadow-sm`}
        >
          <Icon className="h-5 w-5 text-white" />
        </div>
        <h3 className="mb-2 text-base font-bold text-text-main">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

/* ─── Stat counter ───────────────────────────────────────────────── */
function StatPill({ value, label }) {
  return (
    <div className="flex flex-col items-center gap-1 px-8 py-5 rounded-2xl border border-border-main bg-bg-card hover:border-indigo-500/50 transition-colors shadow-sm group">
      <span className="text-2xl font-extrabold text-text-main group-hover:text-indigo-500 transition-colors">
        {value}
      </span>
      <span className="text-xs text-text-muted font-medium text-center">
        {label}
      </span>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────── */
export default function LandingPage() {
  const { t, theme, toggleTheme, language } = useApp();
  const router = useRouter();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Simulator state
  const [simPrincipal, setSimPrincipal] = useState(500000);
  const [simRate, setSimRate] = useState(10.5);
  const [simTerm, setSimTerm] = useState(36);

  const simResult = useMemo(
    () => calcEMI(simPrincipal, simRate, simTerm),
    [simPrincipal, simRate, simTerm],
  );

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("auth_token"));
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMobileMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const navLinks = [
    {
      label: t("featuresSectionTitle").split(" ")[0] + " Features",
      id: "features",
    },
    { label: t("quickSimulatorTitle"), id: "simulator" },
    { label: "Enterprise", id: "cta" },
  ];

  const features = [
    {
      icon: FiPercent,
      title: t("featCalcTitle"),
      desc: t("featCalcDesc"),
      accent: "from-indigo-600/20",
    },
    {
      icon: FiBarChart2,
      title: t("featAnalyticsTitle"),
      desc: t("featAnalyticsDesc"),
      accent: "from-purple-600/20",
    },
    {
      icon: FiSun,
      title: t("featThemeTitle"),
      desc: t("featThemeDesc"),
      accent: "from-amber-600/20",
    },
    {
      icon: FiShield,
      title: t("featSecurityTitle"),
      desc: t("featSecurityDesc"),
      accent: "from-emerald-600/20",
    },
  ];

  const stats = [
    { value: "2,500+", label: t("statActiveLoans") },
    { value: "₹500Cr+", label: t("statDisbursed") },
    { value: "99.1%", label: t("statRate") },
    { value: "500+", label: t("statQueue") },
  ];

  return (
    <div className="min-h-screen bg-background text-text-main transition-colors duration-300 font-sans">
      {/* ── NAVBAR ─────────────────────────────────────────────────── */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "border-b border-border-main bg-bg-header backdrop-blur-xl shadow-sm" : "bg-transparent"}`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30">
              <FiAward className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-text-main leading-none block">
                ApexLoan
              </span>
              <span className="text-[10px] text-text-muted font-medium tracking-wide">
                ENTERPRISE PLATFORM
              </span>
            </div>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="rounded-xl px-4 py-2 text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-card transition-all cursor-pointer"
              >
                {l.label}
              </button>
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="btn-base flex h-9 w-9 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-muted hover:text-text-main cursor-pointer shadow-sm"
              title="Toggle theme"
            >
              {theme === "dark" ? (
                <FiSun className="h-4 w-4" />
              ) : (
                <FiMoon className="h-4 w-4" />
              )}
            </button>

            {/* Language dropdown */}
            <LanguageDropdown compact />

            {/* CTA */}
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              className="btn-base hidden md:flex items-center gap-1.5 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-500 shadow-sm shadow-indigo-600/20 cursor-pointer"
            >
              {isLoggedIn ? t("landingHeroCTA") : t("landingHeroLogin")}
              <FiArrowRight className="h-4 w-4" />
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="btn-base flex md:hidden h-9 w-9 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-muted cursor-pointer"
            >
              {mobileMenuOpen ? (
                <FiX className="h-5 w-5" />
              ) : (
                <FiMenu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile menu drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-border-main bg-bg-card px-6 pb-5 pt-3 space-y-1">
            {navLinks.map((l) => (
              <button
                key={l.id}
                onClick={() => scrollTo(l.id)}
                className="w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium text-text-muted hover:text-text-main hover:bg-bg-main transition-all cursor-pointer"
              >
                {l.label}
              </button>
            ))}
            <Link
              href={isLoggedIn ? "/dashboard" : "/login"}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-center gap-1.5 w-full rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white mt-2 cursor-pointer"
            >
              {isLoggedIn ? t("landingHeroCTA") : t("landingHeroLogin")}
              <FiArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </header>

      {/* ── HERO ────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center overflow-hidden pt-20">
        {/* Background glow layer */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="animate-glow-1 absolute -top-32 left-1/4 h-96 w-96 rounded-full bg-indigo-600/15 blur-3xl" />
          <div className="animate-glow-2 absolute top-1/3 right-1/4 h-80 w-80 rounded-full bg-purple-600/10 blur-3xl" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-border-main to-transparent" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center w-full">
          {/* Left: copy */}
          <div className="flex flex-col gap-6">
            {/* Badge */}
            <div className="inline-flex w-fit items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
              <FiZap className="h-3.5 w-3.5" />
              Next-Gen Loan Management Platform
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight text-text-main">
              {language === "en" ? (
                <>
                  Next-Generation
                  <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                    Enterprise Loan
                  </span>{" "}
                  Management
                </>
              ) : (
                <>
                  अगली पीढ़ी का
                  <br />
                  <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-violet-500 bg-clip-text text-transparent">
                    एंटरप्राइज ऋण
                  </span>{" "}
                  प्रबंधन
                </>
              )}
            </h1>

            {/* Sub */}
            <p className="text-base sm:text-lg text-text-muted leading-relaxed max-w-xl">
              {t("landingSub")}
            </p>

            {/* CTA row */}
            <div className="flex flex-wrap gap-3 pt-2">
              <Link
                href={isLoggedIn ? "/dashboard" : "/login"}
                className="btn-base flex items-center gap-2 rounded-xl bg-indigo-600 px-6 py-3 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 cursor-pointer"
              >
                {isLoggedIn ? t("landingHeroCTA") : t("landingHeroLogin")}
                <FiArrowRight className="h-4 w-4" />
              </Link>
              <button
                onClick={() => scrollTo("simulator")}
                className="btn-base flex items-center gap-2 rounded-xl border border-border-main bg-bg-card px-6 py-3 text-sm font-bold text-text-main hover:bg-bg-main shadow-sm cursor-pointer"
              >
                {t("landingHeroScroll")}
                <FiChevronDown className="h-4 w-4" />
              </button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-5 pt-2">
              {[
                { icon: FiCheckCircle, text: "SOC 2 Compliant" },
                { icon: FiCheckCircle, text: "Bank-Grade Encryption" },
                { icon: FiCheckCircle, text: "99.9% Uptime SLA" },
              ].map((item) => (
                <div
                  key={item.text}
                  className="flex items-center gap-1.5 text-xs text-text-muted font-medium"
                >
                  <item.icon className="h-3.5 w-3.5 text-emerald-500" />
                  {item.text}
                </div>
              ))}
            </div>
          </div>

          {/* Right: dashboard mockup */}
          <DashboardMockup />
        </div>
      </section>

      {/* ── STATS RIBBON ────────────────────────────────────────────── */}
      <section className="border-y border-border-main bg-bg-main/50 py-10">
        <div className="mx-auto max-w-7xl px-6">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {stats.map((s) => (
              <StatPill key={s.label} value={s.value} label={s.label} />
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────────────── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-500/10 px-4 py-1.5 text-xs font-semibold text-purple-400">
              <FiActivity className="h-3.5 w-3.5" />
              Platform Capabilities
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main mb-3">
              {t("featuresSectionTitle")}
            </h2>
            <p className="text-text-muted max-w-2xl mx-auto leading-relaxed">
              {t("featuresSectionSub")}
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {features.map((f) => (
              <FeatureCard
                key={f.title}
                icon={f.icon}
                title={f.title}
                desc={f.desc}
                accent={f.accent}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── LOAN SIMULATOR ───────────────────────────────────────────── */}
      <section
        id="simulator"
        className="py-24 border-t border-border-main bg-bg-main/40 relative overflow-hidden"
      >
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[700px] rounded-full bg-indigo-600/5 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-6">
          <div className="mb-12 text-center">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
              <FiPercent className="h-3.5 w-3.5" />
              Interactive Simulator
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main mb-3">
              {t("quickSimulatorTitle")}
            </h2>
            <p className="text-text-muted max-w-xl mx-auto">
              {t("quickSimulatorSub")}
            </p>
          </div>

          <div className="mx-auto max-w-4xl">
            <div className="rounded-2xl border border-border-main bg-bg-card shadow-xl shadow-black/10 overflow-hidden">
              <div className="grid grid-cols-1 lg:grid-cols-5">
                {/* Input panel */}
                <div className="lg:col-span-3 p-8 border-b lg:border-b-0 lg:border-r border-border-main space-y-6">
                  <h3 className="text-base font-bold text-text-main">
                    Loan Parameters
                  </h3>

                  {/* Principal */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {t("loanAmount")}
                    </label>
                    <div className="relative">
                      <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-500">
                        ₹
                      </span>
                      <input
                        type="number"
                        value={simPrincipal}
                        onChange={(e) => setSimPrincipal(+e.target.value)}
                        className="w-full rounded-xl border border-border-main bg-bg-main py-3 pl-8 pr-4 text-sm font-semibold text-text-main outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                        min="10000"
                        max="100000000"
                      />
                    </div>
                    <input
                      type="range"
                      min="10000"
                      max="10000000"
                      step="10000"
                      value={simPrincipal}
                      onChange={(e) => setSimPrincipal(+e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted">
                      <span>₹10,000</span>
                      <span>₹1,00,00,000</span>
                    </div>
                  </div>

                  {/* Rate */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {t("annualInterestRate")}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={simRate}
                        step="0.1"
                        onChange={(e) => setSimRate(+e.target.value)}
                        className="w-full rounded-xl border border-border-main bg-bg-main py-3 pl-4 pr-10 text-sm font-semibold text-text-main outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                        min="0.1"
                        max="50"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-sm font-semibold text-indigo-500">
                        %
                      </span>
                    </div>
                    <input
                      type="range"
                      min="0.1"
                      max="30"
                      step="0.1"
                      value={simRate}
                      onChange={(e) => setSimRate(+e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted">
                      <span>0.1%</span>
                      <span>30%</span>
                    </div>
                  </div>

                  {/* Term */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted">
                      {t("loanTerm")}
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={simTerm}
                        onChange={(e) => setSimTerm(+e.target.value)}
                        className="w-full rounded-xl border border-border-main bg-bg-main py-3 pl-4 pr-20 text-sm font-semibold text-text-main outline-none transition-all focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10"
                        min="1"
                        max="360"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-text-muted">
                        months
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="360"
                      step="1"
                      value={simTerm}
                      onChange={(e) => setSimTerm(+e.target.value)}
                      className="w-full accent-indigo-600 cursor-pointer"
                    />
                    <div className="flex justify-between text-[10px] text-text-muted">
                      <span>1 month</span>
                      <span>360 months</span>
                    </div>
                  </div>
                </div>

                {/* Results panel */}
                <div className="lg:col-span-2 p-8 flex flex-col justify-between gap-6 bg-gradient-to-br from-indigo-600/5 to-purple-600/5">
                  <h3 className="text-base font-bold text-text-main">
                    Results
                  </h3>

                  <div className="space-y-4">
                    {/* Monthly EMI - hero */}
                    <div className="rounded-2xl border border-indigo-500/30 bg-indigo-600/10 p-5 text-center">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 mb-1">
                        {t("estMonthlyPayment")}
                      </div>
                      <div className="text-3xl font-extrabold text-indigo-400">
                        {fmt(simResult.emi)}
                      </div>
                    </div>

                    {/* Total payback */}
                    <div className="rounded-xl border border-border-main bg-bg-card p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                        {t("estTotalPayback")}
                      </div>
                      <div className="text-xl font-bold text-text-main">
                        {fmt(simResult.totalPayback)}
                      </div>
                    </div>

                    {/* Total interest */}
                    <div className="rounded-xl border border-border-main bg-bg-card p-4">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-text-muted mb-1">
                        {t("estTotalInterest")}
                      </div>
                      <div className="text-xl font-bold text-amber-500">
                        {fmt(simResult.totalInterest)}
                      </div>
                    </div>

                    {/* Interest ratio bar */}
                    <div>
                      <div className="flex justify-between text-[10px] text-text-muted mb-1.5">
                        <span>Principal</span>
                        <span>Interest</span>
                      </div>
                      <div className="flex h-2 w-full overflow-hidden rounded-full bg-border-main">
                        <div
                          className="h-full rounded-l-full bg-indigo-500 transition-all duration-500"
                          style={{
                            width:
                              simResult.totalPayback > 0
                                ? `${(simPrincipal / simResult.totalPayback) * 100}%`
                                : "0%",
                          }}
                        />
                        <div className="h-full flex-1 bg-amber-500 rounded-r-full" />
                      </div>
                    </div>
                  </div>

                  <Link
                    href={isLoggedIn ? "/dashboard/calculator" : "/login"}
                    className="btn-base flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-3 text-sm font-bold text-white hover:bg-indigo-500 cursor-pointer shadow-md shadow-indigo-600/20"
                  >
                    Full Amortization Schedule
                    <FiArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section id="cta" className="py-24 border-t border-border-main">
        <div className="mx-auto max-w-7xl px-6">
          <div className="relative overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-600/15 via-purple-600/10 to-bg-card p-12 text-center shadow-2xl">
            {/* bg glows */}
            <div className="pointer-events-none absolute -top-20 left-1/3 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-20 right-1/3 h-64 w-64 rounded-full bg-purple-500/20 blur-3xl" />

            <div className="relative">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-xs font-semibold text-indigo-400">
                <FiTrendingUp className="h-3.5 w-3.5" />
                Trusted by leading institutions
              </div>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-text-main mb-4 max-w-2xl mx-auto">
                {t("ctaBannerTitle")}
              </h2>
              <p className="text-text-muted max-w-xl mx-auto mb-8 leading-relaxed">
                {t("ctaBannerSub")}
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href={isLoggedIn ? "/dashboard" : "/login"}
                  className="btn-base flex items-center gap-2 rounded-xl bg-indigo-600 px-7 py-3.5 text-sm font-bold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/25 cursor-pointer"
                >
                  {isLoggedIn ? t("landingHeroCTA") : t("landingHeroLogin")}
                  <FiArrowRight className="h-4 w-4" />
                </Link>
                <button
                  onClick={() => scrollTo("simulator")}
                  className="btn-base flex items-center gap-2 rounded-xl border border-border-main bg-bg-card px-7 py-3.5 text-sm font-bold text-text-main hover:bg-bg-main cursor-pointer"
                >
                  {t("landingHeroScroll")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────────── */}
      <footer className="border-t border-border-main bg-bg-card">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            {/* Brand */}
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600">
                <FiAward className="h-4 w-4 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-sm text-text-main">
                  ApexLoan
                </span>
                <div className="text-[10px] text-text-muted font-medium">
                  ENTERPRISE PLATFORM
                </div>
              </div>
            </div>

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 text-xs text-text-muted">
              <button
                onClick={() => scrollTo("features")}
                className="hover:text-text-main transition-colors cursor-pointer"
              >
                Features
              </button>
              <button
                onClick={() => scrollTo("simulator")}
                className="hover:text-text-main transition-colors cursor-pointer"
              >
                Simulator
              </button>
              <button
                onClick={() => scrollTo("cta")}
                className="hover:text-text-main transition-colors cursor-pointer"
              >
                Enterprise
              </button>
              <Link
                href="/login"
                className="hover:text-text-main transition-colors cursor-pointer"
              >
                Sign In
              </Link>
            </div>

            {/* Copyright */}
            <div className="text-[11px] text-text-muted text-center">
              © {new Date().getFullYear()} ApexLoan. All rights reserved.
              <br className="sm:hidden" /> Designed &amp; Developed by{" "}
              <span className="font-semibold text-indigo-400">
                Swarajya Tech
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
