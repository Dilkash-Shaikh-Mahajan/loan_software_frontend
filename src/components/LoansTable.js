"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiChevronRight, FiSearch, FiFilter, FiDownload, FiAlertCircle } from "react-icons/fi";

const recoveryStatusStyles = {
  Recovered:      "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  InProgress:     "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  PendingContact: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  Escalated:      "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

const overdueCls = (days) => {
  if (days >= 90) return "text-rose-500 font-bold";
  if (days >= 60) return "text-amber-500 font-semibold";
  return "text-text-muted";
};

const AGENTS = [
  "Ramesh Gupta", "Priya Nair", "Vikram Mehta",
  "Anjali Singh", "Karan Joshi", "Meena Iyer",
];

const initialCases = [
  { id: "LN-8488", borrower: "David Kim",          email: "d.kim@example.com",        avatar: "DK", type: "Personal",  amount: "₹6,65,000",    daysOverdue: 112, agent: "Ramesh Gupta",  recoveryStatus: "Escalated",      lastContact: "Jun 03, 2026" },
  { id: "LN-8483", borrower: "Mia Lewis",           email: "mia.l@example.com",        avatar: "ML", type: "Personal",  amount: "₹4,15,000",    daysOverdue: 99,  agent: "Priya Nair",   recoveryStatus: "InProgress",     lastContact: "Jun 05, 2026" },
  { id: "LN-8491", borrower: "Sophia Martinez",     email: "sophia.m@example.com",     avatar: "SM", type: "Personal",  amount: "₹10,00,000",   daysOverdue: 78,  agent: "Vikram Mehta", recoveryStatus: "PendingContact",  lastContact: "May 28, 2026" },
  { id: "LN-8486", borrower: "William Harris",      email: "w.harris@example.com",     avatar: "WH", type: "Personal",  amount: "₹12,50,000",   daysOverdue: 62,  agent: "Anjali Singh", recoveryStatus: "InProgress",     lastContact: "Jun 02, 2026" },
  { id: "LN-8495", borrower: "Rahul Sharma",        email: "rahul.s@example.com",      avatar: "RS", type: "Business",  amount: "₹28,75,000",   daysOverdue: 55,  agent: "Karan Joshi",  recoveryStatus: "InProgress",     lastContact: "Jun 04, 2026" },
  { id: "LN-8496", borrower: "Nisha Verma",         email: "nisha.v@example.com",      avatar: "NV", type: "Auto",      amount: "₹9,20,000",    daysOverdue: 48,  agent: "Meena Iyer",   recoveryStatus: "PendingContact", lastContact: "May 30, 2026" },
  { id: "LN-8497", borrower: "Suresh Patil",        email: "s.patil@example.com",      avatar: "SP", type: "Personal",  amount: "₹5,50,000",    daysOverdue: 35,  agent: "Ramesh Gupta", recoveryStatus: "InProgress",     lastContact: "Jun 06, 2026" },
  { id: "LN-8498", borrower: "Kavita Jain",         email: "k.jain@example.com",       avatar: "KJ", type: "Mortgage",  amount: "₹45,00,000",   daysOverdue: 30,  agent: "Priya Nair",   recoveryStatus: "Recovered",      lastContact: "Jun 07, 2026" },
  { id: "LN-8499", borrower: "Ajay Tiwari",         email: "ajay.t@example.com",       avatar: "AT", type: "Business",  amount: "₹18,60,000",   daysOverdue: 22,  agent: "Vikram Mehta", recoveryStatus: "Recovered",      lastContact: "Jun 07, 2026" },
  { id: "LN-8500", borrower: "Deepika Rao",         email: "deepika.r@example.com",    avatar: "DR", type: "Personal",  amount: "₹3,30,000",    daysOverdue: 118, agent: "Anjali Singh", recoveryStatus: "Escalated",      lastContact: "May 25, 2026" },
  { id: "LN-8501", borrower: "Manish Khanna",       email: "manish.k@example.com",     avatar: "MK", type: "Auto",      amount: "₹11,80,000",   daysOverdue: 75,  agent: "Karan Joshi",  recoveryStatus: "InProgress",     lastContact: "Jun 01, 2026" },
  { id: "LN-8502", borrower: "Sunita Deshpande",    email: "sunita.d@example.com",     avatar: "SD", type: "Personal",  amount: "₹7,00,000",    daysOverdue: 43,  agent: "Meena Iyer",   recoveryStatus: "PendingContact", lastContact: "May 29, 2026" },
];

export default function LoansTable() {
  const { t } = useApp();
  const [cases, setCases] = useState(initialCases);
  const [search, setSearch]         = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterAgent, setFilterAgent]   = useState("All");
  const [currentPage, setCurrentPage]   = useState(1);
  const itemsPerPage = 6;

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchQ = c.borrower.toLowerCase().includes(q) || c.id.toLowerCase().includes(q);
    const matchSt = filterStatus === "All" || c.recoveryStatus === filterStatus;
    const matchAg = filterAgent === "All" || c.agent === filterAgent;
    return matchQ && matchSt && matchAg;
  });

  const totalItems = filtered.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIdx = (activePage - 1) * itemsPerPage;
  const paginated = filtered.slice(startIdx, startIdx + itemsPerPage);

  return (
    <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col gap-4 border-b border-border-main p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold text-text-main">{t("recoveryCase")}</h3>
          <p className="text-xs text-text-muted mt-0.5">{t("recoveryCaseSub")}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] sm:flex-none">
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
            <input
              type="text" value={search}
              onChange={e => { setSearch(e.target.value); setCurrentPage(1); }}
              placeholder={t("searchBorrowerId")}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none focus:border-indigo-500 text-text-main"
            />
          </div>
          {/* Recovery Status filter */}
          <div className="relative">
            <select value={filterStatus}
              onChange={e => { setFilterStatus(e.target.value); setCurrentPage(1); }}
              className="appearance-none rounded-xl border border-border-main bg-bg-main py-2 pl-4 pr-10 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
              <option value="All">{t("allRecoveryStatuses")}</option>
              <option value="Recovered">{t("Recovered")}</option>
              <option value="InProgress">{t("InProgress")}</option>
              <option value="PendingContact">{t("PendingContact")}</option>
              <option value="Escalated">{t("Escalated")}</option>
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
          {/* Agent filter */}
          <div className="relative">
            <select value={filterAgent}
              onChange={e => { setFilterAgent(e.target.value); setCurrentPage(1); }}
              className="appearance-none rounded-xl border border-border-main bg-bg-main py-2 pl-4 pr-10 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
              <option value="All">{t("assignedAgent")}</option>
              {AGENTS.map(a => <option key={a} value={a}>{a}</option>)}
            </select>
            <FiFilter className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted pointer-events-none" />
          </div>
          <button className="flex items-center justify-center rounded-xl border border-border-main bg-bg-main p-2.5 text-text-main hover:opacity-90 transition-opacity cursor-pointer">
            <FiDownload className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
              <th className="px-5 py-4">{t("id")}</th>
              <th className="px-5 py-4">{t("borrower")}</th>
              <th className="px-5 py-4">{t("amount")}</th>
              <th className="px-5 py-4">{t("daysOverdue")}</th>
              <th className="px-5 py-4">{t("assignedAgent")}</th>
              <th className="px-5 py-4">{t("recoveryStatus")}</th>
              <th className="px-5 py-4">{t("lastContact")}</th>
              <th className="px-5 py-4"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border-main">
            {paginated.length > 0 ? paginated.map(c => (
              <tr key={c.id} className="hover:bg-bg-main/30 transition-colors">
                <td className="px-5 py-4 font-mono text-xs font-semibold text-text-main">{c.id}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/10 to-purple-500/10 text-xs font-semibold text-indigo-600">
                      {c.avatar}
                    </div>
                    <div>
                      <div className="font-semibold text-text-main leading-tight">{c.borrower}</div>
                      <div className="text-xs text-text-muted">{c.email}</div>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 font-semibold text-text-main">{c.amount}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1.5">
                    {c.daysOverdue >= 90 && <FiAlertCircle className="h-3.5 w-3.5 text-rose-500 flex-shrink-0" />}
                    <span className={`text-sm ${overdueCls(c.daysOverdue)}`}>{c.daysOverdue}d</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-6 w-6 flex-shrink-0 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-[10px] font-bold text-white">
                      {c.agent.split(" ").map(n => n[0]).join("")}
                    </div>
                    <span className="text-sm text-text-main font-medium">{c.agent}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${recoveryStatusStyles[c.recoveryStatus]}`}>
                    {t(c.recoveryStatus)}
                  </span>
                </td>
                <td className="px-5 py-4 text-text-muted text-xs">{c.lastContact}</td>
                <td className="px-5 py-4 text-right">
                  <button className="text-text-muted hover:text-text-main transition-colors cursor-pointer">
                    <FiChevronRight className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="8" className="px-5 py-10 text-center text-text-muted">{t("noRecords")}</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalItems > 0 && (
        <div className="flex flex-col gap-4 border-t border-border-main p-5 sm:flex-row sm:items-center sm:justify-between bg-bg-card">
          <p className="text-xs text-text-muted">
            Showing <span className="font-semibold text-text-main">{startIdx + 1}</span> to{" "}
            <span className="font-semibold text-text-main">{Math.min(startIdx + itemsPerPage, totalItems)}</span> of{" "}
            <span className="font-semibold text-text-main">{totalItems}</span> cases
          </p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={activePage === 1}
              className="rounded-lg border border-border-main bg-bg-main px-3 py-1.5 text-xs font-semibold text-text-main hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
              Previous
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} onClick={() => setCurrentPage(p)}
                className={`rounded-lg h-7 w-7 flex items-center justify-center text-xs font-semibold transition-all cursor-pointer ${
                  activePage === p ? "bg-indigo-600 text-white" : "border border-border-main text-text-muted hover:text-text-main"
                }`}>{p}</button>
            ))}
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={activePage === totalPages}
              className="rounded-lg border border-border-main bg-bg-main px-3 py-1.5 text-xs font-semibold text-text-main hover:opacity-90 disabled:opacity-50 disabled:pointer-events-none cursor-pointer">
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
