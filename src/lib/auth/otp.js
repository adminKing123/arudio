import { db } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email/sendOtp";

export const OTP_LENGTH = 6;
export const OTP_EXPIRY_MINUTES = 10;

/** @typedef {"signup" | "password_reset"} OtpType */

export function generateOtpCode() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

/** @param {OtpType} type */
function getOtpSubject(type) {
  return type === "signup"
    ? "Verify your Arudio account"
    : "Reset your Arudio password";
}

/**
 * @param {string} email
 * @param {OtpType} type
 */
export async function createAndSendOtp(email, type) {
  await db.otp.invalidateActive(email, type);

  const code = generateOtpCode();
  const expiresAt = new Date(
    Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000,
  ).toISOString();

  await db.otp.create({
    email,
    code,
    type,
    expiresAt,
  });

  await sendOtpEmail({
    to: email,
    code,
    subject: getOtpSubject(type),
  });

  return { expiresAt };
}

/**
 * @param {string} email
 * @param {string} code
 * @param {OtpType} type
 */
export async function verifyOtp(email, code, type) {
  const otp = await db.otp.findActive(email, type);

  if (!otp) {
    return { ok: false, error: "OTP expired or not found. Request a new code." };
  }

  if (otp.code !== code.trim()) {
    return { ok: false, error: "Invalid OTP code." };
  }

  await db.otp.markUsed(otp.id);
  return { ok: true };
}
