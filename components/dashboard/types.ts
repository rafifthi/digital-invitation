import type { RSVPStatus, GuestType } from "@/lib/types";

export type MenuId =
  | "overview"
  | "design"
  | "gifts"
  | "guest-list"
  | "wablast"
  | "settings"
  | "account";

export type AccountProfile = {
  name: string;
  email: string;
};
export type TemplateId = "sunny" | "sienna";

export type SectionId =
  | "hero"
  | "couple"
  | "story"
  | "event"
  | "gallery"
  | "countdown"
  | "rsvp"
  | "gift"
  | "guestbook";

export type InvitationBlock = {
  id: string;
  type: SectionId;
  visible: boolean;
  open: boolean;
  content: Record<string, string>;
};

export type InvitationData = {
  customSlug: string;
  youtubeUrl: string;
  coupleNames: string;
  weddingDate: string;
  openingText: string;
  groomName: string;
  brideName: string;
  familyLine: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
};

export type Guest = {
  type: GuestType;
  vip: boolean;
  salutation: string;
  name: string;
  pax: number;
  rsvp: RSVPStatus | null;
  labels: string[];
  whatsapp: string;
};

export function formatWeddingDate(value: string) {
  const date = new Date(`${value}T00:00:00Z`);
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}
