"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiSearch, FiUsers, FiUserCheck, FiAward, FiUserPlus } from "react-icons/fi";

const initialCustomers = [
  { id: "CUST-3921", name: "Alexander Wright", email: "alexander@example.com", phone: "+91 98765 43210", score: 745, loans: 1, debt: "₹37,50,000", status: "Active" },
  { id: "CUST-3922", name: "Sophia Martinez", email: "sophia.m@example.com", phone: "+91 87654 32109", score: 680, loans: 1, debt: "₹10,00,000", status: "Active" },
  { id: "CUST-3923", name: "Marcus Chen", email: "marcus.c@example.com", phone: "+91 76543 21098", score: 810, loans: 1, debt: "₹2,33,00,000", status: "Active" },
  { id: "CUST-3924", name: "Emily Taylor", email: "emily.t@example.com", phone: "+91 65432 10987", score: 720, loans: 0, debt: "₹0", status: "Inactive" },
  { id: "CUST-3925", name: "David Kim", email: "d.kim@example.com", phone: "+91 54321 09876", score: 590, loans: 1, debt: "₹6,65,000", status: "Active" },
];

const scoreColors = (score) => {
  if (score >= 740) return "text-emerald-500 bg-emerald-500/10 border-emerald-500/20";
  if (score >= 670) return "text-indigo-500 bg-indigo-500/10 border-indigo-500/20";
  if (score >= 580) return "text-amber-500 bg-amber-500/10 border-amber-500/20";
  return "text-rose-500 bg-rose-500/10 border-rose-500/20";
};

export default function CustomersView() {
  const { t } = useApp();
  const [customers, setCustomers] = useState(initialCustomers);
  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    const val = e.target.value;
    setSearch(val);
    setCustomers(
      initialCustomers.filter(
        (c) =>
          c.name.toLowerCase().includes(val.toLowerCase()) ||
          c.email.toLowerCase().includes(val.toLowerCase()) ||
          c.id.toLowerCase().includes(val.toLowerCase())
      )
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
          {t("borrowerDir")}
        </h1>
        <p className="text-sm text-text-muted font-sans">
          {t("borrowerDirSub")}
        </p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("allBorrowers")}</span>
            <FiUsers className="h-4 w-4 text-indigo-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{customers.length}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("activeAccounts")}</span>
            <FiUserCheck className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">
            {customers.filter(c => c.status === "Active").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("avgScore")}</span>
            <FiAward className="h-4 w-4 text-purple-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{t("avgScoreValue")}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("newBorrowers")}</span>
            <FiUserPlus className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">{t("newBorrowersValue")}</p>
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
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("custId")}</th>
                <th className="px-6 py-4">{t("borrowerName")}</th>
                <th className="px-6 py-4">{t("phoneNum")}</th>
                <th className="px-6 py-4">{t("creditScore")}</th>
                <th className="px-6 py-4">{t("activeAgreements")}</th>
                <th className="px-6 py-4">{t("totalDebtBal")}</th>
                <th className="px-6 py-4">{t("accStatus")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {customers.length > 0 ? (
                customers.map((c) => (
                  <tr key={c.id} className="hover:bg-bg-main/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-text-main">
                      {c.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="font-semibold text-text-main leading-tight">{c.name}</div>
                        <div className="text-xs text-text-muted">{c.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{c.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${scoreColors(c.score)}`}>
                        {c.score}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted font-semibold">{c.loans}</td>
                    <td className="px-6 py-4 font-semibold text-text-main">{c.debt}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${
                        c.status === "Active"
                          ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                          : "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
                      }`}>
                        {t(c.status)}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-text-muted">
                    {t("noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
