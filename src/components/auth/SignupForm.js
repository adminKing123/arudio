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
      const { ok, data } = await postJson("/api/auth/signup", {
        email: formData.get("email"),
        password: formData.get("password"),
        name: formData.get("name"),
        username: formData.get("username"),
        phone: formData.get("phone"),
      });

      if (!ok) {
        throw new Error(data.error || "Signup failed.");
      }

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
    <AuthPage title="Create account" description="Join Arudio with email and password.">
      <form onSubmit={handleSubmit}>
        <FormField label="Full name" htmlFor="name">
          <Input id="name" name="name" type="text" required autoComplete="name" />
        </FormField>
        <FormField label="Username" htmlFor="username">
          <Input id="username" name="username" type="text" required autoComplete="username" />
        </FormField>
        <FormField label="Phone" htmlFor="phone">
          <Input id="phone" name="phone" type="tel" required autoComplete="tel" />
        </FormField>
        <FormField label="Email" htmlFor="email">
          <Input id="email" name="email" type="email" required autoComplete="email" />
        </FormField>
        <FormField label="Password" htmlFor="password">
          <Input id="password" name="password" type="password" required autoComplete="new-password" minLength={8} />
        </FormField>
        <Button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Sign up"}
        </Button>
        <Message text={error} type="error" />
      </form>
      <AuthLinks links={[{ href: "/login", label: "Already have an account? Login" }]} />
    </AuthPage>
  );
}
