"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading, Field } from "../shared";
import { WA_TEMPLATE_DEFAULT } from "@/lib/constants";

export function WABlast() {
  return (
    <section className="mx-auto max-w-[920px] space-y-5">
      <SectionHeading eyebrow="WhatsApp Blast" title="Send invitations" />
      <Card>
        <CardContent className="grid gap-4 p-5">
          <Field label="WA Message Template">
            <Textarea
              rows={5}
              defaultValue={WA_TEMPLATE_DEFAULT}
            />
          </Field>
          <Button type="button" className="w-full">
            <MessageCircle />
            Send WA Blast
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
