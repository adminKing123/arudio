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
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.get("email"),
          password: formData.get("password"),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
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
    <AuthPage title="Login" description="Sign in to your Arudio account.">
      <form onSubmit={handleSubmit}>
        <FormField label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <TextInput id="password" name="password" type="password" required autoComplete="current-password" />
        </FormField>
        <SubmitButton label={loading ? "Logging in..." : "Login"} disabled={loading} />
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
