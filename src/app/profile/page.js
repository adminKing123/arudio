import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";
import { AppShell } from "@/components/layout/AppShell";
import { InfoRow, PageSection } from "@/components/layout/PageSection";
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
    <AppShell user={{ name: profile.name, username: profile.username }}>
      <PageSection title="Profile">
        <SoftCardSm>
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
          <div className="mt-6">
            <LogoutButton />
          </div>
        </SoftCardSm>
      </PageSection>
    </AppShell>
  );
}
