import type { GuestWishStatus, RSVPStatus, GuestType } from "@/lib/types";

export type MenuId =
  | "overview"
  | "design"
  | "guest-list"
  | "wishes"
  | "settings"
  | "account";

export type AccountProfile = {
  name: string;
  email: string;
};

export type WorkspacePlanName = "Basic" | "Signature" | "Luxe";

export type WorkspaceSummary = {
  id: string;
  name: string;
  packageName: WorkspacePlanName;
  status: "active" | "draft";
};
export type TemplateId = "sunny" | "sienna" | "serene";

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
  accentColor: string;
  fontStyle: "editorial" | "classic" | "modern";
  coupleNames: string;
  weddingDate: string;
  openingText: string;
  groomName: string;
  brideName: string;
  familyLine: string;
  eventTime: string;
  venueName: string;
  venueAddress: string;
  giftBank: string;
  giftAccountNumber: string;
  giftAccountName: string;
  giftEwallet: string;
};

export type InvitationEvent = {
  id: string;
  type: "ceremony" | "reception" | "other";
  title: string;
  date: string;
  startTime: string;
  endTime: string;
  venueName: string;
  venueAddress: string;
  mapsUrl: string;
};

export type WorkspaceCreationInput = {
  name: string;
  subdomain: string;
  event: Omit<InvitationEvent, "id">;
  templateId: TemplateId;
  packageName: WorkspacePlanName;
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
  wish: string;
  wishStatus: GuestWishStatus | null;
  wishSubmittedAt: string | null;
};

export type GuestWithId = Guest & { id: string };

export type GuestLabel = {
  id: string;
  name: string;
  color: string;
};

export type GuestResponseInput = {
  name: string;
  whatsapp: string;
  pax: number;
  rsvp: RSVPStatus;
  wish: string;
};

export type WABlastRecipientStatus = "queued" | "opened" | "sent" | "failed";

export type WABlastRecipient = {
  guestId: string;
  guestName: string;
  whatsapp: string;
  message: string;
  status: WABlastRecipientStatus;
  updatedAt: string | null;
};

export type WABlastCampaign = {
  id: string;
  template: string;
  createdAt: string;
  status: "queued" | "in_progress" | "completed";
  recipients: WABlastRecipient[];
};

export type WABlastInput = {
  recipientIds: string[];
  template: string;
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
