import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign up",
  description: "Create an Arudio account with email, password, and profile details.",
};

export default function SignupPage() {
  return <SignupForm />;
}
