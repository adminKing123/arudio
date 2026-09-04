import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createAndSendOtp } from "@/lib/auth/otp";
import {
  isValidEmail,
  isValidPassword,
  normalizeEmail,
  normalizeUsername,
} from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const email = normalizeEmail(body.email || "");
    const password = body.password || "";
    const name = String(body.name || "").trim();
    const username = normalizeUsername(body.username || "");
    const phone = String(body.phone || "").trim();

    if (!isValidEmail(email)) {
      return NextResponse.json({ error: "Invalid email address." }, { status: 400 });
    }

    if (!isValidPassword(password)) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 },
      );
    }

    if (!name || !username || !phone) {
      return NextResponse.json(
        { error: "Name, username, and phone are required." },
        { status: 400 },
      );
    }

    if (await db.user.findByEmail(email)) {
      return NextResponse.json({ error: "Email is already registered." }, { status: 409 });
    }

    if (await db.user.findByUsername(username)) {
      return NextResponse.json({ error: "Username is already taken." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);
    const now = new Date().toISOString();

    await db.user.create({
      email,
      passwordHash,
      name,
      username,
      phone,
      verified: false,
      createdAt: now,
      updatedAt: now,
    });

    await createAndSendOtp(email, "signup");

    return NextResponse.json({
      ok: true,
      message: "Account created. Verify the OTP sent to your email.",
      email,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Signup failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
