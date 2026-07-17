import type { ElementType } from "react";
import { Gift, LayoutDashboard, Settings, Sparkles, UserCog, Users } from "lucide-react";
import type { MenuId, InvitationData, Guest } from "@/components/dashboard/types";
import type { RSVPStatus } from "@/lib/types";

export const MENU_ITEMS: Array<{
  id: MenuId;
  label: string;
  icon: ElementType;
  children?: Array<{ id: MenuId; label: string }>;
}> = [
  { id: "overview", label: "Dashboard", icon: LayoutDashboard },
  { id: "design", label: "Design", icon: Sparkles },
  { id: "gifts", label: "Gifts", icon: Gift },
  {
    id: "guest-list",
    label: "Guest",
    icon: Users,
    children: [
      { id: "guest-list", label: "Guest List" },
      { id: "wablast", label: "WA Blast" },
    ],
  },
  { id: "settings", label: "Invitation Settings", icon: Settings },
  { id: "account", label: "Account", icon: UserCog },
];

export const DEFAULT_INVITATION: InvitationData = {
  customSlug: "rafifkanza.riuhmerekah.com",
  youtubeUrl: "https://youtube.com/watch?v=wedding-acoustic",
  coupleNames: "Rafif & Kanza",
  weddingDate: "2026-06-30",
  openingText:
    "Together with joyful hearts, we invite you to celebrate our wedding day.",
  groomName: "Rafif Ardiansyah",
  brideName: "Kanza Maharani",
  familyLine: "Son and daughter of two loving families",
  eventTime: "10:00 WIB",
  venueName: "The Langham Jakarta",
  venueAddress: "District 8, SCBD, Jakarta Selatan",
};

export const RSVP_STATUS_STYLES: Record<string, string> = {
  Pending: "border-transparent bg-[#fff4d9] text-[#8f5d00]",
  "Not Attending": "border-transparent bg-[#fff1ec] text-[#b62d00]",
  Attending: "border-transparent bg-[#def6e4] text-[#247f3b]",
};

export const RSVP_LABELS: Record<RSVPStatus, string> = {
  Attending: "Attending",
  "Not Attending": "Not Attending",
  Pending: "Pending",
};

export const MOCK_GUESTS: Array<Guest & { id: string }> = [
  {
    id: "g-001",
    type: "personal",
    vip: true,
    salutation: "Mr.",
    name: "Nadia Putri",
    pax: 2,
    rsvp: "Attending",
    labels: ["VIP", "Family"],
    whatsapp: "+62 812 4455 9012",
  },
  {
    id: "g-002",
    type: "group",
    vip: false,
    salutation: "",
    name: "Raka & Family",
    pax: 5,
    rsvp: "Not Attending",
    labels: ["Work"],
    whatsapp: "+62 857 7772 1881",
  },
  {
    id: "g-003",
    type: "personal",
    vip: false,
    salutation: "",
    name: "Bagas Pratama",
    pax: 1,
    rsvp: "Pending",
    labels: ["Friend"],
    whatsapp: "+62 813 2219 7710",
  },
  {
    id: "g-004",
    type: "personal",
    vip: true,
    salutation: "Mrs. & Mr.",
    name: "Indah & Reza",
    pax: 2,
    rsvp: "Attending",
    labels: ["VIP", "Family"],
    whatsapp: "+62 811 9988 7766",
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
  "Hi [Guest_Name], we joyfully invite you to our wedding. Open your invitation here: [Invitation_Link]";
