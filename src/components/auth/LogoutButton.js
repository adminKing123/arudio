"use client";

import { Button } from "@/components/ui/Button";
import { useLogout } from "@/hooks/useLogout";

export function LogoutButton() {
  const logout = useLogout();

  return (
    <Button type="button" variant="soft" onClick={logout}>
      Logout
    </Button>
  );
}
