"use client";

import { useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Cookies from "js-cookie";
import { useApp } from "@/context/AppContext";
import { 
  FiGrid, 
  FiBriefcase, 
  FiRepeat, 
  FiUsers, 
  FiSettings, 
  FiLogOut, 
  FiX, 
  FiAward,
  FiBell,
  FiPercent,
  FiCalendar,
  FiClock,
  FiMapPin,
  FiMessageSquare,
} from "react-icons/fi";

const menuItems = [
  { id: "dashboard", translationKey: "navDashboard", icon: FiGrid },
  { id: "customers", translationKey: "navCustomers", icon: FiUsers },
  { id: "recovery-agents", translationKey: "navRecoveryAgents", icon: FiUsers },
  { id: "notifications", translationKey: "navNotifications", icon: FiBell },
  // ── HR / Operations ───────────────────────────────────────
  { id: "tracking", translationKey: "navTracking", icon: FiMapPin, divider: true },
  { id: "feedback", translationKey: "navFeedback", icon: FiMessageSquare },
  // ─────────────────────────────────────────────────────────
  { id: "settings", translationKey: "navSettings", icon: FiSettings, divider: true },
];

export default function Sidebar({ activeTab, mobileOpen, setMobileOpen }) {
  const router = useRouter();
  const { t, language } = useApp();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleLogout = () => {
    setShowLogoutConfirm(true);
  };

  const SidebarContent = () => (
    <div className="flex h-full flex-col justify-between bg-bg-card text-text-muted border-r border-border-main p-6 transition-colors duration-300">
      <div className="flex flex-col gap-8 flex-1 min-h-0">
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-2 flex-shrink-0">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md shadow-indigo-500/30">
            <FiAward className="h-5 w-5 text-white" />
          </div>
          <div>
            <span className="font-bold text-lg text-text-main leading-none tracking-tight block">
              ApexLoan
            </span>
            <span className="text-[10px] text-text-muted font-medium tracking-wide">
              {t("enterprisePlatform")}
            </span>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex flex-col gap-1 overflow-y-auto pr-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <div key={item.id}>
                {item.divider && (
                  <div className="mx-2 my-2 border-t border-border-main" />
                )}
                <Link
                  href={item.id === "dashboard" ? "/dashboard" : `/dashboard/${item.id}`}
                  onClick={() => setMobileOpen(false)}
                  className={`btn-base flex items-center gap-3.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors duration-150 text-left cursor-pointer outline-none ${
                    isActive
                      ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/15"
                      : "hover:bg-bg-main hover:text-text-main text-text-muted"
                  }`}
                >
                  <Icon className="h-4.5 w-4.5 flex-shrink-0" />
                  {t(item.translationKey)}
                </Link>
              </div>
            );
          })}
        </nav>
      </div>

      {/* Footer (Logout) */}
      <div className="border-t border-border-main pt-6 flex-shrink-0">
        <button
          onClick={handleLogout}
          className="btn-base flex w-full items-center gap-3.5 rounded-xl px-4 py-3 text-sm font-medium hover:bg-bg-main hover:text-text-main text-text-muted cursor-pointer"
        >
          <FiLogOut className="h-5 w-5" />
          {t("logout")}
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Fixed Left) */}
      <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-20">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer Sidebar Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileOpen(false)}
          />

          {/* Drawer container */}
          <div className="relative flex w-full max-w-xs flex-1 flex-col animate-slide-in">
            {/* Close button inside Drawer */}
            <div className="absolute right-4 top-4 z-10">
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-xl bg-bg-card border border-border-main text-text-muted hover:text-text-main outline-none cursor-pointer"
              >
                <FiX className="h-5 w-5" />
              </button>
            </div>
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Logout Confirmation Dialog */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="w-full max-w-sm rounded-2xl border border-border-main bg-bg-card shadow-2xl p-6 text-center space-y-4 animate-fade-in text-text-main">
            <h3 className="text-base font-bold">
              {language === "en" ? "Confirm Logout" : "लॉगआउट की पुष्टि करें"}
            </h3>
            <p className="text-xs text-text-muted">
              {language === "en" ? "Are you sure you want to log out of your session?" : "क्या आप वाकई अपने सत्र से लॉगआउट करना चाहते हैं?"}
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="btn-base flex-1 rounded-xl border border-border-main bg-bg-card py-2.5 text-xs font-bold text-text-muted hover:text-text-main cursor-pointer"
              >
                {t("cancel")}
              </button>
              <button
                onClick={() => {
                  Cookies.remove("auth_token");
                  router.push("/login");
                }}
                className="btn-base flex-1 rounded-xl bg-rose-600 py-2.5 text-xs font-bold text-white hover:bg-rose-550 shadow-sm cursor-pointer"
              >
                {t("logout")}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
