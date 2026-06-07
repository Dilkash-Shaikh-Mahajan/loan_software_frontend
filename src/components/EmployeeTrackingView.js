"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiUsers, FiMapPin, FiWifi, FiCalendar, FiSearch, FiX, FiCheck, FiBriefcase } from "react-icons/fi";

const ZONES = ["All", "North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];
const STATUSES    = ["All", "OnSite", "Remote", "OnLeave"];

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-cyan-600",
];

const initial = [
  { id: "AGT-1001", name: "Ramesh Gupta",   role: "Senior Recovery Agent", dept: "North Zone", status: "OnSite",  location: "Janakpuri Sect 4, Delhi",   lastSeen: "2 min ago",  currentCase: "LN-8497 (Suresh Patil)", avatar: 0 },
  { id: "AGT-1002", name: "Priya Nair",     role: "Field Collector",       dept: "South Zone", status: "Remote",  location: "Indiranagar, Bangalore",      lastSeen: "5 min ago",  currentCase: "LN-8498 (Kavita Jain)",  avatar: 1 },
  { id: "AGT-1003", name: "Vikram Mehta",   role: "Recovery Specialist",   dept: "East Zone",  status: "OnSite",  location: "Salt Lake Sec V, Kolkata",   lastSeen: "1 min ago",  currentCase: "LN-8491 (Sophia Martinez)", avatar: 2 },
  { id: "AGT-1004", name: "Anjali Singh",   role: "Field Collector",       dept: "West Zone",  status: "OnSite",  location: "Andheri Link Rd, Mumbai",    lastSeen: "Just now",   currentCase: "LN-8500 (Deepika Rao)",   avatar: 3 },
  { id: "AGT-1005", name: "Karan Joshi",    role: "Field Agent",           dept: "Central Zone",status: "Remote",  location: "Hazratganj, Lucknow",        lastSeen: "8 min ago",  currentCase: "LN-8495 (Rahul Sharma)",  avatar: 4 },
  { id: "AGT-1006", name: "Meena Iyer",     role: "Field Collector",       dept: "South Zone", status: "OnLeave", location: "—",                        lastSeen: "2 days ago", currentCase: "—",                        avatar: 5 },
];

const statusCfg = {
  OnSite:  { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  Remote:  { cls: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",   dot: "bg-indigo-500"  },
  OnLeave: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",      dot: "bg-amber-500"   },
};

export default function EmployeeTrackingView() {
  const { t } = useApp();
  const [employees, setEmployees] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fLocation, setFLocation] = useState("");
  const [fStatus, setFStatus]   = useState("OnSite");
  const [fCurrentCase, setFCurrentCase] = useState("");

  const filtered = employees.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase())) &&
    (filterDept === "All" || e.dept === filterDept) &&
    (filterStatus === "All" || e.status === filterStatus)
  );

  const onSite  = employees.filter(e => e.status === "OnSite").length;
  const remote  = employees.filter(e => e.status === "Remote").length;
  const onLeave = employees.filter(e => e.status === "OnLeave").length;

  const openEdit = (emp) => {
    setEditing(emp);
    setFLocation(emp.location);
    setFStatus(emp.status);
    setFCurrentCase(emp.currentCase);
    setModal(true);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setEmployees(prev => prev.map(emp => emp.id === editing.id
      ? { ...emp, location: fLocation, status: fStatus, currentCase: fCurrentCase, lastSeen: "Just now" }
      : emp
    ));
    setModal(false); setEditing(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">{t("trackingTitle")}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t("trackingSub")}</p>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: t("totalStaff"),  val: employees.length, icon: FiUsers,    color: "text-indigo-500" },
          { label: t("onSite"),      val: onSite,           icon: FiMapPin,   color: "text-emerald-500" },
          { label: t("remote"),      val: remote,           icon: FiWifi,     color: "text-indigo-400" },
          { label: t("onLeaveCount"),val: onLeave,          icon: FiCalendar, color: "text-amber-500" },
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-xs">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-xl border border-border-main bg-bg-card py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
        </div>
        <select value={filterDept} onChange={e => setFilterDept(e.target.value)}
          className="rounded-xl border border-border-main bg-bg-card py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
          {ZONES.map(z => <option key={z} value={z}>{z === "All" ? t("allDepts") : z}</option>)}
        </select>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="rounded-xl border border-border-main bg-bg-card py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
          {STATUSES.map(s => <option key={s} value={s}>{s === "All" ? t("allStatuses2") : t(s)}</option>)}
        </select>
      </div>

      {/* Agent Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.length > 0 ? filtered.map(emp => (
          <div key={emp.id} className="group rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            {/* Avatar + status */}
            <div className="flex items-start justify-between mb-4">
              <div className="relative">
                <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[emp.avatar]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                  {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                </div>
                <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-card ${statusCfg[emp.status].dot}`} />
              </div>
              <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${statusCfg[emp.status].cls}`}>
                {t(emp.status)}
              </span>
            </div>

            {/* Info */}
            <div className="mb-3">
              <div className="font-semibold text-text-main leading-tight">{emp.name}</div>
              <div className="text-xs text-text-muted">{emp.role}</div>
              <div className="text-[10px] text-text-muted mt-0.5 font-medium">{emp.dept}</div>
            </div>

            {/* Current Case */}
            <div className="flex items-start gap-1.5 text-xs text-text-main font-medium bg-bg-main/50 border border-border-main/50 rounded-xl p-2 mb-3">
              <FiBriefcase className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-indigo-500" />
              <div>
                <span className="text-[10px] uppercase tracking-wider block text-text-muted">{t("currentCase")}</span>
                <span className="leading-tight text-xs font-semibold">{emp.currentCase}</span>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-start gap-1.5 text-xs text-text-muted mb-3">
              <FiMapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-indigo-400" />
              <span className="leading-tight">{emp.location}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[10px] text-text-muted">Last seen: {emp.lastSeen}</span>
              <button onClick={() => openEdit(emp)}
                className="btn-base text-[10px] font-semibold text-indigo-500 hover:text-indigo-400 cursor-pointer border border-indigo-500/30 rounded-lg px-2.5 py-1 bg-indigo-500/5">
                {t("updateLocation")}
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-text-muted">{t("noRecords")}</div>
        )}
      </div>

      {/* Update Location Modal */}
      {modal && editing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative z-10 w-full max-w-md rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl text-text-main animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <div>
                <h3 className="text-lg font-semibold">{t("updateLocation")}</h3>
                <p className="text-xs text-text-muted">{editing.name} · {editing.dept}</p>
              </div>
              <button onClick={() => setModal(false)} className="btn-base rounded-xl p-1.5 hover:bg-bg-main text-text-muted cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("attendanceStatus")}</label>
                <select value={fStatus} onChange={e => setFStatus(e.target.value)}
                  className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
                  <option value="OnSite">{t("OnSite")}</option>
                  <option value="Remote">{t("Remote")}</option>
                  <option value="OnLeave">{t("OnLeave")}</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("currentCase")}</label>
                <input required type="text" value={fCurrentCase} onChange={e => setFCurrentCase(e.target.value)}
                  placeholder="e.g. LN-8497 (Suresh Patil) or —"
                  className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("location")}</label>
                <input required type="text" value={fLocation} onChange={e => setFLocation(e.target.value)}
                  placeholder="e.g. Janakpuri Sector 4, Delhi"
                  className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
              </div>
              <div className="flex gap-4 pt-4 border-t border-border-main">
                <button type="button" onClick={() => setModal(false)}
                  className="btn-base flex-1 rounded-2xl border border-border-main py-3 text-sm font-semibold hover:bg-bg-main cursor-pointer text-text-main">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="btn-base flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2">
                  <FiCheck className="h-4 w-4" /> {t("saveLocation")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
