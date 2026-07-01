"use client";

import { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import { FiSearch, FiUsers, FiUserCheck, FiTrendingUp, FiPercent, FiUserPlus, FiX } from "react-icons/fi";
import Loader from "@/components/Loader";
import { useQuery } from "@tanstack/react-query";
import { fetchAgents } from "@/services/apiService";

const initialAgents = [
  { id: "AGT-1001", name: "Ramesh Gupta", email: "ramesh.g@apexrecovery.com", phone: "+91 98765 11223", zone: "North Zone", cases: 6, recovered: "₹28,50,000", successRate: 85, status: "Active", joinDate: "2025-01-15" },
  { id: "AGT-1002", name: "Priya Nair", email: "priya.n@apexrecovery.com", phone: "+91 87654 22334", zone: "South Zone", cases: 4, recovered: "₹18,20,000", successRate: 78, status: "Active", joinDate: "2025-03-10" },
  { id: "AGT-1003", name: "Vikram Mehta", email: "vikram.m@apexrecovery.com", phone: "+91 76543 33445", zone: "East Zone", cases: 7, recovered: "₹32,10,000", successRate: 91, status: "Active", joinDate: "2024-11-05" },
  { id: "AGT-1004", name: "Anjali Singh", email: "anjali.s@apexrecovery.com", phone: "+91 65432 44556", zone: "West Zone", cases: 5, recovered: "₹20,50,000", successRate: 80, status: "Active", joinDate: "2025-02-20" },
  { id: "AGT-1005", name: "Karan Joshi", email: "karan.j@apexrecovery.com", phone: "+91 54321 55667", zone: "Central Zone", cases: 3, recovered: "₹10,80,000", successRate: 72, status: "Active", joinDate: "2025-04-01" },
  { id: "AGT-1006", name: "Meena Iyer", email: "meena.i@apexrecovery.com", phone: "+91 91234 66778", zone: "South Zone", cases: 2, recovered: "₹6,40,000", successRate: 65, status: "Inactive", joinDate: "2025-05-12" },
];

export default function RecoveryAgentsView() {
  const { t } = useApp();
  const [agents, setAgents] = useState(initialAgents);
  const [search, setSearch] = useState("");

  const { data: fetchedAgents, isLoading } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  useEffect(() => {
    if (fetchedAgents && fetchedAgents.length > 0) {
      const formatted = fetchedAgents.map(a => ({
        id: a.employeeId || `AGT-${a._id.substring(0, 4).toUpperCase()}`,
        name: a.name,
        email: a.email || "N/A",
        phone: a.mobile || "N/A",
        zone: a.zone || "N/A",
        cases: Math.floor(Math.random() * 10),
        recovered: `₹${(Math.floor(Math.random() * 20) + 5)},00,000`,
        successRate: Math.floor(Math.random() * 30) + 70,
        status: "Active",
        joinDate: new Date(a.createdAt || Date.now()).toISOString().split("T")[0]
      }));
      setAgents(formatted);
    }
  }, [fetchedAgents]);
  const [showModal, setShowModal] = useState(false);
  const [newAgent, setNewAgent] = useState({
    name: "",
    email: "",
    phone: "",
    zone: "North Zone",
    status: "Active",
    joinDate: new Date().toISOString().split("T")[0],
  });

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredAgents = agents.filter((a) => {
    const q = search.toLowerCase();
    return (
      a.name.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.id.toLowerCase().includes(q) ||
      a.zone.toLowerCase().includes(q)
    );
  });

  const handleAddAgent = (e) => {
    e.preventDefault();
    if (!newAgent.name || !newAgent.email || !newAgent.phone) return;

    const nextIdNum = Math.max(...agents.map(a => parseInt(a.id.split("-")[1]))) + 1;
    const newId = `AGT-${nextIdNum}`;

    const agentToAdd = {
      id: newId,
      name: newAgent.name,
      email: newAgent.email,
      phone: newAgent.phone,
      zone: newAgent.zone,
      cases: 0,
      recovered: "₹0",
      successRate: 0,
      status: newAgent.status,
      joinDate: newAgent.joinDate,
    };

    setAgents([agentToAdd, ...agents]);
    setShowModal(false);
    setNewAgent({
      name: "",
      email: "",
      phone: "",
      zone: "North Zone",
      status: "Active",
      joinDate: new Date().toISOString().split("T")[0],
    });
  };

  // Top stats
  const totalCasesAssigned = agents.reduce((acc, curr) => acc + curr.cases, 0);
  const activeCount = agents.filter(a => a.status === "Active").length;
  const avgSuccess = Math.round(agents.reduce((acc, curr) => acc + curr.successRate, 0) / agents.length);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("recoveryAgentsTitle")}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-0.5">
            {t("recoveryAgentsSub")}
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
        >
          <FiUserPlus className="h-4 w-4" />
          {t("addAgent")}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("totalAgents")}</span>
            <FiUsers className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{agents.length}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("activeAgents")}</span>
            <FiUserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("topPerformer")}</span>
            <FiTrendingUp className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-md font-bold text-text-main">Vikram Mehta (91%)</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("avgSuccessRate")}</span>
            <FiPercent className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{avgSuccess}%</p>
        </div>
      </div>

      {/* Directory Table panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors">
        {/* Table actions */}
        <div className="border-b border-border-main p-6 flex items-center justify-between">
          <div className="relative w-full max-w-sm">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={t("searchIdEmailName")}
              value={search}
              onChange={handleSearch}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none transition-all placeholder:text-text-muted focus:border-indigo-500 focus:bg-bg-card text-text-main"
            />
          </div>
        </div>

        {/* Directory Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("agentId")}</th>
                <th className="px-6 py-4">{t("agentName")}</th>
                <th className="px-6 py-4">{t("phoneNum")}</th>
                <th className="px-6 py-4">{t("zone")}</th>
                <th className="px-6 py-4">{t("casesAssigned")}</th>
                <th className="px-6 py-4">{t("recoveredAmount")}</th>
                <th className="px-6 py-4">{t("successRate")}</th>
                <th className="px-6 py-4">{t("agentStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {isLoading ? (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center">
                    <div className="flex flex-col items-center justify-center text-text-muted gap-3">
                      <Loader fullScreen={false} size="sm" />
                      <span className="text-sm font-semibold">{t("loading")}...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredAgents.length > 0 ? (
                filteredAgents.map((a) => (
                  <tr key={a.id} className="hover:bg-bg-main/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-text-main">
                      {a.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-text-main leading-tight">{a.name}</div>
                        <div className="text-xs text-text-muted">{a.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{a.phone}</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center rounded-full border border-border-main bg-bg-main px-2.5 py-0.5 text-xs font-semibold text-text-main">
                        {a.zone}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-semibold">{a.cases}</td>
                    <td className="px-6 py-4 font-semibold text-text-main">{a.recovered}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className="w-12 bg-zinc-200 dark:bg-zinc-800 rounded-full h-1.5 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              a.successRate >= 85 ? "bg-emerald-500" : a.successRate >= 75 ? "bg-indigo-500" : "bg-amber-500"
                            }`}
                            style={{ width: `${a.successRate}%` }}
                          />
                        </div>
                        <span className="font-semibold text-text-main text-xs">{a.successRate}%</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                          a.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                        }`}
                      >
                        {a.status === "Active" ? t("Active") : t("Inactive")}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="px-6 py-10 text-center text-text-muted">
                    {t("noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agent Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowModal(false)}
          />
          {/* Content */}
          <div className="relative w-full max-w-md overflow-hidden rounded-2xl border border-border-main bg-bg-card shadow-2xl animate-scale-in">
            <div className="border-b border-border-main p-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-main">{t("addAgent")}</h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-bg-main hover:text-text-main transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleAddAgent} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  {t("agentName")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ramesh Gupta"
                  value={newAgent.name}
                  onChange={(e) => setNewAgent({ ...newAgent, name: e.target.value })}
                  className="w-full rounded-xl border border-border-main bg-bg-main px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  {t("email")}
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. ramesh@apexrecovery.com"
                  value={newAgent.email}
                  onChange={(e) => setNewAgent({ ...newAgent, email: e.target.value })}
                  className="w-full rounded-xl border border-border-main bg-bg-main px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  {t("contactNumber")}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98765 11223"
                  value={newAgent.phone}
                  onChange={(e) => setNewAgent({ ...newAgent, phone: e.target.value })}
                  className="w-full rounded-xl border border-border-main bg-bg-main px-4 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    {t("assignedZone")}
                  </label>
                  <select
                    value={newAgent.zone}
                    onChange={(e) => setNewAgent({ ...newAgent, zone: e.target.value })}
                    className="w-full rounded-xl border border-border-main bg-bg-main px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main cursor-pointer"
                  >
                    <option value="North Zone">North Zone</option>
                    <option value="South Zone">South Zone</option>
                    <option value="East Zone">East Zone</option>
                    <option value="West Zone">West Zone</option>
                    <option value="Central Zone">Central Zone</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                    {t("joinDate")}
                  </label>
                  <input
                    type="date"
                    required
                    value={newAgent.joinDate}
                    onChange={(e) => setNewAgent({ ...newAgent, joinDate: e.target.value })}
                    className="w-full rounded-xl border border-border-main bg-bg-main px-3 py-2.5 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main cursor-pointer"
                  />
                </div>
              </div>

              <div className="border-t border-border-main pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border-main px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-main cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-indigo-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-indigo-500 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                >
                  {t("saveAgent")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
