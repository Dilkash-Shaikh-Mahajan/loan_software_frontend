"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FiCalendar, FiSearch, FiUsers, FiUserCheck, FiUserX,
  FiClock, FiPlus, FiX, FiCheck,
} from "react-icons/fi";

const ZONES = ["North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];

const initial = [
  { id: "AGT-1001", name: "Ramesh Gupta",  dept: "North Zone", checkIn: "08:45", checkOut: "17:30", hours: "8h 45m", status: "Present" },
  { id: "AGT-1002", name: "Priya Nair",    dept: "South Zone", checkIn: "09:15", checkOut: "18:00", hours: "8h 45m", status: "Present" },
  { id: "AGT-1003", name: "Vikram Mehta",  dept: "East Zone",  checkIn: "08:50", checkOut: "18:15", hours: "9h 25m", status: "Present" },
  { id: "AGT-1004", name: "Anjali Singh",  dept: "West Zone",  checkIn: "—",     checkOut: "—",     hours: "—",      status: "Absent"  },
  { id: "AGT-1005", name: "Karan Joshi",   dept: "Central Zone",checkIn: "09:40", checkOut: "—",     hours: "—",      status: "Late"    },
  { id: "AGT-1006", name: "Meena Iyer",    dept: "South Zone", checkIn: "—",     checkOut: "—",     hours: "—",      status: "Leave"   },
];

const statusCfg = {
  Present: { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  Late:    { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",       dot: "bg-amber-500"   },
  Absent:  { cls: "bg-rose-500/10 text-rose-500 border-rose-500/20",          dot: "bg-rose-500"    },
  Leave:   { cls: "bg-violet-500/10 text-violet-500 border-violet-500/20",    dot: "bg-violet-500"  },
};

export default function AttendanceView() {
  const { t } = useApp();
  const [records, setRecords] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterDate, setFilterDate] = useState(new Date().toISOString().split("T")[0]);
  const [modal, setModal] = useState(false);

  // Form
  const [fId,   setFId]   = useState("");
  const [fName, setFName] = useState("");
  const [fDept, setFDept] = useState("North Zone");
  const [fIn,   setFIn]   = useState("");
  const [fOut,  setFOut]  = useState("");
  const [fStat, setFStat] = useState("Present");

  const present = records.filter(r => r.status === "Present").length;
  const absent  = records.filter(r => r.status === "Absent").length;
  const late    = records.filter(r => r.status === "Late").length;

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q)) &&
      (filterDept === "All" || r.dept === filterDept)
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const hrs = fIn && fOut
      ? (() => {
          const [h1, m1] = fIn.split(":").map(Number);
          const [h2, m2] = fOut.split(":").map(Number);
          const total = (h2 * 60 + m2) - (h1 * 60 + m1);
          return `${Math.floor(total / 60)}h ${total % 60}m`;
        })()
      : "—";
    setRecords(prev => [{
      id: fId || `AGT-${Math.floor(1000 + Math.random() * 900)}`,
      name: fName, dept: fDept,
      checkIn: fIn || "—", checkOut: fOut || "—",
      hours: hrs, status: fStat,
    }, ...prev]);
    setModal(false);
    setFId(""); setFName(""); setFDept("North Zone");
    setFIn(""); setFOut(""); setFStat("Present");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">{t("attendanceTitle")}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t("attendanceSub")}</p>
        </div>
        <button
          onClick={() => setModal(true)}
          className="btn-base flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 cursor-pointer"
        >
          <FiPlus className="h-4 w-4" /> {t("markAttendance")}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: t("totalEmployees"), val: records.length, icon: FiUsers,     color: "text-indigo-500" },
          { label: t("presentToday"),   val: present,        icon: FiUserCheck, color: "text-emerald-500" },
          { label: t("absentToday"),    val: absent,         icon: FiUserX,     color: "text-rose-500" },
          { label: t("lateArrivals"),   val: late,           icon: FiClock,     color: "text-amber-500" },
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

      {/* Table Panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="flex flex-col gap-3 border-b border-border-main p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 max-w-sm">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder={t("search")}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 text-text-main"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <input
              type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer"
            />
            <select
              value={filterDept} onChange={e => setFilterDept(e.target.value)}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer"
            >
              <option value="All">{t("allDepts")}</option>
              {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-4">{t("agentId")}</th>
                <th className="px-5 py-4">{t("agentName")}</th>
                <th className="px-5 py-4">{t("department")}</th>
                <th className="px-5 py-4">{t("checkIn")}</th>
                <th className="px-5 py-4">{t("checkOut")}</th>
                <th className="px-5 py-4">{t("hoursWorked")}</th>
                <th className="px-5 py-4">{t("attendanceStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filtered.length > 0 ? filtered.map(r => (
                <tr key={r.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-text-main">{r.id}</td>
                  <td className="px-5 py-4 font-semibold text-text-main">{r.name}</td>
                  <td className="px-5 py-4 text-text-muted">{r.dept}</td>
                  <td className="px-5 py-4 text-text-muted font-mono">{r.checkIn}</td>
                  <td className="px-5 py-4 text-text-muted font-mono">{r.checkOut}</td>
                  <td className="px-5 py-4 font-semibold text-text-main">{r.hours}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg[r.status].cls}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg[r.status].dot}`} />
                      {t(r.status)}
                    </span>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" className="px-5 py-10 text-center text-text-muted">{t("noRecords")}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Footer note */}
        <div className="border-t border-border-main bg-bg-main/30 px-5 py-3 text-xs text-text-muted">
          {t("attendanceNote")}
        </div>
      </div>

      {/* Mark Attendance Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl text-text-main animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <h3 className="text-lg font-semibold">{t("markAttendance")}</h3>
              <button onClick={() => setModal(false)} className="btn-base rounded-xl p-1.5 hover:bg-bg-main text-text-muted cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("agentId")}</label>
                  <input type="text" value={fId} onChange={e => setFId(e.target.value)} placeholder="AGT-1001"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("agentName")}</label>
                  <input required type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="Full Name"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("department")}</label>
                  <select value={fDept} onChange={e => setFDept(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
                    {ZONES.map(z => <option key={z} value={z}>{z}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("attendanceStatus")}</label>
                  <select value={fStat} onChange={e => setFStat(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
                    {["Present","Late","Absent","Leave"].map(s => <option key={s} value={s}>{t(s)}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("checkIn")}</label>
                  <input type="time" value={fIn} onChange={e => setFIn(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("checkOut")}</label>
                  <input type="time" value={fOut} onChange={e => setFOut(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
              </div>
              <div className="flex gap-4 pt-4 border-t border-border-main">
                <button type="button" onClick={() => setModal(false)}
                  className="btn-base flex-1 rounded-2xl border border-border-main py-3 text-sm font-semibold hover:bg-bg-main cursor-pointer text-text-main">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="btn-base flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-500 shadow-lg shadow-indigo-600/15 cursor-pointer flex items-center justify-center gap-2">
                  <FiCheck className="h-4 w-4" /> {t("confirmAttendance")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
