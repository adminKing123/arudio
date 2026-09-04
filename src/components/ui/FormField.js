/** @param {{ label: string, htmlFor: string, children: import("react").ReactNode, className?: string }} props */
export function FormField({ label, htmlFor, children, className = "" }) {
  return (
    <div className={`mb-5 ${className}`.trim()}>
      <label
        htmlFor={htmlFor}
        className="mb-2 block text-sm font-medium text-[var(--text-muted)]"
      >
        {label}
      </label>
      {children}
    </div>
  );
}
