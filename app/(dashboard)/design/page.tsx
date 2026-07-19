"use client";

import { DesignPanel } from "@/components/dashboard/design-panel";
import { LivePreview } from "@/components/dashboard/live-preview";
import { useDashboard } from "@/context";

export default function DesignPage() {
  const {
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
    event,
    guests,
    submitGuestRsvp,
    setActiveMenu,
  } = useDashboard();

  return (
    <DesignPanel
      invitation={invitation}
      setField={setField}
      musicPlaying={musicPlaying}
      setMusicPlaying={setMusicPlaying}
      selectedTemplate={selectedTemplate}
      setSelectedTemplate={setSelectedTemplate}
      blocks={blocks}
      toggleBlockOpen={toggleBlockOpen}
      toggleBlockVisible={toggleBlockVisible}
      language={language}
      onOpenSettings={() => setActiveMenu("settings")}
      preview={(
        <LivePreview
          invitation={invitation}
          event={event}
          blocks={blocks}
          selectedTemplate={selectedTemplate}
          language={language}
          guests={guests}
          musicPlaying={musicPlaying}
          onMusicPlayingChange={setMusicPlaying}
          onSubmitRsvp={submitGuestRsvp}
        />
      )}
    />
  );
}
