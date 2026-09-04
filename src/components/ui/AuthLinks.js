/** @param {{ links: { href: string, label: string }[], className?: string }} props */
export function AuthLinks({ links, className = "" }) {
  return (
    <nav className={`mt-6 border-t border-white/40 pt-6 ${className}`.trim()}>
      <ul className="flex flex-col gap-3 text-center">
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href} className="neo-link text-sm">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
