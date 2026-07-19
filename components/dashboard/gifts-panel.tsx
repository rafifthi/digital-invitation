"use client";

import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, UploadField } from "./shared";
import { BANK_OPTIONS, EWALLET_OPTIONS } from "@/lib/constants";
import type { Language } from "@/lib/types";
import { useDashboard } from "@/context";

export function GiftSettingsForm({ language }: { language: Language }) {
  const isId = language === "ID";
  const { invitation, setField } = useDashboard();

  return (
    <section className="rounded-2xl border bg-white p-6 max-[640px]:p-4" aria-labelledby="gift-settings-title">
      <div className="max-w-[720px]">
        <h3 id="gift-settings-title" className="text-base font-semibold">
          {isId ? "Hadiah & amplop digital" : "Gifts & digital envelopes"}
        </h3>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">
          {isId ? "Atur rekening bank, e-wallet, dan QRIS yang tampil pada undangan." : "Manage the bank account, e-wallet, and QRIS shown on the invitation."}
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <Field label={isId ? "Bank" : "Bank"}>
            <Select value={invitation.giftBank} onValueChange={(value) => setField("giftBank", value)}>
              <SelectTrigger><SelectValue placeholder={isId ? "Pilih bank" : "Select bank"} /></SelectTrigger>
              <SelectContent>
                {BANK_OPTIONS.map((bank) => <SelectItem key={bank} value={bank}>{bank}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <Field label={isId ? "Nomor rekening" : "Account number"}>
            <Input value={invitation.giftAccountNumber} onChange={(event) => setField("giftAccountNumber", event.target.value)} inputMode="numeric" />
          </Field>
        </div>

        <Field label={isId ? "Nama pemilik rekening" : "Account holder"}>
          <Input value={invitation.giftAccountName} onChange={(event) => setField("giftAccountName", event.target.value)} />
        </Field>

        <div className="grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
          <Field label="E-Wallet">
            <Select value={invitation.giftEwallet} onValueChange={(value) => setField("giftEwallet", value)}>
              <SelectTrigger><SelectValue placeholder={isId ? "Pilih e-wallet" : "Select wallet"} /></SelectTrigger>
              <SelectContent>
                {EWALLET_OPTIONS.map((wallet) => <SelectItem key={wallet} value={wallet}>{wallet}</SelectItem>)}
              </SelectContent>
            </Select>
          </Field>
          <UploadField label="QRIS" text={isId ? "Unggah kode QRIS" : "Upload QRIS code"} compact />
        </div>

        <Button type="button" variant="secondary" className="w-fit max-[560px]:w-full">
          <Plus />
          {isId ? "Tambah rekening lain" : "Add another account"}
        </Button>
      </div>
    </section>
  );
}
