/** @param {{ children: import("react").ReactNode }} props */
export function DashboardMain({ children }) {
  return (
    <div className="dashboard-main flex min-h-screen min-w-0 flex-1 flex-col">
      <main className="dashboard-main-content flex-1">{children}</main>
    </div>
  );
}
