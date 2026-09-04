/** @param {{ links: { href: string, label: string }[] }} props */
export function AuthLinks({ links }) {
  return (
    <nav>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <a href={link.href}>{link.label}</a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
