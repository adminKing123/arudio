import { Logo } from "@/components/ui/Logo";

export function SidebarBrandLogo() {
  return (
    <span className="sidebar-brand-logo-wrap" aria-hidden="true">
      <Logo size="md" className="sidebar-brand-logo" />
    </span>
  );
}
