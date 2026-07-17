"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { ArrowRight, Eye, EyeOff, LoaderCircle, LockKeyhole, Mail, UserRound } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type AuthMode = "sign-in" | "sign-up";

export function AuthForm({ mode }: { mode: AuthMode }) {
  const isSignUp = mode === "sign-up";
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (isSignUp && password !== confirmPassword) {
      setError("Passwords do not match.");
      setLoading(false);
      return;
    }

    const response = await fetch(`/api/auth/${mode}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: String(data.get("name") || ""),
        email: String(data.get("email") || ""),
        password,
      }),
    });
    const result = (await response.json()) as { error?: string };

    if (!response.ok) {
      setError(result.error || "Unable to continue.");
      setLoading(false);
      return;
    }

    window.location.assign("/");
  };

  return (
    <form onSubmit={submit} className="grid gap-4">
      {isSignUp && (
        <div className="grid gap-2">
          <Label htmlFor="name">Account name</Label>
          <div className="relative">
            <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
            <Input id="name" name="name" autoComplete="name" placeholder="Rafif & Kanza" className="pl-9" required />
          </div>
        </div>
      )}

      <div className="grid gap-2">
        <Label htmlFor="email">Email address</Label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
          <Input id="email" name="email" type="email" autoComplete="email" placeholder="you@example.com" className="pl-9" required />
        </div>
      </div>

      <div className="grid gap-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <LockKeyhole className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
          <Input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete={isSignUp ? "new-password" : "current-password"}
            minLength={8}
            className="pl-9 pr-11"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword((current) => !current)}
            className="absolute right-1.5 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-full text-[#666666] transition-colors hover:bg-[#f5f5f5] focus-visible:ring-2 focus-visible:ring-ring"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      {isSignUp && (
        <div className="grid gap-2">
          <Label htmlFor="confirmPassword">Confirm password</Label>
          <Input id="confirmPassword" name="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={8} required />
        </div>
      )}

      {error && (
        <p role="alert" className="rounded-xl border border-[#ffd6c8] bg-[#fff1ec] px-3 py-2.5 text-sm text-[#b62d00]">
          {error}
        </p>
      )}

      <Button type="submit" disabled={loading} className="mt-1 w-full">
        {loading ? <LoaderCircle className="animate-spin" /> : <ArrowRight />}
        {loading ? "Please wait..." : isSignUp ? "Create demo account" : "Sign in"}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? "Already have access?" : "Need a demo account?"}{" "}
        <Link href={isSignUp ? "/sign-in" : "/sign-up"} className="font-medium text-foreground underline decoration-[#c9c7f8] underline-offset-4 hover:decoration-primary">
          {isSignUp ? "Sign in" : "Sign up"}
        </Link>
      </p>
    </form>
  );
}
