"use client";

import { useState, useRef, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { useApp } from "@/context/AppContext";
import {
  FiSearch,
  FiBriefcase,
  FiPlus,
  FiX,
  FiUploadCloud,
  FiUsers,
  FiTrendingUp,
  FiActivity,
  FiMapPin,
} from "react-icons/fi";
import Loader from "@/components/Loader";

import {
  fetchAgents,
  fetchCustomers,
  uploadCustomers,
} from "@/services/apiService";

const initialCases = [
  {
    id: "CASE-1001",
    agentName: "Ramesh Gupta",
    borrower: "Amit Singh",
    amount: "₹45,000",
    status: "Active",
    date: "2026-06-01",
  },
  {
    id: "CASE-1002",
    agentName: "Priya Nair",
    borrower: "Sunita Sharma",
    amount: "₹12,500",
    status: "Active",
    date: "2026-06-05",
  },
  {
    id: "CASE-1003",
    agentName: "Vikram Mehta",
    borrower: "Rajesh Kumar",
    amount: "₹78,000",
    status: "Active",
    date: "2026-06-10",
  },
  {
    id: "CASE-1004",
    agentName: "Anjali Singh",
    borrower: "Meena Devi",
    amount: "₹25,000",
    status: "Active",
    date: "2026-06-12",
  },
];

export default function CasesView() {
  const { t } = useApp();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [search]);
  const [agentSearch, setAgentSearch] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const fileInputRef = useRef(null);
  const [isDragActive, setIsDragActive] = useState(false);

  const { data: customersData, isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers", page, limit, debouncedSearch],
    queryFn: () => fetchCustomers({ page, limit, search: debouncedSearch }),
    placeholderData: (previousData) => previousData,
  });

  const cases = customersData?.data || [];
  const totalCases = customersData?.total || 0;
  const totalPages = customersData?.totalPages || 1;

  const { data: agentsList = [], isLoading: loadingAgents } = useQuery({
    queryKey: ["agents"],
    queryFn: fetchAgents,
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      agentId: "",
      excelFile: null,
    },
  });

  const watchAgentId = watch("agentId");
  const watchExcelFile = watch("excelFile");

  useEffect(() => {
    register("excelFile", {
      validate: {
        required: (value) => {
          if (!value) return "Please upload a valid file to proceed.";
          return true;
        },
        checkSize: (value) => {
          const file = value instanceof File ? value : value?.[0];
          if (!file) return true;
          return (
            file.size <= 10 * 1024 * 1024 || "File size exceeds 10MB limit."
          );
        },
        checkType: (value) => {
          const file = value instanceof File ? value : value?.[0];
          if (!file) return true;
          const validTypes = [
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
            "application/vnd.ms-excel",
            "text/csv",
          ];
          const extension = file.name.split(".").pop().toLowerCase();
          const validExtensions = ["xlsx", "xls", "csv"];
          return (
            validTypes.includes(file.type) ||
            validExtensions.includes(extension) ||
            "Invalid file type. Please upload an Excel or CSV file."
          );
        },
      },
    });
  }, [register]);

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const filteredCases = cases;

  const uploadMutation = useMutation({
    mutationFn: uploadCustomers,
    onSuccess: (result) => {
      if (result.success) {
        toast.success(
          result.message || "Cases assigned to the agent successfully.",
        );
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setShowModal(false);
        reset();
      } else {
        toast.error(result.message || "Upload failed");
      }
    },
    onError: (error) => {
      console.error("Mutation onError:", error);
      toast.error(error.message || "Upload failed. Please try again.");
    },
  });

  const onSubmit = (data, e) => {
    e?.preventDefault();
    uploadMutation.mutate(data);
  };

  const onError = (errors, e) => {
    e?.preventDefault();
    toast.error("Please fill all required fields correctly.");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      setValue("excelFile", e.dataTransfer.files[0], { shouldValidate: true });
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setValue("excelFile", e.target.files[0], { shouldValidate: true });
    }
  };

  const totalValue = cases
    .reduce(
      (acc, c) =>
        acc + parseInt((c.totalDue || c.loan || "0").replace(/\D/g, "") || 0),
      0,
    )
    .toLocaleString();

  const filteredAgentsList = agentsList.filter((a) =>
    a.name.toLowerCase().includes(agentSearch.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            Active Cases
          </h1>
          <p className="text-sm text-text-muted font-sans mt-0.5">
            Manage agents and their currently active cases.
          </p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-indigo-500/30 transition-all hover:scale-[1.02] hover:shadow-indigo-500/40 active:scale-[0.98] cursor-pointer"
        >
          <FiPlus className="h-4 w-4" />
          Add Case
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="group rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-indigo-500/30">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Active Cases
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500 group-hover:scale-110 transition-transform">
              <FiBriefcase className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-text-main">{totalCases}</p>
        </div>
        <div className="group rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-emerald-500/30">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Available Agents
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500 group-hover:scale-110 transition-transform">
              <FiUsers className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-text-main">
            {agentsList.length}
          </p>
        </div>
        <div className="group rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm transition-all hover:shadow-md hover:border-amber-500/30">
          <div className="flex items-center justify-between text-text-muted">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Value Assigned
            </span>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <FiTrendingUp className="h-4 w-4" />
            </div>
          </div>
          <p className="mt-3 text-2xl font-bold text-text-main">
            ₹{totalValue}
          </p>
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
              placeholder="Search by ID, agent, or borrower..."
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
                <th className="px-6 py-4">Case ID</th>
                <th className="px-6 py-4">Agent Name</th>
                <th className="px-6 py-4">Borrower</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border-main">
              {loadingCustomers ? (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="mx-auto flex justify-center"><Loader fullScreen={false} size="sm" /></div>
                  </td>
                </tr>
              ) : filteredCases.length > 0 ? (
                filteredCases.map((c) => {
                  const agentName = c.agentId?.name || "Unknown";
                  return (
                    <tr
                      key={c._id}
                      className="hover:bg-bg-main/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-mono text-xs font-semibold text-indigo-500">
                        {c.loan}
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-main">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 text-xs font-bold text-indigo-600 uppercase">
                            {agentName.charAt(0)}
                          </div>
                          {agentName}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {c.customerName || "Unknown"}
                      </td>
                      <td className="px-6 py-4 font-semibold text-text-main">
                        ₹{c.totalDue || c.loan || "0"}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                          Active
                        </span>
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {
                          new Date(c.createdAt || Date.now())
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" className="px-6 py-12 text-center">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-bg-main">
                        <FiActivity className="h-6 w-6 text-text-muted" />
                      </div>
                      <p className="text-sm text-text-muted">
                        No cases match your query.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {!loadingCustomers && totalPages > 1 && (
          <div className="border-t border-border-main p-4 flex items-center justify-between">
            <span className="text-sm text-text-muted">
              Showing {cases.length} of {totalCases} entries
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border-main text-text-main hover:bg-bg-main disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-text-main px-2">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-3 py-1.5 text-sm font-medium rounded-lg border border-border-main text-text-main hover:bg-bg-main disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Add Case Modal */}
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
              <h3 className="text-lg font-bold text-text-main flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-500">
                  <FiUploadCloud className="h-4 w-4" />
                </div>
                Add Case (Import)
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="rounded-lg p-1 text-text-muted hover:bg-bg-main hover:text-text-main transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <form
              onSubmit={handleSubmit(onSubmit, onError)}
              className="p-5 space-y-4"
            >
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                  Assign to Agent
                </label>
                <input
                  type="hidden"
                  {...register("agentId", {
                    required: "Please select an agent",
                  })}
                />
                <div className="relative">
                  {/* ... agent select ... */}
                  <div
                    onClick={() =>
                      !loadingAgents && setDropdownOpen(!dropdownOpen)
                    }
                    className={`w-full rounded-xl border border-border-main bg-bg-main py-3 pl-11 pr-4 text-sm font-medium outline-none transition-all flex items-center justify-between ${
                      loadingAgents
                        ? "opacity-70 cursor-not-allowed"
                        : "hover:border-indigo-500/50 cursor-pointer shadow-sm"
                    } ${dropdownOpen ? "border-indigo-500 bg-bg-card ring-2 ring-indigo-500/20" : ""}`}
                  >
                    <div className="absolute left-4 flex items-center pointer-events-none">
                      {loadingAgents ? (
                        <Loader fullScreen={false} size="xs" />
                      ) : (
                        <FiUsers className="h-4 w-4 text-text-muted" />
                      )}
                    </div>
                    <span
                      className={`truncate ${!watchAgentId ? "text-text-muted" : "text-text-main"}`}
                    >
                      {loadingAgents
                        ? "Loading agents..."
                        : agentsList.find((a) => a._id === watchAgentId)
                            ?.name || "-- Select an agent --"}
                    </span>
                    <div className="flex items-center pointer-events-none ml-2">
                      <svg
                        className={`h-4 w-4 text-text-muted transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M19 9l-7 7-7-7"
                        />
                      </svg>
                    </div>
                  </div>

                  {dropdownOpen && (
                    <div className="absolute z-10 mt-2 w-full rounded-xl border border-border-main bg-bg-card shadow-lg max-h-60 overflow-hidden flex flex-col">
                      <div className="p-2 border-b border-border-main bg-bg-card shrink-0">
                        <div className="relative">
                          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
                          <input
                            type="text"
                            className="w-full rounded-lg bg-bg-main border border-border-main py-2 pl-9 pr-3 text-sm text-text-main outline-none focus:border-indigo-500"
                            placeholder="Search agents..."
                            value={agentSearch}
                            onChange={(e) => setAgentSearch(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") {
                                e.preventDefault(); // prevent form submission on Enter inside search
                              }
                            }}
                          />
                        </div>
                      </div>
                      <div className="p-1 overflow-y-auto">
                        {filteredAgentsList.length > 0 ? (
                          filteredAgentsList.map((agent) => (
                            <div
                              key={agent._id}
                              onClick={() => {
                                setValue("agentId", agent._id, {
                                  shouldValidate: true,
                                });
                                setDropdownOpen(false);
                                setAgentSearch("");
                              }}
                              className={`cursor-pointer rounded-lg px-4 py-2.5 text-sm transition-colors ${
                                watchAgentId === agent._id
                                  ? "bg-indigo-500/10 text-indigo-500 font-semibold"
                                  : "text-text-main hover:bg-bg-main"
                              }`}
                            >
                              {agent.name}
                            </div>
                          ))
                        ) : (
                          <div className="px-4 py-4 text-sm text-text-muted text-center">
                            No agents found.
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-1.5">
                  Upload Excel File
                </label>
                <div
                  className={`mt-1 flex justify-center rounded-xl border-2 border-dashed px-6 py-8 transition-colors cursor-pointer ${
                    isDragActive
                      ? "border-indigo-500 bg-indigo-500/5"
                      : errors.excelFile
                        ? "border-red-500 bg-red-500/5"
                        : "border-border-main hover:border-indigo-500 bg-bg-main"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="text-center pointer-events-none">
                    <FiUploadCloud
                      className={`mx-auto h-10 w-10 ${
                        isDragActive
                          ? "text-indigo-500 scale-110 transition-transform"
                          : errors.excelFile
                            ? "text-red-500"
                            : "text-text-muted"
                      }`}
                      aria-hidden="true"
                    />
                    <div className="mt-4 flex text-sm text-text-main justify-center">
                      <span className="font-semibold text-indigo-600">
                        Upload a file
                      </span>
                      <p className="pl-1 text-text-muted">or drag and drop</p>
                    </div>
                    <p className="text-xs text-text-muted mt-2">
                      Excel or CSV up to 10MB
                    </p>
                    {watchExcelFile && !errors.excelFile && (
                      <p className="text-xs text-emerald-500 font-semibold mt-2">
                        Selected:{" "}
                        {watchExcelFile instanceof File
                          ? watchExcelFile.name
                          : watchExcelFile[0]?.name}
                      </p>
                    )}
                    {errors.excelFile && (
                      <p className="text-xs text-red-500 font-semibold mt-2">
                        {errors.excelFile.message}
                      </p>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    id="file-upload"
                    type="file"
                    accept=".xlsx, .xls, .csv"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                </div>
              </div>

              <div className="border-t border-border-main pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="rounded-xl border border-border-main px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploadMutation.isPending}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {uploadMutation.isPending ? (
                    <Loader fullScreen={false} size="xs" />
                  ) : (
                    "Import Cases"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
