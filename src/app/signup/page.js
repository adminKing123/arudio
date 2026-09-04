import { SignupForm } from "@/components/auth/SignupForm";

export const metadata = {
  title: "Sign up | Arudio",
  description: "Create an Arudio account with email, password, and profile details.",
};

export default function SignupPage() {
  return <SignupForm />;
}
