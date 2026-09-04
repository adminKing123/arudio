import Link from "next/link";
import { Logo } from "@/components/ui/Logo";
import { getInitials } from "@/lib/api/client";

const NAV_ITEMS = [
  { href: "/", label: "Home", icon: "⌂" },
  { href: "/profile", label: "Profile", icon: "👤", active: true },
];

/** @param {{ children: import("react").ReactNode, user: { name: string, username: string } }} props */
export function AppShell({ children, user }) {
  return (
    <div className="neo-surface flex min-h-screen">
      <aside className="hidden w-20 flex-col items-center gap-4 border-r border-white/30 py-6 md:flex">
        <Link href="/" aria-label="Arudio home">
          <Logo size="sm" />
        </Link>
        <nav className="mt-4 flex flex-col gap-3">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              title={item.label}
              className={`neo-sidebar-icon ${item.active ? "neo-sidebar-icon-active" : ""}`}
            >
              <span aria-hidden="true">{item.icon}</span>
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex items-center justify-between gap-4 px-6 py-5">
          <div className="neo-inset hidden max-w-xl flex-1 items-center px-4 py-3 md:flex">
            <span className="mr-3 text-[var(--text-muted)]">⌕</span>
            <span className="text-sm text-[var(--text-muted)]">Search music</span>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="neo-avatar">{getInitials(user.name)}</div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-[var(--text)]">{user.name}</p>
              <p className="text-xs text-[var(--text-muted)]">@{user.username}</p>
            </div>
          </div>
        </header>

        <main className="flex-1 px-6 pb-8">{children}</main>
      </div>
    </div>
  );
}
