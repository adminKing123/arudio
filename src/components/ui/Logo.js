import Image from "next/image";

/** @type {Record<"sm" | "md" | "lg", number>} */
const LOGO_SIZES = {
  sm: 32,
  md: 40,
  lg: 56,
};

/**
 * Renders the app logo from `/public/logo.svg`.
 * Update that SVG file to change the logo everywhere.
 *
 * @param {{
 *   size?: "sm" | "md" | "lg",
 *   className?: string,
 *   priority?: boolean
 * }} props
 */
export function Logo({ size = "md", className = "", priority = false }) {
  const dimension = LOGO_SIZES[size];

  return (
    <Image
      src="/logo.svg"
      alt="Arudio"
      width={dimension}
      height={dimension}
      priority={priority}
      className={className}
    />
  );
}
