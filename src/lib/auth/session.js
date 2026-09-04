import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";
export const PASSWORD_RESET_COOKIE = "password_reset";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;
const PASSWORD_RESET_MAX_AGE = 60 * 15;

function getSecretKey() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET is not configured.");
  }

  return new TextEncoder().encode(secret);
}

/**
 * @param {{ id: number, email: string }} user
 */
export async function createSessionToken(user) {
  return new SignJWT({ email: user.email })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(String(user.id))
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecretKey());
}

/** @param {string | undefined | null} token */
export async function verifySessionToken(token) {
  if (!token || !process.env.AUTH_SECRET) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      return null;
    }

    return {
      userId,
      email: typeof payload.email === "string" ? payload.email : "",
    };
  } catch {
    return null;
  }
}

/** @param {string | undefined | null} token */
export async function getSessionFromToken(token) {
  if (!token) {
    return null;
  }

  return verifySessionToken(token);
}

export async function getSessionFromCookies() {
  const cookieStore = await cookies();
  return getSessionFromToken(cookieStore.get(SESSION_COOKIE)?.value);
}

/** @param {string} email */
export async function createPasswordResetToken(email) {
  return new SignJWT({ email, purpose: "password_reset" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("15m")
    .sign(getSecretKey());
}

/** @param {string | undefined | null} token */
export async function verifyPasswordResetToken(token) {
  if (!token) {
    return null;
  }

  try {
    const { payload } = await jwtVerify(token, getSecretKey());

    if (payload.purpose !== "password_reset" || typeof payload.email !== "string") {
      return null;
    }

    return { email: payload.email };
  } catch {
    return null;
  }
}

/**
 * @param {import("next/server").NextResponse} response
 * @param {string} token
 */
export function setPasswordResetCookie(response, token) {
  response.cookies.set(PASSWORD_RESET_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: PASSWORD_RESET_MAX_AGE,
  });
}

/** @param {import("next/server").NextResponse} response */
export function clearPasswordResetCookie(response) {
  response.cookies.set(PASSWORD_RESET_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getPasswordResetFromCookies() {
  const cookieStore = await cookies();
  return verifyPasswordResetToken(cookieStore.get(PASSWORD_RESET_COOKIE)?.value);
}

/**
 * @param {import("next/server").NextResponse} response
 * @param {string} token
 */
export function setSessionCookie(response, token) {
  response.cookies.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** @param {import("next/server").NextResponse} response */
export function clearSessionCookie(response) {
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
