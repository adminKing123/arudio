import { DashboardLayout } from "@/components/layout/dashboard/DashboardLayout";
import { DashboardPageHeader } from "@/components/layout/dashboard/DashboardPageHeader";

export default function Home() {
  return (
    <DashboardLayout>
      <DashboardPageHeader title="Dashboard" />
    </DashboardLayout>
  );
}
