"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/ui/AuthPage";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Message } from "@/components/ui/Message";
import { postJson } from "@/lib/api/client";

export function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { ok, data } = await postJson("/api/auth/login", {
        email: formData.get("email"),
        password: formData.get("password"),
      });

      if (!ok) {
        if (data.redirectTo) {
          router.push(data.redirectTo);
          return;
        }

        throw new Error(data.error || "Login failed.");
      }

      router.push(data.redirectTo || "/profile");
      router.refresh();
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage title="Welcome back" description="Sign in to your Arudio account.">
      <form onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" required autoComplete="current-password" />
          <div className="mt-2 flex justify-end">
            <a href="/forgot-password" className="neo-link text-sm">
              Forgot password?
            </a>
          </div>
        </FormField>
        <Button type="submit" loading={loading}>
          Login
        </Button>
        <Message text={error} type="error" />
      </form>
      <div className="neo-divider" role="separator" aria-hidden="true" />
      <p className="text-center text-sm text-[var(--text-muted)]">
        Don&apos;t have an account?{" "}
        <a href="/signup" className="neo-link">
          Create account
        </a>
      </p>
    </AuthPage>
  );
}
