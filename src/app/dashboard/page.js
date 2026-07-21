"use client";

import { useState } from "react";
import Link from "next/link";
import { useApp } from "@/context/AppContext";
import { useQuery } from "@tanstack/react-query";
import { fetchDashboardStats, fetchCustomers } from "@/services/apiService";
import StatsCards from "@/components/StatsCards";
import DashboardCharts from "@/components/DashboardCharts";
import { FiBell, FiChevronRight } from "react-icons/fi";

import Loader from "@/components/Loader";

export default function DashboardOverviewPage() {
  const { t } = useApp();
  const userName = "Admin"; // You can replace this with actual user context

  const { data: dashboardStats } = useQuery({
    queryKey: ["dashboardStats"],
    queryFn: fetchDashboardStats,
  });

  const { data: customersData, isLoading: isLoadingCustomers } = useQuery({
    queryKey: ["customers", { limit: 6 }],
    queryFn: () => fetchCustomers({ limit: 6 }),
  });

  const activeCases = dashboardStats?.activeCases || 0;
  const resolvedCases = dashboardStats?.resolvedCases || 0;

  const recentCases = customersData?.data || [];

  return (
    <div className="relative min-h-screen bg-bg-main rounded-2xl shadow-lg shadow-indigo-500/5 transition-all duration-300  overflow-x-hidden pb-20 animate-fade-in">
      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-6">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-main font-sans">
              {t("WELCOME_BACK") || "Welcome Back"} {userName}
            </h1>
          </div>
        </div>

        {/* Dashboard Content Container */}
        <div className="max-w-5xl mx-auto space-y-6 mt-4">
          {/* Charts (Visit Outcomes) */}
          <DashboardCharts />

          {/* KPI Cards */}
          <StatsCards activeCases={activeCases} resolvedCases={resolvedCases} />

          {/* Urgent Follow Ups */}
          <div className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-text-main">
                {t("URGENT_FOLLOW_UPS") || "URGENT FOLLOW-UPS"}
              </h2>
              <Link
                href="/dashboard/cases"
                className="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:underline cursor-pointer"
              >
                {t("VIEW_ALL") || "VIEW ALL"}
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {isLoadingCustomers ? (
                <div className="flex justify-center py-4">
                  <Loader size="sm" />
                </div>
              ) : recentCases.length === 0 ? (
                <p className="text-sm text-text-muted text-center py-4">
                  {t("noRecords") || "No cases found."}
                </p>
              ) : (
                recentCases.map((caseItem) => {
                  const status = caseItem.isFeedbackCollected
                    ? t("Resolved") || "Resolved"
                    : t("Active") || "Active";
                  const statusColor = caseItem.isFeedbackCollected
                    ? "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20"
                    : "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20";

                  return (
                    <div
                      key={caseItem._id}
                      className={`flex items-center justify-between p-4.5 rounded-2xl bg-bg-card border-l-4 border border-border-main shadow-md shadow-indigo-500/5 transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/10 hover:-translate-y-0.5 ${
                        caseItem.isFeedbackCollected
                          ? "border-l-emerald-500"
                          : "border-l-amber-500"
                      }`}
                    >
                      <div className="flex flex-col">
                        <span className="text-sm font-bold text-text-main">
                          {caseItem.customerName}
                        </span>
                        <span className="text-xs font-medium text-text-muted mt-1">
                          BKT/DPD: {caseItem.bkt || "N/A"} •{" "}
                          {caseItem.product || caseItem.loan || "N/A"}
                        </span>
                        <span className="text-xs font-medium text-text-muted mt-0.5">
                          {t("Agent") || "Agent"}:{" "}
                          {caseItem.agentId?.name ||
                            t("Unassigned") ||
                            "Unassigned"}
                        </span>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex flex-col items-end">
                          <span className="text-sm font-bold text-text-main">
                            ₹{caseItem.totalDue || "0"}
                          </span>
                          <span
                            className={`mt-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${statusColor}`}
                          >
                            {status}
                          </span>
                        </div>
                        {/* <FiChevronRight className="h-5 w-5 text-zinc-400 group-hover:text-indigo-500 transition-colors" /> */}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
