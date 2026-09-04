/** @param {{ title: string, description: string, children: import("react").ReactNode }} props */
export function AuthPage({ title, description, children }) {
  return (
    <main>
      <h1>{title}</h1>
      <p>{description}</p>
      {children}
    </main>
  );
}
