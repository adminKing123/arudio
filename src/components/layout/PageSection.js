/** @param {{ title: string, action?: import("react").ReactNode, children: import("react").ReactNode }} props */
export function PageSection({ title, action, children }) {
  return (
    <section className="mb-8">
      <div className="mb-4 flex items-center justify-between gap-4">
        <h2 className="font-display text-xl font-bold text-[var(--text)]">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

/** @param {{ label: string, value: import("react").ReactNode }} props */
export function InfoRow({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-white/35 py-4 last:border-b-0">
      <dt className="text-sm font-medium text-[var(--text-muted)]">{label}</dt>
      <dd className="text-right text-sm font-semibold text-[var(--text)]">{value}</dd>
    </div>
  );
}
