/** @param {{ children: import("react").ReactNode, collapsed?: boolean, className?: string }} props */
export function SidebarIconSlot({ children, collapsed = false, className = "" }) {
  return (
    <span
      className={`sidebar-icon-slot ${collapsed ? "sidebar-icon-slot-collapsed" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {children}
    </span>
  );
}
