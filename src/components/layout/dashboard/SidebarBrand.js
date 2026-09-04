"use client";

import Link from "next/link";
import { SidebarBrandLogo } from "@/components/layout/dashboard/SidebarBrandLogo";

/** @param {{ collapsed: boolean, onExpand: () => void }} props */
export function SidebarBrand({ collapsed, onExpand }) {
  if (collapsed) {
    return (
      <div
        className="sidebar-brand sidebar-brand-collapsed sidebar-brand-expand"
        onClick={onExpand}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            onExpand();
          }
        }}
        role="button"
        tabIndex={0}
        aria-label="Expand sidebar"
      >
        <SidebarBrandLogo />
      </div>
    );
  }

  return (
    <Link href="/" className="sidebar-brand" aria-label="Arudio home">
      <SidebarBrandLogo />
      <span className="sidebar-brand-title">Arudio</span>
    </Link>
  );
}
