import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAndSendOtp } from "@/lib/auth/otp";
import { isValidEmail, normalizeEmail } from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const user = await db.user.findByEmail(email);

    if (!user) {
      return NextResponse.json({
        ok: true,
        message: "If the email exists, an OTP has been sent.",
      });
    }

    await createAndSendOtp(email, "password_reset");

    return NextResponse.json({
      ok: true,
      message: "If the email exists, an OTP has been sent.",
      email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to send reset OTP.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
