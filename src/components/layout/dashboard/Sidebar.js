"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { HiChevronLeft } from "react-icons/hi2";
import { DASHBOARD_NAV_ITEMS } from "@/lib/navigation/dashboard";
import { SidebarBrand } from "@/components/layout/dashboard/SidebarBrand";
import { SidebarDivider } from "@/components/layout/dashboard/SidebarDivider";
import { SidebarNavItem } from "@/components/layout/dashboard/SidebarNavItem";
import { SidebarLogout } from "@/components/layout/dashboard/SidebarLogout";

const STORAGE_KEY = "arudio-sidebar-collapsed";

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

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    setCollapsed(stored === "true");
    setReady(true);
  }, []);

  function handleCollapse() {
    setCollapsed(true);
    window.localStorage.setItem(STORAGE_KEY, "true");
  }

  function handleExpand() {
    setCollapsed(false);
    window.localStorage.setItem(STORAGE_KEY, "false");
  }

  return (
    <aside
      className={`sidebar ${collapsed ? "sidebar-collapsed" : ""} ${ready ? "sidebar-ready" : ""}`.trim()}
    >
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
