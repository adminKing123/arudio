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

export function SignupForm() {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const data = await postJson("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
        username: formData.get("username"),
        phone: formData.get("phone"),
      });

      router.push(
        `/verify-otp?email=${encodeURIComponent(data.email)}&type=signup`,
      );
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthPage title="Sign up" description="Create your Arudio account with email and password.">
      <form onSubmit={handleSubmit}>
        <FormField label="Full name" htmlFor="name">
          <TextInput id="name" name="name" type="text" required autoComplete="name" />
        </FormField>
        <FormField label="Username" htmlFor="username">
          <TextInput id="username" name="username" type="text" required autoComplete="username" />
        </FormField>
        <FormField label="Phone" htmlFor="phone">
          <TextInput id="phone" name="phone" type="tel" required autoComplete="tel" />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <TextInput id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <TextInput id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <SubmitButton label={loading ? "Creating account..." : "Sign up"} disabled={loading} />
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Already have an account? Login" }]} />
    </AuthPage>
  );
}
