import Link from "next/link";
import { getInitials } from "@/lib/api/client";

/** @param {{ user: { name: string } }} props */
export function DashboardProfile({ user }) {
  return (
    <Link href="/profile" className="dashboard-profile" aria-label="Open profile">
      <span className="dashboard-profile-avatar">{getInitials(user.name)}</span>
      <span className="dashboard-profile-name">{user.name}</span>
    </Link>
  );
}
