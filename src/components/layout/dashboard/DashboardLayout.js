import { cookies } from "next/headers";
import { getCurrentUser } from "@/lib/auth/user";
import { Sidebar } from "@/components/layout/dashboard/Sidebar";
import { DashboardMain } from "@/components/layout/dashboard/DashboardMain";
import { SIDEBAR_COLLAPSED_COOKIE } from "@/lib/sidebar-preference";

/** @param {{ children: import("react").ReactNode }} props */
export async function DashboardLayout({ children }) {
  const cookieStore = await cookies();
  const defaultCollapsed = cookieStore.get(SIDEBAR_COLLAPSED_COOKIE)?.value === "true";
  const user = await getCurrentUser();

  return (
    <div className="dashboard-shell flex min-h-screen">
      <Sidebar defaultCollapsed={defaultCollapsed} />
      <DashboardMain user={user}>{children}</DashboardMain>
    </div>
  );
}
