"use client";

import { useApp } from "@/context/AppContext";
import { FiBriefcase, FiCheckCircle, FiTrendingUp } from "react-icons/fi";

export default function StatsCards({ activeCases = 0, resolvedCases = 0 }) {
  const { t } = useApp();

  return (
    <div className="flex flex-col sm:flex-row gap-5 mb-4">
      {/* Active Cases Card */}
      <div className="group flex-1 relative overflow-hidden rounded-2xl bg-bg-card p-6 shadow-md shadow-indigo-500/5 hover:shadow-2xl hover:shadow-indigo-500/15 hover:-translate-y-0.5 transition-all duration-300 border border-border-main hover:border-indigo-500/30">
        <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
              {t("ACTIVE_CASES") || "ACTIVE CASES"}
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-text-main">
              {activeCases}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform duration-300 shadow-md border border-indigo-500/20">
            <FiBriefcase className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-indigo-500 font-semibold">
          <FiTrendingUp className="h-3.5 w-3.5" />
          <span>Active recovery portfolio</span>
        </div>
      </div>

      {/* Resolved Accounts Card */}
      <div className="group flex-1 relative overflow-hidden rounded-2xl bg-bg-card p-6 shadow-md shadow-emerald-500/5 hover:shadow-2xl hover:shadow-emerald-500/15 hover:-translate-y-0.5 transition-all duration-300 border border-border-main hover:border-emerald-500/30">
        <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
        <div className="flex items-center justify-between relative z-10">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-text-muted block mb-1">
              {t("RESOLVED_ACCOUNTS") || "RESOLVED ACCOUNTS"}
            </span>
            <span className="text-3xl font-extrabold tracking-tight text-text-main">
              {resolvedCases}
            </span>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300 shadow-md border border-emerald-500/20">
            <FiCheckCircle className="h-6 w-6" />
          </div>
        </div>
        <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-500 font-semibold">
          <FiCheckCircle className="h-3.5 w-3.5" />
          <span>Feedback & visits completed</span>
        </div>
      </div>
    </div>
  );
}

