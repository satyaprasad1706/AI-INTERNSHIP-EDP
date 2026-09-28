import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatScore(score: number): string {
  return `${Number(score || 0).toFixed(2)}%`;
}

export function getScoreBadgeColor(score: number): {
  bg: string;
  text: string;
  border: string;
  bar: string;
} {
  if (score >= 80) {
    return {
      bg: "bg-emerald-50 dark:bg-emerald-950/40",
      text: "text-emerald-700 dark:text-emerald-400",
      border: "border-emerald-200 dark:border-emerald-800",
      bar: "bg-emerald-500",
    };
  } else if (score >= 60) {
    return {
      bg: "bg-blue-50 dark:bg-blue-950/40",
      text: "text-blue-700 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
      bar: "bg-blue-500",
    };
  } else if (score >= 40) {
    return {
      bg: "bg-amber-50 dark:bg-amber-950/40",
      text: "text-amber-700 dark:text-amber-400",
      border: "border-amber-200 dark:border-amber-800",
      bar: "bg-amber-500",
    };
  } else {
    return {
      bg: "bg-rose-50 dark:bg-rose-950/40",
      text: "text-rose-700 dark:text-rose-400",
      border: "border-rose-200 dark:border-rose-800",
      bar: "bg-rose-500",
    };
  }
}
