import { BarChart3, BookOpenText, GitBranch, Landmark, ShieldCheck, Vote, type LucideIcon } from "lucide-react";

export type NavMatchMode = "exact" | "prefix";

export interface NavigationItem {
  id: string;
  path: "/" | "/bills" | "/feedback" | "/impact" | "/compromise" | "/trust";
  label: string;
  icon: LucideIcon;
  match: NavMatchMode;
}

export const primaryNavigationItems: NavigationItem[] = [
  { id: "command-center", path: "/", label: "Command", icon: BarChart3, match: "exact" },
  { id: "bills", path: "/bills", label: "Bills", icon: BookOpenText, match: "prefix" },
  { id: "feedback", path: "/feedback", label: "Voice Tokens", icon: Vote, match: "prefix" },
  { id: "impact", path: "/impact", label: "Impact", icon: Landmark, match: "prefix" },
  { id: "compromise", path: "/compromise", label: "Pareto Engine", icon: GitBranch, match: "prefix" },
  { id: "trust", path: "/trust", label: "Trust Network", icon: ShieldCheck, match: "prefix" },
];
