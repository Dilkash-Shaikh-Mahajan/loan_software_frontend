"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FiMessageSquare,
  FiTrendingUp,
  FiThumbsUp,
  FiClock,
  FiX,
  FiEye,
  FiChevronDown,
  FiDownload,
} from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { fetchFeedbacks } from "@/services/apiService";
import Loader from "@/components/Loader";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const CATEGORIES = [
  "Promise to pay",
  "Not contactable",
  "Request for OTC",
  "Refuse To pay",
  "Door Locked",
  "Referral to RCU",
  "Skip",
  "Already made payment",
  "call back later",
  "Visit to hirer for PTP Reminder",
  "health issue",
  "vehicle Theft",
  "Accident Vehicle",
  "Vehicle insurance claim",
  "Recon issue",
];

const statusCfg = {
  Resolved: { cls: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  Pending2: { cls: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  Archived: { cls: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" },
};

export default function CustomerFeedbackView() {
  const { t } = useApp();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);

  const { data: fetchedFeedbacks = [], isLoading } = useQuery({
    queryKey: ["feedbacks", filterCat, search, startDate, endDate],
    queryFn: () =>
      fetchFeedbacks({
        ...(filterCat !== "All" && { category: filterCat }),
        ...(search && { search }),
        ...(startDate && { startDate }),
        ...(endDate && { endDate }),
      }),
  });

  const totalCollected = fetchedFeedbacks?.reduce((a, r) => a + r.rating, 0);
  const avgRating = fetchedFeedbacks?.length
    ? (totalCollected / fetchedFeedbacks?.length).toFixed(0)
    : 0;
  const positive = fetchedFeedbacks?.filter(
    (r) => r.status === "Resolved",
  ).length;
  const positivePct = fetchedFeedbacks?.length
    ? ((positive / fetchedFeedbacks?.length) * 100).toFixed(0)
    : 0;
  const pending = fetchedFeedbacks?.filter(
    (r) => r.status === "Pending2",
  ).length;

  const resolve = (id) => console.log("Resolve feedback:", id);
  const archive = (id) => console.log("Archive feedback:", id);

  const getFormattedDate = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const getExportData = () => {
    return (
      fetchedFeedbacks?.map((r, i) => ({
        "Customer Name": r.customerId?.customerName || "N/A",
        "Loan Ref": r.customerId?.loan || "N/A",
        "Agent Name": r.agentId?.name || "N/A",
        Category: r.feedback || "N/A",
        Comment: r.agentNotes || "N/A",
        Date: new Date(r.visitDate || r.createdAt).toISOString().split("T")[0],
        Location: r.location?.lat
          ? `${r.location.lat}, ${r.location.lng}`
          : "N/A",
      })) || []
    );
  };

  const exportCSV = () => {
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(getExportData());
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `customer_feedback_${getFormattedDate()}.csv`,
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setExportDropdownOpen(false);
    });
  };

  const exportExcel = () => {
    import("xlsx").then((XLSX) => {
      const ws = XLSX.utils.json_to_sheet(getExportData());
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feedback");
      XLSX.writeFile(wb, `customer_feedback_${getFormattedDate()}.xlsx`);
      setExportDropdownOpen(false);
    });
  };

  const exportPDF = () => {
    Promise.all([import("jspdf"), import("jspdf-autotable")]).then(
      ([{ default: jsPDF }, autoTable]) => {
        const doc = new jsPDF();
        doc.text("Customer Feedback", 14, 15);

        const tableColumn = [
          "Customer Name",
          "Loan Ref",
          "Agent Name",
          "Category",
          "Date",
          "Location",
        ];
        const tableRows = [];

        fetchedFeedbacks?.forEach((r, i) => {
          const rowData = [
            r.customerId?.customerName || "N/A",
            r.customerId?.loan || "N/A",
            r.agentId?.name || "N/A",
            r.feedback || "N/A",
            new Date(r.visitDate || r.createdAt).toISOString().split("T")[0],
            r.location?.lat ? `${r.location.lat}, ${r.location.lng}` : "N/A",
          ];
          tableRows.push(rowData);
        });

        const autoTableFn = autoTable.default || autoTable;
        autoTableFn(doc, {
          head: [tableColumn],
          body: tableRows,
          startY: 20,
        });

        doc.save(`customer_feedback_${getFormattedDate()}.pdf`);
        setExportDropdownOpen(false);
      },
    );
  };
  console.log("fetchedFeedbacks", fetchedFeedbacks);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-text-main font-sans drop-shadow-sm">
            {t("feedbackTitle")}
          </h1>
          <p className="text-sm text-text-muted font-medium mt-1">
            {t("feedbackSub")}
          </p>
        </div>
      </div>

      {/* Table Panel */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-border-main p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col sm:flex-row gap-3 flex-1">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t("search")}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-4 text-sm outline-none focus:border-indigo-500 text-text-main flex-1 max-w-sm"
            />
            <select
              value={filterCat}
              onChange={(e) => setFilterCat(e.target.value)}
              className="rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none focus:border-indigo-500 text-text-main cursor-pointer"
            >
              <option value="All">{t("allCategories")}</option>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 relative">
            <button
              onClick={() => setExportDropdownOpen(!exportDropdownOpen)}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer"
            >
              <FiDownload className="h-4 w-4" />
              Export
              <FiChevronDown
                className={`h-4 w-4 transition-transform ${exportDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            {exportDropdownOpen && (
              <div className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-border-main bg-bg-card shadow-xl overflow-hidden z-20">
                <button
                  onClick={exportCSV}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportExcel}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors border-t border-border-main/50"
                >
                  Export as Excel
                </button>
                <button
                  onClick={exportPDF}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors border-t border-border-main/50"
                >
                  Export as PDF
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-max border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted">
                <th className="px-5 py-4">ID</th>
                <th className="px-5 py-4">{t("customerName")}</th>
                <th className="px-5 py-4">{t("loanRefIdFb")}</th>
                <th className="px-5 py-4">{t("Agent Name")}</th>
                <th className="px-5 py-4">{t("category")}</th>
                <th className="px-5 py-4 max-w-xs">{t("comment")}</th>
                <th className="px-5 py-4">{t("feedbackDate")}</th>
                <th className="px-5 py-4">{t("location")}</th>
                <th className="px-5 py-4">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {isLoading ? (
                <tr>
                  <td colSpan="9" className="px-5 py-16 text-center">
                    <Loader fullScreen={false} size="md" />
                    <p className="mt-2 text-sm text-text-muted">
                      {t("loading")}...
                    </p>
                  </td>
                </tr>
              ) : fetchedFeedbacks?.length > 0 ? (
                fetchedFeedbacks?.map((r, i) => {
                  console.log("r was", r);
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-bg-main/30 transition-colors"
                    >
                      <td
                        className="px-5 py-4 font-mono text-xs font-semibold text-text-main"
                        title={r.id}
                      >
                        {i + 1}
                      </td>
                      <td className="px-5 py-4 font-semibold text-text-main whitespace-nowrap">
                        {r.customerId?.customerName}
                      </td>
                      <td className="px-5 py-4 font-mono text-xs text-text-muted">
                        {r.customerId?.loan}
                      </td>
                      <td className="px-5 py-4 font-semibold text-text-main whitespace-nowrap">
                        {r.agentId?.name}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-xs font-semibold text-indigo-500">
                          {r.feedback}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-text-muted text-xs max-w-xs">
                        <p className="line-clamp-2">{r.agentNotes}</p>
                      </td>
                      <td className="px-5 py-4 text-text-muted whitespace-nowrap">
                        {
                          new Date(r.visitDate || r.createdAt)
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-5 py-4">
                        {r.location && r.location.lat && r.location.lng ? (
                          <a
                            href={`https://www.google.com/maps?q=${r.location.lat},${r.location.lng}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-1 text-xs font-semibold text-blue-600 hover:bg-blue-500/20 transition-colors"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                              />
                            </svg>
                            View Map
                          </a>
                        ) : (
                          <span className="text-xs text-text-muted">N/A</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex gap-1.5 flex-wrap">
                          {r.attachmentUrl && (
                            <button
                              onClick={() => setSelectedImage(r.attachmentUrl)}
                              className="btn-base rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-indigo-500/10 text-indigo-500 border border-indigo-500/20 hover:bg-indigo-500/20 cursor-pointer flex items-center"
                            >
                              <FiEye className="mr-1 h-3 w-3" /> View
                            </button>
                          )}
                          {r.status === "Pending2" && (
                            <>
                              <button
                                onClick={() => resolve(r.id)}
                                className="btn-base rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 hover:bg-emerald-500/20 cursor-pointer"
                              >
                                {t("resolveFeedback")}
                              </button>
                              <button
                                onClick={() => archive(r.id)}
                                className="btn-base rounded-lg px-2.5 py-1 text-[10px] font-semibold bg-zinc-500/10 text-zinc-400 border border-zinc-500/20 hover:bg-zinc-500/20 cursor-pointer"
                              >
                                {t("archiveFeedback")}
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td
                    colSpan="9"
                    className="px-5 py-10 text-center text-text-muted"
                  >
                    {t("noRecords")}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          />
          <div className="relative z-10 flex flex-col items-center justify-center max-w-4xl w-full max-h-[90vh] animate-scale-in">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-10 right-0 rounded-full bg-white/20 p-2 text-white hover:bg-white/40 z-20 cursor-pointer transition-colors backdrop-blur-md"
            >
              <FiX className="h-5 w-5" />
            </button>
            <img
              src={`${process.env.NEXT_PUBLIC_API_URL}${selectedImage}`}
              alt="Feedback Attachment"
              className="max-w-full max-h-[85vh] object-contain rounded-xl shadow-2xl"
            />
          </div>
        </div>
      )}
    </div>
  );
}
