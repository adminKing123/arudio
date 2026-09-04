"use client";

import { DASHBOARD_LOGOUT_ICON } from "@/lib/navigation/dashboard";
import { useLogout } from "@/hooks/useLogout";
import { SidebarIconSlot } from "@/components/layout/dashboard/SidebarIconSlot";

/** @param {{ collapsed: boolean }} props */
export function SidebarLogout({ collapsed }) {
  const logout = useLogout();
  const LogoutIcon = DASHBOARD_LOGOUT_ICON;

  return (
    <button
      type="button"
      title={collapsed ? "Logout" : undefined}
      onClick={logout}
      className={`sidebar-nav-item sidebar-logout ${collapsed ? "sidebar-nav-item-collapsed" : ""}`.trim()}
    >
      <SidebarIconSlot collapsed={collapsed}>
        <LogoutIcon className="sidebar-nav-icon" />
      </SidebarIconSlot>
      {!collapsed ? <span className="sidebar-nav-label">Logout</span> : null}
    </button>
  );
}
