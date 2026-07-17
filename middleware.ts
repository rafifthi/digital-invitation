import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { AUTH_COOKIE_NAME, getSessionToken } from "@/lib/auth";

export function middleware(request: NextRequest) {
  const session = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (session !== getSessionToken()) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
