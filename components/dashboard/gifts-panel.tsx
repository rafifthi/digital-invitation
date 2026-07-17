"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SectionHeading, Field, UploadField } from "./shared";
import { BANK_OPTIONS, EWALLET_OPTIONS } from "@/lib/constants";

export function GiftsPanel() {
  return (
    <section className="mx-auto max-w-[920px] space-y-5">
      <SectionHeading eyebrow="Gifts & Digital Envelopes" title="Payment methods" />
      <Card>
        <CardContent className="grid gap-4 p-5">
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            <Field label="Bank">
              <Select defaultValue={BANK_OPTIONS[0]}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank" />
                </SelectTrigger>
                <SelectContent>
                  {BANK_OPTIONS.map((bank) => (
                    <SelectItem key={bank} value={bank}>
                      {bank}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <Field label="Account Number">
              <Input defaultValue="1234567890" />
            </Field>
          </div>
          <Field label="Account Holder">
            <Input defaultValue="Kanza Maharani" />
          </Field>
          <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            <Field label="E-Wallet">
              <Select defaultValue={EWALLET_OPTIONS[0]}>
                <SelectTrigger>
                  <SelectValue placeholder="Select wallet" />
                </SelectTrigger>
                <SelectContent>
                  {EWALLET_OPTIONS.map((wallet) => (
                    <SelectItem key={wallet} value={wallet}>
                      {wallet}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
            <UploadField label="QRIS Barcode" text="Upload QRIS" compact />
          </div>
          <Button type="button" variant="secondary" className="w-fit max-[560px]:w-full">
            <Plus />
            Add Another Account
          </Button>
        </CardContent>
      </Card>
    </section>
  );
}
