"use client";

import { useLayoutEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi2";
import { DASHBOARD_NAV_ITEMS } from "@/lib/navigation/dashboard";
import { SidebarBrand } from "@/components/layout/dashboard/SidebarBrand";
import { SidebarDivider } from "@/components/layout/dashboard/SidebarDivider";
import { SidebarNavItem } from "@/components/layout/dashboard/SidebarNavItem";
import { SidebarLogout } from "@/components/layout/dashboard/SidebarLogout";
import {
  readSidebarCollapsedFromStorage,
  setSidebarCollapsedPreference,
  syncSidebarCollapsedCookie,
} from "@/lib/sidebar-preference";

function isActivePath(pathname, href) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

/** @param {{ onCollapse: () => void }} props */
function SidebarCollapseButton({ onCollapse }) {
  return (
    <button
      type="button"
      className="sidebar-toggle"
      onClick={onCollapse}
      aria-label="Collapse sidebar"
    >
      <HiChevronLeft aria-hidden="true" />
    </button>
  );
}

/** @param {{ defaultCollapsed?: boolean }} props */
export function Sidebar({ defaultCollapsed = false }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(defaultCollapsed);

  useLayoutEffect(() => {
    const stored = readSidebarCollapsedFromStorage();

    if (stored === null) {
      syncSidebarCollapsedCookie(defaultCollapsed);
      return;
    }

    if (stored !== defaultCollapsed) {
      syncSidebarCollapsedCookie(stored);
      setCollapsed(stored);
    }
  }, [defaultCollapsed]);

  function handleCollapse() {
    setCollapsed(true);
    setSidebarCollapsedPreference(true);
  }

  function handleExpand() {
    setCollapsed(false);
    setSidebarCollapsedPreference(false);
  }

  return (
    <aside className={`sidebar sidebar-ready ${collapsed ? "sidebar-collapsed" : ""}`.trim()}>
      <div className="sidebar-header">
        <SidebarBrand collapsed={collapsed} onExpand={handleExpand} />
        {!collapsed ? <SidebarCollapseButton onCollapse={handleCollapse} /> : null}
      </div>

      <SidebarDivider collapsed={collapsed} />

      <nav className="sidebar-nav" aria-label="Dashboard">
        {DASHBOARD_NAV_ITEMS.map((item) => (
          <SidebarNavItem
            key={item.href}
            href={item.href}
            label={item.label}
            icon={item.icon}
            collapsed={collapsed}
            active={isActivePath(pathname, item.href)}
          />
        ))}
      </nav>

      <div className="sidebar-footer">
        <SidebarLogout collapsed={collapsed} />
      </div>
    </aside>
  );
}
