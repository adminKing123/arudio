"use client";

import { Logo } from "@/components/ui/Logo";

/** @param {{ children: import("react").ReactNode }} props */
export function AuthShell({ children }) {
  return (
    <div className="neo-surface flex min-h-screen items-center justify-center p-6">
      <div className="w-full max-w-md">{children}</div>
    </div>
  );
}

/** @param {{ title: string, description: string, headerRef?: import("react").RefObject<HTMLElement | null>, children: import("react").ReactNode }} props */
export function AuthPage({ title, description, headerRef, children }) {
  return (
    <AuthShell>
      <div className="neo-card p-8">
        <div ref={headerRef} className="mb-8 text-center">
          <Logo className="mx-auto mb-4" priority />
          <h1 className="font-display text-2xl font-bold tracking-tight text-[var(--text)]">
            {title}
          </h1>
          <p className="mt-2 text-sm text-[var(--text-muted)]">{description}</p>
        </div>
        {children}
      </div>
    </AuthShell>
  );
}
