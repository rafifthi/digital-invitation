"use client";

import { useState } from "react";
import { CheckCircle2, MessageCircleHeart } from "lucide-react";
import type { GuestResponseInput } from "@/components/dashboard/types";
import type { Language } from "@/lib/types";
import { cn } from "@/lib/utils";

type RsvpWishesFormProps = {
  accentColor: string;
  language: Language;
  variant: "sunny" | "sienna" | "serene";
  onSubmit: (response: GuestResponseInput) => void;
};

const EMPTY_RESPONSE: GuestResponseInput = {
  name: "",
  whatsapp: "",
  pax: 1,
  rsvp: "Attending",
  wish: "",
};

export function RsvpWishesForm({ accentColor, language, variant, onSubmit }: RsvpWishesFormProps) {
  const [open, setOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [response, setResponse] = useState<GuestResponseInput>(EMPTY_RESPONSE);
  const isId = language === "ID";
  const fieldClass = cn(
    "h-9 w-full border bg-white/80 px-2.5 text-[11px] outline-none transition-colors placeholder:text-current/40 focus:border-current",
    variant === "sunny"
      ? "rounded-lg border-[#80604f]/25"
      : variant === "serene"
        ? "rounded-none border-[#6c7c71]/30 bg-[#f8f5ed]/85"
        : "rounded-sm border-[#1f4054]/25",
  );

  const setField = <K extends keyof GuestResponseInput>(field: K, value: GuestResponseInput[K]) => {
    setResponse((current) => ({ ...current, [field]: value }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!response.name.trim() || !response.whatsapp.trim()) return;
    onSubmit(response);
    setSubmitted(true);
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={cn(
          "mt-5 inline-flex items-center gap-2 px-5 py-2.5 text-[10px] font-medium text-white transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-current focus-visible:ring-offset-2",
          variant === "sunny"
            ? "rounded-lg uppercase tracking-wider"
            : variant === "serene"
              ? "rounded-none uppercase tracking-[0.08em]"
              : "rounded-sm font-serif text-[11px]",
        )}
        style={{ backgroundColor: accentColor }}
      >
        <MessageCircleHeart className="size-3.5" />
        {isId ? "Isi RSVP & ucapan" : "RSVP & leave a wish"}
      </button>
    );
  }

  if (submitted) {
    return (
      <div className={cn(
        "mt-5 border bg-white/65 p-4 text-center",
        variant === "sunny" ? "rounded-xl border-[#80604f]/20" : variant === "serene" ? "rounded-none border-[#6c7c71]/25" : "rounded-sm border-[#1f4054]/20",
      )} aria-live="polite">
        <CheckCircle2 className="mx-auto size-5 text-[#33a953]" />
        <strong className="mt-2 block text-xs">{isId ? "RSVP sudah diterima" : "Your RSVP is received"}</strong>
        <p className="mx-auto mt-1 max-w-[28ch] text-[10px] leading-4 opacity-70">
          {response.wish.trim()
            ? (isId ? "Ucapan Anda akan tampil setelah disetujui pengantin." : "Your wish will appear after the couple approves it.")
            : (isId ? "Terima kasih sudah mengonfirmasi kehadiran." : "Thank you for confirming your attendance.")}
        </p>
        <button type="button" className="mt-3 text-[10px] font-medium underline underline-offset-4" onClick={() => setSubmitted(false)}>
          {isId ? "Ubah jawaban" : "Edit response"}
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={cn(
      "mt-5 border bg-white/55 p-3 text-left",
      variant === "sunny" ? "rounded-xl border-[#80604f]/20" : variant === "serene" ? "rounded-none border-[#6c7c71]/25" : "rounded-sm border-[#1f4054]/20",
    )}>
      <div className="grid gap-2.5">
        <InvitationField label={isId ? "Nama" : "Name"}>
          <input className={fieldClass} value={response.name} onChange={(event) => setField("name", event.target.value)} placeholder={isId ? "Nama lengkap" : "Full name"} required />
        </InvitationField>
        <InvitationField label="WhatsApp">
          <input className={fieldClass} value={response.whatsapp} onChange={(event) => setField("whatsapp", event.target.value)} placeholder="08xx xxxx xxxx" inputMode="tel" required />
        </InvitationField>
        <div className="grid grid-cols-[1fr_68px] gap-2">
          <InvitationField label={isId ? "Kehadiran" : "Attendance"}>
            <select className={fieldClass} value={response.rsvp} onChange={(event) => setField("rsvp", event.target.value as GuestResponseInput["rsvp"])}>
              <option value="Attending">{isId ? "Hadir" : "Attending"}</option>
              <option value="Not Attending">{isId ? "Tidak hadir" : "Not attending"}</option>
            </select>
          </InvitationField>
          <InvitationField label="Pax">
            <input className={fieldClass} type="number" min={1} value={response.pax} onChange={(event) => setField("pax", Math.max(1, Number(event.target.value) || 1))} />
          </InvitationField>
        </div>
        <InvitationField label={isId ? "Ucapan untuk pengantin (opsional)" : "Wish for the couple (optional)"}>
          <textarea
            className={cn(fieldClass, "h-20 resize-none py-2 leading-4")}
            value={response.wish}
            onChange={(event) => setField("wish", event.target.value)}
            placeholder={isId ? "Tulis doa dan ucapan terbaik Anda" : "Write your wishes and blessings"}
            maxLength={500}
          />
        </InvitationField>
      </div>
      <p className="mt-2 text-[9px] leading-4 opacity-60">
        {isId ? "Ucapan akan direview sebelum tampil di undangan." : "Wishes are reviewed before appearing on the invitation."}
      </p>
      <div className="mt-3 flex gap-2">
        <button type="button" className="flex-1 border border-current/20 px-3 py-2 text-[10px] font-medium" onClick={() => setOpen(false)}>
          {isId ? "Batal" : "Cancel"}
        </button>
        <button type="submit" className="flex-1 px-3 py-2 text-[10px] font-medium text-white disabled:opacity-50" style={{ backgroundColor: accentColor }} disabled={!response.name.trim() || !response.whatsapp.trim()}>
          {isId ? "Kirim RSVP" : "Send RSVP"}
        </button>
      </div>
    </form>
  );
}

function InvitationField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="grid gap-1">
      <span className="text-[9px] font-medium uppercase tracking-[0.1em] opacity-65">{label}</span>
      {children}
    </label>
  );
}
