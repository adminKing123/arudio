import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  createSessionToken,
  setSessionCookie,
} from "@/lib/auth/session";
import { isValidEmail, normalizeEmail, normalizeUsername } from "@/lib/auth/validation";

export async function POST(request) {
  try {
    const body = await request.json();
    const loginWith = body.loginWith === "email" ? "email" : "username";
    const password = body.password || "";
    const identifier = String(body.identifier || "").trim();

    if (!identifier || !password) {
      return NextResponse.json(
        {
          error:
            loginWith === "email"
              ? "Email and password are required."
              : "Username and password are required.",
        },
        { status: 400 },
      );
    }

    let user;

    if (loginWith === "email") {
      const email = normalizeEmail(identifier);

      if (!isValidEmail(email)) {
        return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
      }

      user = await db.user.findByEmail(email);
    } else {
      const username = normalizeUsername(identifier);
      user = await db.user.findByUsername(username);
    }

    if (!user) {
      return NextResponse.json(
        {
          error:
            loginWith === "email"
              ? "Invalid email or password."
              : "Invalid username or password.",
        },
        { status: 401 },
      );
    }

    const validPassword = await verifyPassword(password, user.passwordHash);

    if (!validPassword) {
      return NextResponse.json(
        {
          error:
            loginWith === "email"
              ? "Invalid email or password."
              : "Invalid username or password.",
        },
        { status: 401 },
      );
    }

    if (!user.verified) {
      return NextResponse.json(
        {
          error: "Email not verified.",
          redirectTo: `/verify-otp?email=${encodeURIComponent(user.email)}&type=signup`,
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
