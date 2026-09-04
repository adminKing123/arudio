/** @param {{ collapsed?: boolean }} props */
export function SidebarDivider({ collapsed = false }) {
  return (
    <div
      className={`sidebar-divider ${collapsed ? "sidebar-divider-collapsed" : ""}`.trim()}
      role="separator"
      aria-hidden="true"
    />
  );
}
