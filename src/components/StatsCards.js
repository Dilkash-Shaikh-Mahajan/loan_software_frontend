"use client";

import { useApp } from "@/context/AppContext";
import { FiBriefcase, FiCheckCircle } from "react-icons/fi";

export default function StatsCards({ activeCases = 0, resolvedCases = 0 }) {
  const { t } = useApp();

  return (
    <div className="flex flex-col sm:flex-row gap-5 mb-2">
      {/* Active Cases Card */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-bg-card p-5 shadow-sm transition-all duration-300 border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-blue-600">
        <div className="flex flex-col h-full justify-center">
          <div className="mb-3 rounded-full bg-blue-50 dark:bg-blue-900/20 w-10 h-10 flex items-center justify-center">
            <FiBriefcase className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="text-xs font-semibold text-text-muted mb-1">
            {t("ACTIVE_CASES") || "ACTIVE CASES"}
          </span>
          <span className="text-xl font-bold tracking-tight text-text-main">
            {activeCases}
          </span>
        </div>
      </div>

      {/* Resolved Accounts Card */}
      <div className="flex-1 relative overflow-hidden rounded-2xl bg-bg-card p-5 shadow-sm transition-all duration-300 border border-zinc-200 dark:border-zinc-800 border-l-4 border-l-emerald-600">
        <div className="flex flex-col h-full justify-center">
          <div className="mb-3 rounded-full bg-emerald-50 dark:bg-emerald-900/20 w-10 h-10 flex items-center justify-center">
            <FiCheckCircle className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          </div>
          <span className="text-xs font-semibold text-text-muted mb-1">
            {t("RESOLVED_ACCOUNTS") || "RESOLVED ACCOUNTS"}
          </span>
          <span className="text-xl font-bold tracking-tight text-text-main">
            {resolvedCases}
          </span>
        </div>
      </div>
    </div>
  );
}
