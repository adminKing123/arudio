import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import {
  clearPasswordResetCookie,
  getPasswordResetFromCookies,
} from "@/lib/auth/session";
import {
  isValidEmail,
  isValidPassword,
  normalizeEmail,
} from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");
    const password = body.password || "";
    const confirmPassword = body.confirmPassword || "";
    const resetSession = await getPasswordResetFromCookies();

    if (!resetSession || resetSession.email !== email) {
      return NextResponse.json(
        { error: "Password reset session expired. Verify OTP again." },
        { status: 403 },
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json({ error: "Passwords do not match." }, { status: 400 });
    }

    const user = await db.user.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const passwordHash = await hashPassword(password);
    await db.user.update(user.id, { passwordHash });

    const response = NextResponse.json({
      ok: true,
      message: "Password reset successfully.",
      redirectTo: "/login",
    });
    clearPasswordResetCookie(response);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Password reset failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
