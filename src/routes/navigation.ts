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
  { id: "command-center", path: "/", label: "Overview", icon: BarChart3, match: "exact" },
  { id: "bills", path: "/bills", label: "Bills", icon: BookOpenText, match: "prefix" },
  { id: "feedback", path: "/feedback", label: "Voter feedback", icon: Vote, match: "prefix" },
  { id: "impact", path: "/impact", label: "Impact", icon: Landmark, match: "prefix" },
  { id: "compromise", path: "/compromise", label: "Compromise analysis", icon: GitBranch, match: "prefix" },
  { id: "trust", path: "/trust", label: "Stakeholder trust", icon: ShieldCheck, match: "prefix" },
];
