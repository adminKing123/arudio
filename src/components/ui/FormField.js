/** @param {{ label: string, htmlFor: string, children: import("react").ReactNode }} props */
export function FormField({ label, htmlFor, children }) {
  return (
    <div>
      <label htmlFor={htmlFor}>{label}</label>
      {children}
    </div>
  );
}
