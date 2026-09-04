/** @param {{ size?: "sm" | "md", className?: string, label?: string }} props */
export function Spinner({ size = "sm", className = "", label = "Loading" }) {
  const sizeClass = size === "md" ? "neo-spinner-md" : "";

  return (
    <span
      className={`neo-spinner ${sizeClass} ${className}`.trim()}
      role="status"
      aria-label={label}
    />
  );
}
