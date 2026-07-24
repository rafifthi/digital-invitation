import type { ElementType } from "react";
import { LayoutDashboard, Settings, Sparkles, Users } from "lucide-react";
import type { MenuId, InvitationData, InvitationEvent, Guest, GuestLabel, WorkspacePlanName, WorkspaceSummary } from "@/components/dashboard/types";
import type { RSVPStatus } from "@/lib/types";

export const MENU_ITEMS: Array<{
  id: MenuId;
  label: string;
  icon: ElementType;
  children?: Array<{ id: MenuId; label: string }>;
}> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "design", label: "Design", icon: Sparkles },
  {
    id: "guest-list",
    label: "Guest",
    icon: Users,
    children: [
      { id: "guest-list", label: "Guest List" },
      { id: "wishes", label: "Wishes" },
    ],
  },
  { id: "settings", label: "Invitation Settings", icon: Settings },
];

export const DEFAULT_INVITATION: InvitationData = {
  customSlug: "rafifkanza.riuhmerekah.com",
  youtubeUrl: "https://youtube.com/watch?v=wedding-acoustic",
  accentColor: "oklch(0.7 0.11 292)",
  fontStyle: "editorial",
  coupleNames: "Rafif & Kanza",
  weddingDate: "2026-08-29",
  openingText:
    "Together with joyful hearts, we invite you to celebrate our wedding day.",
  groomName: "Rafif Ardiansyah",
  brideName: "Kanza Maharani",
  familyLine: "Son and daughter of two loving families",
  eventTime: "10:00 WIB",
  venueName: "The Langham Jakarta",
  venueAddress: "District 8, SCBD, Jakarta Selatan",
  giftBank: "BCA",
  giftAccountNumber: "1234567890",
  giftAccountName: "Kanza Maharani",
  giftEwallet: "GoPay",
};

export const DEFAULT_EVENT: InvitationEvent = {
  id: "event-main",
  type: "ceremony",
  title: "Wedding Ceremony",
  date: "2026-08-29",
  startTime: "10:00",
  endTime: "11:30",
  venueName: "The Langham Jakarta",
  venueAddress: "District 8, SCBD, Jakarta Selatan",
  mapsUrl: "https://maps.google.com/?q=The+Langham+Jakarta",
};

export const DEFAULT_WORKSPACES: WorkspaceSummary[] = [
  {
    id: "workspace-rafif-kanza",
    name: "Rafif & Kanza",
    packageName: "Signature",
    status: "active",
  },
];

export const WORKSPACE_PLANS: Array<{
  name: WorkspacePlanName;
  price: string;
  guests: string;
  credits: string;
}> = [
  { name: "Basic", price: "Rp149.000", guests: "150 guests", credits: "50 WA Blast credits" },
  { name: "Signature", price: "Rp349.000", guests: "500 guests", credits: "150 WA Blast credits" },
  { name: "Luxe", price: "Rp699.000", guests: "Unlimited guests", credits: "Unlimited WA Blast" },
];

export const RSVP_STATUS_STYLES: Record<string, string> = {
  "Not Attending": "border-transparent bg-[#fff1ec] text-[#b62d00]",
  Attending: "border-transparent bg-[#def6e4] text-[#247f3b]",
};

export const RSVP_LABELS: Record<RSVPStatus, string> = {
  Attending: "Attend",
  "Not Attending": "Not attend",
};

export const GUEST_LABEL_COLORS = ["#625cc7", "#247f3b", "#b66b00", "#b33b75", "#2c78a8", "#8a4f3d", "#5d6fc4"] as const;

export const DEFAULT_GUEST_LABELS: GuestLabel[] = [
  { id: "label-vip", name: "VIP", color: GUEST_LABEL_COLORS[0] },
  { id: "label-family", name: "Family", color: GUEST_LABEL_COLORS[1] },
  { id: "label-work", name: "Work", color: GUEST_LABEL_COLORS[2] },
  { id: "label-friend", name: "Friend", color: GUEST_LABEL_COLORS[4] },
  { id: "label-college", name: "College", color: GUEST_LABEL_COLORS[6] },
  { id: "label-neighbor", name: "Neighbor", color: GUEST_LABEL_COLORS[5] },
  { id: "label-rsvp", name: "RSVP", color: GUEST_LABEL_COLORS[3] },
];

export const MOCK_GUESTS: Array<Guest & { id: string }> = [
  {
    id: "g-001",
    type: "personal",
    side: "bride",
    planningStatus: "approved",
    vip: true,
    salutation: "Mr.",
    name: "Nadia Putri",
    pax: 2,
    rsvp: "Attending",
    labels: ["VIP", "Family"],
    whatsapp: "+62 812 4455 9012",
    wish: "Semoga perjalanan baru kalian selalu dipenuhi kasih, tawa, dan keberkahan.",
    wishStatus: "published",
    wishSubmittedAt: "2026-07-14T09:30:00+07:00",
  },
  {
    id: "g-002",
    type: "group",
    side: "groom",
    planningStatus: "review",
    vip: false,
    salutation: "",
    name: "Raka & Family",
    pax: 5,
    rsvp: "Not Attending",
    labels: ["Work"],
    whatsapp: "+62 857 7772 1881",
    wish: "Selamat menempuh hidup baru. Semoga acaranya lancar dan rumah tangganya harmonis.",
    wishStatus: "review",
    wishSubmittedAt: "2026-07-16T18:45:00+07:00",
  },
  {
    id: "g-003",
    type: "personal",
    side: "groom",
    planningStatus: "candidate",
    vip: false,
    salutation: "",
    name: "Bagas Pratama",
    pax: 1,
    rsvp: null,
    labels: ["Friend"],
    whatsapp: "+62 813 2219 7710",
    wish: "",
    wishStatus: null,
    wishSubmittedAt: null,
  },
  {
    id: "g-004",
    type: "personal",
    side: "bride",
    planningStatus: "approved",
    vip: true,
    salutation: "Mrs. & Mr.",
    name: "Indah & Reza",
    pax: 2,
    rsvp: "Attending",
    labels: ["VIP", "Family"],
    whatsapp: "+62 811 9988 7766",
    wish: "Turut berbahagia untuk Rafif dan Kanza. Semoga menjadi keluarga yang penuh cinta.",
    wishStatus: "published",
    wishSubmittedAt: "2026-07-15T13:10:00+07:00",
  },
  {
    id: "g-005",
    type: "personal",
    side: "bride",
    planningStatus: "candidate",
    vip: false,
    salutation: "Ms.",
    name: "Salsa Maharani",
    pax: 1,
    rsvp: null,
    labels: ["College", "Friend"],
    whatsapp: "+62 812 7788 3401",
    wish: "",
    wishStatus: null,
    wishSubmittedAt: null,
  },
  {
    id: "g-006",
    type: "group",
    side: "groom",
    planningStatus: "approved",
    vip: true,
    salutation: "Mr. & Mrs.",
    name: "Hendra & Family",
    pax: 4,
    rsvp: "Attending",
    labels: ["VIP", "Family"],
    whatsapp: "+62 811 3400 8821",
    wish: "Semoga persiapan menuju hari bahagia selalu dimudahkan.",
    wishStatus: "published",
    wishSubmittedAt: "2026-07-17T10:20:00+07:00",
  },
  {
    id: "g-007",
    type: "group",
    side: "bride",
    planningStatus: "review",
    vip: false,
    salutation: "",
    name: "Aurora Marketing Team",
    pax: 4,
    rsvp: null,
    labels: ["Work"],
    whatsapp: "+62 857 8801 4432",
    wish: "",
    wishStatus: null,
    wishSubmittedAt: null,
  },
  {
    id: "g-008",
    type: "personal",
    side: "groom",
    planningStatus: "removed",
    vip: false,
    salutation: "Mr.",
    name: "Dimas Saputra",
    pax: 1,
    rsvp: null,
    labels: ["Neighbor"],
    whatsapp: "+62 813 6654 9021",
    wish: "",
    wishStatus: null,
    wishSubmittedAt: null,
  },
];

export const OVERVIEW_STATS: Array<[string, string, string]> = [
  ["Total Guests", "143", "24 added this week"],
  ["Attending", "88", "62% RSVP rate"],
  ["Not Attending", "12", "43 awaiting response"],
  ["Wedding Day", "58d", "June 30, 2026"],
];

export const BANK_OPTIONS = ["BCA", "Mandiri", "BNI"] as const;

export const EWALLET_OPTIONS = ["GoPay", "OVO", "DANA"] as const;

export const HERO_BG_SVG =
  "data:image/svg+xml,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%22520%22%20height=%22860%22%20viewBox=%220%200%20520%20860%22%3E%3Crect%20width=%22520%22%20height=%22860%22%20fill=%22%23b8727e%22/%3E%3Cpath%20d=%22M0%20590c90-122%20165-178%20259-172%2098%206%20153%2090%20261%2056v386H0z%22%20fill=%22%23f4efe4%22%20opacity=%22.82%22/%3E%3Ccircle%20cx=%22374%22%20cy=%22222%22%20r=%22112%22%20fill=%22%23e9c5c5%22%20opacity=%22.8%22/%3E%3Cpath%20d=%22M127%20340c22-85%2086-142%20157-142%2086%200%20158%2083%20158%20186%200%2087-48%20151-119%20176-13-49-40-86-80-110-45-28-84-62-116-110Z%22%20fill=%22%23733d4d%22%20opacity=%22.72%22/%3E%3Cpath%20d=%22M90%20710c47-82%20107-122%20180-122%2075%200%20128%2042%20160%20122H90Z%22%20fill=%22%23ffffff%22%20opacity=%22.52%22/%3E%3C/svg%3E";

export const WA_TEMPLATE_DEFAULT =
  "Halo [Guest_Name], dengan bahagia kami mengundang Anda ke pernikahan kami. Buka undangan Anda di sini: [Invitation_Link]";
