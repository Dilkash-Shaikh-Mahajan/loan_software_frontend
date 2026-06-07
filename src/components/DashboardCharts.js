"use client";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  Filler,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useApp } from "@/context/AppContext";

ChartJS.register(
  CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Title, Tooltip, Legend, Filler
);

export default function DashboardCharts() {
  const { t, theme } = useApp();
  const isDark = theme === "dark";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const gridColor = isDark ? "#27272a" : "#e4e4e7";

  /* ── Recovery vs Target line chart ────────────────────── */
  const lineData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: t("targetRecovery"),
        data: [120, 135, 140, 155, 160, 170, 175, 185, 190, 200, 210, 220],
        borderColor: "rgb(99,102,241)",
        backgroundColor: "rgba(99,102,241,0.06)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        borderDash: [5, 4],
        pointRadius: 2,
        pointHoverRadius: 6,
      },
      {
        label: t("actualRecovery"),
        data: [98, 115, 128, 142, 138, 158, 162, 174, 181, 193, 178, 205],
        borderColor: "rgb(16,185,129)",
        backgroundColor: "rgba(16,185,129,0.06)",
        fill: true,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const lineOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index", intersect: false },
    plugins: {
      legend: {
        position: "top",
        labels: { color: textColor, font: { family: "var(--font-geist-sans)", size: 12 }, usePointStyle: true, boxWidth: 6 },
      },
      tooltip: {
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        titleColor: isDark ? "#f4f4f5" : "#09090b",
        bodyColor: isDark ? "#a1a1aa" : "#71717a",
        borderColor: isDark ? "#27272a" : "#e4e4e7",
        borderWidth: 1, padding: 12, cornerRadius: 12, boxPadding: 6, usePointStyle: true,
        callbacks: { label: (ctx) => ` ${ctx.dataset.label}: ₹${ctx.raw}L` },
      },
    },
    scales: {
      x: { grid: { display: false }, ticks: { color: textColor, font: { family: "var(--font-geist-sans)", size: 11 } } },
      y: {
        grid: { color: gridColor },
        ticks: { color: textColor, font: { family: "var(--font-geist-sans)", size: 11 }, callback: (v) => `₹${v}L` },
      },
    },
  };

  /* ── Cases by Recovery Status doughnut ─────────────────── */
  const doughnutData = {
    labels: [t("Recovered"), t("InProgress"), t("PendingContact"), t("Escalated")],
    datasets: [{
      data: [38, 29, 22, 11],
      backgroundColor: [
        "rgba(16,185,129,0.85)",   // emerald – Recovered
        "rgba(99,102,241,0.85)",   // indigo – In Progress
        "rgba(245,158,11,0.85)",   // amber – Pending Contact
        "rgba(239,68,68,0.85)",    // rose – Escalated
      ],
      borderColor: isDark ? "#09090b" : "#ffffff",
      borderWidth: 2,
      hoverOffset: 4,
    }],
  };

  const doughnutOptions = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: "75%",
    plugins: {
      legend: {
        position: "bottom",
        labels: { color: textColor, font: { family: "var(--font-geist-sans)", size: 11 }, usePointStyle: true, boxWidth: 6, padding: 16 },
      },
      tooltip: {
        backgroundColor: isDark ? "#18181b" : "#ffffff",
        titleColor: isDark ? "#f4f4f5" : "#09090b",
        bodyColor: isDark ? "#a1a1aa" : "#71717a",
        borderColor: isDark ? "#27272a" : "#e4e4e7",
        borderWidth: 1, padding: 12, cornerRadius: 12, usePointStyle: true,
        callbacks: { label: (ctx) => ` ${ctx.label}: ${ctx.raw}%` },
      },
    },
  };

  return (
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-3">
      {/* Recovery vs Target Line Chart */}
      <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm lg:col-span-2">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-text-main">{t("recoveryVsTarget")}</h3>
          <p className="text-xs text-text-muted">{t("recoveryVsTargetSub")}</p>
        </div>
        <div className="h-72 w-full">
          <Line data={lineData} options={lineOptions} />
        </div>
      </div>

      {/* Cases by Status Doughnut */}
      <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm">
        <div className="mb-4">
          <h3 className="text-base font-semibold text-text-main">{t("casesByStatus")}</h3>
          <p className="text-xs text-text-muted">{t("casesByStatusSub")}</p>
        </div>
        <div className="relative h-64 w-full flex items-center justify-center">
          <Doughnut data={doughnutData} options={doughnutOptions} />
          <div className="absolute flex flex-col items-center justify-center pointer-events-none">
            <span className="text-2xl font-bold tracking-tight text-text-main">248</span>
            <span className="text-[10px] uppercase tracking-wider text-text-muted">{t("totalCases")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
