export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      invitations: {
        Row: {
          id: string;
          owner_id: string;
          slug: string;
          couple_names: string;
          wedding_date: string;
          youtube_url: string | null;
          status: "draft" | "published" | "archived";
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          slug: string;
          couple_names: string;
          wedding_date: string;
          youtube_url?: string | null;
          status?: "draft" | "published" | "archived";
          settings?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["invitations"]["Insert"]>;
      };
      invitation_sections: {
        Row: {
          id: string;
          invitation_id: string;
          section_key: string;
          is_visible: boolean;
          sort_order: number;
          content: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          section_key: string;
          is_visible?: boolean;
          sort_order?: number;
          content?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<
          Database["public"]["Tables"]["invitation_sections"]["Insert"]
        >;
      };
      gift_accounts: {
        Row: {
          id: string;
          invitation_id: string;
          type: "bank" | "ewallet" | "qris";
          provider: string;
          account_number: string | null;
          account_holder: string | null;
          qris_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          type: "bank" | "ewallet" | "qris";
          provider: string;
          account_number?: string | null;
          account_holder?: string | null;
          qris_path?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["gift_accounts"]["Insert"]>;
      };
      guests: {
        Row: {
          id: string;
          invitation_id: string;
          name: string;
          phone_number: string;
          rsvp_status: "pending" | "attending" | "not_attending";
          personalized_slug: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          name: string;
          phone_number: string;
          rsvp_status?: "pending" | "attending" | "not_attending";
          personalized_slug?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["guests"]["Insert"]>;
      };
      wa_blasts: {
        Row: {
          id: string;
          invitation_id: string;
          template: string;
          status: "draft" | "scheduled" | "sent";
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          template: string;
          status?: "draft" | "scheduled" | "sent";
          sent_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wa_blasts"]["Insert"]>;
      };
    };
  };
};
