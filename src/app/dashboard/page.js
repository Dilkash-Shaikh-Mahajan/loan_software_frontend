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
    <div className="relative min-h-screen bg-bg-main overflow-x-hidden pb-20 animate-fade-in">
      {/* Curved Header Background with Blobs */}
      <div className="absolute top-0 left-0 right-0 h-64 bg-gradient-to-br from-[#4F3DE6] to-[#8F53EE] rounded-b-[40px] z-0 overflow-hidden">
        {/* SVG Blob 1 */}
        <div className="absolute -top-12 -right-12 opacity-15 animate-[spin_25s_linear_infinite]">
          <svg width="250" height="250" viewBox="0 0 200 200">
            <path
              fill="#FFFFFF"
              transform="translate(100 100)"
              d="M46.7,-70C58.3,-62.5,64,-44.6,69.5,-27.6C74.9,-10.7,80,5.3,77.3,20C74.7,34.7,64.2,48.1,50.7,56.4C37.3,64.6,20.8,67.6,4.6,61.9C-11.6,56.2,-27.4,41.9,-41.8,29.9C-56.1,18,-69.1,8.3,-71.4,-2.8C-73.8,-13.8,-65.4,-26.3,-54,-35.1C-42.6,-43.8,-28.1,-48.9,-14.3,-58.5C-0.5,-68.2,12.7,-82.5,26.7,-80.7C40.6,-78.9,55.4,-61,46.7,-70Z"
            />
          </svg>
        </div>
        {/* SVG Blob 2 */}
        <div className="absolute top-20 -left-20 opacity-10 animate-[spin_30s_linear_infinite_reverse]">
          <svg width="300" height="300" viewBox="0 0 200 200">
            <path
              fill="#FFFFFF"
              transform="translate(100 100)"
              d="M54.7,-64.7C68.9,-54.6,76.9,-35,80.1,-15C83.3,5.1,81.6,25.6,71.2,40.9C60.8,56.3,41.6,66.6,21.8,70.6C2,74.7,-18.3,72.6,-35,63.4C-51.7,54.2,-64.8,38,-72,19.3C-79.3,0.7,-80.7,-20.3,-71.9,-36.8C-63.1,-53.4,-44,-65.5,-25.9,-70.6C-7.8,-75.7,9.3,-73.9,26.4,-69.8C43.4,-65.7,60.4,-59.4,54.7,-64.7Z"
            />
          </svg>
        </div>
      </div>

      <div className="relative z-10 px-4 sm:px-6 lg:px-8 pt-8">
        {/* Top Header Row */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white font-sans drop-shadow-md">
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
                      className={`flex items-center justify-between p-4 rounded-xl bg-bg-card border-l-4 border border-zinc-200 dark:border-zinc-800 shadow-sm transition-all hover:shadow-md ${
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
                          {t("Agent") || "Agent"}: {caseItem.agentId?.name || t("Unassigned") || "Unassigned"}
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
