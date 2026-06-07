"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiPlus, FiSearch, FiDollarSign, FiCheckCircle, FiClock, FiAlertCircle, FiX, FiFilter } from "react-icons/fi";

const initialPayments = [
  { id: "TX-9284", loanId: "LN-8492", borrower: "Alexander Wright", amount: 104167, method: "Bank Transfer", status: "Successful", date: "2026-06-06" },
  { id: "TX-9283", loanId: "LN-8490", borrower: "Marcus Chen", amount: 203900, method: "ACH Debits", status: "Successful", date: "2026-06-05" },
  { id: "TX-9282", loanId: "LN-8489", borrower: "Emily Taylor", amount: 70833, method: "Card Payment", status: "Successful", date: "2026-06-04" },
  { id: "TX-9281", loanId: "LN-8491", borrower: "Sophia Martinez", amount: 37500, method: "Bank Transfer", status: "Processing", date: "2026-06-03" },
  { id: "TX-9280", loanId: "LN-8488", borrower: "David Kim", amount: 51667, method: "Card Payment", status: "Failed", date: "2026-05-24" },
];

const statusStyles = {
  Successful: "bg-emerald-500/10 text-emerald-550 border-emerald-500/20",
  Processing: "bg-amber-500/10 text-amber-550 border-amber-500/20",
  Failed: "bg-rose-500/10 text-rose-550 border-rose-500/20",
};

export default function RepaymentsView() {
  const { t } = useApp();
  const [payments, setPayments] = useState(initialPayments);
  const [search, setSearch] = useState("");
  const [filterMethod, setFilterMethod] = useState("All");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [loanId, setLoanId] = useState("");
  const [borrower, setBorrower] = useState("");
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("Bank Transfer");

  const handleRecordRepayment = (e) => {
    e.preventDefault();
    if (!loanId || !borrower || !amount) return;

    const newPayment = {
      id: `TX-${Math.floor(9000 + Math.random() * 999)}`,
      loanId,
      borrower,
      amount: parseFloat(amount),
      method,
      status: "Successful",
      date: new Date().toISOString().split("T")[0],
    };

    setPayments([newPayment, ...payments]);
    setIsModalOpen(false);

    // Reset Form
    setLoanId("");
    setBorrower("");
    setAmount("");
    setMethod("Bank Transfer");
  };

  const translateMethod = (m) => {
    if (m === "Bank Transfer") return t("bankTransfer");
    if (m === "ACH Debits") return t("achDebits");
    if (m === "Card Payment") return t("cardPayment");
    return m;
  };

  const filteredPayments = payments.filter((payment) => {
    const matchesSearch =
      payment.borrower.toLowerCase().includes(search.toLowerCase()) ||
      payment.loanId.toLowerCase().includes(search.toLowerCase()) ||
      payment.id.toLowerCase().includes(search.toLowerCase());
    const matchesMethod = filterMethod === "All" || payment.method === filterMethod;
    return matchesSearch && matchesMethod;
  });

  const totalCollected = payments
    .filter(p => p.status === "Successful")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("repaymentHistory")}
          </h1>
          <p className="text-sm text-text-muted font-sans">
            {t("repaymentHistorySub")}
          </p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center justify-center gap-2 rounded-xl bg-indigo-650 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-555 transition-colors shadow-sm shadow-indigo-650/15 cursor-pointer"
        >
          <FiPlus className="h-5 w-5" />
          {t("recordRepay")}
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 animate-fade-in">
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("totalReceived")}</span>
            <FiDollarSign className="h-4 w-4 text-emerald-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">₹{totalCollected.toLocaleString("en-IN")}</p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("settledCleared")}</span>
            <FiCheckCircle className="h-4 w-4 text-indigo-550" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">
            {payments.filter(p => p.status === "Successful").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("processingQueue")}</span>
            <FiClock className="h-4 w-4 text-amber-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">
            {payments.filter(p => p.status === "Processing").length}
          </p>
        </div>
        <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">{t("failedReceipts")}</span>
            <FiAlertCircle className="h-4 w-4 text-rose-500" />
          </div>
          <p className="mt-2 text-xl font-bold text-text-main">
            {payments.filter(p => p.status === "Failed").length}
          </p>
        </div>
      </div>

      {/* Main Ledger panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors">
        {/* Filter bar */}
        <div className="flex flex-col gap-4 border-b border-border-main p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative flex-1 min-w-[240px] sm:flex-none">
            <span className="absolute inset-y-0 left-3 flex items-center text-text-muted">
              <FiSearch className="h-4 w-4" />
            </span>
            <input
              type="text"
              placeholder={t("searchTxLoanName")}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-xl border border-border-main bg-bg-main py-2 pl-9 pr-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
            />
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-text-muted font-semibold uppercase">{t("paymentMode")}</span>
            <select
              value={filterMethod}
              onChange={(e) => setFilterMethod(e.target.value)}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-4 text-sm outline-none transition-all focus:border-indigo-500 text-text-main cursor-pointer"
            >
              <option value="All">{t("allMethods")}</option>
              <option value="Bank Transfer">{t("bankTransfer")}</option>
              <option value="ACH Debits">{t("achDebits")}</option>
              <option value="Card Payment">{t("cardPayment")}</option>
            </select>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-6 py-4">{t("txId")}</th>
                <th className="px-6 py-4">{t("loanRefId")}</th>
                <th className="px-6 py-4">{t("borrower")}</th>
                <th className="px-6 py-4">{t("amountPaid")}</th>
                <th className="px-6 py-4">{t("paymentMode")}</th>
                <th className="px-6 py-4">{t("status")}</th>
                <th className="px-6 py-4">{t("date")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-bg-main/30 transition-colors">
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-text-main">
                      {payment.id}
                    </td>
                    <td className="px-6 py-4 font-mono text-xs text-text-muted">
                      {payment.loanId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-text-main leading-tight">
                      {payment.borrower}
                    </td>
                    <td className="px-6 py-4 font-semibold text-text-main">
                      ₹{payment.amount.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 text-text-muted">{translateMethod(payment.method)}</td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${statusStyles[payment.status]}`}>
                        {t(payment.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{payment.date}</td>
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

      {/* Record Repayment Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div className="relative w-full max-w-lg rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl animate-scale-in text-text-main z-10 transition-colors duration-300">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <h3 className="text-lg font-semibold">{t("recordRepayReceipt")}</h3>
              <button onClick={() => setIsModalOpen(false)} className="rounded-xl p-1.5 hover:bg-bg-main text-text-muted hover:text-text-main transition-colors cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleRecordRepayment} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("loanRefId")}</label>
                  <input
                    type="text"
                    required
                    value={loanId}
                    onChange={(e) => setLoanId(e.target.value)}
                    placeholder="LN-8492"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("borrowerName")}</label>
                  <input
                    type="text"
                    required
                    value={borrower}
                    onChange={(e) => setBorrower(e.target.value)}
                    placeholder="Alexander Wright"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("paymentMode")}</label>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main cursor-pointer"
                  >
                    <option value="Bank Transfer">{t("bankTransfer")}</option>
                    <option value="ACH Debits">{t("achDebits")}</option>
                    <option value="Card Payment">{t("cardPayment")}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("amountPaid")}</label>
                  <input
                    type="number"
                    required
                    min="1"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="1250"
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
                  {t("confirmRepay")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
