import { ForgotPasswordForm } from "@/components/auth/ForgotPasswordForm";

export const metadata = {
  title: "Forgot password",
  description: "Request a 6-digit OTP to reset your Arudio account password.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
