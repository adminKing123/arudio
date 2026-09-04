/** @param {{ className?: string, children: import("react").ReactNode, as?: keyof JSX.IntrinsicElements }} props */
export function SoftCard({ className = "", children, as: Tag = "div" }) {
  return <Tag className={`neo-card p-8 ${className}`.trim()}>{children}</Tag>;
}

/** @param {{ className?: string, children: import("react").ReactNode }} props */
export function SoftCardSm({ className = "", children }) {
  return <div className={`neo-card-sm p-6 ${className}`.trim()}>{children}</div>;
}
