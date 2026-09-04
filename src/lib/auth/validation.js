export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function isValidPassword(password) {
  return typeof password === "string" && password.length >= 8;
}

export function isValidOtpCode(code) {
  return /^\d{6}$/.test(code);
}

export function normalizeEmail(email) {
  return email.trim().toLowerCase();
}

export function normalizeUsername(username) {
  return username.trim().toLowerCase();
}
