"use client";

import { useState } from "react";
import { Gift, Heart, MapPin, MessageCircleHeart, Monitor, Smartphone, Sparkles, Tablet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { RsvpWishesForm } from "@/components/invitation/rsvp-wishes-form";
import { cn } from "@/lib/utils";
import type { GuestResponseInput, GuestWithId, InvitationBlock, InvitationData, InvitationEvent, TemplateId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import { blockText, getTemplate, templateText } from "@/lib/templates";
import { SereneRenderer } from "./serene-renderer";

type PreviewInvitation = Pick<
  InvitationData,
  "coupleNames" | "weddingDate" | "openingText" | "groomName" | "brideName" | "familyLine" | "eventTime" | "venueName" | "venueAddress" | "accentColor" | "fontStyle" | "youtubeUrl" | "giftBank" | "giftAccountNumber" | "giftAccountName" | "giftEwallet"
>;

type PreviewDevice = "desktop" | "tablet" | "mobile";

const DEVICE_OPTIONS = [
  { id: "desktop" as const, icon: Monitor, label: "Desktop" },
  { id: "tablet" as const, icon: Tablet, label: "Tablet" },
  { id: "mobile" as const, icon: Smartphone, label: "Mobile" },
];

export function LivePreview({ invitation, event, blocks, selectedTemplate, language, guests, musicPlaying, onMusicPlayingChange, onSubmitRsvp }: {
  invitation: PreviewInvitation;
  event: InvitationEvent;
  blocks: InvitationBlock[];
  selectedTemplate: TemplateId;
  language: Language;
  guests: GuestWithId[];
  musicPlaying: boolean;
  onMusicPlayingChange: (value: boolean) => void;
  onSubmitRsvp: (response: GuestResponseInput) => void;
}) {
  const [device, setDevice] = useState<PreviewDevice>("mobile");
  const allowedBlocks = getTemplate(selectedTemplate).allowedBlocks;
  const visibleBlocks = allowedBlocks
    .map((type) => blocks.find((block) => block.type === type && block.visible))
    .filter((block): block is InvitationBlock => Boolean(block));
  const template = getTemplate(selectedTemplate);
  const previewInvitation = {
    ...invitation,
    weddingDate: event.date,
    eventTime: formatEventTime(event),
    venueName: event.venueName,
    venueAddress: event.venueAddress,
  };

  return (
    <aside id="invitation-preview" className="flex h-full min-h-0 w-[450px] shrink-0 flex-col items-center overflow-y-auto border-l bg-white px-6 py-7 max-[1180px]:col-start-2 max-[1180px]:w-[410px] max-[1180px]:border-l-0 max-[1180px]:border-t max-[820px]:order-first max-[820px]:!sticky max-[820px]:top-0 max-[820px]:z-20 max-[820px]:!h-[48svh] max-[820px]:!min-h-0 max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:shrink-0 max-[820px]:overflow-hidden max-[820px]:border-b max-[820px]:px-4 max-[820px]:py-3 max-[820px]:shadow-[0_8px_16px_rgba(24,25,37,0.05)]">
      <div className="mb-4 flex w-full max-w-[410px] items-start justify-between gap-4 max-[820px]:mb-2">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">{tr(language, "livePreview")}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">{templateText(template, language).name}</h2>
        </div>
        <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">{tr(language, "live")}</Badge>
      </div>

      <div className="mb-4 flex rounded-full bg-[#f5f5f5] p-1 max-[820px]:mb-2" aria-label={language === "ID" ? "Ukuran pratinjau" : "Preview size"}>
        {DEVICE_OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = device === option.id;
          return (
            <button
              key={option.id}
              type="button"
              onClick={() => setDevice(option.id)}
              aria-pressed={selected}
              aria-label={option.label}
              className={cn(
                "flex h-8 items-center gap-1.5 rounded-full px-3 text-xs font-medium text-muted-foreground transition-colors focus-visible:ring-2 focus-visible:ring-ring",
                selected && "bg-white text-[#625cc7] shadow-[0_1px_2px_rgba(24,25,37,0.08)]",
              )}
            >
              <Icon className="size-3.5" />
              <span className="max-[980px]:sr-only">{option.label}</span>
            </button>
          );
        })}
      </div>

      <div
        className={cn(
          "relative border border-[#2c2d3b] bg-[#181925] shadow-phone transition-[width,border-radius] duration-200",
          device === "mobile" && "aspect-[9/18.8] w-[min(100%,330px,calc((100vh-172px)*0.478))] rounded-[34px] p-3 max-[1180px]:w-[min(100%,320px)]",
          device === "tablet" && "aspect-[4/5] w-[min(100%,390px,calc((100vh-172px)*0.8))] rounded-[28px] p-2.5",
          device === "desktop" && "aspect-[16/10] w-full max-w-[410px] rounded-[18px] p-2",
        )}
      >
        {device === "mobile" && <div className="absolute left-1/2 top-3 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-[#181925]" />}
        <div
          className={cn(
            "phone-scrollbar h-full overflow-hidden bg-[#fbf8f2]",
            device === "mobile" ? "rounded-[25px]" : device === "tablet" ? "rounded-[20px]" : "rounded-[11px]",
          )}
        >
          {visibleBlocks.length === 0 ? (
            <div className="grid h-full place-items-center p-8 text-center">
              <div><Sparkles className="mx-auto size-6 text-[#918df6]" /><p className="mt-3 text-sm font-medium">{language === "ID" ? "Semua bagian disembunyikan" : "All sections are hidden"}</p></div>
            </div>
          ) : selectedTemplate === "serene" ? (
            <SereneRenderer
              blocks={visibleBlocks}
              invitation={previewInvitation}
              event={event}
              language={language}
              guests={guests}
              musicPlaying={musicPlaying}
              onMusicPlayingChange={onMusicPlayingChange}
              onSubmitRsvp={onSubmitRsvp}
            />
          ) : selectedTemplate === "sienna" ? (
            <SiennaRenderer blocks={visibleBlocks} invitation={previewInvitation} event={event} language={language} guests={guests} onSubmitRsvp={onSubmitRsvp} />
          ) : (
            <SunnyRenderer blocks={visibleBlocks} invitation={previewInvitation} event={event} language={language} guests={guests} onSubmitRsvp={onSubmitRsvp} />
          )}
        </div>
      </div>
    </aside>
  );
}

function SunnyRenderer({ blocks, invitation, event, language, guests, onSubmitRsvp }: RendererProps) {
  return (
    <div className="phone-scrollbar h-full overflow-y-auto bg-[#f7f0d8] text-[#4f3c32]">
      {blocks.map((block, index) => {
        if (block.type === "hero") {
          const content = mergeContent(block, invitation);
          return (
            <section key={block.id} className="relative min-h-full overflow-hidden bg-[#d7e2cb]">
              <div className="absolute inset-x-0 top-0 h-[48%] bg-[linear-gradient(180deg,#d9d6df_0%,#a9c2a1_62%,#809f70_100%)]" />
              <div className="absolute inset-x-0 top-[36%] h-[34%] bg-[#b6c96d]" />
              <div className="absolute inset-x-0 top-[44%] h-[30%] opacity-80 [background-image:radial-gradient(circle,#f8cf49_0_2px,transparent_3px)] [background-size:18px_16px]" />
              <div className="absolute left-[34%] top-[31%] h-40 w-12 rounded-t-full bg-[#4d5047]" />
              <div className="absolute left-[52%] top-[33%] h-36 w-14 rounded-t-[50%] bg-[#faf3e8]" />
              <div className="absolute inset-x-0 bottom-0 h-[48%] bg-[linear-gradient(180deg,rgba(247,240,216,0)_0%,#f7f0d8_46%,#f7f0d8_100%)]" />
              <div className="absolute inset-x-6 bottom-10 text-center">
                <p className="text-[9px] uppercase tracking-[0.16em]">{tr(language, "weddingOf")}</p>
                <h3 className={cn("mt-2 text-[34px] leading-none tracking-[-0.04em]", displayFontClass(invitation.fontStyle))}>{content.coupleNames}</h3>
                <p className="mt-3 text-[10px]">{formatDate(content.weddingDate, language)}</p>
                <button type="button" className="mt-5 rounded-lg px-5 py-2.5 text-[10px] font-medium uppercase tracking-wider text-white" style={{ backgroundColor: invitation.accentColor }}>{tr(language, "openInvitation")}</button>
              </div>
            </section>
          );
        }

        return (
          <section key={block.id} className={`relative min-h-[360px] overflow-hidden px-6 py-14 text-center ${index % 2 ? "bg-[#edf1e2]" : "bg-[#f7f0d8]"}`}>
            <div className="absolute left-0 top-8 h-20 w-12 rounded-r-full bg-[#d7a950]/30" />
            <div className="absolute bottom-10 right-0 h-24 w-14 rounded-l-full bg-[#7f9d72]/25" />
            <span className="mx-auto grid size-10 place-items-center rounded-full bg-white/70 text-[#80604f]">{blockIcon(block.type)}</span>
            <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.16em] text-[#80604f]">{blockText(block.type, language).label}</p>
            <SunnyContent block={block} invitation={invitation} event={event} language={language} guests={guests} onSubmitRsvp={onSubmitRsvp} />
          </section>
        );
      })}
    </div>
  );
}

function SiennaRenderer({ blocks, invitation, event, language, guests, onSubmitRsvp }: RendererProps) {
  return (
    <div className="phone-scrollbar h-full overflow-y-auto bg-[#f7f4eb] text-[#1f4054]">
      {blocks.map((block, index) => {
        if (block.type === "hero") {
          const content = mergeContent(block, invitation);
          return (
            <section key={block.id} className="relative min-h-full overflow-hidden bg-[#f7f4eb] px-7 pb-10 pt-20 text-center">
              <BotanicalCorner />
              <div className="absolute inset-x-10 top-24 h-[54%] rounded-t-[120px] border border-[#c9c4b6] bg-[radial-gradient(circle_at_50%_100%,#dfe8e4_0%,#f7f4eb_58%)]" />
              <div className={cn("relative z-10 mx-auto grid size-24 place-items-center rounded-full border border-[#1f4054] bg-[#f7f4eb]/90 text-3xl", displayFontClass(invitation.fontStyle))}>
                <span>{initials(content.coupleNames)}</span>
              </div>
              <div className="relative z-10 mt-28">
                <p className="text-[9px] italic">{tr(language, "weddingOf")}</p>
                <h3 className={cn("mt-2 text-[31px] leading-none tracking-[-0.03em]", displayFontClass(invitation.fontStyle))}>{content.coupleNames}</h3>
                <p className="mt-3 text-[10px] italic">{formatDate(content.weddingDate, language)}</p>
                <button type="button" className={cn("mt-16 rounded-sm px-5 py-2.5 text-[11px] text-white", displayFontClass(invitation.fontStyle))} style={{ backgroundColor: invitation.accentColor }}>{tr(language, "openInvitation")}</button>
              </div>
            </section>
          );
        }

        return (
          <section key={block.id} className={`relative min-h-[380px] overflow-hidden border-t border-[#d8d3c7] px-7 py-16 text-center ${index % 2 ? "bg-[#eef1ec]" : "bg-[#f7f4eb]"}`}>
            <BotanicalCorner small mirrored={index % 2 === 0} />
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-[#577080]">{blockText(block.type, language).label}</p>
            <div className="mx-auto mt-3 h-px w-10 bg-[#1f4054]/35" />
            <SiennaContent block={block} invitation={invitation} event={event} language={language} guests={guests} onSubmitRsvp={onSubmitRsvp} />
          </section>
        );
      })}
    </div>
  );
}

function SunnyContent({ block, invitation, event, language, guests, onSubmitRsvp }: ContentProps) {
  const content = mergeContent(block, invitation);
  const title = blockTitle(block.type, content, language);
  return (
    <div className="mt-5">
      <h3 className={cn("text-2xl leading-tight", displayFontClass(invitation.fontStyle))}>{title}</h3>
      <p className="mx-auto mt-3 max-w-[26ch] text-[11px] leading-5 opacity-75">{blockDescription(block.type, content, language)}</p>
      {block.type === "event" && <EventPreviewDetails event={event} language={language} variant="sunny" />}
      {block.type === "rsvp" && <RsvpWishesForm accentColor={invitation.accentColor} language={language} variant="sunny" onSubmit={onSubmitRsvp} />}
      {block.type === "guestbook" && <PublishedWishes guests={guests} language={language} variant="sunny" />}
      {block.type === "gallery" && <GalleryTiles />}
    </div>
  );
}

function SiennaContent({ block, invitation, event, language, guests, onSubmitRsvp }: ContentProps) {
  const content = mergeContent(block, invitation);
  return (
    <div className="mt-7">
      <h3 className={cn("text-[25px] leading-tight", displayFontClass(invitation.fontStyle))}>{blockTitle(block.type, content, language)}</h3>
      <p className={cn("mx-auto mt-4 max-w-[28ch] text-[11px] leading-5 opacity-75", displayFontClass(invitation.fontStyle))}>{blockDescription(block.type, content, language)}</p>
      {block.type === "event" && <EventPreviewDetails event={event} language={language} variant="sienna" />}
      {block.type === "rsvp" && <RsvpWishesForm accentColor={invitation.accentColor} language={language} variant="sienna" onSubmit={onSubmitRsvp} />}
      {block.type === "guestbook" && <PublishedWishes guests={guests} language={language} variant="sienna" />}
      {block.type === "gallery" && <GalleryTiles squared />}
    </div>
  );
}

function PublishedWishes({ guests, language, variant }: { guests: GuestWithId[]; language: Language; variant: "sunny" | "sienna" }) {
  const published = guests.filter((guest) => guest.wish && guest.wishStatus === "published").slice(0, 2);

  if (published.length === 0) {
    return <p className="mt-5 text-[10px] opacity-60">{language === "ID" ? "Ucapan yang disetujui akan tampil di sini." : "Approved wishes will appear here."}</p>;
  }

  return (
    <div className="mt-5 grid gap-2 text-left">
      {published.map((guest) => (
        <figure key={guest.id} className={cn("border bg-white/55 p-3", variant === "sunny" ? "rounded-xl border-[#80604f]/15" : "rounded-sm border-[#1f4054]/15")}>
          <blockquote className="line-clamp-3 text-[10px] leading-4">“{guest.wish}”</blockquote>
          <figcaption className="mt-2 text-[9px] font-semibold uppercase tracking-[0.08em] opacity-65">{guest.name}</figcaption>
        </figure>
      ))}
    </div>
  );
}

function EventPreviewDetails({ event, language, variant }: { event: InvitationEvent; language: Language; variant: "sunny" | "sienna" }) {
  return (
    <article
      className={cn(
        "mt-5 border bg-white/60 p-3 text-left",
        variant === "sunny" ? "rounded-xl border-[#80604f]/15" : "rounded-sm border-[#1f4054]/15",
      )}
    >
      <strong className="text-[11px] font-semibold leading-4">{event.title}</strong>
      <p className="mt-2 text-[9px] leading-4 opacity-75">
        {formatDate(event.date, language)} · {formatEventTime(event)}
      </p>
      <p className="mt-1 flex items-start gap-1.5 text-[9px] leading-4 opacity-75">
        <MapPin className="mt-0.5 size-2.5 shrink-0" />
        <span>{event.venueName}{event.venueAddress ? `, ${event.venueAddress}` : ""}</span>
      </p>
    </article>
  );
}

function BotanicalCorner({ small = false, mirrored = false }: { small?: boolean; mirrored?: boolean }) {
  return (
    <div className={`pointer-events-none absolute ${mirrored ? "bottom-0 right-0 rotate-180" : "left-0 top-0"} ${small ? "h-28 w-24" : "h-44 w-36"}`}>
      <div className="absolute left-7 top-0 h-full w-px rotate-[28deg] bg-[#66816e]" />
      {[18, 42, 68, 94, 120].map((top, index) => (
        <span key={top} className="absolute h-6 w-3 rounded-[100%_0] bg-[#779477]" style={{ top, left: index % 2 ? 32 : 12 }} />
      ))}
      <span className="absolute left-12 top-4 size-8 rounded-full bg-[#e6b6c4]/80" />
      <span className="absolute left-2 top-24 size-6 rounded-full bg-[#d998ad]/70" />
    </div>
  );
}

function GalleryTiles({ squared = false }: { squared?: boolean }) {
  return <div className="mt-5 grid grid-cols-3 gap-1.5"><span className={`aspect-[3/4] bg-[#b9c7aa] ${squared ? "" : "rounded-t-full"}`} /><span className={`aspect-[3/4] bg-[#d7bfa3] ${squared ? "" : "rounded-t-full"}`} /><span className={`aspect-[3/4] bg-[#9cafa8] ${squared ? "" : "rounded-t-full"}`} /></div>;
}

function mergeContent(block: InvitationBlock, invitation: PreviewInvitation) {
  return { ...invitation, ...block.content };
}

function formatDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "ID" ? "id-ID" : "en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatEventTime(event: InvitationEvent) {
  if (!event.startTime) return "—";
  return event.endTime ? `${event.startTime}–${event.endTime}` : event.startTime;
}

function initials(names: string) {
  return names.split("&").map((part) => part.trim()[0]).filter(Boolean).join("  ");
}

function displayFontClass(style: PreviewInvitation["fontStyle"]) {
  if (style === "modern") return "font-sans font-semibold not-italic";
  if (style === "classic") return "font-serif not-italic";
  return "font-serif italic";
}

function blockIcon(type: InvitationBlock["type"]) {
  if (type === "gift") return <Gift className="size-4" />;
  if (type === "event") return <MapPin className="size-4" />;
  if (type === "rsvp" || type === "guestbook") return <MessageCircleHeart className="size-4" />;
  return <Heart className="size-4" />;
}

function blockTitle(type: InvitationBlock["type"], content: ReturnType<typeof mergeContent>, language: Language) {
  if (type === "couple") return `${content.groomName} & ${content.brideName}`;
  if (type === "event") return language === "ID" ? "Detail acara" : "Event details";
  if (type === "countdown") return language === "ID" ? "58 hari lagi" : "58 days to go";
  if (type === "rsvp") return tr(language, "attendQuestion");
  if (type === "gift") return language === "ID" ? "Kirim tanda kasih" : "Send a wedding gift";
  if (type === "guestbook") return language === "ID" ? "Ucapan tamu" : "Guest wishes";
  if (type === "story") return language === "ID" ? "Perjalanan kami" : "Our journey";
  return language === "ID" ? "Momen favorit" : "Favorite moments";
}

function blockDescription(type: InvitationBlock["type"], content: ReturnType<typeof mergeContent>, language: Language) {
  if (type === "couple") return content.familyLine;
  if (type === "event") return language === "ID" ? "Simpan tanggal dan tempat untuk perayaan kami." : "Save the date and venue for our celebration.";
  if (type === "countdown") return formatDate(content.weddingDate, language);
  if (type === "gift") return "BCA • 1234 5678 90";
  if (type === "guestbook") return language === "ID" ? "Doa dan pesan yang telah kami publikasikan." : "Wishes and blessings shared by our guests.";
  if (type === "story") return content.openingText;
  return blockText(type, language).description;
}

type RendererProps = {
  blocks: InvitationBlock[];
  invitation: PreviewInvitation;
  event: InvitationEvent;
  language: Language;
  guests: GuestWithId[];
  onSubmitRsvp: (response: GuestResponseInput) => void;
};
type ContentProps = {
  block: InvitationBlock;
  invitation: PreviewInvitation;
  event: InvitationEvent;
  language: Language;
  guests: GuestWithId[];
  onSubmitRsvp: (response: GuestResponseInput) => void;
};
