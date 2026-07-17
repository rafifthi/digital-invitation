"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { SectionHeading, ToggleRow } from "./shared";

export function SettingsPanel() {
  const [guestOnly, setGuestOnly] = useState(true);
  const [comments, setComments] = useState(true);

  return (
    <section className="mx-auto max-w-[920px] space-y-5">
      <SectionHeading eyebrow="Settings" title="Invitation controls" />
      <Card>
        <CardContent className="grid gap-3 p-5">
          <ToggleRow
            title="Guest-only access"
            description="Require a matching guest name before opening the invitation."
            checked={guestOnly}
            onCheckedChange={setGuestOnly}
          />
          <ToggleRow
            title="Public comments"
            description="Allow guests to leave wishes on the invitation page."
            checked={comments}
            onCheckedChange={setComments}
          />
        </CardContent>
      </Card>
    </section>
  );
}
