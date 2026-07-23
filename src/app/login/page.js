"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useApp } from "@/context/AppContext";
import LanguageDropdown from "@/components/LanguageDropdown";
import {
  FiMail,
  FiLock,
  FiEye,
  FiEyeOff,
  FiAward,
  FiSun,
  FiMoon,
} from "react-icons/fi";
import Loader from "@/components/Loader";
import { toast } from "react-hot-toast";
import { login } from "@/services/apiService";

export default function LoginPage() {
  const router = useRouter();
  const { theme, toggleTheme, language, toggleLanguage, t } = useApp();

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup.string().required(t("emailReq")).email(t("emailInvalid")),
    password: yup.string().required(t("passwordReq")).min(6, t("passwordMin")),
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
    <div className="flex min-h-screen w-full bg-bg-main text-text-main transition-colors duration-300">
      {/* Left Side: Brand Hero (Hidden on Mobile) */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-zinc-950 items-center justify-center p-12 lg:p-20">
        {/* Abstract mesh background */}
        <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-950 to-zinc-950 z-0"></div>

        {/* Animated glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[100px] animate-glow-1 z-0"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[100px] animate-glow-2 z-0"></div>

        <div className="relative z-10 w-full max-w-lg text-white">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 mb-10 shadow-2xl">
            <FiAward className="h-8 w-8 text-indigo-400" />
          </div>

          <h1 className="text-4xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-[1.15]">
            Advanced <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 animate-gradient-x">
              Debt Recovery
            </span>
          </h1>

          <p className="text-lg text-indigo-100/60 mb-12 leading-relaxed font-light max-w-md">
            Empower your field agents, track overdue portfolios in real-time,
            and maximize collection rates with intelligent recovery operations.
          </p>

          {/* Floating UI decorative element */}
          <div className="relative h-48 w-full rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 overflow-hidden shadow-2xl animate-float">
            <div className="flex items-center justify-between mb-6">
              <div className="h-3 w-32 bg-white/20 rounded-full"></div>
              <div className="h-8 w-20 bg-indigo-500/30 border border-indigo-500/50 rounded-full flex items-center justify-center text-sm font-bold text-indigo-100 tracking-wide">
                +24%
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-3 w-full bg-white/10 rounded-full"></div>
              <div className="h-3 w-4/5 bg-white/10 rounded-full"></div>
              <div className="h-3 w-full bg-white/10 rounded-full"></div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/5 to-transparent"></div>
          </div>
        </div>
      </div>

      {/* Right Side: Login Form */}
      <div className="flex w-full lg:w-1/2 flex-col relative">
        {/* Language and Theme controls at top right */}
        <div className="absolute top-6 right-6 lg:top-10 lg:right-10 flex items-center gap-4 z-20">
          <LanguageDropdown />
          <button
            onClick={toggleTheme}
            className="btn-base flex h-11 w-11 items-center justify-center rounded-xl border border-border-main bg-bg-card text-text-main shadow-sm backdrop-blur-sm cursor-pointer hover:bg-border-main/50 transition-colors"
          >
            {theme === "dark" ? (
              <FiSun className="h-5 w-5" />
            ) : (
              <FiMoon className="h-5 w-5" />
            )}
          </button>
        </div>

        {/* Form Container */}
        <div className="flex-1 flex flex-col justify-center items-center p-6 sm:p-12 lg:px-24">
          <div className="w-full max-w-md">
            {/* Mobile Header Icon */}
            <div className="lg:hidden flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/20 mb-8">
              <FiAward className="h-7 w-7 text-white" />
            </div>

            <div className="mb-10">
              <h2 className="text-3xl font-bold tracking-tight text-text-main mb-3">
                {t("loginHeader") || "Welcome Back"}
              </h2>
              <p className="text-base text-text-muted">{t("loginSub")}</p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">
                  {t("email")}
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-indigo-500 transition-colors">
                    <FiMail className="h-5 w-5" />
                  </span>
                  <input
                    type="email"
                    placeholder="admin@example.com"
                    {...register("email")}
                    className={`w-full rounded-2xl border bg-bg-main py-4 pl-12 pr-4 text-sm font-medium outline-none transition-all placeholder:text-text-muted/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-bg-card ${
                      errors.email
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-border-main"
                    }`}
                  />
                </div>
                {errors.email && (
                  <p className="text-xs text-rose-500 font-semibold mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-text-muted">
                  {t("password")}
                </label>
                <div className="relative group">
                  <span className="absolute inset-y-0 left-4 flex items-center text-text-muted group-focus-within:text-indigo-500 transition-colors">
                    <FiLock className="h-5 w-5" />
                  </span>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...register("password")}
                    className={`w-full rounded-2xl border bg-bg-main py-4 pl-12 pr-12 text-sm font-medium outline-none transition-all placeholder:text-text-muted/50 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 focus:bg-bg-card ${
                      errors.password
                        ? "border-rose-500 focus:border-rose-500 focus:ring-rose-500/10"
                        : "border-border-main"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="btn-base absolute inset-y-0 right-4 flex items-center text-text-muted hover:text-text-main"
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5" />
                    ) : (
                      <FiEye className="h-5 w-5" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-rose-500 font-semibold mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Remember / Forgot */}
              <div className="flex items-center justify-between pt-2 pb-2">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <div className="relative flex items-center justify-center">
                    <input
                      type="checkbox"
                      className="peer h-5 w-5 appearance-none rounded-md border-2 border-border-main bg-bg-main checked:border-indigo-600 checked:bg-indigo-600 focus:outline-none focus:ring-4 focus:ring-indigo-500/20 transition-all cursor-pointer"
                    />
                    <svg
                      className="absolute w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="3"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <span className="text-sm font-semibold text-text-muted group-hover:text-text-main transition-colors select-none">
                    {t("rememberMe")}
                  </span>
                </label>
                <a
                  href="#forgot"
                  className="text-sm font-bold text-indigo-600 hover:text-indigo-500 transition-colors"
                >
                  {t("forgotPass")}
                </a>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-base mt-2 flex w-full items-center justify-center gap-3 rounded-2xl bg-text-main py-4 text-sm font-bold text-bg-main shadow-lg hover:shadow-xl hover:bg-opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none transition-all cursor-pointer"
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
        </div>
      </div>
    </div>
  );
}
