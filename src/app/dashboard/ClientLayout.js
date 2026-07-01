"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Cookies from "js-cookie";
import { useApp } from "@/context/AppContext";
import Sidebar from "@/components/Sidebar";
import Loader from "@/components/Loader";
import LanguageDropdown from "@/components/LanguageDropdown";
import { FiMenu, FiBell, FiSun, FiMoon } from "react-icons/fi";

export default function DashboardLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  const [authorized, setAuthorized] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  // Sync activeTab state with the current pathname
  useEffect(() => {
    if (pathname === "/dashboard") {
      setActiveTab("dashboard");
    } else if (pathname.startsWith("/dashboard/customers")) {
      setActiveTab("customers");
    } else if (pathname.startsWith("/dashboard/notifications")) {
      setActiveTab("notifications");
    } else if (pathname.startsWith("/dashboard/settings")) {
      setActiveTab("settings");
    } else if (pathname.startsWith("/dashboard/tracking")) {
      setActiveTab("tracking");
    } else if (pathname.startsWith("/dashboard/feedback")) {
      setActiveTab("feedback");
    } else if (pathname.startsWith("/dashboard/recovery-agents")) {
      setActiveTab("recovery-agents");
    } else if (pathname.startsWith("/dashboard/cases")) {
      setActiveTab("cases");
    }
  }, [pathname]);

  // Auth Guard
  useEffect(() => {
    const token = Cookies.get("auth_token");
    if (!token) {
      router.push("/login");
    } else {
      setAuthorized(true);
    }
  }, [router]);

  if (!authorized) {
    return <Loader message={t("loading")} />;
  }

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    if (tabId === "dashboard") {
      router.push("/dashboard");
    } else {
      router.push(`/dashboard/${tabId}`);
    }
  };

  return (
    <div className="relative min-h-screen bg-bg-main text-text-main transition-colors duration-300">
      {/* Background Animated Glow Blobs */}
      <div className="fixed top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none animate-glow-1 z-0" />
      <div className="fixed bottom-[-10%] left-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none animate-glow-2 z-0" />
      <div className="fixed top-[40%] left-[-10%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[100px] pointer-events-none animate-glow-1 z-0" />

      <div className="relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar activeTab={activeTab} setActiveTab={handleTabChange} mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

        {/* Main Content Wrapper (indented for desktop fixed sidebar) */}
        <div className="flex flex-col md:pl-64 min-h-screen">
          {/* Header Navigation */}
          <header className="sticky top-0 z-10 flex h-16 w-full items-center justify-between border-b border-border-main bg-bg-header/80 px-6 backdrop-blur-xl transition-colors duration-300">
          <div className="flex items-center gap-4">
            {/* Mobile Sidebar Hamburger Toggle */}
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="btn-base flex h-10 w-10 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main md:hidden cursor-pointer"
            >
              <FiMenu className="h-5 w-5" />
            </button>
            <h2 className="hidden text-sm font-semibold text-text-muted sm:block">
              {t("welcomeAdmin")}
            </h2>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-3">
            {/* Language Dropdown */}
            <LanguageDropdown />

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="btn-base flex h-10 w-10 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main shadow-sm cursor-pointer"
            >
              {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
            </button>

            {/* Notification Indicator */}
            <button
              onClick={() => router.push("/dashboard/notifications")}
              className="btn-base relative flex h-10 w-10 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main shadow-sm cursor-pointer"
            >
              <FiBell className="h-5 w-5" />
              <span className="absolute top-2.5 right-2.5 h-2 w-2 rounded-full bg-indigo-600 ring-2 ring-white dark:ring-zinc-950" />
            </button>

            {/* Profile badge */}
            <div className="flex items-center gap-3 ml-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-border-main font-bold text-sm text-indigo-650">
                AD
              </div>
              <div className="hidden text-left sm:block">
                <div className="text-sm font-semibold text-text-main leading-none">
                  Alex Danvers
                </div>
                <span className="text-[10px] text-text-muted font-medium">{t("sysAdmin")}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Dashboard Panels */}
        <main className="flex-1 p-6">
          {children}
        </main>

        {/* Footer */}
        <footer className="mt-auto border-t border-border-main bg-bg-card py-6 text-center text-xs text-text-muted transition-colors duration-300">
          <p>© {new Date().getFullYear()} ApexLoan. All rights reserved. Designed & Developed by Swarajya Tech</p>
        </footer>
        </div>
      </div>
    </div>
  );
}
