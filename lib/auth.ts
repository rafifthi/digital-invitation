import type { AccountProfile } from "@/components/dashboard/types";

export const AUTH_COOKIE_NAME = "riuh_session";

const FALLBACK_ACCOUNT = {
  name: "Rafif & Kanza",
  email: "demo@example.com",
  password: "password",
  sessionToken: "riuh-local-demo-session",
};

export function getDemoAccount(): AccountProfile {
  return {
    name: process.env.AUTH_NAME || FALLBACK_ACCOUNT.name,
    email: process.env.AUTH_EMAIL || FALLBACK_ACCOUNT.email,
  };
}

export function getDemoPassword() {
  return process.env.AUTH_PASSWORD || FALLBACK_ACCOUNT.password;
}

export function getSessionToken() {
  return process.env.AUTH_SESSION_TOKEN || FALLBACK_ACCOUNT.sessionToken;
}

export function credentialsMatch(email: string, password: string) {
  const account = getDemoAccount();
  return (
    email.trim().toLowerCase() === account.email.toLowerCase() &&
    password === getDemoPassword()
  );
}
