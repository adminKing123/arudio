/** @param {{ label: string, disabled?: boolean, type?: "submit" | "button", onClick?: () => void }} props */
export function SubmitButton({ label, disabled = false, type = "submit", onClick }) {
  return (
    <button type={type} disabled={disabled} onClick={onClick}>
      {label}
    </button>
  );
}
