import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Login",
  description: "Login to your Arudio account with email and password.",
};

export default function LoginPage() {
  return <LoginForm />;
}
