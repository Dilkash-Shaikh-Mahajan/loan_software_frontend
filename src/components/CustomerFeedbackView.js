"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiX, FiEye, FiChevronDown, FiDownload } from "react-icons/fi";
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

export default function CustomerFeedbackView() {
  const { t } = useApp();

  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [exportDropdownOpen, setExportDropdownOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const addressCache = useState(() => new Map())[0];

  const getAddressFromCoords = async (lat, lng) => {
    if (!lat || !lng) return "N/A";
    const cacheKey = `${lat},${lng}`;
    if (addressCache.has(cacheKey)) {
      return addressCache.get(cacheKey);
    }
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1&accept-language=hi,en`,
        {
          headers: {
            "User-Agent": "Loan Software",
          },
        }
      );
      if (!response.ok) return "N/A";
      const data = await response.json();
      const result = data?.display_name || "Address not found";
      addressCache.set(cacheKey, result);
      return result;
    } catch (error) {
      console.error("Reverse geocoding failed:", error);
      return "N/A";
    }
  };

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

  const getFormattedDate = () => {
    const d = new Date();
    return `${String(d.getDate()).padStart(2, "0")}-${String(d.getMonth() + 1).padStart(2, "0")}-${d.getFullYear()}`;
  };

  const getExportDataWithAddresses = async () => {
    if (!fetchedFeedbacks || fetchedFeedbacks.length === 0) return [];

    return await Promise.all(
      fetchedFeedbacks.map(async (r) => {
        let address = "N/A";
        if (r.location?.lat && r.location?.lng) {
          address = await getAddressFromCoords(r.location.lat, r.location.lng);
        }
        return {
          "Customer Name": r.customerId?.customerName || "N/A",
          "Loan Ref": r.customerId?.loan || "N/A",
          "Agent Name": r.agentId?.name || "N/A",
          Category: r.feedback || "N/A",
          Comment: r.agentNotes || "N/A",
          Date: new Date(r.visitDate || r.createdAt).toISOString().split("T")[0],
          Location: r.location?.lat
            ? `${r.location.lat}, ${r.location.lng}`
            : "N/A",
          Address: address,
        };
      })
    );
  };

  const exportCSV = async () => {
    setIsExporting(true);
    try {
      const data = await getExportDataWithAddresses();
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute(
        "download",
        `customer_feedback_${getFormattedDate()}.csv`
      );
      link.style.visibility = "hidden";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("CSV Export error:", err);
    } finally {
      setIsExporting(false);
      setExportDropdownOpen(false);
    }
  };

  const exportExcel = async () => {
    setIsExporting(true);
    try {
      const data = await getExportDataWithAddresses();
      const XLSX = await import("xlsx");
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Feedback");
      XLSX.writeFile(wb, `customer_feedback_${getFormattedDate()}.xlsx`);
    } catch (err) {
      console.error("Excel Export error:", err);
    } finally {
      setIsExporting(false);
      setExportDropdownOpen(false);
    }
  };

  const exportPDF = async () => {
    setIsExporting(true);
    try {
      const data = await getExportDataWithAddresses();
      const [{ default: jsPDF }, { default: html2canvas }] = await Promise.all([
        import("jspdf"),
        import("html2canvas"),
      ]);

      const container = document.createElement("div");
      container.style.position = "absolute";
      container.style.left = "-9999px";
      container.style.top = "-9999px";
      container.style.width = "1100px";
      container.style.backgroundColor = "#ffffff";
      container.style.padding = "20px";

      container.innerHTML = `
        <div style="color: #0f172a; font-family: system-ui, -apple-system, sans-serif;">
          <h2 style="font-size: 22px; font-weight: 700; margin-bottom: 4px; color: #1e1b4b;">Customer Feedback Report</h2>
          <p style="font-size: 12px; color: #64748b; margin-bottom: 16px;">Exported on: ${getFormattedDate()}</p>
          <table style="width: 100%; border-collapse: collapse; font-size: 11px; text-align: left; table-layout: fixed;">
            <thead>
              <tr style="background-color: #1e293b; color: #ffffff;">
                <th style="padding: 8px; border: 1px solid #334155; width: 12%;">Customer Name</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 10%;">Loan Ref</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 11%;">Agent Name</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 10%;">Category</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 18%;">Comment</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 8%;">Date</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 11%;">Location</th>
                <th style="padding: 8px; border: 1px solid #334155; width: 20%;">Address</th>
              </tr>
            </thead>
            <tbody>
              ${data
                .map(
                  (item, idx) => `
                <tr style="background-color: ${idx % 2 === 0 ? "#ffffff" : "#f8fafc"}; color: #1e293b;">
                  <td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: 600; word-break: break-word;">${item["Customer Name"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Loan Ref"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Agent Name"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Category"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Comment"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Date"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Location"]}</td>
                  <td style="padding: 8px; border: 1px solid #cbd5e1; word-break: break-word;">${item["Address"]}</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
        </div>
      `;

      document.body.appendChild(container);

      const canvas = await html2canvas(container, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      document.body.removeChild(container);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "mm",
        format: "a4",
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      let heightLeft = imgHeight;
      let position = 10;

      pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
      heightLeft -= pdfHeight - 20;

      while (heightLeft > 0) {
        position = heightLeft - imgHeight + 10;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 10, position, imgWidth, imgHeight);
        heightLeft -= pdfHeight - 20;
      }

      pdf.save(`customer_feedback_${getFormattedDate()}.pdf`);
    } catch (err) {
      console.error("PDF Export error:", err);
    } finally {
      setIsExporting(false);
      setExportDropdownOpen(false);
    }
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
              disabled={isExporting}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-md hover:bg-indigo-700 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isExporting ? (
                <>
                  <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                  Exporting...
                </>
              ) : (
                <>
                  <FiDownload className="h-4 w-4" />
                  Export
                  <FiChevronDown
                    className={`h-4 w-4 transition-transform ${exportDropdownOpen ? "rotate-180" : ""}`}
                  />
                </>
              )}
            </button>

            {exportDropdownOpen && !isExporting && (
              <div className="absolute top-full right-0 mt-2 w-40 rounded-xl border border-border-main bg-bg-card shadow-xl overflow-hidden z-20">
                <button
                  onClick={exportCSV}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors cursor-pointer"
                >
                  Export as CSV
                </button>
                <button
                  onClick={exportExcel}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors border-t border-border-main/50 cursor-pointer"
                >
                  Export as Excel
                </button>
                <button
                  onClick={exportPDF}
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-text-main hover:bg-bg-main transition-colors border-t border-border-main/50 cursor-pointer"
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
