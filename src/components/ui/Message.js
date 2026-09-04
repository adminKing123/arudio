/** @param {{ text: string, type?: "error" | "success", className?: string }} props */
export function Message({ text, type = "error", className = "" }) {
  if (!text) {
    return null;
  }

  const color =
    type === "success" ? "text-[var(--success)]" : "text-[var(--error)]";

  return (
    <p
      role={type === "error" ? "alert" : "status"}
      className={`mt-4 text-sm font-medium ${color} ${className}`.trim()}
    >
      {text}
    </p>
  );
}
