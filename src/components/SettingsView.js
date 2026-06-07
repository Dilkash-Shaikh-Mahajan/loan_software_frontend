"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { FiSliders, FiUser, FiShield, FiSave, FiInfo } from "react-icons/fi";

export default function SettingsView() {
  const { t } = useApp();
  
  const [baseRate, setBaseRate] = useState(6.5);
  const [maxTenure, setMaxTenure] = useState(180);
  const [lateFee, setLateFee] = useState(50);
  
  const [adminName, setAdminName] = useState("Alex Danvers");
  const [adminEmail, setAdminEmail] = useState("admin@example.com");

  const [tfaEnabled, setTfaEnabled] = useState(true);
  const [emailAlerts, setEmailAlerts] = useState(false);
  const [sessionTimeout, setSessionTimeout] = useState(30);

  const [saveSuccess, setSaveSuccess] = useState(false);

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("platformConfig")}
          </h1>
          <p className="text-sm text-text-muted font-sans">
            {t("platformConfigSub")}
          </p>
        </div>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          
          {/* Column 1 & 2: Main settings */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Section 1: Loan Parameters */}
            <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-5">
                <FiSliders className="h-5 w-5 text-indigo-500" />
                <h3 className="text-base font-semibold text-text-main">{t("loanEnginePolicies")}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("baseRate")}</label>
                  <input
                    type="number"
                    step="0.1"
                    value={baseRate}
                    onChange={(e) => setBaseRate(parseFloat(e.target.value))}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("maxTenure")}</label>
                  <input
                    type="number"
                    value={maxTenure}
                    onChange={(e) => setMaxTenure(parseInt(e.target.value))}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("lateRepayFee")}</label>
                  <input
                    type="number"
                    value={lateFee}
                    onChange={(e) => setLateFee(parseFloat(e.target.value))}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>
            </div>

            {/* Section 2: Administrator Profile */}
            <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-5">
                <FiUser className="h-5 w-5 text-purple-500" />
                <h3 className="text-base font-semibold text-text-main">{t("adminDetails")}</h3>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("fullName")}</label>
                  <input
                    type="text"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("email")}</label>
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Column 3: Security settings card */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-border-main bg-bg-card p-6 shadow-sm transition-colors">
              <div className="flex items-center gap-3 border-b border-border-main pb-4 mb-5">
                <FiShield className="h-5 w-5 text-emerald-500" />
                <h3 className="text-base font-semibold text-text-main">{t("securityAlerts")}</h3>
              </div>
              <div className="space-y-4">
                {/* TFA Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-text-main block leading-tight">{t("twoFactor")}</label>
                    <span className="text-[10px] text-text-muted">{t("twoFactorSub")}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={tfaEnabled}
                      onChange={() => setTfaEnabled(!tfaEnabled)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-main border border-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-main after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Email Alert Toggle */}
                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-sm font-semibold text-text-main block leading-tight">{t("dailyAuditLog")}</label>
                    <span className="text-[10px] text-text-muted">{t("dailyAuditLogSub")}</span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={emailAlerts}
                      onChange={() => setEmailAlerts(!emailAlerts)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-bg-main border border-border-main peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-main after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>

                {/* Session Timeout */}
                <div className="pt-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">{t("sessionExpiryMin")}</label>
                  <select
                    value={sessionTimeout}
                    onChange={(e) => setSessionTimeout(parseInt(e.target.value))}
                    className="w-full rounded-2xl border border-border-main bg-bg-main py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 text-text-main cursor-pointer"
                  >
                    <option value={15}>{t("timeout15")}</option>
                    <option value={30}>{t("timeout30")}</option>
                    <option value={60}>{t("timeout60")}</option>
                    <option value={120}>{t("timeout120")}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Hint Box */}
            <div className="rounded-2xl bg-indigo-500/5 border border-indigo-500/10 p-5 flex gap-3.5 text-text-muted">
              <FiInfo className="h-5 w-5 text-indigo-500 shrink-0 mt-0.5" />
              <p className="text-xs leading-5">
                {t("settingsNote")}
              </p>
            </div>
          </div>
        </div>

        {/* Submit Actions */}
        <div className="flex items-center gap-4">
          <button
            type="submit"
            className="flex items-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-500 transition-colors shadow-sm shadow-indigo-600/15 animate-fade-in cursor-pointer"
          >
            <FiSave className="h-5 w-5" />
            {t("saveConfig")}
          </button>
          
          {saveSuccess && (
            <p className="text-sm font-medium text-emerald-600 dark:text-emerald-400 animate-fade-in">
              {t("configSuccess")}
            </p>
          )}
        </div>
      </form>
    </div>
  );
}
