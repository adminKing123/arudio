import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyOtp } from "@/lib/auth/otp";
import {
  createPasswordResetToken,
  createSessionToken,
  setPasswordResetCookie,
  setSessionCookie,
} from "@/lib/auth/session";
import {
  isValidEmail,
  isValidOtpCode,
  normalizeEmail,
} from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");
    const code = String(body.code || "").trim();
    const type = body.type === "password_reset" ? "password_reset" : "signup";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!isValidOtpCode(code)) {
      return NextResponse.json({ error: "OTP must be a 6-digit code." }, { status: 400 });
    }

    const result = await verifyOtp(email, code, type);

    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    if (type === "signup") {
      const user = await db.user.findByEmail(email);

      if (!user) {
        return NextResponse.json({ error: "User not found." }, { status: 404 });
      }

      await db.user.update(user.id, { verified: true });
      const token = await createSessionToken({ id: user.id, email: user.email });
      const response = NextResponse.json({
        ok: true,
        message: "Email verified successfully.",
        redirectTo: "/profile",
      });
      setSessionCookie(response, token);
      return response;
    }

    const resetToken = await createPasswordResetToken(email);
    const response = NextResponse.json({
      ok: true,
      message: "OTP verified. You can reset your password.",
      redirectTo: `/reset-password?email=${encodeURIComponent(email)}`,
    });
    setPasswordResetCookie(response, resetToken);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "OTP verification failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
