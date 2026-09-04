"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/ui/AuthPage";
import { FormField } from "@/components/ui/FormField";
import { TextInput } from "@/components/ui/TextInput";
import { SubmitButton } from "@/components/ui/SubmitButton";
import { Message } from "@/components/ui/Message";
import { AuthLinks } from "@/components/ui/AuthLinks";

async function postJson(url, body) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || "Request failed.");
  }

  return data;
}

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
      const data = await postJson("/api/auth/reset-password", {
        email,
        password: formData.get("password"),
        confirmPassword: formData.get("confirmPassword"),
      });
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
          <TextInput id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <FormField label="Confirm password" htmlFor="confirmPassword">
          <TextInput id="confirmPassword" name="confirmPassword" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <SubmitButton label={loading ? "Resetting..." : "Reset password"} disabled={loading} />
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Back to login" }]} />
    </AuthPage>
  );
}
