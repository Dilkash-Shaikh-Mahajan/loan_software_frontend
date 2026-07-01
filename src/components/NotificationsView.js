"use client";

import { useState } from "react";
import { useApp } from "@/context/AppContext";
import {
  FiBell,
  FiCheck,
  FiInfo,
  FiAlertTriangle,
  FiCheckCircle,
  FiAlertCircle,
} from "react-icons/fi";
import Loader from "@/components/Loader";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getNotifications,
  markAllNotificationsRead,
  markNotificationAsRead,
} from "@/services/apiService";

export default function NotificationsView() {
  const { t, language } = useApp();
  const queryClient = useQueryClient();

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => getNotifications(),
  });

  const getIcon = (type) => {
    switch (type) {
      case "warning":
        return <FiAlertTriangle className="h-5 w-5 text-amber-500" />;
      case "success":
        return <FiCheckCircle className="h-5 w-5 text-emerald-500" />;
      case "alert":
      case "push_failure_alert":
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
      case "push_failure_alert":
        return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
      default:
        return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
    }
  };

  const markAsReadMutation = useMutation({
    mutationFn: (id) => markNotificationAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const markAllReadMutation = useMutation({
    mutationFn: () => markAllNotificationsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const handleMarkAsRead = (id) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllRead = () => {
    markAllReadMutation.mutate();
  };
  console.log("notifications", notifications);
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
              onClick={handleMarkAllRead}
              disabled={markAllReadMutation.isPending}
              className="flex items-center gap-2 rounded-xl border border-border-main bg-bg-card px-4 py-2 text-sm font-semibold text-text-main hover:opacity-90 transition-opacity shadow-sm cursor-pointer disabled:opacity-50"
            >
              <FiCheck className="h-4 w-4" />
              {markAllReadMutation.isPending ? "Marking..." : t("markAllRead")}
            </button>
          </div>
        )}
      </div>

      {/* Notifications List Container */}
      <div className="rounded-2xl border border-border-main bg-bg-card shadow-sm overflow-hidden transition-colors min-h-[200px]">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="mb-4">
              <Loader fullScreen={false} size="lg" />
            </div>
            <p className="text-sm font-semibold text-text-main">
              {t("loading")}...
            </p>
          </div>
        ) : notifications.length > 0 ? (
          <div className="divide-y divide-border-main">
            {notifications.map((n) => (
              <div
                key={n._id}
                className={`flex gap-4 p-5 hover:bg-bg-main/30 transition-colors ${
                  !n.read ? "bg-indigo-500/5 dark:bg-indigo-500/2.5" : ""
                }`}
              >
                {/* Icon Badge */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${getBadgeColor(n.type || "info")}`}
                >
                  {getIcon(n.type || "info")}
                </div>

                {/* Message Context */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p
                        className={`text-sm font-medium text-text-main ${!n.read ? "font-semibold" : ""}`}
                      >
                        {n.title || n.message}
                      </p>
                      {n.description && (
                        <p
                          className={`text-xs text-text-muted ${!n.read ? "font-medium" : ""}`}
                        >
                          {n.description}
                        </p>
                      )}
                    </div>
                    {/* Unread indicator dot */}
                    {!n.read && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-indigo-600 mt-1.5" />
                    )}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between text-xs text-text-muted">
                    <span>{new Date(n.createdAt).toLocaleString()}</span>

                    <div className="flex items-center gap-4 ml-4">
                      {/* Read status button */}
                      {!n.read && (
                        <button
                          onClick={() => handleMarkAsRead(n._id)}
                          disabled={
                            markAsReadMutation.isPending &&
                            markAsReadMutation.variables === n._id
                          }
                          className="text-indigo-500 hover:text-indigo-600 transition-colors font-semibold cursor-pointer disabled:opacity-50"
                        >
                          {markAsReadMutation.isPending &&
                          markAsReadMutation.variables === n._id
                            ? "Marking..."
                            : language === "en"
                              ? "Mark as read"
                              : "पठित चिह्नित करें"}
                        </button>
                      )}
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
            <p className="text-sm font-semibold text-text-main">
              {t("noNotifications")}
            </p>
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
