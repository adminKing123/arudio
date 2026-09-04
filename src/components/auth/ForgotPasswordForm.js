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

export function ForgotPasswordForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email");

    try {
      await postJson("/api/auth/forgot-password", { email });
      router.push(
        `/verify-otp?email=${encodeURIComponent(String(email))}&type=password_reset`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage title="Forgot password" description="We will email you a 6-digit OTP to reset your password.">
      <form onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <SubmitButton label={loading ? "Sending OTP..." : "Send OTP"} disabled={loading} />
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Back to login" }]} />
    </AuthPage>
  );
}
