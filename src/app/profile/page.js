import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth/session";
import { DashboardLayout } from "@/components/layout/dashboard/DashboardLayout";
import { DashboardPageHeader } from "@/components/layout/dashboard/DashboardPageHeader";
import { InfoRow } from "@/components/layout/PageSection";
import { SoftCardSm } from "@/components/ui/SoftCard";

export const metadata = {
  title: "Profile",
  description: "View and manage your Arudio profile.",
};

export default async function ProfilePage() {
  const session = await getSessionFromCookies();

  if (!session) {
    redirect("/login");
  }

  const user = await db.user.get(session.userId);

  if (!user) {
    redirect("/login");
  }

  const profile = user.toPublicJSON();

  return (
    <DashboardLayout>
      <DashboardPageHeader title="Profile" />
      <SoftCardSm className="dashboard-block-inset-x">
        <dl>
          <InfoRow label="Name" value={profile.name} />
          <InfoRow label="Username" value={`@${profile.username}`} />
          <InfoRow label="Email" value={profile.email} />
          <InfoRow label="Phone" value={profile.phone} />
          <InfoRow label="Verified" value={profile.verified ? "Yes" : "No"} />
          <InfoRow
            label="Member since"
            value={new Date(profile.createdAt).toLocaleString()}
          />
        </dl>
      </SoftCardSm>
    </DashboardLayout>
  );
}
