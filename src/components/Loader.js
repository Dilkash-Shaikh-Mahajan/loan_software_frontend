"use client";

/**
 * Generic full-screen (or inline) loader component.
 *
 * Props:
 *   fullScreen  – boolean (default true)  → wraps in a centered flex screen
 *   message     – string (optional)       → caption beneath the spinner
 *   size        – "sm" | "md" | "lg"      → spinner size (default "md")
 */
export default function Loader({ fullScreen = true, message = "", size = "md" }) {
  const sizeMap = {
    sm: "h-6 w-6 border-2",
    md: "h-10 w-10 border-[3px]",
    lg: "h-14 w-14 border-4",
  };

  const spinner = (
    <div className="flex flex-col items-center gap-4">
      {/* Outer ring */}
      <div className="relative flex items-center justify-center">
        {/* Spinning gradient arc */}
        <div
          className={`${sizeMap[size]} rounded-full border-indigo-500 border-t-transparent animate-spin`}
          style={{ borderStyle: "solid" }}
        />
        {/* Pulsing inner dot */}
        <div className="absolute h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
      </div>

      {message && (
        <p className="text-sm font-medium text-text-muted animate-pulse select-none">
          {message}
        </p>
      )}
    </div>
  );

  if (!fullScreen) return spinner;

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg-main transition-colors duration-300">
      {spinner}
    </div>
  );
}
