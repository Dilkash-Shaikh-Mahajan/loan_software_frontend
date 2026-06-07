"use client";

import { useApp } from "@/context/AppContext";
import { FiAlertCircle, FiTrendingUp, FiPercent, FiUsers } from "react-icons/fi";

const statsConfig = [
  {
    id: 1,
    nameKey: "totalOverduePortfolio",
    value: "₹4,82,60,000",
    change: "+6.8%",
    changeType: "increase",
    icon: FiAlertCircle,
    color: "from-rose-500/10 to-orange-500/10 text-rose-500 border-rose-500/20",
  },
  {
    id: 2,
    nameKey: "recoveredThisMonth",
    value: "₹1,24,35,000",
    change: "+18.3%",
    changeType: "increase",
    icon: FiTrendingUp,
    color: "from-emerald-500/10 to-teal-500/10 text-emerald-500 border-emerald-500/20",
  },
  {
    id: 3,
    nameKey: "recoveryRate",
    value: "73.4%",
    change: "+4.1%",
    changeType: "increase",
    icon: FiPercent,
    color: "from-indigo-500/10 to-blue-500/10 text-indigo-500 border-indigo-500/20",
  },
  {
    id: 4,
    nameKey: "activeAgentsInField",
    value: "24",
    change: "+3",
    changeType: "increase",
    icon: FiUsers,
    color: "from-purple-500/10 to-pink-500/10 text-purple-500 border-purple-500/20",
  },
];

export default function StatsCards() {
  const { t } = useApp();

  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {statsConfig.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="relative overflow-hidden rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-md hover:border-zinc-300 dark:hover:border-zinc-700"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-text-muted">
                {t(item.nameKey)}
              </span>
              <div className={`rounded-xl border bg-gradient-to-br p-2.5 ${item.color}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            
            <div className="mt-4">
              <span className="text-2xl font-bold tracking-tight text-text-main">
                {item.value}
              </span>
              <div className="mt-2 flex items-center gap-1.5 text-xs">
                <span
                  className={`font-semibold ${
                    item.changeType === "increase"
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-rose-600 dark:text-rose-400"
                  }`}
                >
                  {item.change}
                </span>
                <span className="text-text-muted">{t("vsLastMonth")}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
