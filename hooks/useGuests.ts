"use client";

import { useCallback, useState } from "react";
import type { Guest } from "@/components/dashboard/types";
import { MOCK_GUESTS } from "@/lib/constants";

type GuestWithId = Guest & { id: string };

// Placeholder data layer — replace with Supabase queries when backend is ready
export function useGuests() {
  const [guests, setGuests] = useState<GuestWithId[]>(MOCK_GUESTS);

  const addGuest = useCallback((guest: Guest) => {
    const newGuest: GuestWithId = {
      ...guest,
      id: `g-${Date.now()}`,
    };
    setGuests((prev) => [...prev, newGuest]);
    // TODO: await supabase.from("guests").insert(...)
  }, []);

  const removeGuest = useCallback((id: string) => {
    setGuests((prev) => prev.filter((g) => g.id !== id));
    // TODO: await supabase.from("guests").delete().eq("id", id)
  }, []);

  return { guests, addGuest, removeGuest };
}

export function useInvitationPersistence() {
  const saveInvitation = useCallback(async () => {
    // TODO: await supabase.from("invitations").upsert(...)
  }, []);

  const publishInvitation = useCallback(async () => {
    // TODO: await supabase.from("invitations").update({ status: "published" })
  }, []);

  return { saveInvitation, publishInvitation };
}
