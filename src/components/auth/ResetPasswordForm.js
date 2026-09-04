"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/ui/AuthPage";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Message } from "@/components/ui/Message";
import { AuthLinks } from "@/components/ui/AuthLinks";
import { postJson } from "@/lib/api/client";

/** @param {{ email: string }} props */
export function ResetPasswordForm({ email }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { ok, data } = await postJson("/api/auth/reset-password", {
        email,
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });

      if (!ok) {
        throw new Error(data.error || "Password reset failed.");
      }

      router.push(data.redirectTo || "/login");
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage title="Reset password" description={`Set a new password for ${email}.`}>
      <form onSubmit={handleSubmit}>
        <FormField label="New password" htmlFor="password">
          <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword">
          <Input id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? "Resetting..." : "Reset password"}
        </Button>
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Back to login" }]} />
    </AuthPage>
  );
}
