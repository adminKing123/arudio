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

/** @param {{ email: string, type: "signup" | "password_reset" }} props */
export function VerifyOtpForm({ email, type }) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { ok, data } = await postJson("/api/auth/verify-otp", {
        email,
        code: formData.get("code"),
        type,
      });

      if (!ok) {
        throw new Error(data.error || "Verification failed.");
      }

      router.push(data.redirectTo || "/profile");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    setError("");
    setSuccess("");
    setResending(true);

    try {
      const { ok, data } = await postJson("/api/auth/resend-otp", { email, type });

      if (!ok) {
        throw new Error(data.error || "Failed to resend OTP.");
      }

      setSuccess(data.message);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setResending(false);
    }
  }

  return (
    <AuthPage
      title="Verify OTP"
      description={`Enter the 6-digit code sent to ${email}.`}
    >
      <form onSubmit={handleSubmit}>
        <FormField label="6-digit OTP" htmlFor="code">
          <Input
            id="code"
            name="code"
            type="text"
            inputMode="numeric"
            pattern="[0-9]{6}"
            maxLength={6}
            required
            autoComplete="one-time-code"
            className="font-mono text-center text-lg tracking-[0.5em]"
          />
        </FormField>
        <Button type="submit" loading={loading}>
          Verify OTP
        </Button>
        <Message text={error} type="error" />
        <Message text={success} type="success" />
      </form>
      <div className="mt-4 text-center">
        <Button type="button" variant="ghost" loading={resending} onClick={handleResend}>
          Resend OTP
        </Button>
      </div>
      <AuthLinks
        links={[
          type === "signup"
            ? { href: "/login", label: "Back to login" }
            : { href: "/forgot-password", label: "Back to forgot password" },
        ]}
      />
    </AuthPage>
  );
}
