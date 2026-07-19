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
          workspace_name: string;
          package_name: string;
          payment_status: "pending" | "paid" | "refunded";
          paid_at: string | null;
          slug: string;
          couple_names: string;
          wedding_date: string;
          event_type: "ceremony" | "reception" | "other";
          event_title: string;
          start_time: string;
          end_time: string | null;
          venue_name: string;
          venue_address: string | null;
          maps_url: string | null;
          youtube_url: string | null;
          status: "draft" | "published" | "archived";
          settings: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          owner_id: string;
          workspace_name: string;
          package_name?: string;
          payment_status?: "pending" | "paid" | "refunded";
          paid_at?: string | null;
          slug: string;
          couple_names: string;
          wedding_date: string;
          event_type?: "ceremony" | "reception" | "other";
          event_title: string;
          start_time: string;
          end_time?: string | null;
          venue_name: string;
          venue_address?: string | null;
          maps_url?: string | null;
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
          wish_text: string | null;
          wish_status: "review" | "published" | null;
          wish_submitted_at: string | null;
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
          wish_text?: string | null;
          wish_status?: "review" | "published" | null;
          wish_submitted_at?: string | null;
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
          status: "queued" | "in_progress" | "completed";
          recipient_count: number;
          completed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          invitation_id: string;
          template: string;
          status?: "queued" | "in_progress" | "completed";
          recipient_count?: number;
          completed_at?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wa_blasts"]["Insert"]>;
      };
      wa_blast_recipients: {
        Row: {
          id: string;
          wa_blast_id: string;
          guest_id: string | null;
          guest_name: string;
          phone_number: string;
          personalized_message: string;
          status: "queued" | "opened" | "sent" | "failed";
          last_error: string | null;
          opened_at: string | null;
          sent_at: string | null;
          updated_at: string;
        };
        Insert: {
          id?: string;
          wa_blast_id: string;
          guest_id?: string | null;
          guest_name: string;
          phone_number: string;
          personalized_message: string;
          status?: "queued" | "opened" | "sent" | "failed";
          last_error?: string | null;
          opened_at?: string | null;
          sent_at?: string | null;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["wa_blast_recipients"]["Insert"]>;
      };
    };
  };
};
