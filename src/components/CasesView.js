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
  reopenCustomerFeedback,
  updateCustomer,
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
  const [reopenCaseId, setReopenCaseId] = useState(null);
  const [editCaseId, setEditCaseId] = useState(null);
  const [editFormData, setEditFormData] = useState({ 
    agentId: "", addd: "", product: "", loan: "", customerName: "", 
    fatherName: "", mobileNumber: "", pincode: "", model: "", emi: "", 
    pos: "", bkt: "", totalDue: "", engineNumber: "", chassisNumber: "", regNo: ""
  });

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

  const reopenMutation = useMutation({
    mutationFn: reopenCustomerFeedback,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Feedback reopened successfully.");
        queryClient.invalidateQueries({ queryKey: ["customers"] });
      } else {
        toast.error(result.message || "Failed to reopen feedback");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to reopen feedback. Please try again.");
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data) => updateCustomer(editCaseId, data),
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Case updated successfully.");
        queryClient.invalidateQueries({ queryKey: ["customers"] });
        setEditCaseId(null);
      } else {
        toast.error(result.message || "Failed to update case");
      }
    },
    onError: (error) => {
      toast.error(error.message || "Failed to update case. Please try again.");
    },
  });

  const handleReopen = (id) => {
    setReopenCaseId(id);
  };

  const confirmReopen = () => {
    if (reopenCaseId) {
      reopenMutation.mutate(reopenCaseId);
      setReopenCaseId(null);
    }
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
        <div className="group relative overflow-hidden rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 bg-indigo-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex items-center justify-between text-text-muted relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
              Total Active Cases
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 group-hover:scale-110 transition-transform border border-indigo-500/20">
              <FiBriefcase className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-text-main tracking-tight relative z-10">{totalCases}</p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm hover:shadow-xl hover:shadow-emerald-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 bg-emerald-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex items-center justify-between text-text-muted relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Available Agents
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform border border-emerald-500/20">
              <FiUsers className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-text-main tracking-tight relative z-10">
            {agentsList.length}
          </p>
        </div>

        <div className="group relative overflow-hidden rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm hover:shadow-xl hover:shadow-amber-500/10 transition-all duration-300">
          <div className="absolute top-0 right-0 h-24 w-24 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500 pointer-events-none" />
          <div className="flex items-center justify-between text-text-muted relative z-10">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-600 dark:text-amber-400">
              Total Value Assigned
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 group-hover:scale-110 transition-transform border border-amber-500/20">
              <FiTrendingUp className="h-5 w-5" />
            </div>
          </div>
          <p className="mt-4 text-3xl font-extrabold text-text-main tracking-tight relative z-10">
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
                <th className="px-6 py-4">Actions</th>
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
                        {c.isFeedbackCollected ? (
                          <span className="inline-flex items-center rounded-full border border-blue-500/20 bg-blue-500/10 px-2.5 py-0.5 text-xs font-medium text-blue-500">
                            Collected
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-xs font-medium text-emerald-500">
                            Active
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-text-muted">
                        {
                          new Date(c.createdAt || Date.now())
                            .toISOString()
                            .split("T")[0]
                        }
                      </td>
                      <td className="px-6 py-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditCaseId(c._id);
                            setEditFormData({
                              agentId: c.agentId?._id || "",
                              addd: c.addd || "",
                              product: c.product || "",
                              loan: c.loan || "",
                              customerName: c.customerName || "",
                              fatherName: c.fatherName || "",
                              mobileNumber: c.mobileNumber || "",
                              pincode: c.pincode || "",
                              model: c.model || "",
                              emi: c.emi || "",
                              pos: c.pos || "",
                              bkt: c.bkt || "",
                              totalDue: c.totalDue || "",
                              engineNumber: c.engineNumber || "",
                              chassisNumber: c.chassisNumber || "",
                              regNo: c.regNo || "",
                            });
                          }}
                          className="inline-flex items-center justify-center rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-3 py-1.5 text-xs font-medium text-indigo-600 transition-colors hover:bg-indigo-500/20 cursor-pointer disabled:opacity-50"
                        >
                          Edit
                        </button>
                        {c.isFeedbackCollected && (
                          <button
                            onClick={() => handleReopen(c._id)}
                            disabled={reopenMutation.isPending}
                            className="inline-flex items-center justify-center rounded-lg border border-amber-500/20 bg-amber-500/10 px-3 py-1.5 text-xs font-medium text-amber-600 transition-colors hover:bg-amber-500/20 cursor-pointer disabled:opacity-50"
                          >
                            Reopen
                          </button>
                        )}
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

      {/* Reopen Confirmation Modal */}
      {reopenCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setReopenCaseId(null)}
          />
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-border-main bg-bg-card shadow-2xl animate-scale-in">
            <div className="p-6 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 mb-4">
                <svg className="h-8 w-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-text-main mb-2">Reopen Case?</h3>
              <p className="text-sm text-text-muted">
                Are you sure you want to reopen this feedback? The assigned agent will need to collect feedback again.
              </p>
            </div>
            
            <div className="border-t border-border-main p-4 bg-bg-main/30 flex justify-center gap-3">
              <button
                onClick={() => setReopenCaseId(null)}
                className="w-full rounded-xl border border-border-main px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-main cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmReopen}
                className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/20 transition-all hover:scale-[1.02] hover:shadow-amber-500/30 active:scale-[0.98] cursor-pointer"
              >
                Yes, Reopen
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Case Modal */}
      {editCaseId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setEditCaseId(null)}
          />
          <div className="relative w-full max-w-2xl overflow-hidden rounded-2xl border border-border-main bg-bg-card shadow-2xl animate-scale-in">
            <div className="border-b border-border-main p-5 flex items-center justify-between">
              <h3 className="text-lg font-bold text-text-main">
                Edit Case Details
              </h3>
              <button
                onClick={() => setEditCaseId(null)}
                className="rounded-lg p-1 text-text-muted hover:bg-bg-main hover:text-text-main transition-colors cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto max-h-[70vh] space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Assigned Agent
                  </label>
                  <select
                    value={editFormData.agentId}
                    onChange={(e) => setEditFormData({ ...editFormData, agentId: e.target.value })}
                    className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm font-medium outline-none transition-all focus:border-indigo-500 text-text-main"
                  >
                    <option value="">Select an agent</option>
                    {agentsList.map(agent => (
                      <option key={agent._id} value={agent._id}>{agent.name}</option>
                    ))}
                  </select>
                </div>

                {["product", "loan", "customerName", "fatherName", "mobileNumber", "pincode", "model", "emi", "pos", "bkt", "totalDue", "engineNumber", "chassisNumber", "regNo"].map(field => (
                  <div key={field}>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                      {field.replace(/([A-Z])/g, ' $1').trim()}
                    </label>
                    <input
                      type="text"
                      value={editFormData[field]}
                      onChange={(e) => setEditFormData({ ...editFormData, [field]: e.target.value })}
                      className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none transition-all focus:border-indigo-500 text-text-main"
                    />
                  </div>
                ))}

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                    Address
                  </label>
                  <textarea
                    value={editFormData.addd}
                    onChange={(e) => setEditFormData({ ...editFormData, addd: e.target.value })}
                    placeholder="Enter case address..."
                    className="w-full rounded-xl border border-border-main bg-bg-main py-2 px-3 text-sm outline-none transition-all focus:border-indigo-500 text-text-main resize-none h-20"
                  />
                </div>
              </div>

              <div className="border-t border-border-main pt-4 mt-6 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setEditCaseId(null)}
                  className="rounded-xl border border-border-main px-4 py-2.5 text-sm font-semibold text-text-main transition-all hover:bg-bg-main cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => updateMutation.mutate(editFormData)}
                  disabled={updateMutation.isPending}
                  className="rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-indigo-500/20 transition-all hover:scale-[1.02] hover:shadow-indigo-500/30 active:scale-[0.98] cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
                >
                  {updateMutation.isPending ? (
                    <Loader fullScreen={false} size="xs" />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
