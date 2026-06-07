"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend, 
  ArcElement 
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { 
  FiTrendingUp, 
  FiActivity, 
  FiShield, 
  FiDollarSign, 
  FiDownload, 
  FiSearch,
  FiArrowUpRight,
  FiArrowDownRight
} from "react-icons/fi";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const initialAnalyticsReport = [
  { type: "Business", outstanding: 70400000, defaults: "0.85%", rate: "6.8%", score: "A+ (Low Risk)" },
  { type: "Personal", outstanding: 10400000, defaults: "2.10%", rate: "8.5%", score: "B (Medium Risk)" },
  { type: "Mortgage", outstanding: 20400000, defaults: "0.45%", rate: "5.4%", score: "A++ (Very Low Risk)" },
  { type: "Auto", outstanding: 15400000, defaults: "1.45%", rate: "7.2%", score: "A- (Low Risk)" },
];

export default function AnalyticsView() {
  const { t, theme } = useApp();
  const isDarkMode = theme === "dark";
  const [search, setSearch] = useState("");

  const textColor = isDarkMode ? "#a1a1aa" : "#71717a";
  const gridColor = isDarkMode ? "#27272a" : "#e4e4e7";

  // Data for Quarterly Yield comparison
  const barData = {
    labels: ["Q1 Actual", "Q1 Target", "Q2 Actual", "Q2 Target", "Q3 Actual", "Q3 Target", "Q4 Actual", "Q4 Target"],
    datasets: [
      {
        label: t("yieldTarget"),
        data: [195000, 180000, 240000, 220000, 310000, 290000, 420000, 380000],
        backgroundColor: [
          "rgba(99, 102, 241, 0.85)",  // Indigo Actual
          "rgba(99, 102, 241, 0.35)",  // Indigo Target
          "rgba(16, 185, 129, 0.85)",  // Emerald Actual
          "rgba(16, 185, 129, 0.35)",  // Emerald Target
          "rgba(168, 85, 247, 0.85)",  // Purple Actual
          "rgba(168, 85, 247, 0.35)",  // Purple Target
          "rgba(245, 158, 11, 0.85)",  // Amber Actual
          "rgba(245, 158, 11, 0.35)",  // Amber Target
        ],
        borderRadius: 8,
        borderWidth: 0,
        barPercentage: 0.6,
      },
    ],
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
        titleColor: isDarkMode ? "#f4f4f5" : "#09090b",
        bodyColor: isDarkMode ? "#a1a1aa" : "#71717a",
        borderColor: isDarkMode ? "#27272a" : "#e4e4e7",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { color: textColor, font: { family: "var(--font-geist-sans)", size: 10 } },
      },
      y: {
        grid: { color: gridColor },
        ticks: { 
          color: textColor, 
          font: { family: "var(--font-geist-sans)", size: 11 },
          callback: (value) => `$${value / 1000}k`
        },
      },
    },
  };

  // Credit Risk Distribution doughnut
  const doughnutData = {
    labels: ["Score 750+", "Score 680-749", "Score 600-679", "Score Below 600"],
    datasets: [
      {
        data: [45, 35, 15, 5],
        backgroundColor: [
          "rgba(16, 185, 129, 0.85)", // Excellent
          "rgba(99, 102, 241, 0.85)", // Good
          "rgba(245, 158, 11, 0.85)", // Average
          "rgba(239, 68, 68, 0.85)",  // Poor
        ],
        borderColor: isDarkMode ? "#09090b" : "#ffffff",
        borderWidth: 2,
      },
    ],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "70%",
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          color: textColor,
          font: { family: "var(--font-geist-sans)", size: 11 },
          usePointStyle: true,
          boxWidth: 6,
          padding: 14,
        },
      },
      tooltip: {
        backgroundColor: isDarkMode ? "#18181b" : "#ffffff",
        titleColor: isDarkMode ? "#f4f4f5" : "#09090b",
        bodyColor: isDarkMode ? "#a1a1aa" : "#71717a",
        borderColor: isDarkMode ? "#27272a" : "#e4e4e7",
        borderWidth: 1,
        padding: 12,
        cornerRadius: 12,
      },
    },
  };

  const filteredReports = initialAnalyticsReport.filter(
    (item) => item.type.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("analyticsTitle")}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-0.5">
            {t("analyticsSub")}
          </p>
        </div>

        <button className="flex items-center justify-center gap-2.5 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-550 transition-colors shadow-sm shadow-indigo-600/15 cursor-pointer">
          <FiDownload className="h-4 w-4" />
          {t("export")}
        </button>
      </div>

      {/* Mini Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Loss Provision</span>
            <FiShield className="h-4 w-4 text-emerald-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-main">₹1,03,48,000</span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FiArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
              -2.1%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Yield Recovery</span>
            <FiActivity className="h-4 w-4 text-indigo-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-main">96.4%</span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FiArrowUpRight className="mr-0.5 h-3.5 w-3.5" />
              +1.5%
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Capital Velocity</span>
            <FiTrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-main">14.2 days</span>
            <span className="flex items-center text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <FiArrowDownRight className="mr-0.5 h-3.5 w-3.5" />
              -0.8d
            </span>
          </div>
        </div>

        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">Health Index</span>
            <FiDollarSign className="h-4 w-4 text-amber-500" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-xl font-bold text-text-main">94.8 / 100</span>
            <span className="text-[10px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
              Excellent
            </span>
          </div>
        </div>
      </div>

      {/* Advanced Visualizations */}
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-3 animate-fade-in">
        {/* Line / Bar Yield Chart */}
        <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-text-main">{t("earningsGrowth")}</h3>
            <p className="text-xs text-text-muted">{t("earningsGrowthSub")}</p>
          </div>
          <div className="h-72 w-full">
            <Bar data={barData} options={barOptions} />
          </div>
        </div>

        {/* Doughnut Credit Tier Distribution */}
        <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-text-main">{t("riskProfile")}</h3>
            <p className="text-xs text-text-muted">{t("riskProfileSub")}</p>
          </div>
          <div className="relative h-72 w-full flex items-center justify-center">
            <Doughnut data={doughnutData} options={doughnutOptions} />
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-3xl font-bold text-text-main">709</span>
              <span className="text-[10px] uppercase tracking-wider text-text-muted">{t("riskAverage")}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Analytics Reports Table */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors">
        <div className="flex flex-col gap-4 border-b border-border-main p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="text-base font-semibold text-text-main font-sans">
              System Portfolio Performance
            </h3>
            <p className="text-xs text-text-muted">
              Aggregate values across current active loan portfolios.
            </p>
          </div>

          <div className="relative w-full max-w-xs sm:flex-none">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={t("search")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-text-muted focus:border-indigo-500 focus:bg-bg-card text-text-main"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("loanType")}</th>
                <th className="px-6 py-4">Total Outstanding</th>
                <th className="px-6 py-4">Default Rate</th>
                <th className="px-6 py-4">Avg Interest Rate</th>
                <th className="px-6 py-4">Risk Category Score</th>
                <th className="px-6 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredReports.length > 0 ? (
                filteredReports.map((item) => (
                  <tr key={item.type} className="hover:bg-bg-main/30 transition-colors">
                    <td className="px-6 py-4 font-semibold text-text-main">{t(item.type)}</td>
                    <td className="px-6 py-4 text-text-main font-semibold">
                      ₹{item.outstanding.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-text-muted">{item.defaults}</td>
                    <td className="px-6 py-4 text-text-muted">{item.rate}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${
                        item.type === "Mortgage" 
                          ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                          : item.type === "Personal"
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20"
                      }`}>
                        {item.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="flex items-center justify-center rounded-lg border border-border-main bg-bg-main p-2 text-text-main hover:opacity-90 transition-opacity cursor-pointer">
                        <FiDownload className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-10 text-center text-text-muted">
                    {t("noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
