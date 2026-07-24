import type {
  GuestCapacityPlan,
  GuestPlanningStatus,
  GuestReviewFilterSide,
  GuestReviewSession,
  GuestSide,
  GuestWithId,
} from "@/components/dashboard/types";

export const REVIEW_SESSIONS_STORAGE_KEY = "riuh-merekah-review-sessions-v1";
export const REVIEW_SESSIONS_CHANGED_EVENT = "riuh-review-sessions-changed";

export const DEFAULT_GUEST_CAPACITY_PLAN: GuestCapacityPlan = {
  maxPax: 1200,
  groomPercent: 50,
};

export type GuestCapacityMetrics = {
  approved: number;
  review: number;
  candidate: number;
  removed: number;
  potential: number;
  maximum: number;
  approvedBySide: Record<GuestSide, number>;
  potentialBySide: Record<GuestSide, number>;
};

export function calculateGuestCapacity(guests: GuestWithId[]): GuestCapacityMetrics {
  const metrics: GuestCapacityMetrics = {
    approved: 0,
    review: 0,
    candidate: 0,
    removed: 0,
    potential: 0,
    maximum: 0,
    approvedBySide: { groom: 0, bride: 0 },
    potentialBySide: { groom: 0, bride: 0 },
  };

  guests.forEach((guest) => {
    metrics[guest.planningStatus] += guest.pax;
    if (guest.planningStatus === "approved") {
      metrics.approvedBySide[guest.side] += guest.pax;
      metrics.potentialBySide[guest.side] += guest.pax;
    }
    if (guest.planningStatus === "review") {
      metrics.potentialBySide[guest.side] += guest.pax;
    }
  });

  metrics.potential = metrics.approved + metrics.review;
  metrics.maximum = metrics.potential + metrics.candidate;
  return metrics;
}

export function capacityState(metrics: GuestCapacityMetrics, maxPax: number) {
  if (metrics.approved > maxPax) return "over" as const;
  if (metrics.candidate > 0) return "sorting" as const;
  if (metrics.potential > maxPax) return "decision" as const;
  return "safe" as const;
}

export function planningStatusLabel(status: GuestPlanningStatus, isId = true) {
  const labels: Record<GuestPlanningStatus, [string, string]> = {
    candidate: ["Belum disortir", "Not sorted"],
    approved: ["Setuju", "Approved"],
    review: ["Tinjau lagi", "Review"],
    removed: ["Coret", "Removed"],
  };
  return labels[status][isId ? 0 : 1];
}

export function guestSideLabel(side: GuestSide, isId = true) {
  if (side === "groom") return isId ? "Pihak pria" : "Groom side";
  return isId ? "Pihak wanita" : "Bride side";
}

export function guestSideFilterLabel(side: GuestReviewFilterSide, isId = true) {
  if (side === "all") return isId ? "Semua pihak" : "All sides";
  return guestSideLabel(side, isId);
}

export function readReviewSessions(): GuestReviewSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVIEW_SESSIONS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as GuestReviewSession[];
    return Array.isArray(parsed) ? parsed.map(hydrateReviewSession) : [];
  } catch {
    return [];
  }
}

export function writeReviewSessions(sessions: GuestReviewSession[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REVIEW_SESSIONS_STORAGE_KEY, JSON.stringify(sessions));
  window.dispatchEvent(new CustomEvent(REVIEW_SESSIONS_CHANGED_EVENT));
}

export function updateStoredReviewSession(
  token: string,
  updater: (session: GuestReviewSession) => GuestReviewSession,
) {
  const sessions = readReviewSessions();
  const next = sessions.map((session) => session.token === token ? updater(session) : session);
  writeReviewSessions(next);
  return next.find((session) => session.token === token) ?? null;
}

export function createReviewToken() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID().replaceAll("-", "");
  }
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 14)}`;
}

function hydrateReviewSession(session: GuestReviewSession): GuestReviewSession {
  return {
    ...session,
    filterSide: session.filterSide ?? session.side,
    filterLabels: session.filterLabels ?? [],
    filtersApplied: session.filtersApplied ?? false,
    capacityPlan: { ...DEFAULT_GUEST_CAPACITY_PLAN, ...session.capacityPlan },
    status: session.status ?? "active",
    completedAt: session.completedAt ?? null,
    attachments: session.attachments ?? [],
    items: (session.items ?? []).map((item) => ({
      ...item,
      labels: item.labels ?? [],
      decision: item.decision ?? "candidate",
      decidedAt: item.decidedAt ?? null,
    })),
  };
}
