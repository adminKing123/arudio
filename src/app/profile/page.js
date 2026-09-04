import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth/session";
import { LogoutButton } from "@/components/auth/LogoutButton";

export const metadata = {
  title: "Profile | Arudio",
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
    <main>
      <h1>Profile</h1>
      <p>Your Arudio account details.</p>
      <dl>
        <dt>Name</dt>
        <dd>{profile.name}</dd>
        <dt>Username</dt>
        <dd>{profile.username}</dd>
        <dt>Email</dt>
        <dd>{profile.email}</dd>
        <dt>Phone</dt>
        <dd>{profile.phone}</dd>
        <dt>Verified</dt>
        <dd>{profile.verified ? "Yes" : "No"}</dd>
        <dt>Member since</dt>
        <dd>{new Date(profile.createdAt).toLocaleString()}</dd>
      </dl>
      <LogoutButton />
    </main>
  );
}
