"use client";

import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/ui/SubmitButton";

export function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return <SubmitButton label="Logout" onClick={handleLogout} type="button" />;
}
