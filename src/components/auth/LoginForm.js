"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/ui/AuthPage";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Message } from "@/components/ui/Message";
import { AuthFooter } from "@/components/ui/AuthFooter";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { postJson } from "@/lib/api/client";

/** @typedef {"username" | "email"} LoginMethod */

const LOGIN_METHOD_OPTIONS = [
  { value: "username", label: "Username" },
  { value: "email", label: "Email" },
];

export function LoginForm() {
  const router = useRouter();
  const [loginWith, setLoginWith] = useState(/** @type {LoginMethod} */ ("username"));
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handleLoginMethodChange(method) {
    setLoginWith(/** @type {LoginMethod} */ (method));
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(event.currentTarget);

    try {
      const { ok, data } = await postJson("/api/auth/login", {
        loginWith,
        identifier: formData.get("identifier"),
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
        <SegmentedControl
          className="mb-5"
          aria-label="Login method"
          options={LOGIN_METHOD_OPTIONS}
          value={loginWith}
          onChange={handleLoginMethodChange}
        />

        <FormField
          label={loginWith === "username" ? "Username" : "Email"}
          htmlFor="identifier"
        >
          <Input
            id="identifier"
            name="identifier"
            type={loginWith === "username" ? "text" : "email"}
            required
            autoComplete={loginWith === "username" ? "username" : "email"}
            key={loginWith}
          />
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
      <AuthFooter
        prompt="Don't have an account?"
        linkHref="/signup"
        linkLabel="Create account"
      />
    </AuthPage>
  );
}
