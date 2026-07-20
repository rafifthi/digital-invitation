"use client";

import { useState, type ReactNode } from "react";
import {
  Check,
  Copy,
  Eye,
  LayoutTemplate,
  MailOpen,
  Music2,
  Palette,
  Pause,
  Play,
  Save,
  Settings2,
  Type,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { AccordionSection, UploadField } from "./shared";
import type { InvitationBlock, InvitationData, TemplateId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import {
  getTemplate,
  INVITATION_TEMPLATES,
  templateText,
} from "@/lib/templates";
import {
  INVITATION_DOMAIN,
  invitationSubdomain,
  invitationUrl,
} from "@/lib/invitation-url";
import { ThemeThumbnail } from "./theme-thumbnail";

type DesignTool = "theme" | "palette" | "typography" | "music";

const PALETTES = [
  { name: "Lavender", value: "oklch(0.7 0.11 292)" },
  { name: "Terracotta", value: "oklch(0.63 0.12 34)" },
  { name: "Garden", value: "oklch(0.58 0.09 155)" },
  { name: "Serene Sage", value: "#6c7c71" },
];

const TYPOGRAPHY = [
  { id: "editorial", label: "Editorial", sampleClass: "font-serif italic" },
  { id: "classic", label: "Classic", sampleClass: "font-serif" },
  { id: "modern", label: "Modern", sampleClass: "font-sans font-semibold" },
] as const;

export function DesignPanel({
  invitation,
  setField,
  musicPlaying,
  setMusicPlaying,
  selectedTemplate,
  setSelectedTemplate,
  blocks,
  toggleBlockOpen,
  toggleBlockVisible,
  language,
  onOpenSettings,
  preview,
}: {
  invitation: InvitationData;
  setField: (field: keyof InvitationData, value: string) => void;
  musicPlaying: boolean;
  setMusicPlaying: (value: boolean) => void;
  selectedTemplate: TemplateId;
  setSelectedTemplate: (id: TemplateId) => void;
  blocks: InvitationBlock[];
  toggleBlockOpen: (id: string) => void;
  toggleBlockVisible: (id: string, checked: boolean) => void;
  language: Language;
  onOpenSettings: () => void;
  preview: ReactNode;
}) {
  const [published, setPublished] = useState(false);
  const [activeTool, setActiveTool] = useState<DesignTool | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const activeTemplate = getTemplate(selectedTemplate);
  const activeTemplateText = templateText(activeTemplate, language);
  const subdomain = invitationSubdomain(invitation.customSlug);
  const templateBlocks = activeTemplate.allowedBlocks
    .map((type) => blocks.find((block) => block.type === type))
    .filter((block): block is InvitationBlock => Boolean(block));

  const publishChanges = () => {
    setPublished(true);
    window.setTimeout(() => setPublished(false), 1800);
  };

  const copyInvitationLink = async () => {
    try {
      await navigator.clipboard.writeText(invitationUrl(invitation.customSlug));
    } catch {
      // Clipboard access may be unavailable in embedded previews.
    }
    setLinkCopied(true);
    window.setTimeout(() => setLinkCopied(false), 1400);
  };

  const tools = [
    { id: "theme" as const, icon: LayoutTemplate, label: language === "ID" ? "Ganti Tema" : "Change Theme" },
    { id: "palette" as const, icon: Palette, label: language === "ID" ? "Warna Tema" : "Theme Color" },
    { id: "typography" as const, icon: Type, label: language === "ID" ? "Font" : "Font" },
    { id: "music" as const, icon: Music2, label: language === "ID" ? "Musik" : "Music" },
  ];
  const activeToolMeta = tools.find((tool) => tool.id === activeTool);

  const renderToolPanel = () => {
    if (activeTool === "theme") {
      return (
        <div>
          <ToolIntro
            title={language === "ID" ? "Pilih template" : "Choose a template"}
            description={language === "ID" ? "Template menentukan karakter visual dan susunan bagian yang tersedia." : "The template defines the visual character and available section structure."}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 max-[620px]:grid-cols-1">
            {INVITATION_TEMPLATES.map((template) => {
              const text = templateText(template, language);
              const selected = template.id === selectedTemplate;
              return (
                <button
                  key={template.id}
                  data-testid={`template-${template.id}`}
                  type="button"
                  onClick={() => {
                    setSelectedTemplate(template.id);
                    setActiveTool(null);
                  }}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border bg-white p-3 text-left transition-[border-color,box-shadow] duration-200 hover:border-[#c9c7f8] focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-primary shadow-[0_0_0_2px_rgba(145,141,246,0.13)]",
                  )}
                >
                  <div className="relative">
                    <ThemeThumbnail templateId={template.id} name={text.name} />
                    {selected && (
                      <span className="absolute right-2 top-2 grid size-7 place-items-center rounded-full bg-white text-[#625cc7] shadow-[0_1px_4px_rgba(24,25,37,0.12)]">
                        <Check className="size-4" />
                      </span>
                    )}
                  </div>
                  <strong className="mt-3 block px-1 text-sm font-medium">{text.name}</strong>
                  <p className="mt-1 px-1 pb-1 text-xs leading-5 text-muted-foreground">{text.description}</p>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTool === "palette") {
      return (
        <div>
          <ToolIntro
            title={language === "ID" ? "Aksen undangan" : "Invitation accent"}
            description={language === "ID" ? "Gunakan satu warna utama untuk tombol dan detail penting." : "Use one main color for buttons and meaningful details."}
          />
          <div className="mt-4 grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
            {PALETTES.map((palette) => {
              const selected = invitation.accentColor === palette.value;
              return (
                <button
                  key={palette.name}
                  type="button"
                  onClick={() => setField("accentColor", palette.value)}
                  aria-pressed={selected}
                  className={cn(
                    "flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-medium transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-primary bg-[#faf9ff]",
                  )}
                >
                  <span className="size-8 rounded-full border border-black/5" style={{ backgroundColor: palette.value }} />
                  <span>{palette.name}</span>
                  {selected && <Check className="ml-auto size-4 text-[#625cc7]" />}
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTool === "typography") {
      return (
        <div>
          <ToolIntro
            title={language === "ID" ? "Gaya tipografi" : "Typography style"}
            description={language === "ID" ? "Satu pilihan mengatur hierarki tipografi undangan secara konsisten." : "One choice sets a consistent invitation type hierarchy."}
          />
          <div className="mt-4 grid grid-cols-3 gap-3 max-[560px]:grid-cols-1">
            {TYPOGRAPHY.map((option) => {
              const selected = invitation.fontStyle === option.id;
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setField("fontStyle", option.id)}
                  aria-pressed={selected}
                  className={cn(
                    "rounded-xl border px-4 py-3 text-left transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-primary bg-[#faf9ff]",
                  )}
                >
                  <span className={cn("block text-2xl", option.sampleClass)}>Aa</span>
                  <span className="mt-2 block text-xs font-medium">{option.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      );
    }

    if (activeTool === "music") {
      return (
        <div>
          <div className="flex items-start justify-between gap-4">
            <ToolIntro title={tr(language, "backgroundMusic")} description={tr(language, "musicHelp")} />
            <Button type="button" size="icon" aria-label={musicPlaying ? tr(language, "pauseMusic") : tr(language, "playMusic")} onClick={() => setMusicPlaying(!musicPlaying)}>
              {musicPlaying ? <Pause /> : <Play />}
            </Button>
          </div>
          <Input className="mt-4" id="youtubeUrl" value={invitation.youtubeUrl} onChange={(event) => setField("youtubeUrl", event.target.value)} />
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex h-full min-h-0 flex-col bg-[#fafafa]">
      <header className="shrink-0 border-b bg-white px-8 py-5 max-[820px]:px-4">
        <div className="flex flex-wrap items-center gap-5">
          <div className="flex min-w-[min(100%,300px)] flex-1 items-center gap-4">
            <span className="grid size-12 shrink-0 place-items-center rounded-2xl bg-[#eeedff] text-[#7772df]">
              <MailOpen className="size-5" />
            </span>
            <div className="min-w-0">
              <h2 className="text-xl font-semibold leading-tight tracking-[-0.03em]">
                {language === "ID" ? "Undangan Umum" : "General Invitation"}: {activeTemplateText.name}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {language === "ID" ? "Atur kebutuhan undangan pernikahan digital Anda." : "Set up your digital wedding invitation needs."}
              </p>
            </div>
          </div>
          <div className="ml-auto flex shrink-0 items-center gap-2">
            <Button asChild variant="secondary">
              <a href={invitationUrl(invitation.customSlug)} target="_blank" rel="noopener noreferrer">
                <Eye />
                {language === "ID" ? "Preview Tema" : "Theme Preview"}
              </a>
            </Button>
            <Button type="button" onClick={publishChanges}>
              {published ? <Check /> : <Save />}
              {published ? (language === "ID" ? "Tersimpan" : "Saved") : (language === "ID" ? "Simpan" : "Save")}
            </Button>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-[minmax(600px,1fr)_minmax(300px,380px)] gap-3 max-[1200px]:grid-cols-1">
          <div className="flex min-w-0 gap-2 overflow-x-auto rounded-xl border bg-[#faf9ff] p-2" aria-label={language === "ID" ? "Pengaturan umum" : "General settings"}>
            {tools.map((tool) => {
              const Icon = tool.icon;
              const selected = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => setActiveTool(tool.id)}
                  aria-pressed={selected}
                  className={cn(
                    "flex h-9 shrink-0 items-center gap-2 rounded-full border bg-white px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-[#c9c7f8] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring",
                    selected && "border-[#bdb9ff] bg-[#eeedff] text-[#625cc7]",
                  )}
                >
                  <Icon className="size-3.5" />
                  {tool.label}
                </button>
              );
            })}
            <button
              type="button"
              onClick={onOpenSettings}
              className="flex h-9 shrink-0 items-center gap-2 rounded-full border bg-white px-3 text-xs font-medium text-muted-foreground transition-colors hover:border-[#c9c7f8] hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring"
            >
              <Settings2 className="size-3.5" />
              {language === "ID" ? "Informasi Undangan" : "Invitation Info"}
            </button>
          </div>
          <div className="flex min-w-0 items-center gap-2 rounded-xl border bg-[#faf9ff] p-2">
            <SubdomainField value={subdomain} language={language} compact readOnly />
            <Button type="button" variant="secondary" size="sm" onClick={copyInvitationLink}>
              {linkCopied ? <Check /> : <Copy />}
              {linkCopied ? tr(language, "copied") : tr(language, "copy")}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 grid-cols-[minmax(0,1fr)_450px] overflow-hidden max-[1180px]:grid-cols-[minmax(0,1fr)_410px] max-[820px]:flex max-[820px]:flex-col max-[820px]:overflow-y-auto">
        <main className="min-w-0 overflow-y-auto px-8 pb-16 pt-7 max-[820px]:h-auto max-[820px]:w-full max-[820px]:flex-none max-[820px]:overflow-visible max-[820px]:px-4">
          <section className="mx-auto max-w-[820px] space-y-5">
            <div className="flex items-end justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold">{tr(language, "invitationSections")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  {language === "ID" ? "Buka bagian untuk mengedit, atau ubah statusnya langsung." : "Open a section to edit it, or change its status directly."}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {templateBlocks.filter((block) => block.visible).length}/{templateBlocks.length} {language === "ID" ? "aktif" : "active"}
              </span>
            </div>

            <div className="grid gap-3">
              {templateBlocks.map((block, index) => (
                <AccordionSection
                  key={block.id}
                  id={block.type}
                  index={index}
                  isOpen={block.open}
                  isVisible={block.visible}
                  onToggleOpen={() => toggleBlockOpen(block.id)}
                  onToggleVisible={(checked) => toggleBlockVisible(block.id, checked)}
                  language={language}
                >
                  <BlockFields block={block} language={language} onOpenSettings={onOpenSettings} />
                </AccordionSection>
              ))}
            </div>
          </section>
        </main>
        {preview}
      </div>

      <Dialog open={activeTool !== null} onOpenChange={(open) => !open && setActiveTool(null)}>
        <DialogContent className="max-h-[88svh] overflow-y-auto sm:max-w-[680px]">
          <DialogHeader className="sr-only">
            <DialogTitle>{activeToolMeta?.label ?? (language === "ID" ? "Pengaturan umum" : "General settings")}</DialogTitle>
            <DialogDescription>
              {language === "ID" ? "Perbarui pengaturan undangan." : "Update invitation settings."}
            </DialogDescription>
          </DialogHeader>
          {renderToolPanel()}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function ToolIntro({ title, description }: { title: string; description: string }) {
  return (
    <div>
      <h3 className="text-sm font-semibold">{title}</h3>
      <p className="mt-1 max-w-[64ch] text-sm leading-5 text-muted-foreground">{description}</p>
    </div>
  );
}

function SubdomainField({
  value,
  onChange,
  language,
  compact = false,
  readOnly = false,
}: {
  value: string;
  onChange?: (value: string) => void;
  language: Language;
  compact?: boolean;
  readOnly?: boolean;
}) {
  return (
    <div
      className={cn(
        "flex min-w-0 items-center overflow-hidden rounded-lg border bg-white focus-within:border-primary focus-within:ring-2 focus-within:ring-ring/25",
        compact ? "h-8 max-w-[390px] flex-1" : "h-10 flex-1",
      )}
    >
      <span className="pl-3 text-xs text-muted-foreground">https://</span>
      <Input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={readOnly}
        aria-label={language === "ID" ? "Subdomain undangan" : "Invitation subdomain"}
        autoCapitalize="none"
        autoCorrect="off"
        spellCheck={false}
        className={cn(
          "min-w-16 flex-1 border-0 bg-transparent px-1 shadow-none focus-visible:ring-0",
          compact && "h-8 text-xs",
        )}
      />
      <span className="shrink-0 pr-3 text-xs font-medium text-muted-foreground">
        .{INVITATION_DOMAIN}
      </span>
    </div>
  );
}

function BlockFields({ block, language, onOpenSettings }: { block: InvitationBlock; language: Language; onOpenSettings: () => void }) {
  const type = block.type;

  if (type === "hero") {
    return (
      <div className="grid gap-3">
        <SettingsManagedNotice language={language} onOpenSettings={onOpenSettings} />
        <UploadField label={tr(language, "heroImage")} text={tr(language, "uploadCover")} />
      </div>
    );
  }

  if (type === "gallery") return <UploadField label={tr(language, "galleryImages")} text={tr(language, "uploadGallery")} />;
  if (["couple", "event", "story", "countdown", "rsvp"].includes(type)) {
    return <SettingsManagedNotice language={language} onOpenSettings={onOpenSettings} />;
  }

  return (
    <div className="rounded-xl border bg-[#fafafa] p-4 text-sm text-muted-foreground">
      {language === "ID" ? "Pengaturan detail untuk block ini akan mengikuti data modul terkait." : "Detailed settings for this block will use its related module data."}
    </div>
  );
}

function SettingsManagedNotice({ language, onOpenSettings }: { language: Language; onOpenSettings: () => void }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border bg-[#fafafa] p-4 max-[560px]:items-start max-[560px]:flex-col">
      <div className="flex min-w-0 gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[#eeedff] text-[#625cc7]">
          <Settings2 className="size-4" />
        </span>
        <div>
          <strong className="text-sm font-medium">{language === "ID" ? "Mengikuti Invitation Settings" : "Managed in Invitation Settings"}</strong>
          <p className="mt-1 text-sm leading-5 text-muted-foreground">
            {language === "ID" ? "Nama, waktu, tempat, dan informasi acara memakai satu sumber data." : "Names, timing, venue, and event details use one shared source of truth."}
          </p>
        </div>
      </div>
      <Button type="button" variant="secondary" size="sm" onClick={onOpenSettings} className="shrink-0">
        {language === "ID" ? "Buka Settings" : "Open Settings"}
      </Button>
    </div>
  );
}
