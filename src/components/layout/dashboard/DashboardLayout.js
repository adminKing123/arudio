import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { DashboardMain } from "@/components/layout/dashboard/DashboardMain";

/** @param {{ children: import("react").ReactNode }} props */
export function DashboardLayout({ children }) {
  return (
    <div className="dashboard-shell flex min-h-screen">
      <Sidebar />
      <DashboardMain>{children}</DashboardMain>
    </div>
  );
}
