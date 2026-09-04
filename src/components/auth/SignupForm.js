"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AuthPage } from "@/components/ui/AuthPage";
import { AuthFooter } from "@/components/ui/AuthFooter";
import { StepIndicator } from "@/components/ui/StepIndicator";
import { FormField } from "@/components/ui/FormField";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Message } from "@/components/ui/Message";
import { useGsapStepTransition } from "@/hooks/useGsapStepTransition";
import { isValidEmail, isValidPassword } from "@/lib/auth/validation";
import { postJson } from "@/lib/api/client";

const STEPS = ["About you", "Account", "Security"];

const STEP_COPY = {
  1: {
    title: "Create account",
    description: "Tell us a bit about yourself.",
  },
  2: {
    title: "Your account",
    description: "Set up your email and username.",
  },
  3: {
    title: "Secure your account",
    description: "Choose a strong password.",
  },
};

const INITIAL_FORM = {
  name: "",
  phone: "",
  email: "",
  username: "",
  password: "",
  confirmPassword: "",
};

export function SignupForm() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { formRef, headerRef, animateToStep, playInitialAnimation } = useGsapStepTransition(step);

  const copy = STEP_COPY[step];

  useEffect(() => {
    playInitialAnimation();
  }, [playInitialAnimation]);

  function updateField(field, value) {
    setFormData((current) => ({ ...current, [field]: value }));
  }

  function validateStep1() {
    if (!formData.name.trim()) {
      return "Full name is required.";
    }

    if (!formData.phone.trim()) {
      return "Mobile number is required.";
    }

    return "";
  }

  function validateStep2() {
    if (!isValidEmail(formData.email)) {
      return "Invalid email address.";
    }

    if (!formData.username.trim()) {
      return "Username is required.";
    }

    return "";
  }

  function validateStep3() {
    if (!isValidPassword(formData.password)) {
      return "Password must be at least 8 characters.";
    }

    if (formData.password !== formData.confirmPassword) {
      return "Passwords do not match.";
    }

    return "";
  }

  function goToStep(nextStep) {
    animateToStep(nextStep, () => setStep(nextStep));
  }

  function handleContinueStep1(event) {
    event.preventDefault();
    setError("");

    const validationError = validateStep1();
    if (validationError) {
      setError(validationError);
      return;
    }

    goToStep(2);
  }

  function handleContinueStep2(event) {
    event.preventDefault();
    setError("");

    const validationError = validateStep2();
    if (validationError) {
      setError(validationError);
      return;
    }

    goToStep(3);
  }

  function handleBack() {
    setError("");
    goToStep(step - 1);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationError = validateStep3();
    if (validationError) {
      setError(validationError);
      return;
    }

    setLoading(true);

    try {
      const { ok, data } = await postJson("/api/auth/signup", {
        email: formData.email,
        password: formData.password,
        name: formData.name.trim(),
        username: formData.username,
        phone: formData.phone.trim(),
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
    <AuthPage title={copy.title} description={copy.description} headerRef={headerRef}>
      <StepIndicator steps={STEPS} currentStep={step} />

      <div ref={formRef} className="overflow-hidden">
        {step === 1 ? (
          <form onSubmit={handleContinueStep1}>
            <FormField label="Full name" htmlFor="name">
              <Input
                id="name"
                name="name"
                type="text"
                required
                autoComplete="name"
                value={formData.name}
                onChange={(event) => updateField("name", event.target.value)}
              />
            </FormField>
            <FormField label="Mobile number" htmlFor="phone">
              <Input
                id="phone"
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                value={formData.phone}
                onChange={(event) => updateField("phone", event.target.value)}
              />
            </FormField>
            <Button type="submit">Continue</Button>
            <Message text={error} type="error" />
          </form>
        ) : null}

        {step === 2 ? (
          <form onSubmit={handleContinueStep2}>
            <FormField label="Email" htmlFor="email">
              <Input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                value={formData.email}
                onChange={(event) => updateField("email", event.target.value)}
              />
            </FormField>
            <FormField label="Username" htmlFor="username">
              <Input
                id="username"
                name="username"
                type="text"
                required
                autoComplete="username"
                value={formData.username}
                onChange={(event) => updateField("username", event.target.value)}
              />
            </FormField>
            <div className="flex gap-3">
              <Button type="button" variant="soft" className="neo-btn-flat flex-1" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" className="neo-btn-flat flex-1">
                Continue
              </Button>
            </div>
            <Message text={error} type="error" />
          </form>
        ) : null}

        {step === 3 ? (
          <form onSubmit={handleSubmit}>
            <FormField label="Password" htmlFor="password">
              <Input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={formData.password}
                onChange={(event) => updateField("password", event.target.value)}
              />
            </FormField>
            <FormField label="Confirm password" htmlFor="confirmPassword">
              <Input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                minLength={8}
                value={formData.confirmPassword}
                onChange={(event) => updateField("confirmPassword", event.target.value)}
              />
            </FormField>
            <div className="flex gap-3">
              <Button type="button" variant="soft" className="neo-btn-flat flex-1" onClick={handleBack}>
                Back
              </Button>
              <Button type="submit" loading={loading} className="neo-btn-flat flex-1">
                Sign up
              </Button>
            </div>
            <Message text={error} type="error" />
          </form>
        ) : null}
      </div>

      <AuthFooter
        prompt="Already have an account?"
        linkHref="/login"
        linkLabel="Login"
      />
    </AuthPage>
  );
}
