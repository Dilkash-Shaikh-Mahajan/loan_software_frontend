"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar, Doughnut } from "react-chartjs-2";
import { useQuery } from "@tanstack/react-query";
import { useApp } from "@/context/AppContext";
import { FiCalendar, FiUsers, FiX } from "react-icons/fi";
import Loader from "@/components/Loader";
import {
  fetchAgentFeedbackStacked,
  fetchAgentFeedbackAnalytics,
} from "@/services/apiService";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
);

export default function DashboardCharts() {
  const { t, theme } = useApp();
  const isDark = theme === "dark";
  const textColor = isDark ? "#a1a1aa" : "#71717a";
  const gridColor = isDark ? "#27272a" : "#e4e4e7";

  const [dateRange, setDateRange] = useState({ start: "", end: "" });
  const [tempDate, setTempDate] = useState({ start: "", end: "" });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const datePickerRef = useRef(null);

  // Close date picker on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (
        datePickerRef.current &&
        !datePickerRef.current.contains(event.target)
      ) {
        setShowDatePicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleApplyDate = () => {
    setDateRange(tempDate);
    setShowDatePicker(false);
  };

  const handleClearDate = () => {
    const emptyDates = { start: "", end: "" };
    setTempDate(emptyDates);
    setDateRange(emptyDates);
    setShowDatePicker(false);
  };

  const formatDateString = (dateStr) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${day}-${month}-${year}`;
  };

  const formatDisplayDate = () => {
    if (dateRange.start && dateRange.end) {
      return `${formatDateString(dateRange.start)} to ${formatDateString(dateRange.end)}`;
    } else if (dateRange.start) {
      return `From ${formatDateString(dateRange.start)}`;
    }
    return t("SELECT_DATE") || "Select Date";
  };

  // Fetch Stacked Agent Feedback Data
  const { data: stackedFeedbacks = [], isLoading: isLoadingStacked } = useQuery(
    {
      queryKey: ["agentFeedbackStacked", dateRange],
      queryFn: () =>
        fetchAgentFeedbackStacked({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
    },
  );

  // Fetch Agent Feedback Data with date params
  const { data: agentFeedbacks = [], isLoading: isLoadingAgentFeedbacks } =
    useQuery({
      queryKey: ["agentFeedbackAnalytics", dateRange],
      queryFn: () =>
        fetchAgentFeedbackAnalytics({
          startDate: dateRange.start,
          endDate: dateRange.end,
        }),
    });

  // 1. Stacked Bar Chart Config
  const barData = useMemo(() => {
    // Get unique agents
    const labels = stackedFeedbacks.map((item) => item.agentName);

    // Get all unique feedback types across all agents
    const feedbackTypes = new Set();
    stackedFeedbacks.forEach((agent) => {
      agent.feedbacks?.forEach((fb) => feedbackTypes.add(fb.type));
    });
    const uniqueFeedbackTypes = Array.from(feedbackTypes);

    // predefined colors for different feedback types
    const colors = [
      "#1E63EC",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
      "#F43F5E",
      "#3B82F6",
      "#F97316",
      "#06B6D4",
    ];

    const datasets = uniqueFeedbackTypes.map((fbType, index) => {
      const data = stackedFeedbacks.map((agent) => {
        const found = agent.feedbacks?.find((fb) => fb.type === fbType);
        return found ? found.count : 0;
      });

      return {
        label: t(fbType) || fbType,
        data,
        backgroundColor: colors[index % colors.length],
        barThickness: 24,
      };
    });

    if (datasets.length === 0) {
      return {
        labels: [t("NO_DATA") || "No Data"],
        datasets: [{ label: t("NO_DATA") || "No Data", data: [0], backgroundColor: "#e4e4e7" }],
      };
    }

    return { labels, datasets };
  }, [stackedFeedbacks, t]);

  const barOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: "top",
          labels: {
            color: textColor,
            font: { family: "var(--font-geist-sans)", size: 11 },
            usePointStyle: true,
            boxWidth: 6,
          },
        },
        tooltip: {
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          titleColor: isDark ? "#f4f4f5" : "#09090b",
          bodyColor: isDark ? "#a1a1aa" : "#71717a",
          borderColor: isDark ? "#27272a" : "#e4e4e7",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          usePointStyle: true,
        },
      },
      scales: {
        x: {
          stacked: true,
          grid: { display: false },
          ticks: {
            color: textColor,
            font: { family: "var(--font-geist-sans)", size: 11 },
          },
        },
        y: {
          stacked: true,
          grid: { color: gridColor, drawBorder: false, borderDash: [5, 5] },
          ticks: {
            color: textColor,
            font: { family: "var(--font-geist-sans)", size: 11 },
          },
        },
      },
    }),
    [isDark, textColor, gridColor],
  );

  // 2. Agent-wise Feedback Chart Config
  const agentFeedbackData = useMemo(() => {
    const data =
      agentFeedbacks.length > 0
        ? agentFeedbacks
        : [{ agentName: t("NO_DATA") || "No Data", feedbackCount: 1 }];

    const bgColors = [
      "#1E63EC",
      "#10B981",
      "#F59E0B",
      "#8B5CF6",
      "#EC4899",
      "#14B8A6",
      "#F43F5E",
    ];

    return {
      labels: data.map((item) => item.agentName),
      datasets: [
        {
          data: data.map((item) => item.feedbackCount),
          backgroundColor:
            agentFeedbacks.length > 0
              ? bgColors.slice(0, data.length)
              : ["#e4e4e7"],
          borderWidth: 0,
          hoverOffset: 4,
        },
      ],
    };
  }, [agentFeedbacks]);

  const doughnutOptions = useMemo(
    () => ({
      responsive: true,
      maintainAspectRatio: false,
      cutout: "70%",
      plugins: {
        legend: {
          position: "right",
          labels: {
            color: textColor,
            font: { family: "var(--font-geist-sans)", size: 11 },
            usePointStyle: true,
            boxWidth: 6,
          },
        },
        tooltip: {
          backgroundColor: isDark ? "#18181b" : "#ffffff",
          titleColor: isDark ? "#f4f4f5" : "#09090b",
          bodyColor: isDark ? "#a1a1aa" : "#71717a",
          borderColor: isDark ? "#27272a" : "#e4e4e7",
          borderWidth: 1,
          padding: 12,
          cornerRadius: 12,
          usePointStyle: true,
        },
      },
    }),
    [isDark, textColor],
  );

  return (
    <div className="flex flex-col md:flex-row gap-5 mb-6">
      {/* Visit Outcomes Chart */}
      <div className="flex-[2] rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm relative">
        <div className="mb-6 flex flex-row items-center justify-between">
          <h3 className="text-base font-bold text-text-main">
            {t("VISIT_OUTCOME") || "VISIT OUTCOME"}
          </h3>
          <div className="relative" ref={datePickerRef}>
            <button
              onClick={() => {
                setTempDate(dateRange);
                setShowDatePicker(!showDatePicker);
              }}
              className="flex items-center gap-2 rounded-full border border-indigo-100 bg-indigo-50/50 dark:border-indigo-900/30 dark:bg-indigo-900/10 px-3 py-1.5 transition-colors hover:bg-indigo-100 dark:hover:bg-indigo-900/20 cursor-pointer"
            >
              <FiCalendar className="h-3.5 w-4 text-indigo-600 dark:text-indigo-400" />
              <span className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 max-w-[150px] truncate">
                {formatDisplayDate()}
              </span>
            </button>

            {/* Date Range Picker Dropdown */}
            {showDatePicker && (
              <div className="absolute right-0 top-full mt-2 w-72 rounded-xl border border-border-main bg-bg-card p-4 shadow-xl z-50 animate-fade-in">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-sm font-bold text-text-main">
                    Select Date Range
                  </h4>
                  <button
                    onClick={() => setShowDatePicker(false)}
                    className="text-text-muted hover:text-text-main cursor-pointer"
                  >
                    <FiX className="h-4 w-4" />
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      value={tempDate.start}
                      onChange={(e) =>
                        setTempDate({ ...tempDate, start: e.target.value })
                      }
                      className="w-full rounded-lg border border-border-main bg-bg-main px-3 py-2 text-sm text-text-main focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-text-muted mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      value={tempDate.end}
                      onChange={(e) =>
                        setTempDate({ ...tempDate, end: e.target.value })
                      }
                      className="w-full rounded-lg border border-border-main bg-bg-main px-3 py-2 text-sm text-text-main focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    />
                  </div>
                </div>

                <div className="mt-4 flex gap-2">
                  <button
                    onClick={handleClearDate}
                    className="flex-1 rounded-lg border border-border-main px-3 py-2 text-xs font-semibold text-text-muted hover:bg-bg-main transition-colors cursor-pointer"
                  >
                    Clear
                  </button>
                  <button
                    onClick={handleApplyDate}
                    className="flex-1 rounded-lg bg-indigo-600 px-3 py-2 text-xs font-semibold text-white hover:bg-indigo-500 transition-colors cursor-pointer"
                  >
                    Apply
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="h-60 w-full relative">
          {isLoadingStacked ? (
            <div className="flex h-full items-center justify-center">
              <Loader size="sm" />
            </div>
          ) : (
            <Bar data={barData} options={barOptions} />
          )}
        </div>
      </div>

      {/* Agent-wise Feedback Chart */}
      <div className="flex-[1] rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
        <div className="mb-4 flex flex-row items-center gap-2">
          <div className="p-1.5 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
            <FiUsers className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          </div>
          <h3 className="text-sm font-bold text-text-main">
            {t("AGENT_FEEDBACK") || "Agent-wise Feedback"}
          </h3>
        </div>
        <div className="h-48 w-full relative">
          {isLoadingAgentFeedbacks ? (
            <div className="flex h-full items-center justify-center">
              <Loader size="sm" />
            </div>
          ) : (
            <Doughnut data={agentFeedbackData} options={doughnutOptions} />
          )}
        </div>
      </div>
    </div>
  );
}
