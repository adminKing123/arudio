import { HiMagnifyingGlass } from "react-icons/hi2";

/** @param {import("react").InputHTMLAttributes<HTMLInputElement> & { className?: string }} props */
export function SearchBar({
  className = "",
  placeholder = "Search music",
  ...props
}) {
  return (
    <label className={`search-bar ${className}`.trim()}>
      <HiMagnifyingGlass className="search-bar-icon" aria-hidden="true" />
      <input
        type="search"
        className="search-bar-input"
        placeholder={placeholder}
        {...props}
      />
    </label>
  );
}
