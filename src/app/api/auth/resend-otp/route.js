import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { createAndSendOtp } from "@/lib/auth/otp";
import { isValidEmail, normalizeEmail } from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");
    const type = body.type === "password_reset" ? "password_reset" : "signup";

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    const user = await db.user.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    if (type === "signup" && user.verified) {
      return NextResponse.json({ error: "Account is already verified." }, { status: 400 });
    }

    await createAndSendOtp(email, type);

    return NextResponse.json({
      ok: true,
      message: "A new OTP has been sent to your email.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to resend OTP.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
