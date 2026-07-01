"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import StatsCards from "@/components/StatsCards";
import DashboardCharts from "@/components/DashboardCharts";
import AnalyticsView from "@/components/AnalyticsView";
import { FiMapPin, FiWifi, FiArrowRight } from "react-icons/fi";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/services/apiService";

const gradients = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-sky-500 to-cyan-600",
];

const statusDot = { OnSite: "bg-emerald-500", Remote: "bg-indigo-400" };

export default function DashboardOverviewPage() {
  const { t } = useApp();
  const [activeTab, setActiveTab] = useState("overview");

  const { data: agentsData, isLoading: isLoadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const displayAgents =
    agentsData && agentsData.length > 0
      ? agentsData.slice(0, 5).map((agent, i) => {
          const nameParts = agent.name ? agent.name.split(" ") : ["U"];
          const initials = nameParts
            .map((n) => n[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
          return {
            id: agent._id || i,
            name: agent.name,
            // zone: agent.zone || "N/A",
            cases: Math.floor(Math.random() * 10),
            status: i % 2 === 0 ? "OnSite" : "Remote",
            initials,
            gradient: gradients[i % gradients.length],
          };
        })
      : [];

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
          <div className="flex rounded-xl bg-bg-card/80 backdrop-blur-md border border-border-main p-1 shadow-sm">
            <button
              onClick={() => setActiveTab("overview")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "overview"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {t("navDashboard")}
            </button>
            <button
              onClick={() => setActiveTab("analytics")}
              className={`rounded-lg px-4 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "analytics"
                  ? "bg-indigo-600 text-white shadow-sm"
                  : "text-text-muted hover:text-text-main"
              }`}
            >
              {t("navAnalytics")}
            </button>
          </div>

          <button className="rounded-xl border border-border-main bg-bg-card/80 backdrop-blur-md px-4 py-2.5 text-sm font-semibold text-text-main hover:bg-bg-main transition-colors shadow-sm cursor-pointer">
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
          <div className="rounded-3xl border border-border-main bg-bg-card/70 backdrop-blur-xl shadow-lg shadow-indigo-500/5 overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-purple-500/10 hover:-translate-y-0.5 relative">
            <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
            <div className="relative flex items-center justify-between border-b border-border-main/50 px-6 py-5 bg-gradient-to-r from-bg-card/50 to-transparent">
              <div>
                <h3 className="text-base font-semibold text-text-main">
                  {t("agentSummaryTitle")}
                </h3>
                <p className="text-xs text-text-muted mt-0.5">
                  Live field status of active recovery agents
                </p>
              </div>
              <Link
                href="/dashboard/recovery-agents"
                className="flex items-center gap-1.5 text-xs font-semibold text-indigo-500 hover:text-indigo-400 transition-colors cursor-pointer"
              >
                View all agents <FiArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-0 divide-y divide-border-main sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-5 lg:divide-x lg:divide-y-0">
              {isLoadingAgents ? (
                <div className="col-span-full py-8 flex justify-center text-indigo-500">
                  <Loader fullScreen={false} size="sm" />
                </div>
              ) : (
                displayAgents.map((agent) => {
                  // const Icon = statusIcon[agent.status] || FiMapPin;
                  return (
                    <div
                      key={agent.id || agent.name}
                      className="flex items-center gap-4 px-5 py-5 hover:bg-bg-main/30 transition-all duration-300 relative group cursor-pointer"
                    >
                      {/* Hover Glow */}
                      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/0 via-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
                      {/* Avatar */}
                      <div className="relative flex-shrink-0">
                        <div
                          className={`h-10 w-10 rounded-xl bg-gradient-to-br ${agent.gradient} flex items-center justify-center text-white text-xs font-bold shadow-sm`}
                        >
                          {agent.initials}
                        </div>
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg-card ${statusDot[agent.status]}`}
                        />
                      </div>
                      {/* Info */}
                      <div className="min-w-0">
                        <div className="font-semibold text-sm text-text-main leading-tight truncate">
                          {agent.name}
                        </div>
                        {/* <div className="flex items-center gap-1 mt-0.5">
                          <Icon className="h-3 w-3 text-text-muted flex-shrink-0" />
                          <span className="text-[11px] text-text-muted truncate">
                            {agent.zone}
                          </span>
                        </div> */}
                        <div className="text-[11px] text-indigo-500 font-semibold mt-0.5">
                          {agent.cases} cases
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </>
      ) : (
        <AnalyticsView />
      )}
    </div>
  );
}
