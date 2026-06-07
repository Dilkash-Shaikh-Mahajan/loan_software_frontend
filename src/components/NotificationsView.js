"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import { 
  FiBell, 
  FiCheck, 
  FiTrash2, 
  FiInfo, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiAlertCircle 
} from "react-icons/fi";

const initialNotifications = [
  {
    id: 1,
    type: "warning", // warning / success / info / alert
    messageEn: "Loan reference LN-8488 (David Kim) is overdue by 12 days.",
    messageHi: "ऋण संदर्भ LN-8488 (डेविड किम) 12 दिनों से अतिदेय है।",
    timeEn: "10 minutes ago",
    timeHi: "10 मिनट पहले",
    read: false,
  },
  {
    id: 2,
    type: "success",
    messageEn: "Payment of ₹1,00,000 received from Sophia Martinez (LN-8491).",
    messageHi: "सोफिया मार्टिनेज (LN-8491) से ₹1,00,000 का भुगतान प्राप्त हुआ।",
    timeEn: "2 hours ago",
    timeHi: "2 घंटे पहले",
    read: false,
  },
  {
    id: 3,
    type: "info",
    messageEn: "System calculates active configurations successfully: Base rate set to 6.5%.",
    messageHi: "सिस्टम ने सक्रिय विन्यास की गणना सफलतापूर्वक की: मूल दर 6.5% निर्धारित की गई।",
    timeEn: "1 day ago",
    timeHi: "1 दिन पहले",
    read: true,
  },
  {
    id: 4,
    type: "alert",
    messageEn: "New loan application LN-8493 submitted by Alexander Wright.",
    messageHi: "अलेक्जेंडर राइट द्वारा नया ऋण आवेदन LN-8493 जमा किया गया।",
    timeEn: "3 days ago",
    timeHi: "3 दिन पहले",
    read: true,
  },
];

export default function NotificationsView() {
  const { t, language } = useApp();
  const [notifications, setNotifications] = useState(initialNotifications);

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return <FiAlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <FiCheckCircle className="h-5 w-5 text-emerald-500" />;
      case "alert":
        return <FiAlertCircle className="h-5 w-5 text-rose-500" />;
      default:
        return <FiInfo className="h-5 w-5 text-indigo-500" />;
    }
  };

  const getBadgeColor = (type) => {
    switch (type) {
      case "warning":
        return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
      case "success":
        return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
      case "alert":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    }
  };

  const toggleRead = (id) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  };

  const markAllRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const deleteNotification = (id) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return (
    <div className="space-y-6">
      {/* Header Panel */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main font-sans flex items-center gap-3">
            <FiBell className="h-6 w-6 text-indigo-500" />
            {t("notifications")}
          </h1>
          <p className="text-sm text-text-muted font-sans mt-1">
            {t("notificationsSub")}
          </p>
        </div>

        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={markAllRead}
              className="flex items-center gap-2 rounded-xl border border-border-main bg-bg-card px-4 py-2 text-sm font-semibold text-text-main hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <FiCheck className="h-4 w-4" />
              {t("markAllRead")}
            </button>
            <button
              onClick={clearAll}
              className="flex items-center gap-2 rounded-xl border border-border-main bg-bg-card px-4 py-2 text-sm font-semibold text-rose-600 dark:text-rose-400 hover:opacity-90 transition-opacity shadow-sm cursor-pointer"
            >
              <FiTrash2 className="h-4 w-4" />
              {t("clearAll")}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors">
        {notifications.length > 0 ? (
          <div className="divide-y divide-border-main">
            {notifications.map((n) => (
              <div
                key={n.id}
                className={`flex gap-4 p-5 hover:bg-bg-main/30 transition-colors ${
                  !n.read ? "bg-indigo-500/5 dark:bg-indigo-500/2.5" : ""
                }`}
              >
                {/* Icon Badge */}
                <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getBadgeColor(n.type)}`}>
                  {getIcon(n.type)}
                </div>

                {/* Message Context */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <p className={`text-sm font-medium text-text-main ${!n.read ? "font-semibold" : ""}`}>
                      {language === "en" ? n.messageEn : n.messageHi}
                    </p>
                    {/* Unread indicator dot */}
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 mt-1.5" />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-text-muted">
                    <span>{language === "en" ? n.timeEn : n.timeHi}</span>
                    
                    <div className="flex items-center gap-4 ml-4">
                      {/* Read status button toggle */}
                      <button
                        onClick={() => toggleRead(n.id)}
                        className="hover:text-indigo-650 transition-colors font-semibold cursor-pointer"
                      >
                        {n.read ? (language === "en" ? "Mark as unread" : "अपठित चिह्नित करें") : (language === "en" ? "Mark as read" : "पठित चिह्नित करें")}
                      </button>

                      {/* Delete notification button */}
                      <button
                        onClick={() => deleteNotification(n.id)}
                        className="hover:text-rose-600 transition-colors cursor-pointer"
                        title={language === "en" ? "Delete notification" : "अधिसूचना हटाएं"}
                      >
                        <FiTrash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-bg-main border border-border-main text-text-muted mb-4 shadow-sm">
              <FiBell className="h-6 w-6" />
            </div>
            <p className="text-sm font-semibold text-text-main">{t("noNotifications")}</p>
            <p className="text-xs text-text-muted mt-1 max-w-xs">
              {language === "en" 
                ? "You will receive system alerts here when outstanding changes or calculated distributions occur."
                : "बकाया बदलाव या परिकलित वितरण होने पर आपको यहां सिस्टम अलर्ट प्राप्त होंगे।"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
