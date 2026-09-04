/** @param {{ options: { value: string, label: string }[], value: string, onChange: (value: string) => void, className?: string, "aria-label"?: string }} props */
export function SegmentedControl({
  options,
  value,
  onChange,
  className = "",
  "aria-label": ariaLabel,
}) {
  return (
    <div
      className={`neo-segmented ${className}`.trim()}
      style={{ "--segmented-count": options.length }}
      role="tablist"
      aria-label={ariaLabel}
    >
      {options.map((option) => {
        const isActive = value === option.value;

        return (
          <button
            key={option.value}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={isActive ? "neo-segmented-active" : ""}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
