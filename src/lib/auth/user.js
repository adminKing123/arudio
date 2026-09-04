import { db } from "@/lib/db";
import { getSessionFromCookies } from "@/lib/auth/session";

export async function getCurrentUser() {
  const session = await getSessionFromCookies();

  if (!session) {
    return null;
  }

  const user = await db.user.get(session.userId);

  if (!user) {
    return null;
  }

  return user.toPublicJSON();
}
