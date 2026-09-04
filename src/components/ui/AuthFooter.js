/** @param {{ prompt: string, linkHref: string, linkLabel: string }} props */
export function AuthFooter({ prompt, linkHref, linkLabel }) {
  return (
    <>
      <div className="neo-divider" role="separator" aria-hidden="true" />
      <p className="text-center text-sm text-[var(--text-muted)]">
        {prompt}{" "}
        <a href={linkHref} className="neo-link">
          {linkLabel}
        </a>
      </p>
    </>
  );
}
