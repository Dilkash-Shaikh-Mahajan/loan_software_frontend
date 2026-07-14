"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useApp } from "@/context/AppContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import { FiMail, FiLock, FiEye, FiEyeOff, FiAward, FiSun, FiMoon } from "react-icons/fi";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import { login } from "@/services/apiService";
export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .required(t("emailReq"))
      .email(t("emailInvalid")),
    password: yup
      .string()
      .required(t("passwordReq"))
      .min(6, t("passwordMin")),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      const res = await login({ email: data.email, password: data.password });
      sessionStorage.setItem("auth_token", res.token || "demo_session_token");
      
      if (res.data) {
        localStorage.setItem("user", JSON.stringify(res.data));
      }
      
      toast.success(t("loginSuccess") || "Login successful");
      router.push("/dashboard");
    } catch (error) {
      toast.error(error.message || t("loginFailed") || "Failed to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-bg-main px-4 py-12 text-text-main transition-colors duration-300 overflow-hidden">
      {/* Background Animated Glows (subtle visibility depending on theme) */}
      <div className="absolute top-1/4 left-1/4 h-72 w-72 rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl animate-glow-1" />
      <div className="absolute bottom-1/4 right-1/4 h-96 w-96 rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl animate-glow-2" />

      {/* Top right language and theme bar */}
      <div className="absolute top-6 right-6 flex items-center gap-3 z-20">
        <LanguageDropdown />

        <button
          onClick={toggleTheme}
          className="btn-base flex h-10 w-10 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main shadow-sm backdrop-blur-sm cursor-pointer"
        >
          {theme === "dark" ? <FiSun className="h-5 w-5" /> : <FiMoon className="h-5 w-5" />}
        </button>
      </div>

      <div className="relative w-full max-w-md">
        {/* Brand Header */}
        <div className="flex flex-col items-center gap-2 mb-8 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20">
            <FiAward className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-main mt-2">
            {t("loginHeader")}
          </h1>
          <p className="text-sm text-text-muted">
            {t("loginSub")}
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-border-main bg-bg-card p-8 shadow-2xl backdrop-blur-md transition-colors duration-300">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Email Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                {t("email")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                  <FiMail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  placeholder="admin@example.com"
                  {...register("email")}
                  className={`w-full rounded-2xl border bg-bg-main py-3.5 pl-12 pr-4 text-sm outline-none transition-all placeholder:text-text-muted focus:border-indigo-500 focus:bg-bg-card ${
                    errors.email 
                      ? "border-rose-500 focus:border-rose-500" 
                      : "border-border-main"
                  }`}
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.email.message}</p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-text-muted mb-2">
                {t("password")}
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-4 flex items-center text-text-muted">
                  <FiLock className="h-5 w-5" />
                </span>
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  {...register("password")}
                  className={`w-full rounded-2xl border bg-bg-main py-3.5 pl-12 pr-12 text-sm outline-none transition-all placeholder:text-text-muted focus:border-indigo-500 focus:bg-bg-card ${
                    errors.password 
                      ? "border-rose-500 focus:border-rose-500" 
                      : "border-border-main"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="btn-base absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-text-main"
                >
                  {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="mt-1.5 text-xs text-rose-500 font-medium">{errors.password.message}</p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-xs">
              <label className="flex items-center gap-2 cursor-pointer text-text-muted hover:text-text-main select-none">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-border-main bg-bg-main text-indigo-650 focus:ring-0 focus:ring-offset-0 cursor-pointer accent-indigo-500"
                />
                {t("rememberMe")}
              </label>
              <a href="#forgot" className="font-semibold text-indigo-655 hover:text-indigo-500 transition-colors">
                {t("forgotPass")}
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-base flex w-full items-center justify-center gap-2.5 rounded-2xl bg-gradient-to-r from-indigo-550 to-purple-600 py-3.5 text-sm font-semibold text-white shadow-xl shadow-indigo-650/10 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader fullScreen={false} size="xs" />
                  {t("signingIn")}
                </>
              ) : (
                t("signIn")
              )}
            </button>
          </form>
        </div>
        
        {/* Support Note */}
        <p className="mt-8 text-center text-xs text-text-muted">
          {t("demoMode")}
        </p>
      </div>
    </div>
  );
}
