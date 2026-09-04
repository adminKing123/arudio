/** @param {{ icon: import("react").IconType, label: string, className?: string, onClick?: () => void }} props */
export function HeaderIconButton({ icon: Icon, label, className = "", onClick }) {
  return (
    <button
      type="button"
      className={`header-icon-btn ${className}`.trim()}
      aria-label={label}
      onClick={onClick}
    >
      <Icon aria-hidden="true" />
    </button>
  );
}
