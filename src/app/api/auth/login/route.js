import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { isValidEmail, normalizeEmail } from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");
    const password = body.password || "";

    if (!isValidEmail(email) || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    const user = await db.user.findByEmail(email);

    if (!user) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
    }

    if (!user.verified) {
      return NextResponse.json(
        {
          error: "Email not verified.",
          redirectTo: `/verify-otp?email=${encodeURIComponent(email)}&type=signup`,
        },
        { status: 403 },
      );
    }

    const token = await createSessionToken({ id: user.id, email: user.email });
    const response = NextResponse.json({
      ok: true,
      message: "Logged in successfully.",
      redirectTo: "/profile",
    });
    setSessionCookie(response, token);
    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Login failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
