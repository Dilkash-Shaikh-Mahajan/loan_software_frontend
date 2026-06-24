"use client";

import { useState, useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { 
  FiUsers, FiMapPin, FiWifi, FiCalendar, FiSearch, 
  FiX, FiCheck, FiBriefcase, FiGrid, FiMap, FiClock, FiActivity, FiNavigation 
} from "react-icons/fi";
import dynamic from "next/dynamic";
import io from "socket.io-client";

// Leaflet relies on window, so we must load it dynamically with SSR disabled
const MapComponent = dynamic(() => import("@/components/MapComponent"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 rounded-3xl animate-pulse">
      <p className="text-gray-500 font-semibold">Loading Map Engine...</p>
    </div>
  ),
});

const SOCKET_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

const ZONES = ["All", "North Zone", "South Zone", "East Zone", "West Zone", "Central Zone"];
const STATUSES = ["All", "OnSite", "Remote", "OnLeave"];

const AVATAR_COLORS = [
  "from-indigo-500 to-purple-600",
  "from-emerald-500 to-teal-600",
  "from-amber-500 to-orange-600",
  "from-rose-500 to-pink-600",
  "from-violet-500 to-purple-600",
  "from-sky-500 to-cyan-600",
];

const statusCfg = {
  OnSite:  { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20", dot: "bg-emerald-500" },
  Remote:  { cls: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",   dot: "bg-indigo-500"  },
  OnLeave: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20",      dot: "bg-amber-500"   },
};

export default function EmployeeTrackingView() {
  const { t } = useApp();
  
  // Real-time states
  const [locations, setLocations] = useState({});
  const [agents, setAgents] = useState([]);
  
  const [search, setSearch] = useState("");
  const [filterDept, setFilterDept] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [viewMode, setViewMode] = useState("map"); // 'map' or 'grid'
  const [selectedAgentId, setSelectedAgentId] = useState(null);
  
  const [logs, setLogs] = useState(["[Live] Agent tracking telemetry initialized. Connecting to server..."]);
  const [lastPing, setLastPing] = useState(null);
  const logsEndRef = useRef(null);

  // Auto-scroll logs
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [logs]);

  // Fetch initial locations & setup socket
  useEffect(() => {
    let socket;

    const fetchInitialLocations = async () => {
      try {
        const res = await fetch(`${SOCKET_URL}/api/users/locations`);
        const data = await res.json();
        
        if (data.success && data.data) {
          const locMap = {};
          const agentList = data.data.map((user, idx) => {
            const hasLocation = !!user.lastLocation;
            if (hasLocation) {
              locMap[user._id] = {
                userId: user._id,
                name: user.name,
                lat: user.lastLocation.lat,
                lng: user.lastLocation.lng,
                updatedAt: user.lastLocation.updatedAt,
              };
            }
            return {
              id: user._id,
              employeeId: user.employeeId || "N/A",
              name: user.name || "Unknown",
              role: "Field Agent",
              dept: "Central Zone", // You can map real depts here
              status: hasLocation ? "OnSite" : "Remote",
              currentCase: "Active Patrol",
              avatar: idx % AVATAR_COLORS.length,
            };
          });
          
          setLocations(locMap);
          setAgents(agentList);
          setLogs(prev => [...prev, `[System] Loaded ${data.data.length} agents from database.`]);
        }
      } catch (err) {
        setLogs(prev => [...prev, `[Error] Failed to fetch initial data: ${err.message}`]);
      }
    };

    fetchInitialLocations();

    // Setup Socket
    socket = io(SOCKET_URL);

    socket.on("connect", () => {
      setLogs(prev => [...prev, `[System] Connected to live socket stream.`]);
    });

    socket.on("admin_location_update", (data) => {
      const now = new Date();
      setLastPing(now);
      
      setLocations(prev => {
        const existing = prev[data.userId];
        const newLog = existing 
          ? `[GPS] Ping from ${existing.name || data.userId}: moved to [${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}]`
          : `[GPS] New tracking acquired for user ${data.userId}`;
          
        setLogs(logList => [...logList.slice(-49), newLog]); // Keep last 50 logs
        
        return {
          ...prev,
          [data.userId]: {
            ...existing,
            ...data,
          },
        };
      });
    });

    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Compute selected agent from locations
  const selectedLoc = selectedAgentId ? locations[selectedAgentId] : null;
  const selectedAgentData = selectedAgentId ? agents.find(a => a.id === selectedAgentId) : null;

  const filteredAgents = agents.filter(e =>
    (e.name.toLowerCase().includes(search.toLowerCase()) || e.employeeId.toLowerCase().includes(search.toLowerCase())) &&
    (filterDept === "All" || e.dept === filterDept) &&
    (filterStatus === "All" || e.status === filterStatus)
  );

  const onSite = agents.filter(e => e.status === "OnSite").length;
  const remote = agents.filter(e => e.status === "Remote").length;
  const onLeave = agents.filter(e => e.status === "OnLeave").length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main flex items-center gap-2">
            Live Tracking
            <span className="flex h-2.5 w-2.5 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </h1>
          <p className="text-sm text-text-muted mt-0.5">Real-time GPS tracking for field agents.</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Real-time Indicator Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3 py-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            <FiClock className="h-3.5 w-3.5 animate-spin" style={{ animationDuration: '3s' }} />
            <span>{lastPing ? `Last ping: ${lastPing.toLocaleTimeString()}` : "Waiting for GPS..."}</span>
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
          { label: t("totalStaff"),  val: agents.length, icon: FiUsers,    color: "text-indigo-500" },
          { label: t("onSite"),      val: onSite,        icon: FiMapPin,   color: "text-emerald-500" },
          { label: t("remote"),      val: remote,        icon: FiWifi,     color: "text-indigo-400" },
          { label: t("onLeaveCount"),val: onLeave,       icon: FiCalendar, color: "text-amber-500" },
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
          {/* Live Real Map Area using react-leaflet */}
          <div className="lg:col-span-2 relative h-[520px] rounded-3xl border border-border-main bg-bg-card overflow-hidden shadow-sm">
            <MapComponent locations={locations} selectedUserId={selectedAgentId} />
          </div>

          {/* Map Side Telemetry Panel */}
          <div className="rounded-3xl border border-border-main bg-bg-card p-5 shadow-sm flex flex-col justify-between h-[520px] overflow-hidden">
            <div className="space-y-4 flex-1 flex flex-col overflow-hidden">
              <span className="text-[10px] font-bold text-text-muted uppercase tracking-wider block">Select Agent to Track</span>
              <div className="overflow-y-auto pr-1 flex-shrink-0 space-y-2 max-h-[140px]">
                {filteredAgents.map(emp => {
                  const isSelected = selectedAgentId === emp.id;
                  const empLoc = locations[emp.id];
                  
                  return (
                    <button
                      key={emp.id}
                      onClick={() => setSelectedAgentId(emp.id)}
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
                        <div className="text-[8px] text-text-muted font-mono truncate">{emp.employeeId}</div>
                      </div>
                      <span className={`h-1.5 w-1.5 rounded-full ${empLoc ? statusCfg.OnSite.dot : statusCfg.Remote.dot}`} />
                    </button>
                  );
                })}
              </div>

              {/* Selected Agent Detailed Telemetry */}
              {selectedAgentData && (
                <div className="border-t border-border-main pt-3 flex-shrink-0 space-y-2 text-xs animate-scale-in">
                  <div className="flex items-center gap-2.5">
                    <div className={`h-8 w-8 rounded-lg bg-gradient-to-br ${AVATAR_COLORS[selectedAgentData.avatar]} flex items-center justify-center text-white font-bold text-xs shadow-sm`}>
                      {selectedAgentData.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <h3 className="font-bold text-text-main text-xs leading-none">{selectedAgentData.name}</h3>
                      <span className="text-[8px] font-mono font-semibold text-text-muted mt-0.5 inline-block">{selectedAgentData.employeeId}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div>
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Coordinates</span>
                      {selectedLoc ? (
                        <span className="font-semibold text-text-main text-[10px]">
                          {selectedLoc.lat.toFixed(4)}, {selectedLoc.lng.toFixed(4)}
                        </span>
                      ) : (
                        <span className="font-semibold text-text-muted text-[10px]">Unknown</span>
                      )}
                    </div>
                    <div>
                      <span className="text-[8px] font-bold text-text-muted uppercase tracking-wider block">Last Update</span>
                      {selectedLoc ? (
                        <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold mt-0.5 ${statusCfg.OnSite.cls}`}>
                          {new Date(selectedLoc.updatedAt).toLocaleTimeString()}
                        </span>
                      ) : (
                        <span className={`inline-flex items-center rounded-full border px-1.5 py-0.5 text-[9px] font-semibold mt-0.5 ${statusCfg.Remote.cls}`}>
                          Offline
                        </span>
                      )}
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
          </div>
        </div>
      ) : (
        /* GRID VIEW CONTAINER */
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-fade-in">
          {filteredAgents.length > 0 ? filteredAgents.map(emp => {
            const loc = locations[emp.id];
            
            return (
              <div key={emp.id} className="group rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
                <div className="flex items-start justify-between mb-4">
                  <div className="relative">
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${AVATAR_COLORS[emp.avatar]} flex items-center justify-center text-white font-bold text-sm shadow-sm`}>
                      {emp.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-bg-card ${loc ? statusCfg.OnSite.dot : statusCfg.Remote.dot}`} />
                  </div>
                  <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-semibold ${loc ? statusCfg.OnSite.cls : statusCfg.Remote.cls}`}>
                    {loc ? "Tracking" : "Offline"}
                  </span>
                </div>

                <div className="mb-3">
                  <div className="font-semibold text-text-main leading-tight">{emp.name}</div>
                  <div className="text-xs text-text-muted">{emp.role}</div>
                  <div className="text-[10px] text-text-muted mt-0.5 font-medium">{emp.employeeId}</div>
                </div>

                <div className="flex items-start gap-1.5 text-xs text-text-muted mb-3">
                  <FiMapPin className="h-3.5 w-3.5 flex-shrink-0 mt-0.5 text-indigo-400" />
                  <span className="leading-tight">
                    {loc ? `${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}` : "Location unavailable"}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-4 border-t border-border-main pt-3">
                  <span className="text-[10px] text-text-muted">
                    {loc ? `Updated: ${new Date(loc.updatedAt).toLocaleTimeString()}` : "Never"}
                  </span>
                  <button 
                    onClick={() => {
                      setSelectedAgentId(emp.id);
                      setViewMode("map");
                    }}
                    className="btn-base text-[10px] font-semibold text-indigo-500 hover:text-indigo-400 cursor-pointer border border-indigo-500/30 rounded-lg px-2.5 py-1 bg-indigo-500/5">
                    Track Live
                  </button>
                </div>
              </div>
            );
          }) : (
            <div className="col-span-full py-12 text-center text-text-muted">{t("noRecords")}</div>
          )}
        </div>
      )}
    </div>
  );
}
