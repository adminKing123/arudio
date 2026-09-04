import { HiBell } from "react-icons/hi2";
import { SearchBar } from "@/components/ui/SearchBar";
import { HeaderIconButton } from "@/components/layout/dashboard/HeaderIconButton";
import { DashboardProfile } from "@/components/layout/dashboard/DashboardProfile";

/** @param {{ className?: string, user: { name: string } | null }} props */
export function DashboardHeader({ className = "", user }) {
  return (
    <header className={`dashboard-header ${className}`.trim()}>
      <SearchBar className="dashboard-header-search" />

      <div className="dashboard-header-actions">
        <HeaderIconButton icon={HiBell} label="Notifications" />
        {user ? <DashboardProfile user={user} /> : null}
      </div>
    </header>
  );
}
