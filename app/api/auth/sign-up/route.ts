import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME, credentialsMatch, getSessionToken } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Enter an account name." }, { status: 400 });
  }

  if (!credentialsMatch(body.email || "", body.password || "")) {
    return NextResponse.json(
      { error: "For this demo, use the email and password configured in .env.local." },
      { status: 409 },
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
