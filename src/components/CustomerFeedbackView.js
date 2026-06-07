"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiMessageSquare, FiTrendingUp, FiThumbsUp, FiClock, FiPlus, FiX, FiCheck } from "react-icons/fi";

const CATEGORIES = ["Service", "Product", "Process", "Staff"];

const initial = [
  { id: "FB-1001", customer: "David Kim",        loanId: "LN-8488", rating: 45000, category: "Product",  comment: "Met borrower, collected partial payment. Promised to clear remaining by next week.", date: "2026-06-06", status: "Resolved" },
  { id: "FB-1002", customer: "Sophia Martinez",  loanId: "LN-8491", rating: 0,     category: "Process",  comment: "Borrower promised to pay online on Jun 15. Standard commitment signed.",               date: "2026-06-05", status: "Pending2"  },
  { id: "FB-1003", customer: "Alexander Wright", loanId: "LN-8492", rating: 115000,category: "Service",  comment: "Defaulter cleared the entire overdue amount via bank draft. Receipt generated.",       date: "2026-06-03", status: "Resolved" },
  { id: "FB-1004", customer: "Rahul Sharma",     loanId: "LN-8495", rating: 0,     category: "Staff",    comment: "Met borrower. Refused to cooperate or pay. Direct escalation requested.",             date: "2026-05-28", status: "Archived" },
  { id: "FB-1005", customer: "Mia Lewis",        loanId: "LN-8483", rating: 60000, category: "Product",  comment: "Collected cash. Agent deposited in branch. Case updated.",                             date: "2026-05-24", status: "Resolved" },
  { id: "FB-1006", customer: "William Harris",   loanId: "LN-8486", rating: 0,     category: "Process",  comment: "Promise to pay verified. Post-dated check collected for Jun 10.",                      date: "2026-05-20", status: "Pending2"  },
];

const statusCfg = {
  Resolved: { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  Pending2: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  Archived: { cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

export default function CustomerFeedbackView() {
  const { t } = useApp();
  const [records, setRecords] = useState(initial);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [modal, setModal] = useState(false);

  // Form
  const [fName,    setFName]    = useState("");
  const [fLoanId,  setFLoanId]  = useState("");
  const [fRating,  setFRating]  = useState(0);
  const [fCat,     setFCat]     = useState("Product");
  const [fComment, setFComment] = useState("");

  const filtered = records.filter(r => {
    const q = search.toLowerCase();
    return (
      (r.customer.toLowerCase().includes(q) || r.loanId.toLowerCase().includes(q) || r.comment.toLowerCase().includes(q)) &&
      (filterCat === "All" || r.category === filterCat)
    );
  });

  const totalCollected = records.reduce((a, r) => a + r.rating, 0);
  const avgRating      = records.length ? (totalCollected / records.length).toFixed(0) : 0;
  const positive       = records.filter(r => r.status === "Resolved").length;
  const positivePct    = records.length ? ((positive / records.length) * 100).toFixed(0) : 0;
  const pending        = records.filter(r => r.status === "Pending2").length;

  const handleSubmit = (e) => {
    e.preventDefault();
    const parsedAmt = Number(fRating) || 0;
    const isCollected = parsedAmt > 0;
    const defaultStatus = isCollected ? "Resolved" : fCat === "Staff" ? "Archived" : "Pending2";

    setRecords(prev => [{
      id: `FB-${Math.floor(1000 + Math.random() * 9000)}`,
      customer: fName, loanId: fLoanId,
      rating: parsedAmt, category: fCat,
      comment: fComment, date: new Date().toISOString().split("T")[0],
      status: defaultStatus,
    }, ...prev]);
    setModal(false);
    setFName(""); setFLoanId(""); setFRating(0); setFCat("Product"); setFComment("");
  };

  const resolve = (id) => setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Resolved" } : r));
  const archive = (id) => setRecords(prev => prev.map(r => r.id === id ? { ...r, status: "Archived" } : r));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main">{t("feedbackTitle")}</h1>
          <p className="text-sm text-text-muted mt-0.5">{t("feedbackSub")}</p>
        </div>
        <button onClick={() => setModal(true)}
          className="btn-base flex items-center gap-2 rounded-xl bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-indigo-600/20 cursor-pointer hover:bg-indigo-500 transition-all hover:scale-[1.02] active:scale-[0.98]">
          <FiPlus className="h-4 w-4" /> {t("addFeedback")}
        </button>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 gap-5 lg:grid-cols-4">
        {[
          { label: t("totalFeedback"),  val: records.length,                               icon: FiMessageSquare, color: "text-indigo-500" },
          { label: t("avgRating"),      val: `₹${Number(avgRating).toLocaleString()}`,      icon: FiTrendingUp,    color: "text-amber-500" },
          { label: t("positiveRate"),   val: `${positivePct}%`,                            icon: FiThumbsUp,      color: "text-emerald-500" },
          { label: t("pendingReviews"), val: pending,                                      icon: FiClock,         color: "text-rose-500" },
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

      {/* Outcomes Distribution */}
      <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm">
        <h2 className="text-sm font-bold text-text-main mb-4">{t("category")} Breakdown</h2>
        <div className="space-y-3">
          {[
            { label: "Resolved", translationKey: "Resolved", colorCls: "bg-emerald-500" },
            { label: "Pending2", translationKey: "Pending2", colorCls: "bg-amber-400" },
            { label: "Archived", translationKey: "Archived", colorCls: "bg-zinc-400" },
          ].map(outcome => {
            const count = records.filter(r => r.status === outcome.label).length;
            const pct = records.length ? (count / records.length) * 100 : 0;
            return (
              <div key={outcome.label} className="flex items-center gap-3">
                <div className="w-28 text-xs text-text-muted font-medium">
                  {t(outcome.translationKey)}
                </div>
                <div className="flex-1 h-2 rounded-full bg-border-main overflow-hidden">
                  <div
                    className={`h-full rounded-full ${outcome.colorCls} transition-all duration-500`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
                <span className="text-xs text-text-muted w-6 text-right font-semibold">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Table Panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-main p-5 sm:flex-row sm:items-center sm:justify-between">
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder={t("search")}
            className="rounded-xl border border-border-main bg-bg-main py-2 px-4 text-sm outline-none focus:border-indigo-500 text-text-main flex-1 max-w-sm" />
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
            <option value="All">{t("allCategories")}</option>
            {CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">{t("customerName")}</th>
                <th className="px-5 py-4">{t("loanRefIdFb")}</th>
                <th className="px-5 py-4">{t("rating")}</th>
                <th className="px-5 py-4">{t("category")}</th>
                <th className="px-5 py-4 max-w-xs">{t("comment")}</th>
                <th className="px-5 py-4">{t("feedbackDate")}</th>
                <th className="px-5 py-4">{t("feedbackStatus")}</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {filtered.length > 0 ? filtered.map(r => (
                <tr key={r.id} className="hover:bg-bg-main/30 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-semibold text-text-main">{r.id}</td>
                  <td className="px-5 py-4 font-semibold text-text-main whitespace-nowrap">{r.customer}</td>
                  <td className="px-5 py-4 font-mono text-xs text-text-muted">{r.loanId}</td>
                  <td className="px-5 py-4 font-semibold text-text-main whitespace-nowrap">
                    {r.rating > 0 ? `₹${r.rating.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-4">
                    <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500">
                      {t(r.category)}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-text-muted text-xs max-w-xs">
                    <p className="line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="px-5 py-4 text-text-muted whitespace-nowrap">{r.date}</td>
                  <td className="px-5 py-4">
                    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold ${statusCfg[r.status].cls}`}>
                      {t(r.status)}
                    </span>
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex gap-1.5">
                      {r.status === "Pending2" && (
                        <>
                          <button onClick={() => resolve(r.id)}
                            className="btn-base rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer">
                            {t("resolveFeedback")}
                          </button>
                          <button onClick={() => archive(r.id)}
                            className="btn-base rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 cursor-pointer">
                            {t("archiveFeedback")}
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="9" className="px-5 py-10 text-center text-text-muted">{t("noRecords")}</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Visit Modal */}
      {modal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setModal(false)} />
          <div className="relative z-10 w-full max-w-lg rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl text-text-main animate-scale-in">
            <div className="flex items-center justify-between border-b border-border-main pb-4 mb-6">
              <h3 className="text-lg font-semibold">{t("addFeedback")}</h3>
              <button onClick={() => setModal(false)} className="btn-base rounded-xl p-1.5 hover:bg-bg-main text-text-muted cursor-pointer">
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("customerName")}</label>
                  <input required type="text" value={fName} onChange={e => setFName(e.target.value)} placeholder="Defaulter Name"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("loanRefIdFb")}</label>
                  <input required type="text" value={fLoanId} onChange={e => setFLoanId(e.target.value)} placeholder="LN-XXXX"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("category")}</label>
                  <select value={fCat} onChange={e => setFCat(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer">
                    {CATEGORIES.map(c => <option key={c} value={c}>{t(c)}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("rating")}</label>
                  <input type="number" min="0" value={fRating} onChange={e => setFRating(e.target.value)} placeholder="0"
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("comment")}</label>
                <textarea required rows={3} value={fComment} onChange={e => setFComment(e.target.value)}
                  placeholder={t("feedbackPlaceholder")}
                  className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none focus:border-indigo-500 text-text-main resize-none" />
              </div>
              <div className="flex gap-4 pt-4 border-t border-border-main">
                <button type="button" onClick={() => setModal(false)}
                  className="btn-base flex-1 rounded-2xl border border-border-main py-3 text-sm font-semibold hover:bg-bg-main cursor-pointer text-text-main">
                  {t("cancel")}
                </button>
                <button type="submit"
                  className="btn-base flex-1 rounded-2xl bg-indigo-600 py-3 text-sm font-semibold text-white cursor-pointer flex items-center justify-center gap-2 hover:bg-indigo-500">
                  <FiCheck className="h-4 w-4" /> {t("submitFeedback")}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
