import type { Language } from "@/lib/types";
import type { InvitationBlock, SectionId, TemplateId } from "@/components/dashboard/types";

export type TemplateDefinition = {
  id: TemplateId;
  name: string;
  nameId: string;
  description: string;
  descriptionId: string;
  interaction: string;
  interactionId: string;
  allowedBlocks: SectionId[];
  accent: string;
};

export const INVITATION_TEMPLATES: TemplateDefinition[] = [
  {
    id: "sunny",
    name: "Sunny",
    nameId: "Sunny",
    description: "A bright outdoor celebration with warm light, open space, and cheerful floral details.",
    descriptionId: "Perayaan outdoor yang cerah dengan cahaya hangat, ruang terbuka, dan detail bunga ceria.",
    interaction: "Vibrant • Outdoor • Cheerful",
    interactionId: "Ceria • Outdoor • Hangat",
    allowedBlocks: ["hero", "couple", "event", "countdown", "gallery", "rsvp", "gift", "guestbook"],
    accent: "#8b674f",
  },
  {
    id: "sienna",
    name: "Sienna",
    nameId: "Sienna",
    description: "A timeless botanical invitation built around an ivory arch, fine linework, and deep navy type.",
    descriptionId: "Undangan botanical klasik dengan lengkung ivory, garis halus, dan tipografi navy yang elegan.",
    interaction: "Majestic • Classic • Timeless",
    interactionId: "Megah • Klasik • Abadi",
    allowedBlocks: ["hero", "couple", "story", "event", "countdown", "gallery", "rsvp", "gift", "guestbook"],
    accent: "#1f4054",
  },
  {
    id: "serene",
    name: "Serene",
    nameId: "Serene",
    description: "A quiet editorial invitation with monochrome imagery, sage details, and cinematic full-screen pacing.",
    descriptionId: "Undangan editorial yang tenang dengan foto monokrom, detail sage, dan alur sinematik layar penuh.",
    interaction: "Editorial • Cinematic • Serene",
    interactionId: "Editorial • Sinematik • Teduh",
    allowedBlocks: ["hero", "story", "couple", "event", "gallery", "rsvp", "guestbook", "gift"],
    accent: "#6c7c71",
  },
];

const blockCopy: Record<SectionId, { en: string; id: string; enDescription: string; idDescription: string }> = {
  hero: { en: "Opening cover", id: "Sampul pembuka", enDescription: "Names, date, and invitation entrance.", idDescription: "Nama, tanggal, dan pintu masuk undangan." },
  couple: { en: "The couple", id: "Mempelai", enDescription: "Introduce the bride and groom.", idDescription: "Perkenalkan kedua mempelai." },
  story: { en: "Our story", id: "Cerita kami", enDescription: "A chapter from the couple's journey.", idDescription: "Satu bab dari perjalanan pasangan." },
  event: { en: "Event details", id: "Detail acara", enDescription: "Venue, date, and ceremony time.", idDescription: "Lokasi, tanggal, dan waktu acara." },
  gallery: { en: "Gallery", id: "Galeri", enDescription: "A collection of wedding photographs.", idDescription: "Koleksi foto pernikahan." },
  countdown: { en: "Countdown", id: "Hitung mundur", enDescription: "Build anticipation for the wedding day.", idDescription: "Bangun antusiasme menuju hari pernikahan." },
  rsvp: { en: "RSVP", id: "RSVP", enDescription: "Collect guest attendance responses.", idDescription: "Kumpulkan konfirmasi kehadiran tamu." },
  gift: { en: "Wedding gift", id: "Hadiah pernikahan", enDescription: "Share bank, wallet, or delivery details.", idDescription: "Bagikan detail bank, dompet, atau pengiriman." },
  guestbook: { en: "Guest wishes", id: "Ucapan tamu", enDescription: "A place for messages and blessings.", idDescription: "Tempat untuk pesan dan doa." },
};

export const DEFAULT_BLOCKS: InvitationBlock[] = [
  { id: "block-hero-1", type: "hero", visible: true, open: true, content: {} },
  { id: "block-couple-1", type: "couple", visible: true, open: true, content: {} },
  { id: "block-story-1", type: "story", visible: true, open: false, content: {} },
  { id: "block-event-1", type: "event", visible: true, open: false, content: {} },
  { id: "block-countdown-1", type: "countdown", visible: true, open: false, content: {} },
  { id: "block-gallery-1", type: "gallery", visible: true, open: false, content: {} },
  { id: "block-rsvp-1", type: "rsvp", visible: true, open: false, content: {} },
  { id: "block-gift-1", type: "gift", visible: true, open: false, content: {} },
  { id: "block-guestbook-1", type: "guestbook", visible: true, open: false, content: {} },
];

export function getTemplate(id: TemplateId) {
  return INVITATION_TEMPLATES.find((template) => template.id === id) || INVITATION_TEMPLATES[0];
}

export function templateText(template: TemplateDefinition, language: Language) {
  return language === "ID"
    ? { name: template.nameId, description: template.descriptionId, interaction: template.interactionId }
    : { name: template.name, description: template.description, interaction: template.interaction };
}

export function blockText(type: SectionId, language: Language) {
  const value = blockCopy[type];
  return language === "ID"
    ? { label: value.id, description: value.idDescription }
    : { label: value.en, description: value.enDescription };
}
