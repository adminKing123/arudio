import { redirect } from "next/navigation";
import { VerifyOtpForm } from "@/components/auth/VerifyOtpForm";

export const metadata = {
  title: "Verify OTP | Arudio",
  description: "Verify your 6-digit OTP code for Arudio signup or password reset.",
};

export default async function VerifyOtpPage({ searchParams }) {
  const params = await searchParams;
  const email = typeof params.email === "string" ? params.email : "";
  const type =
    params.type === "password_reset" ? "password_reset" : "signup";

  if (!email) {
    redirect(type === "password_reset" ? "/forgot-password" : "/signup");
  }

  return <VerifyOtpForm email={email} type={type} />;
}
