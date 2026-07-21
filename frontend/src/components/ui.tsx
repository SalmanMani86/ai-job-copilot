import type { ButtonHTMLAttributes, ReactNode } from "react";

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-xl border border-zinc-800 bg-zinc-900/50 p-6 ${className}`}>
      {children}
    </div>
  );
}

export function Button({
  children,
  className = "",
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode }) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-lg bg-violet-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

export function Chip({ children, tone = "neutral" }: { children: ReactNode; tone?: "success" | "warning" | "neutral" }) {
  const toneClasses = {
    success: "bg-emerald-500/10 text-emerald-400 ring-emerald-500/20",
    warning: "bg-amber-500/10 text-amber-400 ring-amber-500/20",
    neutral: "bg-zinc-500/10 text-zinc-300 ring-zinc-500/20",
  }[tone];

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset ${toneClasses}`}>
      {children}
    </span>
  );
}
