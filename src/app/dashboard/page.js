"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import StatsCards from "@/components/StatsCards";
import DashboardCharts from "@/components/DashboardCharts";
import LoansTable from "@/components/LoansTable";
import AnalyticsView from "@/components/AnalyticsView";
import { FiMapPin, FiWifi, FiArrowRight } from "react-icons/fi";

const AGENTS_ON_DUTY = [
  { name: "Ramesh Gupta",  zone: "North Zone",  cases: 6, status: "OnSite",  initials: "RG", gradient: "from-indigo-500 to-purple-600" },
  { name: "Priya Nair",    zone: "South Zone",  cases: 4, status: "Remote",  initials: "PN", gradient: "from-emerald-500 to-teal-600"  },
  { name: "Vikram Mehta",  zone: "East Zone",   cases: 7, status: "OnSite",  initials: "VM", gradient: "from-amber-500 to-orange-600"  },
  { name: "Anjali Singh",  zone: "West Zone",   cases: 5, status: "OnSite",  initials: "AS", gradient: "from-rose-500 to-pink-600"     },
  { name: "Karan Joshi",   zone: "Central Zone",cases: 3, status: "Remote",  initials: "KJ", gradient: "from-sky-500 to-cyan-600"      },
];

const statusDot = { OnSite: "bg-emerald-500", Remote: "bg-indigo-400" };
const statusIcon = { OnSite: FiMapPin, Remote: FiWifi };

export default function DashboardOverviewPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("recoveryOverview")}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-0.5">
            {t("recoveryOverviewSub")}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Tab Toggle */}
          <div className="flex rounded-xl bg-bg-card border border-border-main p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview" ? "bg-indigo-600 text-white shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >{t("navDashboard")}</button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "analytics" ? "bg-indigo-600 text-white shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >{t("navAnalytics")}</button>
          </div>

          <button className="rounded-xl border border-border-main bg-bg-card px-4 py-2.5 text-sm font-semibold text-text-main hover:bg-bg-main transition-colors shadow-sm cursor-pointer">
            {t("export")}
          </button>
          <Link
            href="/dashboard/recovery-agents"
            className="rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-600/15 cursor-pointer"
          >
            {t("assignCase")}
          </Link>
        </div>
      </div>

      {activeTab === "overview" ? (
        <>
          {/* KPI Cards */}
          <StatsCards />

          {/* Charts */}
          <DashboardCharts />

          {/* Agents on Duty Today */}
          <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
            <div className="flex items-center justify-between border-b border-border-main px-6 py-4">
              <div>
                <h3 className="text-base font-semibold text-text-main">{t("agentSummaryTitle")}</h3>
                <p className="text-xs text-text-muted mt-0.5">Live field status of active recovery agents</p>
              </div>
              <Link
                href="/dashboard/tracking"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                {t("agentSummaryLink")} <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-0 divide-y divide-border-main sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-5 lg:divide-x lg:divide-y-0">
              {AGENTS_ON_DUTY.map((agent) => {
                const Icon = statusIcon[agent.status];
                return (
                  <div key={agent.name} className="flex items-center gap-4 px-5 py-4 hover:bg-bg-main/40 transition-colors">
                    {/* Avatar */}
                    <div className="relative flex-shrink-0">
                      <div className={`h-10 w-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}>
                        {agent.initials}
                      </div>
                      <span className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-card ${statusDot[agent.status]}`} />
                    </div>
                    {/* Info */}
                    <div className="min-w-0">
                      <div className="font-semibold text-sm text-text-main leading-tight truncate">{agent.name}</div>
                      <div className="flex items-center gap-1 mt-0.5">
                        <Icon className="h-3 w-3 text-text-muted flex-shrink-0" />
                        <span className="text-[11px] text-text-muted truncate">{agent.zone}</span>
                      </div>
                      <div className="text-[11px] text-indigo-500 font-semibold mt-0.5">{agent.cases} cases</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recovery Cases Table */}
          <LoansTable />
        </>
      ) : (
        <AnalyticsView />
      )}
    </div>
  );
}
