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
      const { ok, data } = await postJson("/api/auth/forgot-password", { email });

      if (!ok) {
        throw new Error(data.error || "Failed to send OTP.");
      }

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
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <Button type="submit" loading={loading}>
          Send OTP
        </Button>
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Back to login" }]} />
    </AuthPage>
  );
}
