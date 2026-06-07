"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { 
  FiUsers, FiMapPin, FiWifi, FiCalendar, FiSearch, 
  FiX, FiCheck, FiBriefcase, FiGrid, FiMap, FiClock, FiActivity, FiNavigation 
} from "react-icons/fi";

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

const BASE_COORDS = {
  "AGT-1001": { x: 46, y: 22 }, // Delhi
  "AGT-1002": { x: 49, y: 76 }, // Bangalore
  "AGT-1003": { x: 76, y: 45 }, // Kolkata
  "AGT-1004": { x: 34, y: 58 }, // Mumbai
  "AGT-1005": { x: 56, y: 30 }  // Lucknow
};

const initial = [
  { id: "AGT-1001", name: "Ramesh Gupta",   role: "Senior Recovery Agent", dept: "North Zone", status: "OnSite",  location: "Janakpuri, Delhi, India",            lastSeen: "Just now",  currentCase: "LN-8497 (Suresh Patil)", coords: { x: 46, y: 22 }, avatar: 0 },
  { id: "AGT-1002", name: "Priya Nair",     role: "Field Collector",       dept: "South Zone", status: "Remote",  location: "Indiranagar, Bengaluru, India",      lastSeen: "Just now",  currentCase: "LN-8498 (Kavita Jain)",  coords: { x: 49, y: 76 }, avatar: 1 },
  { id: "AGT-1003", name: "Vikram Mehta",   role: "Recovery Specialist",   dept: "East Zone",  status: "OnSite",  location: "Salt Lake Sector V, Kolkata, India",  lastSeen: "Just now",  currentCase: "LN-8491 (Sophia Martinez)", coords: { x: 76, y: 45 }, avatar: 2 },
  { id: "AGT-1004", name: "Anjali Singh",   role: "Field Collector",       dept: "West Zone",  status: "OnSite",  location: "Andheri West, Mumbai, India",        lastSeen: "Just now",   currentCase: "LN-8500 (Deepika Rao)",   coords: { x: 34, y: 58 }, avatar: 3 },
  { id: "AGT-1005", name: "Karan Joshi",    role: "Field Agent",           dept: "Central Zone",status: "Remote",  location: "Hazratganj, Lucknow, India",          lastSeen: "Just now",  currentCase: "LN-8495 (Rahul Sharma)",  coords: { x: 56, y: 30 }, avatar: 4 },
  { id: "AGT-1006", name: "Meena Iyer",     role: "Field Collector",       dept: "South Zone", status: "OnLeave", location: "Mumbai, India",                      lastSeen: "2 days ago", currentCase: "—",                        coords: null,            avatar: 5 },
];

const statusCfg = {
  OnSite:  { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  Remote:  { cls: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",   dot: "bg-indigo-500"  },
  OnLeave: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",      dot: "bg-amber-500"   },
};

// Simulated moving route landmarks for each agent
const LANDMARKS = {
  "AGT-1001": [
    "Janakpuri District Center, Delhi, India",
    "Block A, Janakpuri, Delhi, India",
    "Metro Station Gate 2, Janakpuri, Delhi, India",
    "Pankha Road Crossing, Janakpuri, Delhi, India",
    "Major Somnath Marg, Janakpuri, Delhi, India"
  ],
  "AGT-1002": [
    "100 Feet Rd, Indiranagar, Bengaluru, India",
    "12th Main Rd, Indiranagar, Bengaluru, India",
    "Metro Station, Indiranagar, Bengaluru, India",
    "Hal 2nd Stage, Indiranagar, Bengaluru, India",
    "Double Road, Indiranagar, Bengaluru, India"
  ],
  "AGT-1003": [
    "Salt Lake Sector V, Kolkata, India",
    "Block GP, Salt Lake Sector V, Kolkata, India",
    "Block EP, Salt Lake Sector V, Kolkata, India",
    "College More Crossing, Salt Lake Sector V, Kolkata, India",
    "SDF Building Lane, Salt Lake Sector V, Kolkata, India"
  ],
  "AGT-1004": [
    "Andheri West Link Road, Mumbai, India",
    "Veera Desai Rd, Andheri West, Mumbai, India",
    "Lokhandwala Market, Andheri West, Mumbai, India",
    "Versova Beach Road, Andheri West, Mumbai, India",
    "Juhu Circle Interchange, Mumbai, India"
  ],
  "AGT-1005": [
    "Hazratganj Crossing, Lucknow, India",
    "Near GPO, Hazratganj, Lucknow, India",
    "Shahnajaf Road, Hazratganj, Lucknow, India",
    "Halwasiya Market Lane, Hazratganj, Lucknow, India",
    "Sapru Marg Crossing, Hazratganj, Lucknow, India"
  ]
};

export default function EmployeeTrackingView() {
  const { t } = useApp();
  const [employees, setEmployees] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'grid'
  const [selectedAgent, setSelectedAgent] = useState(initial[0]);
  const [countdown, setCountdown] = useState(5);
  const [logs, setLogs] = useState(["[Live] Agent tracking telemetry initialized."]);
  
  // Modals
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [fLocation, setFLocation] = useState("");
  const [fStatus, setFStatus]   = useState("OnSite");
  const [fCurrentCase, setFCurrentCase] = useState("");

  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Live Location Update Simulation Hook (5s Interval with moving markers)
  useEffect(() => {
    // Timer countdown helper
    const timer = setInterval(() => {
      setCountdown(prev => (prev === 1 ? 5 : prev - 1));
    }, 1000);

    // Dynamic location updates every 5 seconds
    const interval = setInterval(() => {
      const now = new Date().toLocaleTimeString();
      
      setEmployees(prev => {
        const nextLandmarkIndex = Math.floor(Math.random() * 5);
        const updated = prev.map(emp => {
          if (emp.coords === null && emp.status === "OnLeave") return emp; // Skip on-leave
          
          const list = LANDMARKS[emp.id];
          if (!list) return emp;
          
          const newLoc = list[nextLandmarkIndex];
          // Simulate slight coordinate movement around their base coordinate
          const base = BASE_COORDS[emp.id];
          const dx = (Math.random() - 0.5) * 4; // Shift left/right by up to 2%
          const dy = (Math.random() - 0.5) * 4; // Shift up/down by up to 2%
          
          return {
            ...emp,
            location: newLoc,
            lastSeen: "Just now",
            coords: {
              x: Math.max(15, Math.min(85, base.x + dx)),
              y: Math.max(15, Math.min(85, base.y + dy))
            }
          };
        });

        // Sync selected agent's info data (location text / coordinates)
        if (selectedAgent) {
          const matched = updated.find(emp => emp.id === selectedAgent.id);
          if (matched && matched.location !== selectedAgent.location) {
            setSelectedAgent(matched);
            setLogs(logPrev => [...logPrev, `[${now}] GPS ping: ${matched.name} moved to ${matched.location.split(",")[0]}`]);
          }
        }
        
        return updated;
      });

    }, 5000);

    return () => {
      clearInterval(timer);
      clearInterval(interval);
    };
  }, [selectedAgent]);

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
    const now = new Date().toLocaleTimeString();
    setEmployees(prev => {
      const base = BASE_COORDS[editing.id] || { x: 50, y: 50 };
      const updated = prev.map(emp => emp.id === editing.id
        ? { ...emp, location: fLocation, status: fStatus, currentCase: fCurrentCase, lastSeen: "Just now", coords: fStatus === "OnLeave" ? null : base }
        : emp
      );
      const matched = updated.find(emp => emp.id === editing.id);
      if (selectedAgent && selectedAgent.id === editing.id) {
        setSelectedAgent(matched);
      }
      setLogs(logPrev => [...logPrev, `[${now}] Manual override: ${matched.name} set to ${fLocation}`]);
      return updated;
    });
    setModal(false); setEditing(null);
  };

  // Google Maps URL focused on India to display all moving overlay markers
  const googleMapsIndiaUrl = "https://maps.google.com/maps?q=India&t=&z=5&ie=UTF8&iwloc=&output=embed";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2">
            {t("trackingTitle")}
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-0.5">{t("trackingSub")}</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time Indicator Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <FiClock className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>GPS Ping in {countdown}s</span>
          </div>

          {/* View Switcher */}
          <div className="flex rounded-xl bg-bg-card border border-border-main p-1 shadow-sm">
            <button
              onClick={() => setViewMode("map")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "map" ? "bg-indigo-600 text-white shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >
              <FiMap className="h-3.5 w-3.5" />
              {t("mapView")}
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-all cursor-pointer ${
                viewMode === "grid" ? "bg-indigo-600 text-white shadow-sm" : "text-text-muted hover:text-text-main"
              }`}
            >
              <FiGrid className="h-3.5 w-3.5" />
              {t("gridView")}
            </button>
          </div>
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
      <div className="flex flex-wrap items-center gap-3">
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

      {/* Conditional View Rendering */}
      {viewMode === "map" ? (
        /* DYNAMIC GOOGLE MAP VIEW CONTAINER WITH MOVING MARKER OVERLAYS */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Live Google Map Overlay Area */}
          <div className="lg:col-span-2 relative h-[520px] rounded-3xl border border-border-main bg-bg-card overflow-hidden shadow-sm">
            {/* Real Google Maps iframe centeralizing India */}
            <iframe
              title="Google Maps Live Agent Reference Map"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              loading="lazy"
              allowFullScreen
              referrerPolicy="no-referrer-when-downgrade"
              src={googleMapsIndiaUrl}
              className="grayscale-[20%] dark:invert-[90%] dark:hue-rotate-[180deg] transition-all duration-300 pointer-events-auto"
            />
            
            {/* Moving Pulsing HTML Markers overlaying the Google Map */}
            {filtered.map(emp => {
              if (!emp.coords) return null;
              const isSelected = selectedAgent && selectedAgent.id === emp.id;
              return (
                <button
                  key={emp.id}
                  onClick={() => setSelectedAgent(emp)}
                  style={{ 
                    left: `${emp.coords.x}%`, 
                    top: `${emp.coords.y}%`,
                    transition: "left 4.5s ease-in-out, top 4.5s ease-in-out" // Buttery smooth sliding movement
                  }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 focus:outline-none cursor-pointer"
                >
                  {/* Pin outer pulse animation */}
                  <span className={`absolute inline-flex h-8 w-8 -left-2.5 -top-2.5 rounded-full opacity-65 animate-ping ${
                    emp.status === "OnSite" ? "bg-emerald-400" : "bg-indigo-400"
                  }`} />
                  
                  {/* Pin Core */}
                  <span className={`relative flex h-3.5 w-3.5 rounded-full border-2 border-white dark:border-zinc-950 shadow-md ${
                    emp.status === "OnSite" ? "bg-emerald-500" : "bg-indigo-500"
                  } ${isSelected ? "ring-4 ring-indigo-500/40 scale-125" : "group-hover:scale-110"} transition-all duration-200`} />

                  {/* Popover Hover Card */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-44 rounded-xl border border-border-main bg-bg-card p-2.5 shadow-xl opacity-0 scale-95 group-hover:opacity-100 group-hover:scale-100 pointer-events-none transition-all duration-200 z-30">
                    <div className="font-bold text-text-main text-xs leading-tight">{emp.name}</div>
                    <div className="text-[10px] text-text-muted mt-0.5 flex items-center gap-1">
                      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg[emp.status].dot}`} />
                      {t(emp.status)}
                    </div>
                    <div className="text-[9px] text-text-muted font-semibold mt-1 font-mono">{emp.id}</div>
                    <div className="text-[8px] text-indigo-500 font-bold mt-1 truncate">{emp.location.split(",")[0]}</div>
                  </div>
                </button>
              );
            })}

            {/* Quick Map floating badge */}
            {selectedAgent && (
              <div className="absolute top-4 left-4 bg-bg-card/95 backdrop-blur-sm border border-border-main rounded-2xl px-4 py-2.5 shadow-lg max-w-xs flex items-center gap-3 animate-scale-in">
                <span className="relative flex h-2.5 w-2.5 flex-shrink-0">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-emerald-400" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
                </span>
                <div>
                  <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Live Tracker Map</span>
                  <span className="text-xs font-semibold text-text-main block truncate">{selectedAgent.name}</span>
                </div>
              </div>
            )}

            {/* Map Status Overlay Legend */}
            <div className="absolute bottom-4 left-4 bg-bg-card/90 backdrop-blur-sm border border-border-main/80 rounded-xl px-3 py-2 text-[10px] font-semibold text-text-muted flex gap-4 select-none">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <span>On Field (On-Site)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                <span>Transit (Remote)</span>
              </div>
            </div>
          </div>

          {/* Map Side Telemetry Panel */}
          <div className="rounded-3xl border border-border-main bg-bg-card p-5 shadow-sm flex flex-col justify-between h-[520px] overflow-hidden">
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Select Agent to Track</span>
              <div className="overflow-y-auto pr-1 flex-shrink-0 space-y-2 max-h-[140px]">
                {filtered.map(emp => {
                  const isSelected = selectedAgent && selectedAgent.id === emp.id;
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedAgent(emp)}
                      className={`w-full flex items-center gap-3 p-2 rounded-xl border transition-all text-left cursor-pointer ${
                        isSelected 
                          ? "bg-indigo-600/10 border-indigo-500/30 text-text-main shadow-sm" 
                          : "border-border-main hover:bg-bg-main/50 text-text-muted hover:text-text-main"
                      }`}
                    >
                      <div className={`h-7 w-7 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[emp.avatar]} flex items-center justify-center text-white font-bold text-[10px] shadow-sm`}>
                        {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-xs text-text-main truncate">{emp.name}</div>
                        <div className="text-[8px] text-text-muted font-mono truncate">{emp.dept}</div>
                      </div>
                      <span className={`h-1.5 w-1.5 rounded-full ${statusCfg[emp.status].dot}`} />
                    </button>
                  );
                })}
              </div>

              {/* Selected Agent Detailed Telemetry */}
              {selectedAgent && (
                <div className="border-t border-border-main pt-3 flex-shrink-0 space-y-2 text-xs animate-scale-in">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[selectedAgent.avatar]} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                      {selectedAgent.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-xs leading-none">{selectedAgent.name}</h3>
                      <span className="text-[8px] font-mono font-semibold text-text-muted mt-0.5 inline-block">{selectedAgent.id}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Zone</span>
                      <span className="font-semibold text-text-main text-xs">{selectedAgent.dept}</span>
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Status</span>
                      <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold mt-0.5 ${statusCfg[selectedAgent.status].cls}`}>
                        {t(selectedAgent.status)}
                      </span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Active Borrower Case</span>
                    <span className="font-semibold text-text-main text-xs block leading-tight">{selectedAgent.currentCase}</span>
                  </div>

                  <div>
                    <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Live Location Address</span>
                    <div className="flex items-start gap-1 mt-0.5">
                      <FiMapPin className="h-3.5 w-3.5 text-rose-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-text-main font-semibold leading-tight">{selectedAgent.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Live Updates Log Feed */}
              <div className="border-t border-border-main pt-3 flex-1 flex flex-col min-h-[120px] overflow-hidden">
                <span className="text-[9px] font-bold text-text-muted uppercase tracking-wider block mb-1">Live Telemetry Logs</span>
                <div className="flex-1 overflow-y-auto bg-bg-main/60 border border-border-main/50 rounded-xl p-2 font-mono text-[9px] text-text-muted space-y-1.5 max-h-[140px]">
                  {logs.map((log, i) => (
                    <div key={i} className="leading-normal border-b border-border-main/20 pb-1 last:border-0 select-none">
                      {log}
                    </div>
                  ))}
                  <div ref={logsEndRef} />
                </div>
              </div>
            </div>

            {/* Actions */}
            {selectedAgent && (
              <div className="border-t border-border-main pt-3 flex gap-2">
                <button
                  onClick={() => openEdit(selectedAgent)}
                  className="w-full inline-flex items-center justify-center gap-1.5 rounded-xl bg-indigo-600 py-2.5 text-xs font-semibold text-white shadow-sm hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  <FiActivity className="h-3.5 w-3.5" />
                  {t("updateLocation")}
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* GRID VIEW CONTAINER */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
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
      )}

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
                  placeholder="e.g. Janakpuri, Delhi, India"
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
