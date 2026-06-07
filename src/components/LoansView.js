"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiPlus, FiSearch, FiDollarSign, FiPercent, FiClock, FiAlertCircle, FiX, FiCheck } from "react-icons/fi";

const initialRegistry = [
  { id: "LN-8492", borrower: "Alexander Wright", email: "alexander@example.com", type: "Business", amount: 3750000, rate: 6.8, term: 36, status: "Approved", date: "2026-06-06" },
  { id: "LN-8491", borrower: "Sophia Martinez", email: "sophia.m@example.com", type: "Personal", amount: 1000000, rate: 8.5, term: 12, status: "Pending", date: "2026-06-05" },
  { id: "LN-8490", borrower: "Marcus Chen", email: "marcus.c@example.com", type: "Mortgage", amount: 23300000, rate: 5.4, term: 180, status: "Approved", date: "2026-06-03" },
  { id: "LN-8489", borrower: "Emily Taylor", email: "emily.t@example.com", type: "Auto", amount: 2375000, rate: 7.2, term: 48, status: "Approved", date: "2026-05-28" },
  { id: "LN-8488", borrower: "David Kim", email: "d.kim@example.com", type: "Personal", amount: 665000, rate: 9.0, term: 12, status: "Overdue", date: "2026-05-24" },
];

const statusStyles = {
  Approved: "bg-emerald-500/10 text-emerald-550 border-emerald-500/20",
  Pending: "bg-amber-500/10 text-amber-550 border-amber-500/20",
  Overdue: "bg-rose-500/10 text-rose-550 border-rose-500/20",
  Rejected: "bg-zinc-500/10 text-text-muted border-zinc-550/20",
};

export default function LoansView() {
  const { t } = useApp();
  const [loans, setLoans] = useState(initialRegistry);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [borrower, setBorrower] = useState("");
  const [email, setEmail] = useState("");
  const [type, setType] = useState("Personal");
  const [amount, setAmount] = useState("");
  const [rate, setRate] = useState("");
  const [term, setTerm] = useState("");

  const handleCreateLoan = (e) => {
    e.preventDefault();
    if (!borrower || !email || !amount || !rate || !term) return;

    const newLoan = {
      id: `LN-${Math.floor(1000 + Math.random() * 9000)}`,
      borrower,
      email,
      type,
      amount: parseFloat(amount),
      rate: parseFloat(rate),
      term: parseInt(term),
      status: "Pending",
      date: new Date().toISOString().split("T")[0],
    };

    setLoans([newLoan, ...loans]);
    setIsModalOpen(false);

    // Reset Form
    setBorrower("");
    setEmail("");
    setType("Personal");
    setAmount("");
    setRate("");
    setTerm("");
  };

  const filteredLoans = loans.filter((loan) => {
    const matchesSearch =
      loan.borrower.toLowerCase().includes(search.toLowerCase()) ||
      loan.id.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || loan.type === filterType;
    return matchesSearch && matchesType;
  });

  const totals = loans.reduce((acc, curr) => acc + curr.amount, 0);
  const activeCount = loans.filter(l => l.status === "Approved").length;
  const pendingCount = loans.filter(l => l.status === "Pending").length;

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("loansRegistry")}
          </h1>
          <p className="text-sm text-text-muted font-sans">
            {t("loansRegistrySub")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-550 transition-colors shadow-sm shadow-indigo-650/15 cursor-pointer"
        >
          <FiPlus className="h-5 w-5" />
          {t("newLoanApp")}
        </button>
      </div>

      {/* Mini Stats Row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("totalCapitalOut")}</span>
            <FiDollarSign className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">₹{totals.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("approvedLoans")}</span>
            <FiCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("pendingReview")}</span>
            <FiClock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{pendingCount}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("riskAssessment")}</span>
            <FiAlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{t("lowRisk")}</p>
        </div>
      </div>

      {/* Main Table Panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors">
        {/* Table Filters */}
        <div className="flex flex-col gap-4 border-b border-border-main p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 min-w-[240px] sm:flex-none">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={t("searchIdBorrower")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-semibold uppercase">{t("loanType")}</span>
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-4 text-sm outline-none transition-all focus:border-indigo-500 text-text-main cursor-pointer"
            >
              <option value="All">{t("all")} {t("loanType")}</option>
              <option value="Personal">{t("Personal")}</option>
              <option value="Business">{t("Business")}</option>
              <option value="Mortgage">{t("Mortgage")}</option>
              <option value="Auto">{t("Auto")}</option>
            </select>
          </div>
        </div>

        {/* Table Layout */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("id")}</th>
                <th className="px-6 py-4">{t("borrower")}</th>
                <th className="px-6 py-4">{t("loanType")}</th>
                <th className="px-6 py-4">{t("amount")}</th>
                <th className="px-6 py-4">{t("rate")}</th>
                <th className="px-6 py-4">{t("term")}</th>
                <th className="px-6 py-4">{t("status")}</th>
                <th className="px-6 py-4">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredLoans.length > 0 ? (
                filteredLoans.map((loan) => (
                  <tr key={loan.id} className="hover:bg-bg-main/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-text-main">
                      {loan.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-text-main leading-tight">{loan.borrower}</div>
                        <div className="text-xs text-text-muted">{loan.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{t(loan.type)}</td>
                    <td className="px-6 py-4 font-semibold text-text-main">
                      ₹{loan.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-text-muted">{loan.rate}%</td>
                    <td className="px-6 py-4 text-text-muted">{loan.term} mos</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[loan.status]}`}>
                        {t(loan.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{loan.date}</td>
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

      {/* Modal Popup */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl animate-scale-in text-text-main z-10 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <h3 className="text-lg font-semibold">{t("newLoanApp")}</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-1.5 hover:bg-bg-main text-text-muted hover:text-text-main transition-colors cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLoan} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("borrowerName")}</label>
                  <input
                    type="text"
                    required
                    value={borrower}
                    onChange={(e) => setBorrower(e.target.value)}
                    placeholder="John Doe"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("email")}</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("loanType")}</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main cursor-pointer"
                  >
                    <option value="Personal">{t("Personal")}</option>
                    <option value="Business">{t("Business")}</option>
                    <option value="Mortgage">{t("Mortgage")}</option>
                    <option value="Auto">{t("Auto")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("principalAmt")}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="25000"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("interestRate")}</label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    min="0.1"
                    value={rate}
                    onChange={(e) => setRate(e.target.value)}
                    placeholder="7.25"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("termDuration")}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={term}
                    onChange={(e) => setTerm(e.target.value)}
                    placeholder="36"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4 border-t border-border-main mt-6">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 rounded-2xl border border-border-main py-3 text-sm font-semibold hover:bg-bg-main transition-colors cursor-pointer"
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-2xl bg-indigo-650 py-3 text-sm font-semibold text-white hover:bg-indigo-550 transition-colors shadow-xl shadow-indigo-650/10 cursor-pointer"
                >
                  {t("submitApp")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
