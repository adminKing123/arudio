/** @param {import("react").InputHTMLAttributes<HTMLInputElement>} props */
export function Input({ className = "", ...props }) {
  return <input className={`neo-input ${className}`.trim()} {...props} />;
}
