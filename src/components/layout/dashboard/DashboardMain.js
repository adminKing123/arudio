import { DashboardHeader } from "@/components/layout/dashboard/DashboardHeader";

/** @param {{ children: import("react").ReactNode, user: { name: string } | null }} props */
export function DashboardMain({ children, user }) {
  return (
    <div className="dashboard-main flex min-h-screen min-w-0 flex-1 flex-col">
      <DashboardHeader user={user} />
      <main className="dashboard-main-content flex-1">{children}</main>
    </div>
  );
}
