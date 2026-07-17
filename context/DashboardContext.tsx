"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import type { InvitationBlock, MenuId, InvitationData, TemplateId } from "@/components/dashboard/types";
import type { Language } from "@/lib/types";
import { DEFAULT_INVITATION } from "@/lib/constants";
import { menuLabel } from "@/lib/i18n";
import { DEFAULT_BLOCKS } from "@/lib/templates";

type DashboardContextValue = {
  activeMenu: MenuId;
  setActiveMenu: (id: MenuId) => void;
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
};

const DashboardContext = createContext<DashboardContextValue | null>(null);

export function DashboardProvider({ children }: { children: React.ReactNode }) {
  const [activeMenu, setActiveMenu] = useState<MenuId>("design");
  const [language, setLanguage] = useState<Language>("EN");
  const [copied, setCopied] = useState(false);
  const [musicPlaying, setMusicPlaying] = useState(true);
  const [guestDialogOpen, setGuestDialogOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateId>("sunny");
  const [blocks, setBlocks] = useState<InvitationBlock[]>(DEFAULT_BLOCKS);
  const [invitation, setInvitation] = useState<InvitationData>(DEFAULT_INVITATION);

  const activeTitle = useMemo(() => {
    return menuLabel(language, activeMenu);
  }, [activeMenu, language]);

  const setField = useCallback((field: keyof InvitationData, value: string) => {
    setInvitation((current) => ({ ...current, [field]: value }));
  }, []);

  const toggleBlockOpen = useCallback((id: string) => {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, open: !block.open } : block));
  }, []);

  const toggleBlockVisible = useCallback((id: string, checked: boolean) => {
    setBlocks((current) => current.map((block) => block.id === id ? { ...block, visible: checked } : block));
  }, []);

  const setBlockField = useCallback((id: string, field: string, value: string) => {
    setBlocks((current) => current.map((block) => block.id === id
      ? { ...block, content: { ...block.content, [field]: value } }
      : block));
  }, []);

  const copyInvitationLink = useCallback(async () => {
    const url = `https://${invitation.customSlug}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      // Clipboard API may not be available
    }
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1400);
  }, [invitation.customSlug]);

  const value = useMemo<DashboardContextValue>(
    () => ({
      activeMenu,
      setActiveMenu,
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
    }),
    [
      activeMenu,
      activeTitle,
      language,
      copied,
      copyInvitationLink,
      musicPlaying,
      guestDialogOpen,
      selectedTemplate,
      blocks,
      toggleBlockOpen,
      toggleBlockVisible,
      setBlockField,
      invitation,
      setField,
    ],
  );

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const ctx = useContext(DashboardContext);
  if (!ctx) {
    throw new Error("useDashboard must be used within <DashboardProvider>");
  }
  return ctx;
}
