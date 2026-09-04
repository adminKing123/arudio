"use client";

import Link from "next/link";
import { SidebarIconSlot } from "@/components/layout/dashboard/SidebarIconSlot";

/**
 * @param {{
 *   href: string,
 *   label: string,
 *   icon: import("react").IconType,
 *   collapsed: boolean,
 *   active: boolean
 * }} props
 */
export function SidebarNavItem({ href, label, icon: Icon, collapsed, active }) {
  return (
    <Link
      href={href}
      title={collapsed ? label : undefined}
      aria-current={active ? "page" : undefined}
      className={`sidebar-nav-item ${active ? "sidebar-nav-item-active" : ""} ${collapsed ? "sidebar-nav-item-collapsed" : ""}`.trim()}
    >
      <SidebarIconSlot collapsed={collapsed}>
        <Icon className="sidebar-nav-icon" />
      </SidebarIconSlot>
      {!collapsed ? <span className="sidebar-nav-label">{label}</span> : null}
    </Link>
  );
}
