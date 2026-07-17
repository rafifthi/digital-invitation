"use client";

import { Gift, Heart, MapPin, MessageCircleHeart, Sparkles } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { InvitationBlock, InvitationData, TemplateId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import { blockText, getTemplate, templateText } from "@/lib/templates";

type PreviewInvitation = Pick<
  InvitationData,
  "coupleNames" | "weddingDate" | "openingText" | "groomName" | "brideName" | "familyLine" | "eventTime" | "venueName" | "venueAddress"
>;

export function LivePreview({ invitation, blocks, selectedTemplate, language }: {
  invitation: PreviewInvitation;
  blocks: InvitationBlock[];
  selectedTemplate: TemplateId;
  language: Language;
}) {
  const allowedBlocks = getTemplate(selectedTemplate).allowedBlocks;
  const visibleBlocks = blocks.filter((block) => block.visible && allowedBlocks.includes(block.type));
  const template = getTemplate(selectedTemplate);

  return (
    <aside className="flex h-full min-h-0 flex-col items-center overflow-y-auto border-l bg-white px-7 py-7 max-[1180px]:col-start-2 max-[1180px]:border-l-0 max-[1180px]:border-t max-[820px]:order-first max-[820px]:!sticky max-[820px]:top-0 max-[820px]:z-20 max-[820px]:!h-[46svh] max-[820px]:!min-h-0 max-[820px]:w-full max-[820px]:min-w-0 max-[820px]:shrink-0 max-[820px]:overflow-hidden max-[820px]:border-b max-[820px]:px-4 max-[820px]:py-3 max-[820px]:shadow-[0_8px_16px_rgba(24,25,37,0.05)]">
      <div className="mb-5 flex w-full max-w-[390px] items-center justify-between gap-4 max-[820px]:mb-3">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">{tr(language, "livePreview")}</p>
          <h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">{templateText(template, language).name}</h2>
        </div>
        <Badge className="border-0 bg-[#def6e4] text-[#247f3b]">{tr(language, "live")}</Badge>
      </div>

      <div className="relative aspect-[9/18.8] w-[min(100%,360px,calc((100vh-122px)*0.478))] rounded-[34px] border border-[#2c2d3b] bg-[#181925] p-3 shadow-phone max-[1180px]:w-[min(100%,360px)]">
        <div className="absolute left-1/2 top-3 z-30 h-5 w-20 -translate-x-1/2 rounded-full bg-[#181925]" />
        <div className="phone-scrollbar h-full overflow-hidden rounded-[25px] bg-[#fbf8f2]">
          {visibleBlocks.length === 0 ? (
            <div className="grid h-full place-items-center p-8 text-center">
              <div><Sparkles className="mx-auto size-6 text-[#918df6]" /><p className="mt-3 text-sm font-medium">{language === "ID" ? "Semua bagian disembunyikan" : "All sections are hidden"}</p></div>
            </div>
          ) : selectedTemplate === "sienna" ? (
            <SiennaRenderer blocks={visibleBlocks} invitation={invitation} language={language} />
          ) : (
            <SunnyRenderer blocks={visibleBlocks} invitation={invitation} language={language} />
          )}
        </div>
      </div>
    </aside>
  );
}

function SunnyRenderer({ blocks, invitation, language }: RendererProps) {
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
                <h3 className="mt-2 font-serif text-[34px] italic leading-none tracking-[-0.04em]">{content.coupleNames}</h3>
                <p className="mt-3 text-[10px]">{formatDate(content.weddingDate, language)}</p>
                <button type="button" className="mt-5 rounded-lg bg-[#80604f] px-5 py-2.5 text-[10px] font-medium uppercase tracking-wider text-white">{tr(language, "openInvitation")}</button>
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
            <SunnyContent block={block} invitation={invitation} language={language} />
          </section>
        );
      })}
    </div>
  );
}

function SiennaRenderer({ blocks, invitation, language }: RendererProps) {
  return (
    <div className="phone-scrollbar h-full overflow-y-auto bg-[#f7f4eb] text-[#1f4054]">
      {blocks.map((block, index) => {
        if (block.type === "hero") {
          const content = mergeContent(block, invitation);
          return (
            <section key={block.id} className="relative min-h-full overflow-hidden bg-[#f7f4eb] px-7 pb-10 pt-20 text-center">
              <BotanicalCorner />
              <div className="absolute inset-x-10 top-24 h-[54%] rounded-t-[120px] border border-[#c9c4b6] bg-[radial-gradient(circle_at_50%_100%,#dfe8e4_0%,#f7f4eb_58%)]" />
              <div className="relative z-10 mx-auto grid size-24 place-items-center rounded-full border border-[#1f4054] bg-[#f7f4eb]/90 font-serif text-3xl">
                <span>{initials(content.coupleNames)}</span>
              </div>
              <div className="relative z-10 mt-28">
                <p className="text-[9px] italic">{tr(language, "weddingOf")}</p>
                <h3 className="mt-2 font-serif text-[31px] leading-none tracking-[-0.03em]">{content.coupleNames}</h3>
                <p className="mt-3 text-[10px] italic">{formatDate(content.weddingDate, language)}</p>
                <button type="button" className="mt-16 rounded-sm bg-[#1f4054] px-5 py-2.5 font-serif text-[11px] text-white">{tr(language, "openInvitation")}</button>
              </div>
            </section>
          );
        }

        return (
          <section key={block.id} className={`relative min-h-[380px] overflow-hidden border-t border-[#d8d3c7] px-7 py-16 text-center ${index % 2 ? "bg-[#eef1ec]" : "bg-[#f7f4eb]"}`}>
            <BotanicalCorner small mirrored={index % 2 === 0} />
            <p className="font-serif text-[10px] uppercase tracking-[0.18em] text-[#577080]">{blockText(block.type, language).label}</p>
            <div className="mx-auto mt-3 h-px w-10 bg-[#1f4054]/35" />
            <SiennaContent block={block} invitation={invitation} language={language} />
          </section>
        );
      })}
    </div>
  );
}

function SunnyContent({ block, invitation, language }: ContentProps) {
  const content = mergeContent(block, invitation);
  const title = blockTitle(block.type, content, language);
  return (
    <div className="mt-5">
      <h3 className="font-serif text-2xl italic leading-tight">{title}</h3>
      <p className="mx-auto mt-3 max-w-[26ch] text-[11px] leading-5 opacity-75">{blockDescription(block.type, content, language)}</p>
      {block.type === "rsvp" && <button type="button" className="mt-5 rounded-lg bg-[#80604f] px-5 py-2 text-[10px] font-medium text-white">{tr(language, "attend")}</button>}
      {block.type === "gallery" && <GalleryTiles />}
    </div>
  );
}

function SiennaContent({ block, invitation, language }: ContentProps) {
  const content = mergeContent(block, invitation);
  return (
    <div className="mt-7">
      <h3 className="font-serif text-[25px] leading-tight">{blockTitle(block.type, content, language)}</h3>
      <p className="mx-auto mt-4 max-w-[28ch] font-serif text-[11px] italic leading-5 opacity-75">{blockDescription(block.type, content, language)}</p>
      {block.type === "rsvp" && <button type="button" className="mt-6 bg-[#1f4054] px-5 py-2.5 font-serif text-[11px] text-white">{tr(language, "attend")}</button>}
      {block.type === "gallery" && <GalleryTiles squared />}
    </div>
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

function initials(names: string) {
  return names.split("&").map((part) => part.trim()[0]).filter(Boolean).join("  ");
}

function blockIcon(type: InvitationBlock["type"]) {
  if (type === "gift") return <Gift className="size-4" />;
  if (type === "event") return <MapPin className="size-4" />;
  if (type === "rsvp" || type === "guestbook") return <MessageCircleHeart className="size-4" />;
  return <Heart className="size-4" />;
}

function blockTitle(type: InvitationBlock["type"], content: ReturnType<typeof mergeContent>, language: Language) {
  if (type === "couple") return `${content.groomName} & ${content.brideName}`;
  if (type === "event") return content.venueName;
  if (type === "countdown") return language === "ID" ? "58 hari lagi" : "58 days to go";
  if (type === "rsvp") return tr(language, "attendQuestion");
  if (type === "gift") return language === "ID" ? "Kirim tanda kasih" : "Send a wedding gift";
  if (type === "guestbook") return language === "ID" ? "Tulis ucapan" : "Leave your wishes";
  if (type === "story") return language === "ID" ? "Perjalanan kami" : "Our journey";
  return language === "ID" ? "Momen favorit" : "Favorite moments";
}

function blockDescription(type: InvitationBlock["type"], content: ReturnType<typeof mergeContent>, language: Language) {
  if (type === "couple") return content.familyLine;
  if (type === "event") return `${content.eventTime} • ${content.venueAddress}`;
  if (type === "countdown") return formatDate(content.weddingDate, language);
  if (type === "gift") return "BCA • 1234 5678 90";
  if (type === "guestbook") return language === "ID" ? "Doa dan pesan Anda berarti bagi kami." : "Your words and blessings mean a lot to us.";
  if (type === "story") return content.openingText;
  return blockText(type, language).description;
}

type RendererProps = { blocks: InvitationBlock[]; invitation: PreviewInvitation; language: Language };
type ContentProps = { block: InvitationBlock; invitation: PreviewInvitation; language: Language };
