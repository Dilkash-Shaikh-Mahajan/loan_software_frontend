"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiClock, FiTrendingUp, FiAlertTriangle, FiCalendar, FiEdit2, FiX, FiCheck } from "react-icons/fi";

const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];

const initial = [
  { id: "AGT-1001", name: "Ramesh Gupta",   dept: "North Zone",  mon: 8.5, tue: 9.0, wed: 8.0, thu: 9.5, fri: 8.5, total: 43.5, flag: "overtime"  },
  { id: "AGT-1002", name: "Priya Nair",     dept: "South Zone",  mon: 6.5, tue: 7.0, wed: 7.5, thu: 6.0, fri: 7.0, total: 34.0, flag: "undertime" },
  { id: "AGT-1003", name: "Vikram Mehta",   dept: "East Zone",   mon: 8.0, tue: 8.5, wed: 9.0, thu: 8.5, fri: 8.0, total: 42.0, flag: "normal"    },
  { id: "AGT-1004", name: "Anjali Singh",   dept: "West Zone",   mon: 8.0, tue: 8.0, wed: 8.0, thu: 8.0, fri: 8.0, total: 40.0, flag: "normal"    },
  { id: "AGT-1005", name: "Karan Joshi",    dept: "Central Zone",mon: 9.0, tue: 9.5, wed: 9.0, thu: 10.0,fri: 9.5, total: 47.0, flag: "overtime"  },
  { id: "AGT-1006", name: "Meena Iyer",     dept: "South Zone",  mon: 5.0, tue: 6.0, wed: 6.5, thu: 5.5, fri: 6.0, total: 29.0, flag: "undertime" },
];

const flagCfg = {
  overtime:  { cls: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20" },
  undertime: { cls: "bg-rose-500/10 text-rose-500 border-rose-500/20" },
  normal:    { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
};

const DAYS = ["mon", "tue", "wed", "thu", "fri"];
const MAX_H = 12;

// Zone bar chart data
const zoneTotals = (records) => {
  const map = {};
  records.forEach(r => {
    map[r.dept] = (map[r.dept] || 0) + r.total;
  });
  return Object.entries(map).map(([dept, total]) => ({
    dept,
    avg: (total / records.filter(r => r.dept === dept).length).toFixed(1)
  }));
};

export default function WorkingHoursView() {
  const { t } = useApp();
  const [records, setRecords] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fHours, setFHours] = useState({ mon: "", tue: "", wed: "", thu: "", fri: "" });

  const filtered = records.filter(r =>
    (r.name.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase())) &&
    (filterDept === "All" || r.dept === filterDept)
  );

  const totalOvertimeHrs = records.filter(r => r.flag === "overtime").reduce((a, r) => a + (r.total - 40), 0).toFixed(1);
  const undertimeCount   = records.filter(r => r.flag === "undertime").length;
  const weekGrandTotal   = records.reduce((a, r) => a + r.total, 0).toFixed(0);
  const avgDaily         = (records.reduce((a, r) => a + r.total, 0) / (records.length * 5)).toFixed(1);

  const openEdit = (r) => {
    setEditing(r);
    setFHours({ mon: r.mon, tue: r.tue, wed: r.wed, thu: r.thu, fri: r.fri });
    setModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    const total = Object.values(fHours).reduce((a, v) => a + Number(v), 0);
    const flag = total > 42 ? "overtime" : total < 36 ? "undertime" : "normal";
    setRecords(prev => prev.map(r => r.id === editing.id
      ? { ...r, mon: +fHours.mon, tue: +fHours.tue, wed: +fHours.wed, thu: +fHours.thu, fri: +fHours.fri, total, flag }
      : r
    ));
    setModal(false); setEditing(null);
  };

  const chartData = zoneTotals(records);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">{t("workingHoursTitle")}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t("workingHoursSub")}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: t("avgDailyHours"),  val: `${avgDaily}h`,      icon: FiClock,         color: "text-indigo-500" },
          { label: t("totalOvertime"),  val: `${totalOvertimeHrs}h`, icon: FiTrendingUp,  color: "text-emerald-500" },
          { label: t("undertimeAlerts"),val: undertimeCount,       icon: FiAlertTriangle, color: "text-rose-500" },
          { label: t("weekTotal"),      val: `${weekGrandTotal}h`, icon: FiCalendar,      color: "text-amber-500" },
        ].map(s => (
          <div key={s.label} className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
            <div className="flex items-center justify-between text-text-muted mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider">{s.label}</span>
              <s.icon className={`h-4 w-4 ${s.color}`} />
            </div>
            <p className="text-2xl font-bold text-text-main">{s.val}</p>
          </div>
        ))}
      </div>

      {/* Weekly Dept Chart */}
      <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm">
        <h2 className="text-base font-bold text-text-main mb-1">{t("weeklyBreakdown")}</h2>
        <p className="text-xs text-text-muted mb-5">{t("weeklyBreakdownSub")}</p>
        <div className="flex items-end gap-6 h-28">
          {chartData.map(d => {
            const pct = Math.min((d.avg / 50) * 100, 100);
            return (
              <div key={d.dept} className="flex flex-col items-center gap-2 flex-1">
                <span className="text-xs font-semibold text-indigo-500">{d.avg}h</span>
                <div className="w-full rounded-t-lg bg-border-main overflow-hidden" style={{ height: "64px" }}>
                  <div
                    className="w-full rounded-t-lg bg-gradient-to-t from-indigo-600 to-indigo-400 transition-all duration-700"
                    style={{ height: `${pct}%`, marginTop: `${100 - pct}%` }}
                  />
                </div>
                <span className="text-[10px] text-text-muted text-center leading-tight">{d.dept}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-main p-5 sm:flex-row sm:items-center sm:justify-between">
          <input
            type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("search")}
            className="rounded-xl border border-border-main bg-bg-main py-2 px-4 text-sm outline-none focus:border-indigo-500 text-text-main flex-1 max-w-xs"
          />
          <select
            value={filterDept} onChange={e => setFilterDept(e.target.value)}
            className="rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer"
          >
            <option value="All">{t("allDepts")}</option>
            {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-4">{t("agentId")}</th>
                <th className="px-5 py-4">{t("agentName")}</th>
                <th className="px-5 py-4">{t("department")}</th>
                {DAYS.map(d => <th key={d} className="px-4 py-4 text-center">{t(d)}</th>)}
                <th className="px-5 py-4 text-center">Total</th>
                <th className="px-5 py-4">{t("status")}</th>
                <th className="px-5 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filtered.length > 0 ? filtered.map(r => (
                <tr key={r.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-text-main">{r.id}</td>
                  <td className="px-5 py-4 font-semibold text-text-main">{r.name}</td>
                  <td className="px-5 py-4 text-text-muted">{r.dept}</td>
                  {DAYS.map(d => (
                    <td key={d} className="px-4 py-4 text-center">
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className="w-8 rounded-sm bg-indigo-500/20"
                          style={{ height: `${(r[d] / MAX_H) * 32}px`, minHeight: "4px" }}
                        />
                        <span className="text-xs text-text-muted">{r[d]}h</span>
                      </div>
                    </td>
                  ))}
                  <td className="px-5 py-4 text-center font-bold text-text-main">{r.total}h</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${flagCfg[r.flag].cls}`}>
                      {t(r.flag)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <button onClick={() => openEdit(r)} className="btn-base rounded-lg p-1.5 text-text-muted hover:text-indigo-500 hover:bg-indigo-500/10 cursor-pointer">
                      <FiEdit2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="11" className="px-5 py-10 text-center text-text-muted">{t("noRecords")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Hours Modal */}
      {modal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl text-text-main animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold">{t("editHours")}</h3>
                <p className="text-xs text-text-muted">{editing.name} · {editing.dept}</p>
              </div>
              <button onClick={() => setModal(false)} className="btn-base rounded-xl p-1.5 hover:bg-bg-main text-text-muted cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div className="grid grid-cols-5 gap-3">
                {DAYS.map(d => (
                  <div key={d}>
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-text-muted mb-1.5 text-center">{t(d)}</label>
                    <input
                      type="number" min="0" max="16" step="0.5" required
                      value={fHours[d]} onChange={e => setFHours(prev => ({ ...prev, [d]: e.target.value }))}
                      className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-2 text-sm outline-none focus:border-indigo-500 text-text-main text-center"
                    />
                  </div>
                ))}
              </div>
              <div className="flex gap-4 pt-4 border-t border-border-main">
                <button type="button" onClick={() => setModal(false)}
                  className="btn-base flex-1 rounded-2xl border border-border-main py-3 text-sm font-semibold hover:bg-bg-main cursor-pointer text-text-main">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="btn-base flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2">
                  <FiCheck className="h-4 w-4" /> {t("saveHours")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
