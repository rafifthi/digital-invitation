"use client";

import { useState } from "react";
import { Check, KeyRound, LogOut, Mail, ShieldCheck, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import type { AccountProfile } from "./types";
import { PlanSettingsPanel } from "./plan-settings-panel";
import { Field, SectionHeading } from "./shared";

export type AccountSettingsSection = "profile" | "plan";

export function AccountSettingsPanel({ account, section = "profile" }: { account: AccountProfile; section?: AccountSettingsSection }) {
  const [emailUpdates, setEmailUpdates] = useState(true);
  const [saved, setSaved] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const savePreferences = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const signOut = async () => {
    setSigningOut(true);
    const response = await fetch("/api/auth/sign-out", { method: "POST" });
    if (!response.ok) {
      setSigningOut(false);
      return;
    }
    window.location.assign("/sign-in");
  };

  return (
    <section className="mx-auto max-w-[1020px] space-y-6">
      <SectionHeading
        eyebrow="Account settings"
        title={section === "profile" ? "Profile and access" : "Plan & payment"}
      />

      {section === "profile" && (
        <div className="grid gap-5">
          <Card>
            <CardHeader className="border-b">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <CardTitle className="font-medium tracking-[-0.02em]">Demo profile</CardTitle>
                  <CardDescription className="mt-1">Identity is read from server-side environment variables.</CardDescription>
                </div>
                <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">
                  <ShieldCheck className="mr-1 size-3.5" /> Active
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 pt-5">
              <div className="grid grid-cols-2 gap-4 max-[560px]:grid-cols-1">
                <Field label="Account name">
                  <div className="relative">
                    <UserRound className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
                    <Input value={account.name} readOnly className="bg-[#fafafa] pl-9" />
                  </div>
                </Field>
                <Field label="Email address">
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#999999]" />
                    <Input value={account.email} readOnly className="bg-[#fafafa] pl-9" />
                  </div>
                </Field>
              </div>
              <p className="text-xs leading-5 text-muted-foreground">
                Update <code>AUTH_NAME</code> and <code>AUTH_EMAIL</code> in <code>.env.local</code> to change these values.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-medium tracking-[-0.02em]">Preferences</CardTitle>
              <CardDescription>Control account-level communication.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              <div className="flex min-h-16 items-center justify-between gap-4 rounded-xl border bg-[#fafafa] p-4">
                <div>
                  <p className="text-sm font-medium">Email updates</p>
                  <p className="mt-1 text-sm text-muted-foreground">Receive product and invitation activity summaries.</p>
                </div>
                <Switch checked={emailUpdates} onCheckedChange={setEmailUpdates} aria-label="Email updates" />
              </div>
              <Button type="button" onClick={savePreferences} className="w-fit max-[560px]:w-full">
                {saved && <Check />}
                {saved ? "Saved" : "Save preferences"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="font-medium tracking-[-0.02em]">Security</CardTitle>
              <CardDescription>The current authentication layer is for local demo use.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-3">
              <div className="flex items-center gap-3 rounded-xl border bg-[#fafafa] p-4">
                <span className="grid size-9 place-items-center rounded-full bg-[#eeedff] text-[#7772df]">
                  <KeyRound className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-medium">Environment password</p>
                  <p className="mt-0.5 text-sm text-muted-foreground">Managed with <code>AUTH_PASSWORD</code>.</p>
                </div>
              </div>
              <Button
                type="button"
                variant="outline"
                onClick={() => void signOut()}
                disabled={signingOut}
                className="mt-1 w-fit text-[#b62d00] hover:bg-[#fff1ec] hover:text-[#b62d00] max-[560px]:w-full"
              >
                <LogOut /> {signingOut ? "Signing out..." : "Sign out"}
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {section === "plan" && (
        <div>
          <PlanSettingsPanel />
        </div>
      )}
    </section>
  );
}
