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
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>
        <Message text={error} type="error" />
      </form>
      <AuthLinks
        links={[
          { href: "/signup", label: "Create account" },
          { href: "/forgot-password", label: "Forgot password?" },
        ]}
      />
    </AuthPage>
  );
}
