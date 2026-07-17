"use client";

import type { ReactNode } from "react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import type { SectionId } from "./types";
import type { Language } from "@/lib/types";
import { tr } from "@/lib/i18n";
import { blockText } from "@/lib/templates";

export function SectionHeading({
  eyebrow,
  title,
  action,
}: {
  eyebrow: string;
  title: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-4 pb-2 max-[560px]:items-stretch max-[560px]:flex-col">
      <div>
        <p className="text-xs font-medium uppercase tracking-[0.12em] text-[#999999]">
          {eyebrow}
        </p>
        <h2 className="mt-1 text-2xl font-semibold tracking-[-0.03em]">{title}</h2>
      </div>
      {action}
    </div>
  );
}

export function AccordionSection({
  id,
  isOpen,
  isVisible,
  onToggleOpen,
  onToggleVisible,
  language,
  children,
}: {
  id: SectionId;
  isOpen: boolean;
  isVisible: boolean;
  onToggleOpen: () => void;
  onToggleVisible: (checked: boolean) => void;
  language: Language;
  children: ReactNode;
}) {
  return (
    <Card>
      <div className="flex items-center">
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex h-14 min-w-0 flex-1 items-center justify-between rounded-2xl px-5 text-left font-medium transition-colors hover:bg-[#fafafa] focus-visible:ring-2 focus-visible:ring-ring"
          aria-expanded={isOpen}
        >
          <span className="truncate">
            {blockText(id, language).label}
          </span>
          <ChevronDown
            className={cn(
              "size-4 shrink-0 text-muted-foreground transition-transform",
              isOpen && "rotate-180",
            )}
          />
        </button>
        <div className="flex shrink-0 items-center gap-2 pr-4">
          <span className="hidden text-xs text-muted-foreground min-[480px]:inline">
            {isVisible
              ? language === "ID" ? "Tampil" : "Shown"
              : language === "ID" ? "Tersembunyi" : "Hidden"}
          </span>
          <Switch
            data-testid={`section-visibility-${id}`}
            checked={isVisible}
            onCheckedChange={onToggleVisible}
            aria-label={`${tr(language, "showSection")}: ${blockText(id, language).label}`}
          />
        </div>
      </div>
      {isOpen && (
        <CardContent className="grid gap-4 border-t pt-4">
          <p className="text-sm leading-5 text-muted-foreground">
            {blockText(id, language).description}
          </p>
          {children}
        </CardContent>
      )}
    </Card>
  );
}

export function ToggleRow({
  title,
  description,
  checked,
  onCheckedChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex min-h-16 items-center justify-between gap-4 rounded-xl border bg-[#fafafa] p-4 max-[560px]:items-start">
      <div>
        <strong className="text-sm font-medium">{title}</strong>
        <p className="mt-1 text-sm leading-5 text-muted-foreground">{description}</p>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={title}
        className="shrink-0"
      />
    </div>
  );
}

export function Field({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      {children}
    </div>
  );
}

export function UploadField({
  label,
  text,
  compact,
}: {
  label: string;
  text: string;
  compact?: boolean;
}) {
  return (
    <div className="grid gap-2">
      <Label>{label}</Label>
      <input type="file" className="sr-only" />
      <span
        className={cn(
          "grid min-h-[74px] cursor-pointer place-items-center rounded-lg border border-dashed border-[#c9c7f8] bg-[#fafaff] text-sm font-medium text-[#666666] transition-colors hover:border-primary hover:bg-[#f4f3ff]",
          compact && "min-h-10",
        )}
      >
        {text}
      </span>
    </div>
  );
}

export function PreviewCard({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <section className="m-3 rounded-2xl border border-[#e8e8e8] bg-white p-5 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-[#666666]">
        {label}
      </p>
      {children}
    </section>
  );
}
