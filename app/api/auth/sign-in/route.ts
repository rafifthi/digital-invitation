import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, credentialsMatch, getSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  const email = body.email || "";
  const password = body.password || "";

  if (!credentialsMatch(email, password)) {
    return NextResponse.json(
      { error: "Email or password does not match the configured demo account." },
      { status: 401 },
    );
  }

  const response = NextResponse.json({ ok: true });
  response.cookies.set(AUTH_COOKIE_NAME, getSessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return response;
}
