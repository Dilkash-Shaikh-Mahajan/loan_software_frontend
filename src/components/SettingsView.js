"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  FiUser, FiSave, FiInfo, FiMonitor, FiLock, FiDownload, FiTrash2, 
  FiBell, FiShield, FiCamera, FiSmartphone, FiMail
} from "react-icons/fi";
import { toast } from "react-hot-toast";

export default function SettingsView() {
  const { t, theme, toggleTheme, language, setLanguage } = useApp();
  
  const [activeTab, setActiveTab] = useState("profile");
  const [isSaving, setIsSaving] = useState(false);

  // Profile States
  const [profileName, setProfileName] = useState("Alex Danvers");
  const [profileEmail, setProfileEmail] = useState("admin@example.com");
  const [profilePhone, setProfilePhone] = useState("+1 234 567 8900");
  const [profileRole, setProfileRole] = useState("Administrator");

  // Notification States
  const [emailNotif, setEmailNotif] = useState(true);
  const [smsNotif, setSmsNotif] = useState(false);
  const [pushNotif, setPushNotif] = useState(true);

  const tabs = [
    { id: "profile", label: "User Profile", icon: FiUser },
    { id: "preferences", label: "Preferences", icon: FiMonitor },
    { id: "notifications", label: "Notifications", icon: FiBell },
    { id: "security", label: "Security", icon: FiShield },
  ];

  const handleSaveSettings = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    // Mock API call
    await new Promise((resolve) => setTimeout(resolve, 800));
    setIsSaving(false);
    toast.success("Settings saved successfully!");
  };

  const renderProfile = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pb-6 border-b border-border-main">
        <div className="relative group/avatar cursor-pointer">
          <div className="absolute -inset-1 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 opacity-20 group-hover/avatar:opacity-60 blur transition duration-500"></div>
          <div className="relative h-24 w-24 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-3xl font-bold shadow-xl shrink-0 ring-4 ring-bg-card transition-transform duration-300 group-hover/avatar:scale-105 overflow-hidden">
            {profileName.charAt(0)}
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity duration-300 backdrop-blur-sm">
              <FiCamera className="h-6 w-6 text-white" />
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-bold text-text-main">{profileName}</h3>
          <p className="text-sm text-text-muted mt-1">{profileRole}</p>
          <div className="mt-3 flex gap-3">
            <button type="button" className="text-xs font-semibold bg-bg-main hover:bg-border-main border border-border-main text-text-main py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
              Change Avatar
            </button>
            <button type="button" className="text-xs font-semibold text-rose-500 hover:text-rose-600 hover:bg-rose-500/10 py-1.5 px-3 rounded-lg transition-colors cursor-pointer">
              Remove
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Full Name</label>
          <input
            type="text"
            value={profileName}
            onChange={(e) => setProfileName(e.target.value)}
            className="w-full rounded-xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-bg-card text-text-main hover:border-indigo-500/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Email Address</label>
          <input
            type="email"
            value={profileEmail}
            onChange={(e) => setProfileEmail(e.target.value)}
            className="w-full rounded-xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-bg-card text-text-main hover:border-indigo-500/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Phone Number</label>
          <input
            type="tel"
            value={profilePhone}
            onChange={(e) => setProfilePhone(e.target.value)}
            className="w-full rounded-xl border border-border-main bg-bg-main py-3 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-bg-card text-text-main hover:border-indigo-500/30"
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-xs font-semibold uppercase tracking-wider text-text-muted">Role</label>
          <input
            type="text"
            value={profileRole}
            disabled
            className="w-full rounded-xl border border-border-main bg-bg-main/50 py-3 px-4 text-sm outline-none text-text-muted cursor-not-allowed"
          />
        </div>
      </div>
    </div>
  );

  const renderPreferences = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-6">
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border-main bg-bg-main hover:border-indigo-500/30 transition-colors">
          <div>
            <h4 className="text-sm font-semibold text-text-main">Dark Mode</h4>
            <p className="text-xs text-text-muted mt-1">Adjust the appearance of the application</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer select-none">
            <input type="checkbox" checked={theme === 'dark'} onChange={toggleTheme} className="sr-only peer" />
            <div className="w-11 h-6 bg-border-main rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-main after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 rounded-2xl border border-border-main bg-bg-main hover:border-indigo-500/30 transition-colors">
          <div className="w-1/2">
            <h4 className="text-sm font-semibold text-text-main">Language</h4>
            <p className="text-xs text-text-muted mt-1">Set your preferred language for the interface</p>
          </div>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="w-1/3 rounded-xl border border-border-main bg-bg-card py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 text-text-main cursor-pointer hover:shadow-sm"
          >
            <option value="en">English (US)</option>
            <option value="hi">हिंदी (Hindi)</option>
          </select>
        </div>
        
        <div className="flex items-center justify-between p-4 rounded-2xl border border-border-main bg-bg-main hover:border-indigo-500/30 transition-colors">
          <div className="w-1/2">
            <h4 className="text-sm font-semibold text-text-main">Timezone</h4>
            <p className="text-xs text-text-muted mt-1">Set your local timezone</p>
          </div>
          <select className="w-1/3 rounded-xl border border-border-main bg-bg-card py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 text-text-main cursor-pointer hover:shadow-sm">
            <option>UTC (Coordinated Universal Time)</option>
            <option>EST (Eastern Standard Time)</option>
            <option>PST (Pacific Standard Time)</option>
            <option>IST (Indian Standard Time)</option>
          </select>
        </div>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="space-y-4">
        {[
          { icon: FiMail, title: "Email Notifications", desc: "Receive daily summaries and critical alerts via email.", state: emailNotif, setter: setEmailNotif },
          { icon: FiSmartphone, title: "SMS Alerts", desc: "Get text messages for urgent assignments and updates.", state: smsNotif, setter: setSmsNotif },
          { icon: FiBell, title: "Push Notifications", desc: "In-app popups and desktop notifications.", state: pushNotif, setter: setPushNotif },
        ].map((item, i) => (
          <div key={i} className="flex items-start sm:items-center justify-between p-5 rounded-2xl border border-border-main bg-bg-main hover:border-indigo-500/30 transition-colors gap-4">
            <div className="flex gap-4 items-center">
              <div className="h-10 w-10 rounded-xl bg-bg-card border border-border-main flex items-center justify-center shrink-0 shadow-sm text-text-muted">
                <item.icon className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-text-main">{item.title}</h4>
                <p className="text-xs text-text-muted mt-1 max-w-sm">{item.desc}</p>
              </div>
            </div>
            <label className="relative inline-flex items-center cursor-pointer select-none shrink-0 mt-2 sm:mt-0">
              <input type="checkbox" checked={item.state} onChange={() => item.setter(!item.state)} className="sr-only peer" />
              <div className="w-11 h-6 bg-border-main rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-border-main after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-500 shadow-inner"></div>
            </label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSecurity = () => (
    <div className="space-y-8 animate-fade-in">
      {/* Change Password */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Change Password</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5 sm:col-span-2">
            <label className="text-xs font-semibold text-text-muted">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main" />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-text-muted">Confirm Password</label>
            <input type="password" placeholder="••••••••" className="w-full rounded-xl border border-border-main bg-bg-main py-2.5 px-4 text-sm outline-none transition-all focus:border-indigo-500 focus:bg-bg-card text-text-main" />
          </div>
        </div>
        <button type="button" className="text-sm font-semibold bg-bg-main border border-border-main hover:bg-border-main text-text-main py-2 px-5 rounded-xl transition-colors cursor-pointer shadow-sm">
          Update Password
        </button>
      </div>

      <div className="h-px w-full bg-border-main my-6"></div>

      {/* Danger Zone */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold text-rose-500 uppercase tracking-wider">Danger Zone</h3>
        <div className="p-5 rounded-2xl border border-rose-500/20 bg-rose-500/5 space-y-4">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-text-main">Export Account Data</h4>
              <p className="text-xs text-text-muted mt-1">Download all your personal data in CSV format.</p>
            </div>
            <button type="button" className="flex items-center gap-2 text-sm font-semibold bg-bg-card border border-border-main hover:bg-bg-main text-text-main py-2 px-4 rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap">
              <FiDownload className="h-4 w-4" /> Export Data
            </button>
          </div>
          <div className="h-px w-full bg-border-main/50"></div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-semibold text-text-main">Delete Account</h4>
              <p className="text-xs text-text-muted mt-1">Permanently remove your account and all data.</p>
            </div>
            <button type="button" className="flex items-center gap-2 text-sm font-semibold bg-rose-500 hover:bg-rose-600 text-white py-2 px-4 rounded-xl transition-colors cursor-pointer shadow-sm whitespace-nowrap">
              <FiTrash2 className="h-4 w-4" /> Delete Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-12 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-bg-card border border-border-main rounded-3xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 h-64 w-64 rounded-full bg-gradient-to-br from-indigo-500/10 to-transparent blur-3xl pointer-events-none" />
        <div className="relative">
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans">
            {t("platformConfig")}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-1">
            Manage your account settings and preferences.
          </p>
        </div>
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="relative group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-300 shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer disabled:opacity-70 disabled:pointer-events-none overflow-hidden shrink-0 min-w-[140px]"
        >
          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          {isSaving ? (
            <span className="flex items-center gap-2">Saving...</span>
          ) : (
            <>
              <FiSave className="h-4 w-4 group-hover:scale-110 transition-transform duration-300" />
              {t("saveConfig") || "Save Changes"}
            </>
          )}
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-6 items-start">
        {/* Sidebar Navigation */}
        <div className="w-full md:w-64 shrink-0 flex flex-col gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl text-sm font-semibold transition-all duration-300 cursor-pointer ${
                activeTab === tab.id
                  ? "bg-indigo-500 text-white shadow-md shadow-indigo-500/20 translate-x-1"
                  : "text-text-muted hover:bg-bg-card hover:text-text-main hover:border-border-main border border-transparent"
              }`}
            >
              <tab.icon className={`h-4 w-4 ${activeTab === tab.id ? "text-indigo-200" : ""}`} />
              {tab.label}
            </button>
          ))}
          
          <div className="mt-4 p-4 rounded-xl bg-bg-card border border-border-main shadow-sm flex gap-3 text-text-muted">
            <FiInfo className="h-5 w-5 shrink-0 text-indigo-500 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              Unsaved changes will be lost if you navigate away. Remember to save!
            </p>
          </div>
        </div>
        
        {/* Main Content Area */}
        <div className="flex-1 min-w-0 w-full bg-bg-card border border-border-main rounded-3xl shadow-sm p-6 sm:p-8 min-h-[500px]">
          <h2 className="text-xl font-bold text-text-main mb-6 pb-4 border-b border-border-main">
            {tabs.find(t => t.id === activeTab)?.label}
          </h2>
          
          {activeTab === "profile" && renderProfile()}
          {activeTab === "preferences" && renderPreferences()}
          {activeTab === "notifications" && renderNotifications()}
          {activeTab === "security" && renderSecurity()}
        </div>
      </div>
    </div>
  );
}
