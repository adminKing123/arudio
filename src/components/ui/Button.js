import { Spinner } from "@/components/ui/Spinner";

/** @param {{ variant?: "primary" | "soft" | "ghost", className?: string, loading?: boolean, children: import("react").ReactNode } & import("react").ButtonHTMLAttributes<HTMLButtonElement>} props */
export function Button({
  variant = "primary",
  className = "",
  loading = false,
  children,
  disabled,
  ...props
}) {
  const variantClass =
    variant === "primary"
      ? "neo-btn neo-btn-primary w-full"
      : variant === "ghost"
        ? "neo-btn neo-btn-ghost"
        : "neo-btn neo-btn-soft w-full";

  return (
    <button
      className={`${variantClass} ${className}`.trim()}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading ? <Spinner label="Loading" /> : children}
    </button>
  );
}
