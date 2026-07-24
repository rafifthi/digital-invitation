"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import type {
  CreateGuestReviewSessionInput,
  Guest,
  GuestCapacityPlan,
  GuestPlanningStatus,
  GuestResponseInput,
  GuestLabel,
  GuestReviewAttachment,
  GuestReviewSession,
  GuestReviewSessionStatus,
  GuestWithId,
  InvitationBlock,
  InvitationData,
  InvitationEvent,
  MenuId,
  TemplateId,
  WABlastCampaign,
  WABlastInput,
  WABlastRecipientStatus,
  WorkspaceCreationInput,
  WorkspaceSummary,
} from "@/components/dashboard/types";
import type { GuestWishStatus, Language } from "@/lib/types";
import { DEFAULT_EVENT, DEFAULT_GUEST_LABELS, DEFAULT_INVITATION, DEFAULT_WORKSPACES, GUEST_LABEL_COLORS, MOCK_GUESTS, WA_TEMPLATE_DEFAULT } from "@/lib/constants";
import { menuLabel } from "@/lib/i18n";
import { DEFAULT_BLOCKS, getTemplate } from "@/lib/templates";
import { invitationHost, invitationUrl } from "@/lib/invitation-url";
import { DASHBOARD_ROUTES, menuFromPathname } from "@/lib/dashboard-routes";
import {
  createReviewToken,
  DEFAULT_GUEST_CAPACITY_PLAN,
  readReviewSessions,
  REVIEW_SESSIONS_CHANGED_EVENT,
  REVIEW_SESSIONS_STORAGE_KEY,
  updateStoredReviewSession,
  writeReviewSessions,
} from "@/lib/guest-planning";

type WorkspaceRecord = {
  summary: WorkspaceSummary;
  invitation: InvitationData;
  event: InvitationEvent;
  selectedTemplate: TemplateId;
  blocks: InvitationBlock[];
  guests: GuestWithId[];
  capacityPlan: GuestCapacityPlan;
  guestLabels: GuestLabel[];
  waTemplate: string;
  waBlasts: WABlastCampaign[];
  demoSeedVersion?: number;
};

type DashboardContextValue = {
  activeMenu: MenuId;
  setActiveMenu: (id: MenuId) => void;
  isNavigating: boolean;
  activeTitle: string;
  language: Language;
  setLanguage: (lang: Language) => void;
  copied: boolean;
  copyInvitationLink: () => Promise<void>;
  musicPlaying: boolean;
  setMusicPlaying: (value: boolean) => void;
  guestDialogOpen: boolean;
  setGuestDialogOpen: (open: boolean) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
  blocks: InvitationBlock[];
  toggleBlockOpen: (id: string) => void;
  toggleBlockVisible: (id: string, checked: boolean) => void;
  setBlockField: (id: string, field: string, value: string) => void;
  invitation: InvitationData;
  setField: (field: keyof InvitationData, value: string) => void;
  event: InvitationEvent;
  updateEvent: (updates: Partial<Omit<InvitationEvent, "id">>) => void;
  workspaces: WorkspaceSummary[];
  activeWorkspaceId: string;
  setActiveWorkspaceId: (id: string) => void;
  createWorkspace: (input: WorkspaceCreationInput) => string;
  guests: GuestWithId[];
  guestLabels: GuestLabel[];
  capacityPlan: GuestCapacityPlan;
  setCapacityPlan: (updates: Partial<GuestCapacityPlan>) => void;
  reviewSessions: GuestReviewSession[];
  createGuestReviewSession: (input: CreateGuestReviewSessionInput) => string;
  setGuestReviewDecision: (token: string, guestId: string, decision: GuestPlanningStatus) => void;
  addGuestReviewAttachment: (token: string, attachment: GuestReviewAttachment) => void;
  setGuestReviewSessionStatus: (token: string, status: GuestReviewSessionStatus) => void;
  setGuestsPlanningStatus: (ids: string[], status: GuestPlanningStatus) => void;
  addGuest: (guest: Guest) => void;
  deleteGuests: (ids: string[]) => void;
  createGuestLabel: (name: string) => GuestLabel;
  setGuestLabelColor: (id: string, color: string) => void;
  submitGuestRsvp: (response: GuestResponseInput) => void;
  setGuestWishStatus: (id: string, status: GuestWishStatus) => void;
  waTemplate: string;
  setWATemplate: (template: string) => void;
  waBlasts: WABlastCampaign[];
  createWABlast: (input: WABlastInput) => string;
  setWABlastRecipientStatus: (blastId: string, guestId: string, status: WABlastRecipientStatus) => void;
};

const WORKSPACE_STORAGE_KEY = "riuh-merekah-workspaces-v1";
const DEFAULT_WORKSPACE_ID = DEFAULT_WORKSPACES[0].id;
const CURRENT_DEMO_SEED_VERSION = 2;
const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const routeMenu = menuFromPathname(pathname);
  const [pendingMenu, setPendingMenu] = useState<MenuId | null>(null);
  const [transitionPending, startNavigationTransition] = useTransition();
  const activeMenu = pendingMenu ?? routeMenu;
  const isNavigating = pendingMenu !== null || transitionPending;
  const [language, setLanguage] = useState<Language>("EN");
  const [copied, setCopied] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [workspaceRecords, setWorkspaceRecords] = useState<Record<string, WorkspaceRecord>>(createInitialWorkspaceRecords);
  const [activeWorkspaceId, setActiveWorkspaceState] = useState(DEFAULT_WORKSPACE_ID);
  const [workspaceStorageReady, setWorkspaceStorageReady] = useState(false);
  const [reviewSessionRecords, setReviewSessionRecords] = useState<GuestReviewSession[]>([]);

  useEffect(() => {
    setPendingMenu(null);
  }, [pathname]);

  useEffect(() => {
    let nextRecords = createInitialWorkspaceRecords();
    let nextActiveWorkspaceId = DEFAULT_WORKSPACE_ID;

    try {
      const raw = window.localStorage.getItem(WORKSPACE_STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw) as { records?: Record<string, WorkspaceRecord>; activeWorkspaceId?: string };
        if (saved.records && Object.keys(saved.records).length > 0) {
          const fallbackWorkspaceId = Object.keys(saved.records)[0];
          nextRecords = hydrateWorkspaceRecords(saved.records);
          nextActiveWorkspaceId = saved.activeWorkspaceId && nextRecords[saved.activeWorkspaceId]
            ? saved.activeWorkspaceId
            : fallbackWorkspaceId;
        }
      }
    } catch {
      // Invalid local demo state falls back to the bundled workspace.
    }

    const storedSessions = readReviewSessions();
    const migratedSessions = migrateLegacyReviewSessions(storedSessions, nextRecords);
    if (migratedSessions.some((session, index) => session !== storedSessions[index])) {
      writeReviewSessions(migratedSessions);
    }
    setReviewSessionRecords(migratedSessions);
    setWorkspaceRecords(applyReviewDecisionsToRecords(nextRecords, migratedSessions));
    setActiveWorkspaceState(nextActiveWorkspaceId);
    setWorkspaceStorageReady(true);
  }, []);

  useEffect(() => {
    const syncReviewSessions = () => {
      const sessions = readReviewSessions();
      setReviewSessionRecords(sessions);
      setWorkspaceRecords((current) => applyReviewDecisionsToRecords(current, sessions));
    };
    const handleStorage = (event: StorageEvent) => {
      if (event.key === REVIEW_SESSIONS_STORAGE_KEY) syncReviewSessions();
    };
    window.addEventListener(REVIEW_SESSIONS_CHANGED_EVENT, syncReviewSessions);
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", syncReviewSessions);
    return () => {
      window.removeEventListener(REVIEW_SESSIONS_CHANGED_EVENT, syncReviewSessions);
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", syncReviewSessions);
    };
  }, []);

  useEffect(() => {
    if (!workspaceStorageReady) return;
    window.localStorage.setItem(WORKSPACE_STORAGE_KEY, JSON.stringify({ records: workspaceRecords, activeWorkspaceId }));
  }, [activeWorkspaceId, workspaceRecords, workspaceStorageReady]);

  const activeWorkspace = (workspaceRecords[activeWorkspaceId] ?? Object.values(workspaceRecords)[0])!;
  const invitation = activeWorkspace.invitation;
  const event = activeWorkspace.event;
  const selectedTemplate = activeWorkspace.selectedTemplate;
  const blocks = activeWorkspace.blocks;
  const guests = activeWorkspace.guests;
  const capacityPlan = activeWorkspace.capacityPlan;
  const guestLabels = activeWorkspace.guestLabels;
  const waTemplate = activeWorkspace.waTemplate;
  const waBlasts = activeWorkspace.waBlasts;
  const workspaces = useMemo(() => Object.values(workspaceRecords).map((workspace) => workspace.summary), [workspaceRecords]);
  const reviewSessions = useMemo(
    () => reviewSessionRecords.filter((session) => session.workspaceId === activeWorkspaceId),
    [activeWorkspaceId, reviewSessionRecords],
  );

  const activeTitle = useMemo(() => menuLabel(language, activeMenu), [activeMenu, language]);

  const setActiveMenu = useCallback((id: MenuId) => {
    const destination = DASHBOARD_ROUTES[id];
    if (destination === pathname) return;
    setPendingMenu(id);
    startNavigationTransition(() => router.push(destination));
  }, [pathname, router]);

  const updateActiveWorkspace = useCallback((updater: (workspace: WorkspaceRecord) => WorkspaceRecord) => {
    setWorkspaceRecords((current) => {
      const workspace = current[activeWorkspaceId];
      if (!workspace) return current;
      return { ...current, [activeWorkspaceId]: updater(workspace) };
    });
  }, [activeWorkspaceId]);

  const setActiveWorkspaceId = useCallback((id: string) => {
    if (!workspaceRecords[id]) return;
    setActiveWorkspaceState(id);
    setCopied(false);
    setGuestDialogOpen(false);
  }, [workspaceRecords]);

  const createWorkspace = useCallback((input: WorkspaceCreationInput) => {
    const timestamp = Date.now();
    const id = `workspace-${timestamp}`;
    const template = getTemplate(input.templateId);
    const nextEvent: InvitationEvent = { id: `event-${timestamp}`, ...input.event };
    const nextInvitation: InvitationData = {
      ...DEFAULT_INVITATION,
      customSlug: invitationHost(input.subdomain),
      accentColor: template.accent,
      coupleNames: input.name,
      weddingDate: input.event.date,
      groomName: "",
      brideName: "",
      familyLine: "",
      eventTime: formatEventTime(input.event.startTime, input.event.endTime),
      venueName: input.event.venueName,
      venueAddress: input.event.venueAddress,
    };
    const record: WorkspaceRecord = {
      summary: {
        id,
        name: input.name,
        packageName: input.packageName,
        status: "active",
      },
      invitation: nextInvitation,
      event: nextEvent,
      selectedTemplate: input.templateId,
      blocks: cloneBlocks(DEFAULT_BLOCKS),
      guests: [],
      capacityPlan: { ...DEFAULT_GUEST_CAPACITY_PLAN },
      guestLabels: [],
      waTemplate: WA_TEMPLATE_DEFAULT,
      waBlasts: [],
    };

    setWorkspaceRecords((current) => ({ ...current, [id]: record }));
    setActiveWorkspaceState(id);
    setCopied(false);
    setGuestDialogOpen(false);
    setActiveMenu("overview");
    return id;
  }, [setActiveMenu]);

  const setField = useCallback((field: keyof InvitationData, value: string) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      invitation: { ...workspace.invitation, [field]: value },
    }));
  }, [updateActiveWorkspace]);

  const updateEvent = useCallback((updates: Partial<Omit<InvitationEvent, "id">>) => {
    updateActiveWorkspace((workspace) => {
      const nextEvent = { ...workspace.event, ...updates };
      return {
        ...workspace,
        event: nextEvent,
        invitation: {
          ...workspace.invitation,
          ...(updates.date !== undefined ? { weddingDate: updates.date } : {}),
          ...(updates.venueName !== undefined ? { venueName: updates.venueName } : {}),
          ...(updates.venueAddress !== undefined ? { venueAddress: updates.venueAddress } : {}),
          ...(updates.startTime !== undefined || updates.endTime !== undefined
            ? { eventTime: formatEventTime(nextEvent.startTime, nextEvent.endTime) }
            : {}),
        },
      };
    });
  }, [updateActiveWorkspace]);

  const setSelectedTemplate = useCallback((id: TemplateId) => {
    const template = getTemplate(id);
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      selectedTemplate: id,
      invitation: { ...workspace.invitation, accentColor: template.accent },
    }));
  }, [updateActiveWorkspace]);

  const toggleBlockOpen = useCallback((id: string) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      blocks: workspace.blocks.map((block) => block.id === id ? { ...block, open: !block.open } : block),
    }));
  }, [updateActiveWorkspace]);

  const toggleBlockVisible = useCallback((id: string, checked: boolean) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      blocks: workspace.blocks.map((block) => block.id === id ? { ...block, visible: checked } : block),
    }));
  }, [updateActiveWorkspace]);

  const setBlockField = useCallback((id: string, field: string, value: string) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      blocks: workspace.blocks.map((block) => block.id === id
        ? { ...block, content: { ...block.content, [field]: value } }
        : block),
    }));
  }, [updateActiveWorkspace]);

  const addGuest = useCallback((guest: Guest) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guests: [...workspace.guests, { ...guest, id: `g-${Date.now()}` }],
    }));
  }, [updateActiveWorkspace]);

  const setCapacityPlan = useCallback((updates: Partial<GuestCapacityPlan>) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      capacityPlan: {
        ...workspace.capacityPlan,
        ...updates,
        maxPax: Math.max(1, Math.round(updates.maxPax ?? workspace.capacityPlan.maxPax)),
        groomPercent: Math.min(100, Math.max(0, Math.round(updates.groomPercent ?? workspace.capacityPlan.groomPercent))),
      },
    }));
  }, [updateActiveWorkspace]);

  const createGuestReviewSession = useCallback((input: CreateGuestReviewSessionInput) => {
    const token = createReviewToken();
    const selectedGuests = guests.filter((guest) => input.guestIds.includes(guest.id));
    const session: GuestReviewSession = {
      id: `review-${Date.now()}`,
      token,
      workspaceId: activeWorkspaceId,
      reviewerName: input.reviewerName.trim(),
      side: input.filterSide === "all" ? (selectedGuests[0]?.side ?? "groom") : input.filterSide,
      mode: "digital",
      filterSide: input.filterSide,
      filterLabels: [...input.filterLabels],
      filtersApplied: true,
      capacityPlan: { ...capacityPlan },
      status: "active",
      createdAt: new Date().toISOString(),
      completedAt: null,
      attachments: [],
      items: selectedGuests.map((guest) => ({
        guestId: guest.id,
        name: guest.name,
        pax: guest.pax,
        type: guest.type,
        side: guest.side,
        labels: [...guest.labels],
        decision: "candidate",
        decidedAt: null,
      })),
    };
    const nextSessions = [session, ...reviewSessionRecords];
    setReviewSessionRecords(nextSessions);
    writeReviewSessions(nextSessions);
    return token;
  }, [activeWorkspaceId, capacityPlan, guests, reviewSessionRecords]);

  const setGuestReviewDecision = useCallback((token: string, guestId: string, decision: GuestPlanningStatus) => {
    const decidedAt = decision === "candidate" ? null : new Date().toISOString();
    const updateSession = (session: GuestReviewSession): GuestReviewSession => {
      const items = session.items.map((item) => item.guestId === guestId
        ? { ...item, decision, decidedAt }
        : item);
      const completed = items.length > 0 && items.every((item) => item.decision !== "candidate");
      return {
        ...session,
        items,
        status: session.status === "closed"
          ? "closed"
          : completed
            ? "completed"
            : session.status === "completed"
              ? "active"
              : session.status,
        completedAt: completed ? new Date().toISOString() : null,
      };
    };
    setReviewSessionRecords((current) => current.map((session) => session.token === token ? updateSession(session) : session));
    updateStoredReviewSession(token, updateSession);
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guests: workspace.guests.map((guest) => guest.id === guestId ? { ...guest, planningStatus: decision } : guest),
    }));
  }, [updateActiveWorkspace]);

  const addGuestReviewAttachment = useCallback((token: string, attachment: GuestReviewAttachment) => {
    const updateSession = (session: GuestReviewSession): GuestReviewSession => ({
      ...session,
      attachments: [...session.attachments, attachment],
      status: "reconciling",
    });
    setReviewSessionRecords((current) => current.map((session) => session.token === token ? updateSession(session) : session));
    updateStoredReviewSession(token, updateSession);
  }, []);

  const setGuestReviewSessionStatus = useCallback((token: string, status: GuestReviewSessionStatus) => {
    const updateSession = (session: GuestReviewSession): GuestReviewSession => ({ ...session, status });
    setReviewSessionRecords((current) => current.map((session) => session.token === token ? updateSession(session) : session));
    updateStoredReviewSession(token, updateSession);
  }, []);

  const setGuestsPlanningStatus = useCallback((ids: string[], planningStatus: GuestPlanningStatus) => {
    if (ids.length === 0) return;
    const selectedIds = new Set(ids);
    const decidedAt = planningStatus === "candidate" ? null : new Date().toISOString();
    const nextSessions = reviewSessionRecords.map((session) => {
      if (session.workspaceId !== activeWorkspaceId) return session;

      let changed = false;
      const items = session.items.map((item) => {
        if (!selectedIds.has(item.guestId)) return item;
        changed = true;
        return { ...item, decision: planningStatus, decidedAt };
      });
      if (!changed) return session;

      const completed = items.length > 0 && items.every((item) => item.decision !== "candidate");
      return {
        ...session,
        items,
        status: session.status === "closed"
          ? "closed" as const
          : completed
            ? "completed" as const
            : session.status === "completed"
              ? "active" as const
              : session.status,
        completedAt: completed ? new Date().toISOString() : null,
      };
    });

    setReviewSessionRecords(nextSessions);
    writeReviewSessions(nextSessions);
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guests: workspace.guests.map((guest) => selectedIds.has(guest.id)
        ? { ...guest, planningStatus }
        : guest),
    }));
  }, [activeWorkspaceId, reviewSessionRecords, updateActiveWorkspace]);

  const deleteGuests = useCallback((ids: string[]) => {
    if (ids.length === 0) return;
    const selectedIds = new Set(ids);
    const nextSessions = reviewSessionRecords.map((session) => {
      if (session.workspaceId !== activeWorkspaceId) return session;
      const items = session.items.filter((item) => !selectedIds.has(item.guestId));
      return items.length === session.items.length ? session : { ...session, items };
    });

    setReviewSessionRecords(nextSessions);
    writeReviewSessions(nextSessions);
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guests: workspace.guests.filter((guest) => !selectedIds.has(guest.id)),
    }));
  }, [activeWorkspaceId, reviewSessionRecords, updateActiveWorkspace]);

  const createGuestLabel = useCallback((name: string) => {
    const normalizedName = name.trim();
    const existing = guestLabels.find((label) => label.name.toLocaleLowerCase() === normalizedName.toLocaleLowerCase());
    if (existing) return existing;

    const label: GuestLabel = {
      id: `label-${Date.now()}-${normalizedName.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "tag"}`,
      name: normalizedName,
      color: GUEST_LABEL_COLORS[guestLabels.length % GUEST_LABEL_COLORS.length],
    };
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guestLabels: [...workspace.guestLabels, label],
    }));
    return label;
  }, [guestLabels, updateActiveWorkspace]);

  const setGuestLabelColor = useCallback((id: string, color: string) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guestLabels: workspace.guestLabels.map((label) => label.id === id ? { ...label, color } : label),
    }));
  }, [updateActiveWorkspace]);

  const submitGuestRsvp = useCallback((response: GuestResponseInput) => {
    const normalizedPhone = normalizePhone(response.whatsapp);
    const submittedAt = response.wish.trim() ? new Date().toISOString() : null;
    updateActiveWorkspace((workspace) => {
      const existingIndex = workspace.guests.findIndex((guest) =>
        normalizePhone(guest.whatsapp) === normalizedPhone
        || guest.name.trim().toLocaleLowerCase() === response.name.trim().toLocaleLowerCase(),
      );
      const responseFields = {
        name: response.name.trim(),
        whatsapp: response.whatsapp.trim(),
        pax: response.pax,
        rsvp: response.rsvp,
        wish: response.wish.trim(),
        wishStatus: response.wish.trim() ? "review" as const : null,
        wishSubmittedAt: submittedAt,
      };

      const nextGuests = existingIndex >= 0
        ? workspace.guests.map((guest, index) => index === existingIndex ? { ...guest, ...responseFields } : guest)
        : [...workspace.guests, {
            id: `g-${Date.now()}`,
            type: "personal" as const,
            side: "groom" as const,
            planningStatus: "candidate" as const,
            vip: false,
            salutation: "",
            labels: ["RSVP"],
            ...responseFields,
          }];
      return { ...workspace, guests: nextGuests };
    });
  }, [updateActiveWorkspace]);

  const setGuestWishStatus = useCallback((id: string, status: GuestWishStatus) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      guests: workspace.guests.map((guest) => guest.id === id ? { ...guest, wishStatus: status } : guest),
    }));
  }, [updateActiveWorkspace]);

  const setWATemplate = useCallback((template: string) => {
    updateActiveWorkspace((workspace) => ({ ...workspace, waTemplate: template }));
  }, [updateActiveWorkspace]);

  const createWABlast = useCallback(({ recipientIds, template }: WABlastInput) => {
    const blastId = `wa-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const createdAt = new Date().toISOString();

    updateActiveWorkspace((workspace) => {
      const recipients = workspace.guests
        .filter((guest) => recipientIds.includes(guest.id) && isValidWhatsApp(guest.whatsapp))
        .map((guest) => ({
          guestId: guest.id,
          guestName: guest.name,
          whatsapp: guest.whatsapp,
          message: personalizeWABlast(template, guest.name, invitationUrl(workspace.invitation.customSlug)),
          status: "queued" as const,
          updatedAt: null,
        }));

      const campaign: WABlastCampaign = {
        id: blastId,
        template,
        createdAt,
        status: "queued",
        recipients,
      };

      return { ...workspace, waBlasts: [campaign, ...(workspace.waBlasts ?? [])] };
    });

    return blastId;
  }, [updateActiveWorkspace]);

  const setWABlastRecipientStatus = useCallback((blastId: string, guestId: string, status: WABlastRecipientStatus) => {
    updateActiveWorkspace((workspace) => ({
      ...workspace,
      waBlasts: (workspace.waBlasts ?? []).map((campaign) => {
        if (campaign.id !== blastId) return campaign;
        const recipients = campaign.recipients.map((recipient) => recipient.guestId === guestId
          ? { ...recipient, status, updatedAt: new Date().toISOString() }
          : recipient);
        const hasPending = recipients.some((recipient) => recipient.status === "queued" || recipient.status === "opened");
        const hasProgress = recipients.some((recipient) => recipient.status !== "queued");
        return {
          ...campaign,
          recipients,
          status: hasPending ? (hasProgress ? "in_progress" as const : "queued" as const) : "completed" as const,
        };
      }),
    }));
  }, [updateActiveWorkspace]);

  const copyInvitationLink = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl(invitation.customSlug));
    } catch {
      // Clipboard API may not be available.
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }, [invitation.customSlug]);

  const value = useMemo<DashboardContextValue>(() => ({
    activeMenu,
    setActiveMenu,
    isNavigating,
    activeTitle,
    language,
    setLanguage,
    copied,
    copyInvitationLink,
    musicPlaying,
    setMusicPlaying,
    guestDialogOpen,
    setGuestDialogOpen,
    selectedTemplate,
    setSelectedTemplate,
    blocks,
    toggleBlockOpen,
    toggleBlockVisible,
    setBlockField,
    invitation,
    setField,
    event,
    updateEvent,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    createWorkspace,
    guests,
    guestLabels,
    capacityPlan,
    setCapacityPlan,
    reviewSessions,
    createGuestReviewSession,
    setGuestReviewDecision,
    addGuestReviewAttachment,
    setGuestReviewSessionStatus,
    setGuestsPlanningStatus,
    addGuest,
    deleteGuests,
    createGuestLabel,
    setGuestLabelColor,
    submitGuestRsvp,
    setGuestWishStatus,
    waTemplate,
    setWATemplate,
    waBlasts,
    createWABlast,
    setWABlastRecipientStatus,
  }), [
    activeMenu,
    setActiveMenu,
    isNavigating,
    activeTitle,
    language,
    copied,
    copyInvitationLink,
    musicPlaying,
    guestDialogOpen,
    selectedTemplate,
    setSelectedTemplate,
    blocks,
    toggleBlockOpen,
    toggleBlockVisible,
    setBlockField,
    invitation,
    setField,
    event,
    updateEvent,
    workspaces,
    activeWorkspaceId,
    setActiveWorkspaceId,
    createWorkspace,
    guests,
    guestLabels,
    capacityPlan,
    setCapacityPlan,
    reviewSessions,
    createGuestReviewSession,
    setGuestReviewDecision,
    addGuestReviewAttachment,
    setGuestReviewSessionStatus,
    setGuestsPlanningStatus,
    addGuest,
    deleteGuests,
    createGuestLabel,
    setGuestLabelColor,
    submitGuestRsvp,
    setGuestWishStatus,
    waTemplate,
    setWATemplate,
    waBlasts,
    createWABlast,
    setWABlastRecipientStatus,
  ]);

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
}

function createInitialWorkspaceRecords(): Record<string, WorkspaceRecord> {
  const summary = DEFAULT_WORKSPACES[0];
  return {
    [summary.id]: {
      summary,
      invitation: { ...DEFAULT_INVITATION },
      event: { ...DEFAULT_EVENT },
      selectedTemplate: "sunny",
      blocks: cloneBlocks(DEFAULT_BLOCKS),
      guests: MOCK_GUESTS.map((guest) => ({ ...guest, labels: [...guest.labels] })),
      capacityPlan: { ...DEFAULT_GUEST_CAPACITY_PLAN },
      guestLabels: DEFAULT_GUEST_LABELS.map((label) => ({ ...label })),
      waTemplate: WA_TEMPLATE_DEFAULT,
      waBlasts: [],
      demoSeedVersion: CURRENT_DEMO_SEED_VERSION,
    },
  };
}

function cloneBlocks(blocks: InvitationBlock[]) {
  return blocks.map((block) => ({ ...block, content: { ...block.content } }));
}

function formatEventTime(startTime: string, endTime: string) {
  return endTime ? `${startTime} - ${endTime} WIB` : `${startTime} WIB`;
}

function normalizePhone(value: string) {
  return value.replace(/\D/g, "").replace(/^0/, "62");
}

function isValidWhatsApp(value: string) {
  const digits = normalizePhone(value);
  return digits.length >= 10 && digits.length <= 15;
}

function personalizeWABlast(template: string, guestName: string, link: string) {
  return template
    .replaceAll("[Guest_Name]", guestName)
    .replaceAll("[Invitation_Link]", link);
}

function hydrateWorkspaceRecords(records: Record<string, WorkspaceRecord>) {
  return Object.fromEntries(Object.entries(records).map(([id, workspace]) => {
    let guests = (workspace.guests ?? []).map((guest) => ({
      ...guest,
      side: guest.side ?? "groom",
      planningStatus: guest.planningStatus ?? "candidate",
      wish: guest.wish ?? "",
      wishStatus: guest.wishStatus ?? null,
      wishSubmittedAt: guest.wishSubmittedAt ?? null,
    }));
    let guestLabels = workspace.guestLabels ?? deriveGuestLabels(guests);

    const shouldMigrateDemoSeed = id === DEFAULT_WORKSPACE_ID
      && (workspace.demoSeedVersion ?? 0) < CURRENT_DEMO_SEED_VERSION
      && guests.some((guest) => MOCK_GUESTS.some((seed) => seed.id === guest.id));

    if (shouldMigrateDemoSeed) {
      const seedById = new Map(MOCK_GUESTS.map((guest) => [guest.id, guest]));
      guests = guests.map((guest) => {
        const seed = seedById.get(guest.id);
        return seed
          ? {
              ...guest,
              type: seed.type,
              side: seed.side,
              planningStatus: seed.planningStatus,
              vip: seed.vip,
              labels: [...seed.labels],
            }
          : guest;
      });

      const existingGuestIds = new Set(guests.map((guest) => guest.id));
      guests = [
        ...guests,
        ...MOCK_GUESTS
          .filter((guest) => !existingGuestIds.has(guest.id))
          .map((guest) => ({ ...guest, labels: [...guest.labels] })),
      ];

      const existingLabelNames = new Set(guestLabels.map((label) => label.name.toLocaleLowerCase()));
      guestLabels = [
        ...guestLabels,
        ...DEFAULT_GUEST_LABELS
          .filter((label) => !existingLabelNames.has(label.name.toLocaleLowerCase()))
          .map((label) => ({ ...label })),
      ];
    }

    return [
      id,
      {
      ...workspace,
      invitation: { ...DEFAULT_INVITATION, ...workspace.invitation },
      capacityPlan: { ...DEFAULT_GUEST_CAPACITY_PLAN, ...workspace.capacityPlan },
      guests,
      guestLabels,
      waTemplate: workspace.waTemplate ?? WA_TEMPLATE_DEFAULT,
      waBlasts: workspace.waBlasts ?? [],
      demoSeedVersion: shouldMigrateDemoSeed ? CURRENT_DEMO_SEED_VERSION : workspace.demoSeedVersion,
      },
    ];
  }));
}

function migrateLegacyReviewSessions(
  sessions: GuestReviewSession[],
  records: Record<string, WorkspaceRecord>,
) {
  return sessions.map((session) => {
    if (session.filtersApplied) return session;

    const filterSide = session.filterSide ?? session.side;
    const filterLabels = session.filterLabels ?? [];
    const existingItems = new Map(session.items.map((item) => [item.guestId, item]));
    const workspaceGuests = records[session.workspaceId]?.guests ?? [];
    const matchingGuests = workspaceGuests.filter((guest) => (
      (filterSide === "all" || guest.side === filterSide)
      && (filterLabels.length === 0 || filterLabels.some((label) => guest.labels.includes(label)))
    ));

    return {
      ...session,
      filterSide,
      filterLabels,
      filtersApplied: true,
      items: matchingGuests.map((guest) => {
        const existingItem = existingItems.get(guest.id);
        return {
          guestId: guest.id,
          name: guest.name,
          pax: guest.pax,
          type: guest.type,
          side: guest.side,
          labels: [...guest.labels],
          decision: existingItem?.decision ?? "candidate",
          decidedAt: existingItem?.decidedAt ?? null,
        };
      }),
    };
  });
}

function applyReviewDecisionsToRecords(
  records: Record<string, WorkspaceRecord>,
  sessions: GuestReviewSession[],
) {
  const latestDecisions = new Map<string, { decision: GuestPlanningStatus; decidedAt: string }>();
  sessions.forEach((session) => {
    session.items.forEach((item) => {
      if (item.decision === "candidate" || !item.decidedAt) return;
      const key = `${session.workspaceId}:${item.guestId}`;
      const current = latestDecisions.get(key);
      if (!current || item.decidedAt > current.decidedAt) {
        latestDecisions.set(key, { decision: item.decision, decidedAt: item.decidedAt });
      }
    });
  });

  return Object.fromEntries(Object.entries(records).map(([workspaceId, workspace]) => [
    workspaceId,
    {
      ...workspace,
      guests: workspace.guests.map((guest) => {
        const latest = latestDecisions.get(`${workspaceId}:${guest.id}`);
        return latest ? { ...guest, planningStatus: latest.decision } : guest;
      }),
    },
  ]));
}

function deriveGuestLabels(guests: GuestWithId[]) {
  const names = Array.from(new Set(guests.flatMap((guest) => guest.labels)));
  return names.map((name, index) => ({
    id: `label-migrated-${index}-${name.toLocaleLowerCase().replace(/[^a-z0-9]+/g, "-")}`,
    name,
    color: GUEST_LABEL_COLORS[index % GUEST_LABEL_COLORS.length],
  }));
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) throw new Error("useDashboard must be used within <DashboardProvider>");
  return ctx;
}
