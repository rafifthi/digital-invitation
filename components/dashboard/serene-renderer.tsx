"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { CalendarDays, Check, ChevronDown, Copy, MapPin, Play, Volume2, VolumeX } from "lucide-react";
import { RsvpWishesForm } from "@/components/invitation/rsvp-wishes-form";
import { HERO_BG_SVG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Language } from "@/lib/types";
import type {
  GuestResponseInput,
  GuestWithId,
  InvitationBlock,
  InvitationData,
  InvitationEvent,
} from "./types";

type SereneInvitation = Pick<
  InvitationData,
  | "coupleNames"
  | "weddingDate"
  | "openingText"
  | "groomName"
  | "brideName"
  | "familyLine"
  | "youtubeUrl"
  | "accentColor"
  | "fontStyle"
  | "giftBank"
  | "giftAccountNumber"
  | "giftAccountName"
  | "giftEwallet"
>;

export function SereneRenderer({
  blocks,
  invitation,
  event,
  language,
  guests,
  musicPlaying,
  onMusicPlayingChange,
  onSubmitRsvp,
}: {
  blocks: InvitationBlock[];
  invitation: SereneInvitation;
  event: InvitationEvent;
  language: Language;
  guests: GuestWithId[];
  musicPlaying: boolean;
  onMusicPlayingChange: (value: boolean) => void;
  onSubmitRsvp: (response: GuestResponseInput) => void;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [galleryOpen, setGalleryOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const isId = language === "ID";
  const hasHero = blocks.some((block) => block.type === "hero");
  const names = splitCoupleNames(invitation.coupleNames, invitation.brideName, invitation.groomName);
  const displayClass = sereneDisplayClass(invitation.fontStyle);

  return (
    <div
      data-testid="serene-renderer"
      className="serene-body relative h-full overflow-hidden bg-[#eeeae0] text-[#4c4c4c]"
      style={{ "--serene-accent": invitation.accentColor } as CSSProperties}
    >
      {hasHero && (
        <div
          data-testid="serene-cover"
          aria-hidden={isOpen}
          className={cn(
            "absolute inset-0 z-50 flex min-h-full flex-col items-center justify-between overflow-hidden px-8 py-14 text-center text-[#f8f5ed] transition-[transform,opacity] duration-1000 ease-[cubic-bezier(0.76,0,0.24,1)]",
            isOpen && "pointer-events-none -translate-y-full opacity-0",
          )}
        >
          <div
            className="absolute inset-0 scale-110 bg-cover bg-center blur-[2px]"
            style={{ backgroundImage: `url("${HERO_BG_SVG}")` }}
          />
          <div className="absolute inset-0 bg-[#4c4c4c]/38" />
          <SereneMark className="relative z-10 size-16" />
          <div className="relative z-10">
            <p className="text-[10px] tracking-wide">{isId ? "Halo" : "Hello"}</p>
            <p className="serene-display mt-2 text-[25px] leading-none">{isId ? "Tamu Undangan" : "Our Honored Guest"}</p>
            <button
              type="button"
              data-testid="serene-open-invitation"
              onClick={() => {
                scrollRef.current?.scrollTo({ top: 0 });
                setIsOpen(true);
              }}
              className="mt-5 border border-[#f8f5ed]/85 px-5 py-3 text-[9px] font-bold uppercase tracking-[0.08em] transition-[background-color,color,transform] duration-200 hover:-translate-y-0.5 hover:bg-[#f8f5ed] hover:text-[#4c4c4c] focus-visible:ring-2 focus-visible:ring-[#f8f5ed] focus-visible:ring-offset-2 focus-visible:ring-offset-[#4c4c4c]"
            >
              {isId ? "Buka Undangan" : "Open Invitation"}
            </button>
          </div>
          <p className="relative z-10 text-[8px] uppercase tracking-[0.22em]">{invitation.coupleNames}</p>
        </div>
      )}

      <div ref={scrollRef} className="serene-scroll h-full overflow-y-auto overscroll-contain">
        {blocks.map((block) => {
          if (block.type === "hero") {
            return (
              <section key={block.id} data-testid="serene-section-hero" className="relative flex min-h-full items-center justify-center overflow-hidden bg-[#9d9d9a] px-6 py-20 text-center text-[#f8f5ed]">
                <div className="serene-hero-image absolute inset-0 scale-105 bg-cover bg-center grayscale" style={{ backgroundImage: `url("${HERO_BG_SVG}")` }} />
                <div className="absolute inset-0 bg-[#4c4c4c]/38" />
                <div className="relative z-10 w-full">
                  <p className="text-[10px] uppercase tracking-[0.03em]">{isId ? "Pernikahan" : "The wedding of"}</p>
                  <div className={cn("serene-display mt-4 uppercase tracking-[0.03em]", displayClass)}>
                    <p className="text-[34px] leading-[0.96]">{names.first}</p>
                    <p className="my-3 text-[10px] font-sans tracking-normal">and</p>
                    <p className="text-[34px] leading-[0.96]">{names.second}</p>
                  </div>
                  <div className="mt-20 flex flex-col items-center gap-2 text-[9px] tracking-wide">
                    <span>{isId ? "Gulir ke bawah" : "Scroll down"}</span>
                    <span className="serene-scroll-cue grid size-5 place-items-center rounded-full border border-[#f8f5ed]/70"><ChevronDown className="size-3" /></span>
                  </div>
                </div>
              </section>
            );
          }

          if (block.type === "story") {
            return (
              <section key={block.id} data-testid="serene-section-story" className="relative min-h-full overflow-hidden bg-[#eeeae0] px-8 py-20 text-center">
                <SereneReveal className="flex min-h-[420px] flex-col items-center justify-center gap-8">
                  <SereneMark className="size-12 text-[var(--serene-accent)]" />
                  <blockquote className="serene-display max-w-[30ch] text-[16px] leading-7">
                    “Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu pasangan hidup, agar kamu merasa tenteram kepadanya, dan dijadikan-Nya di antaramu rasa kasih dan sayang.”
                  </blockquote>
                  <p className="text-[9px] uppercase tracking-[0.15em]">Q.S. Ar Rum: 21</p>
                  <div className="h-px w-10 bg-[#4c4c4c]/25" />
                  <p className="max-w-[31ch] text-[11px] leading-5 opacity-75">{invitation.openingText}</p>
                </SereneReveal>
              </section>
            );
          }

          if (block.type === "couple") {
            return (
              <section key={block.id} data-testid="serene-section-couple" className="bg-[#6c7c71] text-[#f8f5ed]">
                <SereneProfile
                  role={isId ? "Mempelai Wanita" : "The Bride"}
                  name={invitation.brideName || names.first}
                  familyLine={invitation.familyLine}
                  imagePosition="center 36%"
                  displayClass={displayClass}
                />
                <SereneProfile
                  role={isId ? "Mempelai Pria" : "The Groom"}
                  name={invitation.groomName || names.second}
                  familyLine={invitation.familyLine}
                  imagePosition="center 68%"
                  displayClass={displayClass}
                  flipped
                />
              </section>
            );
          }

          if (block.type === "event") {
            return (
              <section key={block.id} data-testid="serene-section-event" className="relative min-h-full overflow-hidden bg-[#eeeae0] px-7 py-20 text-center">
                <SereneReveal className="mx-auto flex min-h-[480px] max-w-[310px] flex-col items-center justify-center">
                  <p className="text-[10px] uppercase tracking-[0.26em]">{event.title}</p>
                  <h3 className="serene-display mt-5 text-[28px] uppercase leading-tight">{formatSereneDate(event.date, language)}</h3>
                  <p className="mt-4 text-[10px] uppercase tracking-[0.1em]">・{formatSereneTime(event)}・</p>
                  <a
                    href={calendarUrl(event)}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-7 inline-flex items-center gap-2 border border-[#4c4c4c]/55 px-4 py-2.5 text-[9px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#4c4c4c] hover:text-[#f8f5ed] focus-visible:ring-2 focus-visible:ring-[#4c4c4c]"
                  >
                    <CalendarDays className="size-3" />
                    {isId ? "Tambah ke Kalender" : "Add to Calendar"}
                  </a>
                  <div className="my-10 h-px w-20 bg-[#4c4c4c]/25" />
                  <p className="serene-script text-[36px] leading-none">{event.venueName}</p>
                  <p className="mt-4 max-w-[28ch] text-[10px] leading-5 opacity-75">{event.venueAddress}</p>
                  <a
                    href={event.mapsUrl || "https://maps.google.com"}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex items-center gap-2 text-[9px] font-bold uppercase tracking-[0.09em] underline decoration-[#4c4c4c]/40 underline-offset-4 focus-visible:ring-2 focus-visible:ring-[#4c4c4c]"
                  >
                    <MapPin className="size-3" />
                    {isId ? "Lihat Lokasi" : "View Location"}
                  </a>
                </SereneReveal>
              </section>
            );
          }

          if (block.type === "gallery") {
            return (
              <section key={block.id} data-testid="serene-section-gallery" className="overflow-hidden bg-[#eeeae0] py-14">
                <SereneReveal>
                  <div className="relative h-[520px] overflow-hidden grayscale">
                    <div className="absolute -left-3 top-6 h-[58%] w-[58%] -rotate-3 bg-cover bg-center" style={{ backgroundImage: `url("${HERO_BG_SVG}")` }} />
                    <div className="absolute -right-4 bottom-5 h-[58%] w-[58%] rotate-2 bg-cover bg-right" style={{ backgroundImage: `url("${HERO_BG_SVG}")` }} />
                    <p className="serene-script absolute left-3 top-[43%] z-10 -rotate-[12deg] text-[52px]">{names.first}</p>
                    <p className="serene-script absolute bottom-[34%] right-0 z-10 -rotate-[12deg] text-[52px]">{names.second}</p>
                  </div>
                  <div className="px-7 text-center">
                    <button
                      type="button"
                      aria-expanded={galleryOpen}
                      onClick={() => setGalleryOpen((current) => !current)}
                      className="border border-[#4c4c4c]/55 px-5 py-2.5 text-[9px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#4c4c4c] hover:text-[#f8f5ed] focus-visible:ring-2 focus-visible:ring-[#4c4c4c]"
                    >
                      {galleryOpen ? (isId ? "Tutup Galeri" : "Close Gallery") : (isId ? "Buka Galeri" : "Open Gallery")}
                    </button>
                    <div className={cn("grid transition-[grid-template-rows,opacity] duration-700 ease-out", galleryOpen ? "mt-8 grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0")}>
                      <div className="min-h-0 overflow-hidden">
                        <div className="grid grid-cols-2 gap-2 grayscale">
                          {["20% 35%", "76% 20%", "42% 78%", "82% 68%", "18% 82%", "50% 45%"].map((position, index) => (
                            <span
                              key={position}
                              className={cn("block bg-cover", index % 3 === 0 ? "aspect-[2/3]" : "aspect-square")}
                              style={{ backgroundImage: `url("${HERO_BG_SVG}")`, backgroundPosition: position }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </SereneReveal>
                <SereneVideo url={invitation.youtubeUrl} language={language} />
              </section>
            );
          }

          if (block.type === "rsvp") {
            return (
              <section key={block.id} data-testid="serene-section-rsvp" className="min-h-full bg-[#eeeae0] px-7 py-20 text-center">
                <SereneReveal className="mx-auto flex min-h-[460px] max-w-[320px] flex-col items-center justify-center">
                  <p className="serene-label">RSVP</p>
                  <p className="serene-display mt-5 text-[23px] leading-8">{isId ? "Apakah Anda akan hadir di hari bahagia kami?" : "Will you join us on our wedding day?"}</p>
                  <RsvpWishesForm accentColor={invitation.accentColor} language={language} variant="serene" onSubmit={onSubmitRsvp} />
                </SereneReveal>
              </section>
            );
          }

          if (block.type === "guestbook") {
            return (
              <section key={block.id} data-testid="serene-section-guestbook" className="relative min-h-full overflow-hidden bg-[#eeeae0] px-7 py-20">
                <SereneReveal>
                  <SereneSectionLabel>{isId ? "Ucapan & Doa" : "Wishes & Prayers"}</SereneSectionLabel>
                  <SereneWishes guests={guests} language={language} />
                </SereneReveal>
              </section>
            );
          }

          if (block.type === "gift") {
            return (
              <section key={block.id} data-testid="serene-section-gift" className="relative min-h-full overflow-hidden bg-[#6c7c71] px-7 py-20 text-center text-[#f8f5ed]">
                <SereneReveal className="mx-auto flex min-h-[480px] max-w-[320px] flex-col items-center justify-center">
                  <SereneSectionLabel light>{isId ? "Tanda Kasih" : "A Token of Love"}</SereneSectionLabel>
                  <p className="mt-10 max-w-[29ch] text-[11px] leading-6 opacity-80">
                    {isId ? "Doa restu Anda adalah hadiah terindah. Jika berkenan, tanda kasih dapat disampaikan melalui detail berikut." : "Your prayers are the greatest gift. If you wish, a token of love may be sent through the details below."}
                  </p>
                  <GiftCopy invitation={invitation} language={language} />
                </SereneReveal>
              </section>
            );
          }

          return null;
        })}

        <section className="relative flex min-h-full items-end overflow-hidden bg-[#b8727e] px-7 py-16 text-[#f8f5ed]">
          <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url("${HERO_BG_SVG}")` }} />
          <div className="absolute inset-0 bg-[#4c4c4c]/25" />
          <SereneReveal className="relative z-10 w-full text-center">
            <SereneMark className="mx-auto size-14" />
            <p className="serene-display mt-8 text-[25px] leading-tight">{isId ? "Terima kasih" : "Thank you"}</p>
            <p className="mx-auto mt-3 max-w-[28ch] text-[10px] leading-5 opacity-85">{isId ? "Merupakan kehormatan bagi kami untuk merayakan hari ini bersama Anda." : "It is an honor to celebrate this day with you."}</p>
            <p className="serene-script mt-8 text-[36px]">{invitation.coupleNames}</p>
          </SereneReveal>
        </section>
      </div>

      {isOpen && (
        <button
          type="button"
          aria-label={musicPlaying ? (isId ? "Matikan musik" : "Mute music") : (isId ? "Putar musik" : "Play music")}
          aria-pressed={musicPlaying}
          onClick={() => onMusicPlayingChange(!musicPlaying)}
          className="absolute bottom-3 left-3 z-40 grid size-9 place-items-center rounded-full bg-[#ded8ca]/95 text-[#4c4c4c] shadow-[0_2px_12px_rgba(76,76,76,0.16)] transition-transform hover:scale-105 focus-visible:ring-2 focus-visible:ring-[#4c4c4c]"
        >
          {musicPlaying ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
        </button>
      )}
    </div>
  );
}

function SereneProfile({ role, name, familyLine, imagePosition, displayClass, flipped = false }: {
  role: string;
  name: string;
  familyLine: string;
  imagePosition: string;
  displayClass: string;
  flipped?: boolean;
}) {
  return (
    <article className="relative min-h-[620px] overflow-hidden">
      <div
        className={cn("absolute inset-0 scale-105 bg-cover grayscale", flipped && "-scale-x-105")}
        style={{ backgroundImage: `url("${HERO_BG_SVG}")`, backgroundPosition: imagePosition }}
      />
      <div className="absolute inset-0 bg-[#4c4c4c]/34" />
      <SereneReveal className="relative z-10 flex min-h-[620px] flex-col items-center justify-end px-7 pb-20 text-center">
        <p className="serene-script text-[42px] leading-none">{role}</p>
        <h3 className={cn("serene-display mt-7 text-[26px] uppercase leading-tight tracking-[0.03em]", displayClass)}>{name}</h3>
        <p className="mt-4 text-[10px] leading-5 opacity-85">{familyLine}</p>
      </SereneReveal>
    </article>
  );
}

function SereneVideo({ url, language }: { url: string; language: Language }) {
  const embedUrl = useMemo(() => youtubeEmbedUrl(url), [url]);
  if (!url) return null;

  return (
    <SereneReveal className="px-7 pb-14 pt-20 text-center">
      <p className="serene-label">Our Film</p>
      <div className="relative mt-6 aspect-video overflow-hidden bg-[#4c4c4c] text-[#f8f5ed]">
        {embedUrl ? (
          <iframe
            className="absolute inset-0 size-full border-0"
            src={embedUrl}
            title={language === "ID" ? "Video pasangan" : "Couple video"}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <a href={url} target="_blank" rel="noreferrer" className="grid size-full place-items-center focus-visible:ring-2 focus-visible:ring-[#f8f5ed]">
            <span className="grid size-12 place-items-center rounded-full border border-[#f8f5ed]/70"><Play className="ml-0.5 size-4" /></span>
          </a>
        )}
      </div>
    </SereneReveal>
  );
}

function SereneWishes({ guests, language }: { guests: GuestWithId[]; language: Language }) {
  const published = guests.filter((guest) => guest.wish && guest.wishStatus === "published").slice(0, 6);
  if (published.length === 0) {
    return <p className="mt-10 text-center text-[10px] leading-5 opacity-60">{language === "ID" ? "Ucapan yang telah disetujui akan tampil di sini." : "Approved wishes will appear here."}</p>;
  }

  return (
    <div className="mt-10 grid gap-7">
      {published.map((guest) => (
        <figure key={guest.id} className="border-b border-[#4c4c4c]/20 pb-7">
          <figcaption className="text-[10px] font-bold uppercase tracking-[0.09em]">{guest.name}</figcaption>
          <blockquote className="mt-3 text-[11px] leading-6 opacity-75">{guest.wish}</blockquote>
        </figure>
      ))}
    </div>
  );
}

function GiftCopy({ invitation, language }: { invitation: SereneInvitation; language: Language }) {
  const [copied, setCopied] = useState(false);
  const copyAccount = async () => {
    try {
      await navigator.clipboard.writeText(invitation.giftAccountNumber);
    } catch {
      // Embedded previews may not expose the Clipboard API.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  };

  return (
    <div className="mt-9 w-full border-y border-[#f8f5ed]/35 py-6">
      <p className="text-[9px] uppercase tracking-[0.18em]">{invitation.giftBank} · {invitation.giftEwallet}</p>
      <p className="serene-display mt-3 text-[22px] tracking-[0.08em]">{invitation.giftAccountNumber}</p>
      <p className="mt-2 text-[10px] uppercase tracking-[0.1em] opacity-75">{invitation.giftAccountName}</p>
      <button
        type="button"
        onClick={copyAccount}
        className="mt-5 inline-flex items-center gap-2 border border-[#f8f5ed]/60 px-4 py-2 text-[9px] font-bold uppercase tracking-[0.08em] transition-colors hover:bg-[#f8f5ed] hover:text-[#4c4c4c] focus-visible:ring-2 focus-visible:ring-[#f8f5ed]"
      >
        {copied ? <Check className="size-3" /> : <Copy className="size-3" />}
        {copied ? (language === "ID" ? "Tersalin" : "Copied") : (language === "ID" ? "Salin" : "Copy")}
      </button>
    </div>
  );
}

function SereneReveal({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return <div ref={ref} className={cn("serene-reveal", visible && "is-visible", className)}>{children}</div>;
}

function SereneSectionLabel({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <div className={cn("relative mx-auto w-full text-center", light ? "text-[#f8f5ed]" : "text-[#4c4c4c]")}>
      <span className="absolute left-0 top-1/2 h-px w-[24%] bg-current opacity-35" />
      <h3 className="serene-display text-[23px] uppercase leading-tight">{children}</h3>
      <span className="absolute right-0 top-1/2 h-px w-[24%] bg-current opacity-35" />
    </div>
  );
}

function SereneMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      {[0, 45, 90, 135, 180, 225, 270, 315].map((rotation) => (
        <ellipse key={rotation} cx="32" cy="15" rx="3.7" ry="9" stroke="currentColor" strokeWidth="2" transform={`rotate(${rotation} 32 32)`} />
      ))}
    </svg>
  );
}

function splitCoupleNames(value: string, bride: string, groom: string) {
  const parts = value.split("&").map((part) => part.trim()).filter(Boolean);
  if (parts.length >= 2) return { first: parts[0], second: parts[1] };
  return { first: bride || value, second: groom || value };
}

function sereneDisplayClass(style: InvitationData["fontStyle"]) {
  if (style === "modern") return "!font-sans !font-semibold";
  if (style === "editorial") return "italic";
  return "not-italic";
}

function formatSereneDate(value: string, language: Language) {
  return new Intl.DateTimeFormat(language === "ID" ? "id-ID" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${value}T00:00:00Z`));
}

function formatSereneTime(event: InvitationEvent) {
  if (!event.startTime) return "—";
  return event.endTime ? `${event.startTime} - ${event.endTime} WIB` : `${event.startTime} WIB`;
}

function calendarUrl(event: InvitationEvent) {
  const start = `${event.date.replaceAll("-", "")}T${event.startTime.replace(":", "")}00`;
  const endTime = event.endTime || event.startTime;
  const end = `${event.date.replaceAll("-", "")}T${endTime.replace(":", "")}00`;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: event.title,
    dates: `${start}/${end}`,
    location: `${event.venueName}, ${event.venueAddress}`,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value);
    const id = url.hostname.includes("youtu.be") ? url.pathname.slice(1) : url.searchParams.get("v");
    return id && /^[\w-]{6,}$/.test(id) ? `https://www.youtube-nocookie.com/embed/${id}` : null;
  } catch {
    return null;
  }
}
