"use client";

import { useMemo, useState } from "react";
import { Check, Link2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/context";
import {
  INVITATION_DOMAIN,
  invitationHost,
  invitationSubdomain,
} from "@/lib/invitation-url";
import { cn } from "@/lib/utils";
import { Field, SectionHeading, ToggleRow } from "./shared";
import { GiftSettingsForm } from "./gifts-panel";
import type { InvitationEvent } from "./types";

const SETTINGS_TABS = ["invitation", "event", "access", "gifts"] as const;
type SettingsTab = (typeof SETTINGS_TABS)[number];

export function SettingsPanel({ initialTab }: { initialTab?: string }) {
  const {
    invitation,
    setField,
    event,
    updateEvent,
    blocks,
    setBlockField,
    language,
  } = useDashboard();
  const [activeTab, setActiveTab] = useState<SettingsTab>(() => normalizeSettingsTab(initialTab));
  const [guestOnly, setGuestOnly] = useState(true);
  const [publicWishes, setPublicWishes] = useState(true);
  const [saved, setSaved] = useState(false);
  const rsvpBlock = blocks.find((block) => block.type === "rsvp");
  const rsvpDeadline = rsvpBlock?.content.deadline ?? "2026-08-22";
  const copy = useMemo(() => settingsCopy(language), [language]);

  const saveSettings = () => {
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1600);
  };

  const selectTab = (tab: SettingsTab) => {
    setActiveTab(tab);
    window.history.replaceState(null, "", tab === "invitation" ? "/settings" : `/settings?tab=${tab}`);
  };

  return (
    <section className="mx-auto max-w-[1020px] space-y-6">
      <SectionHeading
        eyebrow={copy.eyebrow}
        title={copy.title}
        action={(
          <Button type="button" onClick={saveSettings}>
            {saved ? <Check /> : <Save />}
            {saved ? copy.saved : copy.save}
          </Button>
        )}
      />

      <div
        className="flex gap-1 overflow-x-auto border-b pb-px"
        role="tablist"
        aria-label={copy.tabListLabel}
      >
        {SETTINGS_TABS.map((tab) => (
          <button
            key={tab}
            type="button"
            role="tab"
            id={`settings-tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls={`settings-panel-${tab}`}
            onClick={() => selectTab(tab)}
            className={cn(
              "relative h-11 shrink-0 rounded-t-lg px-4 text-sm font-medium text-muted-foreground outline-none transition-colors hover:text-foreground focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
              activeTab === tab && "text-foreground after:absolute after:inset-x-3 after:-bottom-px after:h-0.5 after:rounded-full after:bg-primary",
            )}
          >
            {copy.tabs[tab]}
          </button>
        ))}
      </div>

      {activeTab === "invitation" && (
        <section
          id="settings-panel-invitation"
          role="tabpanel"
          aria-labelledby="settings-tab-invitation"
          className="rounded-2xl border bg-white p-6 max-[640px]:p-4"
        >
          <PanelIntro title={copy.invitationTitle} description={copy.invitationDescription} />
          <div className="mt-6 grid grid-cols-2 gap-4 max-[700px]:grid-cols-1">
            <Field label={copy.coupleDisplayName}>
              <Input value={invitation.coupleNames} onChange={(inputEvent) => setField("coupleNames", inputEvent.target.value)} />
            </Field>
            <Field label={copy.familyLine}>
              <Input value={invitation.familyLine} onChange={(inputEvent) => setField("familyLine", inputEvent.target.value)} />
            </Field>
            <Field label={copy.groomName}>
              <Input value={invitation.groomName} onChange={(inputEvent) => setField("groomName", inputEvent.target.value)} />
            </Field>
            <Field label={copy.brideName}>
              <Input value={invitation.brideName} onChange={(inputEvent) => setField("brideName", inputEvent.target.value)} />
            </Field>
            <div className="col-span-2 max-[700px]:col-span-1">
              <Field label={copy.openingText}>
                <Textarea rows={4} value={invitation.openingText} onChange={(inputEvent) => setField("openingText", inputEvent.target.value)} />
              </Field>
            </div>
            <Field label={copy.address}>
              <div className="flex h-10 min-w-0 items-center overflow-hidden rounded-lg border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25">
                <span className="pl-3 text-xs text-muted-foreground">https://</span>
                <Input
                  value={invitationSubdomain(invitation.customSlug)}
                  onChange={(inputEvent) => setField("customSlug", invitationHost(inputEvent.target.value))}
                  aria-label={copy.subdomain}
                  autoCapitalize="none"
                  autoCorrect="off"
                  spellCheck={false}
                  className="min-w-16 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0"
                />
                <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">.{INVITATION_DOMAIN}</span>
              </div>
            </Field>
            <Field label={copy.rsvpDeadline}>
              <Input
                type="date"
                value={rsvpDeadline}
                onChange={(inputEvent) => rsvpBlock && setBlockField(rsvpBlock.id, "deadline", inputEvent.target.value)}
              />
            </Field>
          </div>
        </section>
      )}

      {activeTab === "event" && (
        <section
          id="settings-panel-event"
          role="tabpanel"
          aria-labelledby="settings-tab-event"
          className="rounded-2xl border bg-white p-6 max-[640px]:p-4"
        >
          <PanelIntro title={copy.eventDetails} description={copy.eventDescription} />
          <div className="mt-6 grid grid-cols-2 gap-4 max-[640px]:grid-cols-1">
            <Field label={copy.eventType}>
              <Select value={event.type} onValueChange={(value) => updateEvent({ type: value as InvitationEvent["type"] })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="ceremony">{copy.ceremony}</SelectItem>
                  <SelectItem value="reception">{copy.reception}</SelectItem>
                  <SelectItem value="other">{copy.other}</SelectItem>
                </SelectContent>
              </Select>
            </Field>
            <Field label={copy.eventTitle}>
              <Input value={event.title} onChange={(inputEvent) => updateEvent({ title: inputEvent.target.value })} />
            </Field>
            <Field label={copy.eventDate}>
              <Input type="date" value={event.date} onChange={(inputEvent) => updateEvent({ date: inputEvent.target.value })} />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={copy.startTime}>
                <Input type="time" value={event.startTime} onChange={(inputEvent) => updateEvent({ startTime: inputEvent.target.value })} />
              </Field>
              <Field label={copy.endTime}>
                <Input type="time" value={event.endTime} onChange={(inputEvent) => updateEvent({ endTime: inputEvent.target.value })} />
              </Field>
            </div>
            <div className="col-span-2 max-[640px]:col-span-1">
              <Field label={copy.venueName}>
                <Input value={event.venueName} onChange={(inputEvent) => updateEvent({ venueName: inputEvent.target.value })} />
              </Field>
            </div>
            <div className="col-span-2 max-[640px]:col-span-1">
              <Field label={copy.venueAddress}>
                <Textarea rows={3} value={event.venueAddress} onChange={(inputEvent) => updateEvent({ venueAddress: inputEvent.target.value })} />
              </Field>
            </div>
            <div className="col-span-2 max-[640px]:col-span-1">
              <Field label={copy.mapsUrl}>
                <div className="relative">
                  <Link2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input className="pl-9" type="url" value={event.mapsUrl} onChange={(inputEvent) => updateEvent({ mapsUrl: inputEvent.target.value })} placeholder="https://maps.google.com/..." />
                </div>
              </Field>
            </div>
          </div>
        </section>
      )}

      {activeTab === "access" && (
        <section
          id="settings-panel-access"
          role="tabpanel"
          aria-labelledby="settings-tab-access"
          className="rounded-2xl border bg-white p-6 max-[640px]:p-4"
        >
          <PanelIntro title={copy.accessTitle} description={copy.accessDescription} />
          <div className="mt-5 grid gap-3">
            <ToggleRow title={copy.guestOnly} description={copy.guestOnlyDescription} checked={guestOnly} onCheckedChange={setGuestOnly} />
            <ToggleRow title={copy.publicWishes} description={copy.publicWishesDescription} checked={publicWishes} onCheckedChange={setPublicWishes} />
          </div>
        </section>
      )}

      {activeTab === "gifts" && (
        <div id="settings-panel-gifts" role="tabpanel" aria-labelledby="settings-tab-gifts">
          <GiftSettingsForm language={language} />
        </div>
      )}
    </section>
  );
}

function PanelIntro({ title, description }: { title: string; description: string }) {
  return (
    <div className="max-w-[720px]">
      <h3 className="text-base font-semibold">{title}</h3>
      <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function normalizeSettingsTab(value?: string): SettingsTab {
  return SETTINGS_TABS.includes(value as SettingsTab) ? value as SettingsTab : "invitation";
}

function settingsCopy(language: "EN" | "ID") {
  const isId = language === "ID";
  return {
    eyebrow: isId ? "Pengaturan workspace" : "Workspace settings",
    title: isId ? "Informasi undangan & acara" : "Invitation & event information",
    save: isId ? "Simpan perubahan" : "Save changes",
    saved: isId ? "Tersimpan" : "Saved",
    tabListLabel: isId ? "Bagian pengaturan undangan" : "Invitation settings sections",
    tabs: {
      invitation: isId ? "Undangan" : "Invitation",
      event: isId ? "Acara" : "Event",
      access: isId ? "Akses tamu" : "Guest access",
      gifts: isId ? "Hadiah" : "Gifts",
    } satisfies Record<SettingsTab, string>,
    invitationTitle: isId ? "Informasi undangan" : "Invitation information",
    invitationDescription: isId ? "Satu workspace mengelola satu undangan dan satu acara." : "One workspace manages one invitation and one event.",
    coupleDisplayName: isId ? "Nama pasangan di undangan" : "Couple display name",
    familyLine: isId ? "Keterangan keluarga" : "Family line",
    groomName: isId ? "Nama mempelai pria" : "Groom name",
    brideName: isId ? "Nama mempelai wanita" : "Bride name",
    openingText: isId ? "Teks pembuka" : "Opening text",
    address: isId ? "Alamat undangan" : "Invitation address",
    subdomain: isId ? "Subdomain undangan" : "Invitation subdomain",
    rsvpDeadline: isId ? "Batas konfirmasi RSVP" : "RSVP deadline",
    eventDetails: isId ? "Detail acara" : "Event details",
    eventDescription: isId ? "Tanggal, waktu, dan tempat ini dipakai oleh dashboard, countdown, dan live preview." : "This date, time, and venue power the dashboard, countdown, and live preview.",
    eventType: isId ? "Jenis acara" : "Event type",
    ceremony: isId ? "Akad / pemberkatan" : "Ceremony",
    reception: isId ? "Resepsi" : "Reception",
    other: isId ? "Acara lainnya" : "Other event",
    eventTitle: isId ? "Nama acara" : "Event name",
    eventDate: isId ? "Tanggal" : "Date",
    startTime: isId ? "Mulai" : "Start",
    endTime: isId ? "Selesai" : "End",
    venueName: isId ? "Nama tempat" : "Venue name",
    venueAddress: isId ? "Alamat lengkap" : "Full address",
    mapsUrl: isId ? "Tautan Google Maps" : "Google Maps link",
    accessTitle: isId ? "Akses & interaksi tamu" : "Guest access & interaction",
    accessDescription: isId ? "Atur siapa yang dapat membuka undangan dan mengirim ucapan." : "Control who can open the invitation and submit wishes.",
    guestOnly: isId ? "Akses khusus tamu" : "Guest-only access",
    guestOnlyDescription: isId ? "Tamu harus menggunakan nama yang terdaftar untuk membuka undangan." : "Guests must use a registered name to open the invitation.",
    publicWishes: isId ? "Ucapan dari tamu" : "Guest wishes",
    publicWishesDescription: isId ? "Izinkan tamu mengirim ucapan melalui form RSVP untuk dimoderasi di Guest → Wishes." : "Allow guests to submit a wish from RSVP for moderation in Guest → Wishes.",
  };
}
