import nodemailer from "nodemailer";

function getTransport() {
  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_APP_PASSWORD;

  if (!host || !user || !pass) {
    throw new Error("SMTP settings are not configured.");
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });
}

/**
 * @param {{ to: string, code: string, subject: string }} params
 */
export async function sendOtpEmail({ to, code, subject }) {
  const from = process.env.SMTP_USER;

  if (!from) {
    throw new Error("SMTP_USER is not configured.");
  }

  const transport = getTransport();

  await transport.sendMail({
    from,
    to,
    subject,
    text: `Your Arudio verification code is ${code}. It expires in 10 minutes.`,
    html: `<p>Your Arudio verification code is <strong>${code}</strong>.</p><p>It expires in 10 minutes.</p>`,
  });
}
