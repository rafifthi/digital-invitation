"use client";

import { useState } from "react";
import {
  Check,
  CloudUpload,
  Flower2,
  Landmark,
  Pause,
  Play,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SectionHeading, AccordionSection, Field, UploadField } from "./shared";
import type { InvitationBlock, InvitationData, TemplateId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import {
  getTemplate,
  INVITATION_TEMPLATES,
  templateText,
} from "@/lib/templates";

const templateIcons = {
  sunny: Flower2,
  sienna: Landmark,
};

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
  setBlockField,
  language,
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
  setBlockField: (id: string, field: string, value: string) => void;
  language: Language;
}) {
  const [published, setPublished] = useState(false);
  const activeTemplate = getTemplate(selectedTemplate);
  const templateBlocks = activeTemplate.allowedBlocks
    .map((type) => blocks.find((block) => block.type === type))
    .filter((block): block is InvitationBlock => Boolean(block));

  const publishChanges = () => {
    setPublished(true);
    window.setTimeout(() => setPublished(false), 1800);
  };

  return (
    <section className="mx-auto max-w-[1180px] space-y-5">
      <SectionHeading
        eyebrow={tr(language, "designEyebrow")}
        title={tr(language, "invitationSections")}
        action={
          <div className="flex items-center">
            <Button type="button" onClick={publishChanges}>
              {published ? <Check /> : <CloudUpload />}
              {published ? tr(language, "published") : tr(language, "publishChanges")}
            </Button>
          </div>
        }
      />

      <div>
        <div className="mb-3 flex items-end justify-between gap-4">
          <div>
            <h3 className="text-sm font-medium">{language === "ID" ? "Pilih template" : "Choose a template"}</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              {language === "ID" ? "Setiap template menyediakan susunan bagian tetap yang dapat ditampilkan atau disembunyikan." : "Each template provides a fixed set of sections that can be shown or hidden."}
            </p>
          </div>
          <span className="text-xs text-muted-foreground">{INVITATION_TEMPLATES.length} templates</span>
        </div>
        <div className="grid grid-cols-2 gap-3 max-[760px]:grid-cols-1">
          {INVITATION_TEMPLATES.map((template) => {
            const Icon = templateIcons[template.id];
            const text = templateText(template, language);
            const selected = template.id === selectedTemplate;
            return (
              <button
                key={template.id}
                data-testid={`template-${template.id}`}
                type="button"
                onClick={() => setSelectedTemplate(template.id)}
                aria-pressed={selected}
                className={cn(
                  "group rounded-2xl border bg-white p-4 text-left transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-[#c9c7f8] focus-visible:ring-2 focus-visible:ring-ring",
                  selected && "border-primary shadow-[0_0_0_2px_rgba(145,141,246,0.15)]",
                )}
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="grid size-10 place-items-center rounded-full" style={{ backgroundColor: `${template.accent}18`, color: template.accent }}>
                    <Icon className="size-4" />
                  </span>
                  {selected && <span className="rounded-full bg-[#eeedff] px-2 py-1 text-[11px] font-medium text-[#625cc7]">{language === "ID" ? "Dipilih" : "Selected"}</span>}
                </div>
                <strong className="mt-4 block text-sm font-medium">{text.name}</strong>
                <p className="mt-1.5 text-xs leading-5 text-muted-foreground">{text.description}</p>
                <p className="mt-3 text-[11px] font-medium uppercase tracking-[0.08em]" style={{ color: template.accent }}>{text.interaction}</p>
              </button>
            );
          })}
        </div>
      </div>

      <Card>
        <CardContent className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <label htmlFor="youtubeUrl" className="text-sm font-medium text-foreground">{tr(language, "backgroundMusic")}</label>
              <p className="mt-1 text-sm text-muted-foreground">{tr(language, "musicHelp")}</p>
            </div>
            <Button type="button" size="icon" aria-label={musicPlaying ? tr(language, "pauseMusic") : tr(language, "playMusic")} onClick={() => setMusicPlaying(!musicPlaying)}>
              {musicPlaying ? <Pause /> : <Play />}
            </Button>
          </div>
          <Input id="youtubeUrl" value={invitation.youtubeUrl} onChange={(event) => setField("youtubeUrl", event.target.value)} />
        </CardContent>
      </Card>

      <div className="grid gap-3">
        {templateBlocks.map((block) => (
          <AccordionSection
            key={block.id}
            id={block.type}
            isOpen={block.open}
            isVisible={block.visible}
            onToggleOpen={() => toggleBlockOpen(block.id)}
            onToggleVisible={(checked) => toggleBlockVisible(block.id, checked)}
            language={language}
          >
            <BlockFields block={block} invitation={invitation} setBlockField={setBlockField} language={language} />
          </AccordionSection>
        ))}
      </div>
    </section>
  );
}

function BlockFields({ block, invitation, setBlockField, language }: { block: InvitationBlock; invitation: InvitationData; setBlockField: (id: string, field: string, value: string) => void; language: Language }) {
  const type = block.type;
  const value = (field: keyof InvitationData) => block.content[field] ?? invitation[field];
  const update = (field: keyof InvitationData, nextValue: string) => setBlockField(block.id, field, nextValue);

  if (type === "hero") {
    return (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          <Field label={tr(language, "coupleNames")}><Input value={value("coupleNames")} onChange={(event) => update("coupleNames", event.target.value)} /></Field>
          <Field label={tr(language, "weddingDate")}><Input type="date" value={value("weddingDate")} onChange={(event) => update("weddingDate", event.target.value)} /></Field>
        </div>
        <Field label={tr(language, "openingText")}><Textarea value={value("openingText")} onChange={(event) => update("openingText", event.target.value)} /></Field>
        <UploadField label={tr(language, "heroImage")} text={tr(language, "uploadCover")} />
      </div>
    );
  }

  if (type === "couple") {
    return (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          <Field label={tr(language, "groomName")}><Input value={value("groomName")} onChange={(event) => update("groomName", event.target.value)} /></Field>
          <Field label={tr(language, "brideName")}><Input value={value("brideName")} onChange={(event) => update("brideName", event.target.value)} /></Field>
        </div>
        <Field label={tr(language, "familyLine")}><Input value={value("familyLine")} onChange={(event) => update("familyLine", event.target.value)} /></Field>
      </div>
    );
  }

  if (type === "event") {
    return (
      <div className="grid gap-3">
        <div className="grid grid-cols-2 gap-3 max-[560px]:grid-cols-1">
          <Field label={tr(language, "ceremonyTime")}><Input value={value("eventTime")} onChange={(event) => update("eventTime", event.target.value)} /></Field>
          <Field label={tr(language, "venue")}><Input value={value("venueName")} onChange={(event) => update("venueName", event.target.value)} /></Field>
        </div>
        <Field label={tr(language, "address")}><Textarea value={value("venueAddress")} onChange={(event) => update("venueAddress", event.target.value)} /></Field>
      </div>
    );
  }

  if (type === "gallery") return <UploadField label={tr(language, "galleryImages")} text={tr(language, "uploadGallery")} />;
  if (type === "rsvp") return <Field label={tr(language, "rsvpDeadline")}><Input type="date" value={block.content.deadline || "2026-06-20"} onChange={(event) => setBlockField(block.id, "deadline", event.target.value)} /></Field>;
  if (type === "story") return <Field label={language === "ID" ? "Cerita pasangan" : "Couple story"}><Textarea value={value("openingText")} onChange={(event) => update("openingText", event.target.value)} /></Field>;
  if (type === "countdown") return <Field label={tr(language, "weddingDate")}><Input type="date" value={value("weddingDate")} onChange={(event) => update("weddingDate", event.target.value)} /></Field>;

  return (
    <div className="rounded-xl border bg-[#fafafa] p-4 text-sm text-muted-foreground">
      {language === "ID" ? "Pengaturan detail untuk block ini akan mengikuti data modul terkait." : "Detailed settings for this block will use its related module data."}
    </div>
  );
}
