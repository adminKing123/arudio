import { redirect } from "next/navigation";
import { ResetPasswordForm } from "@/components/auth/ResetPasswordForm";

export const metadata = {
  title: "Reset password",
  description: "Set a new password for your Arudio account after OTP verification.",
};

export default async function ResetPasswordPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";

  if (!email) {
    redirect("/forgot-password");
  }

  return <ResetPasswordForm email={email} />;
}
