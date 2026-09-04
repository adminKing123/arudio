/** @param {{ title: string }} props */
export function DashboardPageHeader({ title }) {
  return (
    <header className="dashboard-page-header">
      <h1 className="dashboard-page-title">{title}</h1>
    </header>
  );
}
