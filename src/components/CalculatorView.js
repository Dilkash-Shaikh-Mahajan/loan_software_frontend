"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiPercent, FiDownload, FiRefreshCw } from "react-icons/fi";

export default function CalculatorView() {
  const { t } = useApp();

  const [principal, setPrincipal] = useState(500000);
  const [rate, setRate] = useState(7.5);
  const [term, setTerm] = useState(12);
  const [loanType, setLoanType] = useState("Personal");

  const [monthlyPayment, setMonthlyPayment] = useState(0);
  const [totalInterest, setTotalInterest] = useState(0);
  const [totalRepayment, setTotalRepayment] = useState(0);
  const [schedule, setSchedule] = useState([]);
  const [calculated, setCalculated] = useState(false);

  const calculateAmortization = (e) => {
    e.preventDefault();
    if (!principal || !rate || !term) return;

    const P = parseFloat(principal);
    const annualRate = parseFloat(rate);
    const N = parseInt(term);

    // Monthly interest rate
    const r = annualRate / 12 / 100;

    let monthly = 0;
    if (r === 0) {
      monthly = P / N;
    } else {
      monthly = (P * r * Math.pow(1 + r, N)) / (Math.pow(1 + r, N) - 1);
    }

    const totalRepay = monthly * N;
    const totalInt = totalRepay - P;

    setMonthlyPayment(monthly);
    setTotalInterest(totalInt);
    setTotalRepayment(totalRepay);

    // Generate month-by-month amortization schedule
    let balance = P;
    const newSchedule = [];

    for (let month = 1; month <= N; month++) {
      const interestPaid = balance * r;
      const principalPaid = monthly - interestPaid;
      const endBalance = balance - principalPaid;

      newSchedule.push({
        month,
        beginBalance: balance,
        payment: monthly,
        principalPaid,
        interestPaid,
        endBalance: Math.max(0, endBalance),
      });

      balance = endBalance;
    }

    setSchedule(newSchedule);
    setCalculated(true);
  };

  const handleReset = () => {
    setPrincipal(500000);
    setRate(7.5);
    setTerm(12);
    setLoanType("Personal");
    setMonthlyPayment(0);
    setTotalInterest(0);
    setTotalRepayment(0);
    setSchedule([]);
    setCalculated(false);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans flex items-center gap-3">
          <FiPercent className="h-6 w-6 text-indigo-500" />
          {t("calculatorTitle")}
        </h1>
        <p className="text-sm text-text-muted font-sans mt-0.5">
          {t("calculatorSub")}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Input form */}
        <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm h-fit">
          <h3 className="text-base font-semibold text-text-main border-b border-border-main pb-4 mb-5 flex items-center gap-2">
            <FiPercent className="h-5 w-5 text-indigo-500" />
            Simulator Parameters
          </h3>
          <form onSubmit={calculateAmortization} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Principal Amount (₹)
              </label>
              <input
                type="number"
                required
                min="100"
                value={principal}
                onChange={(e) => setPrincipal(e.target.value)}
                className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Annual Interest Rate (%)
              </label>
              <input
                type="number"
                step="0.01"
                required
                min="0.01"
                value={rate}
                onChange={(e) => setRate(e.target.value)}
                className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                Term Duration (Months)
              </label>
              <input
                type="number"
                required
                min="1"
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                {t("loanType")}
              </label>
              <select
                value={loanType}
                onChange={(e) => setLoanType(e.target.value)}
                className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main cursor-pointer"
              >
                <option value="Personal">{t("Personal")}</option>
                <option value="Business">{t("Business")}</option>
                <option value="Mortgage">{t("Mortgage")}</option>
                <option value="Auto">{t("Auto")}</option>
              </select>
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={handleReset}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-border-main bg-bg-card py-3 text-sm font-semibold text-text-muted hover:text-text-main transition-colors cursor-pointer"
              >
                <FiRefreshCw className="h-4 w-4" />
                Reset
              </button>
              <button
                type="submit"
                className="flex-[2] rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white hover:bg-indigo-550 transition-colors shadow-xl shadow-indigo-600/10 cursor-pointer"
              >
                {t("calculate")}
              </button>
            </div>
          </form>
        </div>

        {/* Right Outputs and Schedule */}
        <div className="lg:col-span-2 space-y-6">
          {calculated ? (
            <>
              {/* Stats highlights */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 animate-fade-in">
                <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
                    {t("monthlyRepayment")}
                  </span>
                  <span className="mt-2 text-2xl font-bold text-text-main">
                    ₹{monthlyPayment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
                    {t("totalInterest")}
                  </span>
                  <span className="mt-2 text-2xl font-bold text-emerald-600 dark:text-emerald-400">
                    ₹{totalInterest.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>

                <div className="rounded-2xl border border-border-main bg-bg-card p-5 shadow-sm">
                  <span className="text-xs font-semibold uppercase tracking-wider text-text-muted block">
                    {t("totalRepayment")}
                  </span>
                  <span className="mt-2 text-2xl font-bold text-text-main">
                    ₹{totalRepayment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Amortization Table */}
              <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors animate-fade-in">
                <div className="flex flex-col gap-4 border-b border-border-main p-6 sm:flex-row sm:items-center sm:justify-between">
                  <h3 className="text-base font-semibold text-text-main font-sans">
                    {t("amortizationSchedule")}
                  </h3>
                  <button className="flex items-center justify-center gap-2 rounded-lg border border-border-main bg-bg-main px-3 py-1.5 text-xs font-semibold text-text-main hover:opacity-90 transition-opacity cursor-pointer">
                    <FiDownload className="h-4 w-4" />
                    Export Sheet
                  </button>
                </div>

                <div className="overflow-y-auto max-h-96">
                  <table className="w-full border-collapse text-left text-sm">
                    <thead>
                      <tr className="border-b border-border-main bg-bg-main/50 text-xs font-semibold uppercase tracking-wider text-text-muted sticky top-0 backdrop-blur-md">
                        <th className="px-6 py-4">{t("month")}</th>
                        <th className="px-6 py-4">Beginning Balance</th>
                        <th className="px-6 py-4">{t("amount")}</th>
                        <th className="px-6 py-4">{t("principalPaid")}</th>
                        <th className="px-6 py-4">{t("interestPaid")}</th>
                        <th className="px-6 py-4">{t("remainingBalance")}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-main">
                      {schedule.map((row) => (
                        <tr key={row.month} className="hover:bg-bg-main/30 transition-colors">
                          <td className="px-6 py-3 font-semibold text-text-main">{row.month}</td>
                          <td className="px-6 py-3 text-text-muted">
                            ₹{row.beginBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3 text-text-main font-semibold">
                            ₹{row.payment.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3 text-emerald-600 dark:text-emerald-400">
                            ₹{row.principalPaid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3 text-rose-600 dark:text-rose-400">
                            ₹{row.interestPaid.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                          <td className="px-6 py-3 text-text-main font-semibold">
                            ₹{row.endBalance.toLocaleString("en-IN", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          ) : (
            <div className="rounded-2xl border border-border-main bg-bg-card p-16 text-center flex flex-col items-center justify-center h-full min-h-[300px]">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-main border border-border-main text-text-muted mb-4 shadow-sm">
                <FiPercent className="h-6 w-6" />
              </div>
              <h3 className="text-base font-semibold text-text-main">Awaiting Parameters</h3>
              <p className="text-xs text-text-muted mt-1 max-w-sm">
                Enter simulated borrowing details on the left panel and click Calculate to view yields, monthly rates, and full schedules.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
