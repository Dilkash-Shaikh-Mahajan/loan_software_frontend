"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
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
    const token = sessionStorage.getItem("auth_token");
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
    <div className="relative min-h-screen bg-bg-main text-text-main transition-colors duration-300 overflow-hidden">
      {/* Background Animated Glow Blobs */}
      <div className="fixed top-[-10%] right-[-5%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 blur-[120px] pointer-events-none animate-glow-1 z-0" />
      <div className="fixed bottom-[-10%] left-[10%] h-[500px] w-[500px] rounded-full bg-purple-500/10 dark:bg-purple-500/5 blur-[120px] pointer-events-none animate-glow-2 z-0" />
      <div className="fixed top-[40%] left-[-10%] h-[400px] w-[400px] rounded-full bg-emerald-500/5 dark:bg-emerald-500/5 blur-[100px] pointer-events-none animate-glow-1 z-0" />

      {/* Organic Background SVG Blobs & Grid Pattern */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 opacity-40 dark:opacity-20">
        {/* Top-Right Decorative Organic Blob */}
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] text-indigo-500/20 animate-float">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
            <path d="M44.7,-76.4C58.8,-69.2,71.8,-57.4,79.6,-43.1C87.4,-28.7,90.1,-11.8,87.6,4.3C85.1,20.4,77.5,35.6,67.6,48.2C57.7,60.8,45.5,70.8,31.7,76.2C17.9,81.6,2.5,82.4,-13.4,79.5C-29.3,76.6,-45.7,70,-58.4,59.3C-71.1,48.6,-80,33.8,-83.4,17.8C-86.8,1.8,-84.7,-15.4,-77.2,-30.2C-69.7,-45,-56.8,-57.4,-42.6,-64.6C-28.4,-71.8,-14.2,-73.8,0.7,-75.1C15.6,-76.3,30.6,-83.6,44.7,-76.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Bottom-Left Decorative Organic Blob */}
        <div className="absolute -bottom-32 -left-32 w-[600px] h-[600px] text-purple-500/20 animate-float-delayed">
          <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" className="w-full h-full fill-current">
            <path d="M39.9,-65.4C51.2,-58.5,60.1,-47.4,66.8,-35.1C73.5,-22.8,78,-9.3,77.2,3.9C76.4,17.1,70.3,30,62,40.9C53.7,51.8,43.2,60.7,31.2,66.2C19.2,71.7,5.7,73.8,-7.4,75.1C-20.5,76.4,-33.2,76.9,-44.6,71.7C-56,66.5,-66.1,55.6,-72.6,42.7C-79.1,29.8,-82,14.9,-80.6,0.8C-79.2,-13.3,-73.5,-26.6,-65,-37.2C-56.5,-47.8,-45.2,-55.7,-33.4,-62.1C-21.6,-68.5,-9.3,-73.4,2.8,-77.7C14.9,-82,28.6,-72.3,39.9,-65.4Z" transform="translate(100 100)" />
          </svg>
        </div>

        {/* Subtle Background Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:24px_24px] opacity-15" />
      </div>

      <div className="relative z-10">
        {/* Sidebar Navigation */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={handleTabChange}
          mobileOpen={mobileSidebarOpen}
          setMobileOpen={setMobileSidebarOpen}
        />

        {/* Main Content Wrapper (indented for desktop fixed sidebar) */}
        <div className="flex flex-col md:pl-64 min-h-screen">
          {/* Header Navigation */}
          <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-border-main bg-bg-header/80 px-6 backdrop-blur-xl transition-colors duration-300">
            <div className="flex items-center gap-4">
              {/* Mobile Sidebar Hamburger Toggle */}
              <button
                onClick={() => setMobileSidebarOpen(true)}
                className="btn-base flex h-10 w-10 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main md:hidden cursor-pointer"
              >
                <FiMenu className="h-5 w-5" />
              </button>
              {/* <h2 className="hidden text-sm font-semibold text-text-muted sm:block">
              {t("welcomeAdmin")}
            </h2> */}
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
                {theme === "dark" ? (
                  <FiSun className="h-5 w-5" />
                ) : (
                  <FiMoon className="h-5 w-5" />
                )}
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
                  <span className="text-[10px] text-text-muted font-medium">
                    {t("sysAdmin")}
                  </span>
                </div>
              </div>
            </div>
          </header>

          {/* Dashboard Panels */}
          <main className="flex-1 p-6">{children}</main>

          {/* Footer */}
          <footer className="mt-auto border-t border-border-main bg-bg-card py-6 text-center text-xs text-text-muted transition-colors duration-300">
            <p>
              © {new Date().getFullYear()} ApexLoan. All rights reserved.
              Designed & Developed by Swarajya Tech
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
