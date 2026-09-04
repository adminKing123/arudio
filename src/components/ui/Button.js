/** @param {{ variant?: "primary" | "soft" | "ghost", className?: string, children: import("react").ReactNode } & import("react").ButtonHTMLAttributes<HTMLButtonElement>} props */
export function Button({
  variant = "primary",
  className = "",
  children,
  ...props
}) {
  const variantClass =
    variant === "primary"
      ? "neo-btn neo-btn-primary w-full"
      : variant === "ghost"
        ? "neo-btn neo-btn-ghost"
        : "neo-btn neo-btn-soft w-full";

  return (
    <button className={`${variantClass} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
