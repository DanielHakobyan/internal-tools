import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { formatDistanceToNow, parseISO, isValid } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export function formatDeadline(deadline: string | null): string {
  if (!deadline) return "No deadline";
  try {
    const date = parseISO(deadline);
    if (!isValid(date)) return deadline;
    return formatDistanceToNow(date, { addSuffix: true });
  } catch {
    return deadline;
  }
}

export function formatDate(date: string | null): string {
  if (!date) return "Unknown";
  try {
    const d = parseISO(date);
    if (!isValid(d)) return date;
    return d.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

export function countWords(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length;
}

export function estimateMinutesSaved(actionCount: number): number {
  // Industry average: ~15 minutes per manual action item processing
  return actionCount * 15;
}

export function getPriorityColor(priority: string) {
  switch (priority) {
    case "high":
      return {
        bg: "bg-red-500/20",
        text: "text-red-400",
        border: "border-red-500/30",
        dot: "bg-red-400",
      };
    case "medium":
      return {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        border: "border-amber-500/30",
        dot: "bg-amber-400",
      };
    case "low":
      return {
        bg: "bg-emerald-500/20",
        text: "text-emerald-400",
        border: "border-emerald-500/30",
        dot: "bg-emerald-400",
      };
    default:
      return {
        bg: "bg-slate-500/20",
        text: "text-slate-400",
        border: "border-slate-500/30",
        dot: "bg-slate-400",
      };
  }
}

export function getStatusConfig(status: string) {
  switch (status) {
    case "pending":
      return { label: "Pending", color: "text-slate-400", bg: "bg-slate-500/20" };
    case "in_progress":
      return { label: "In Progress", color: "text-blue-400", bg: "bg-blue-500/20" };
    case "done":
      return { label: "Done", color: "text-emerald-400", bg: "bg-emerald-500/20" };
    default:
      return { label: "Pending", color: "text-slate-400", bg: "bg-slate-500/20" };
  }
}

export function getDepartmentColor(dept: string): string {
  const map: Record<string, string> = {
    engineering: "text-blue-400 bg-blue-500/20",
    design: "text-purple-400 bg-purple-500/20",
    marketing: "text-pink-400 bg-pink-500/20",
    sales: "text-green-400 bg-green-500/20",
    ops: "text-orange-400 bg-orange-500/20",
    devops: "text-cyan-400 bg-cyan-500/20",
    hr: "text-yellow-400 bg-yellow-500/20",
    finance: "text-emerald-400 bg-emerald-500/20",
    legal: "text-red-400 bg-red-500/20",
  };
  return map[dept] || "text-slate-400 bg-slate-500/20";
}

export const AVATAR_COLORS = [
  "bg-violet-500",
  "bg-blue-500",
  "bg-emerald-500",
  "bg-amber-500",
  "bg-rose-500",
  "bg-cyan-500",
  "bg-pink-500",
  "bg-indigo-500",
];

export function getAvatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
