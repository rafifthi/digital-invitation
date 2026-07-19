"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { useDashboard } from "@/context";

export function MessageTemplateDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { language, waTemplate, setWATemplate } = useDashboard();
  const [draft, setDraft] = useState(waTemplate);
  const isId = language === "ID";

  useEffect(() => {
    if (open) setDraft(waTemplate);
  }, [open, waTemplate]);

  const appendToken = (token: string) => {
    setDraft((current) => `${current}${current && !current.endsWith(" ") ? " " : ""}${token}`);
  };

  const handleSave = () => {
    const nextTemplate = draft.trim();
    if (!nextTemplate) return;
    setWATemplate(nextTemplate);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>{isId ? "Edit template pesan" : "Edit message template"}</DialogTitle>
          <DialogDescription>
            {isId ? "Atur pesan default untuk kirim WhatsApp dan WA Blast." : "Set the default message used for direct WhatsApp and WA Blast."}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-3 py-2">
          <div className="flex flex-wrap gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => appendToken("[Guest_Name]")}>[Guest_Name]</Button>
            <Button type="button" variant="secondary" size="sm" onClick={() => appendToken("[Invitation_Link]")}>[Invitation_Link]</Button>
          </div>
          <Textarea
            rows={8}
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            aria-label={isId ? "Template pesan WhatsApp" : "WhatsApp message template"}
            className="resize-y leading-6"
          />
          <div className="flex items-center justify-between gap-3 text-xs text-muted-foreground">
            <span>{draft.length} {isId ? "karakter" : "characters"}</span>
            <span>{isId ? "Variabel diganti otomatis saat dikirim." : "Variables are replaced automatically when sent."}</span>
          </div>
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>{isId ? "Batal" : "Cancel"}</Button>
          <Button type="button" onClick={handleSave} disabled={!draft.trim()}>{isId ? "Simpan template" : "Save template"}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
