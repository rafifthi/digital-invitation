create extension if not exists "pgcrypto";

create type public.invitation_status as enum ('draft', 'published', 'archived');
create type public.rsvp_status as enum ('pending', 'attending', 'not_attending');
create type public.wish_status as enum ('review', 'published');
create type public.gift_account_type as enum ('bank', 'ewallet', 'qris');
create type public.wa_blast_status as enum ('queued', 'in_progress', 'completed');
create type public.wa_blast_recipient_status as enum ('queued', 'opened', 'sent', 'failed');
create type public.invitation_event_type as enum ('ceremony', 'reception', 'other');
create type public.workspace_payment_status as enum ('pending', 'paid', 'refunded');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  workspace_name text not null,
  package_name text not null default 'Signature',
  payment_status public.workspace_payment_status not null default 'pending',
  paid_at timestamptz,
  slug text not null unique,
  couple_names text not null,
  wedding_date date not null,
  event_type public.invitation_event_type not null default 'ceremony',
  event_title text not null,
  start_time time not null,
  end_time time,
  venue_name text not null,
  venue_address text,
  maps_url text,
  youtube_url text,
  status public.invitation_status not null default 'draft',
  settings jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitation_sections (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  section_key text not null,
  is_visible boolean not null default true,
  sort_order int not null default 0,
  content jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, section_key)
);

create table public.gift_accounts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  type public.gift_account_type not null,
  provider text not null,
  account_number text,
  account_holder text,
  qris_path text,
  created_at timestamptz not null default now()
);

create table public.guests (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  name text not null,
  phone_number text not null,
  rsvp_status public.rsvp_status not null default 'pending',
  wish_text text,
  wish_status public.wish_status,
  wish_submitted_at timestamptz,
  personalized_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, phone_number)
);

create table public.wa_blasts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  template text not null,
  status public.wa_blast_status not null default 'queued',
  recipient_count int not null default 0 check (recipient_count >= 0),
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

create table public.wa_blast_recipients (
  id uuid primary key default gen_random_uuid(),
  wa_blast_id uuid not null references public.wa_blasts(id) on delete cascade,
  guest_id uuid references public.guests(id) on delete set null,
  guest_name text not null,
  phone_number text not null,
  personalized_message text not null,
  status public.wa_blast_recipient_status not null default 'queued',
  last_error text,
  opened_at timestamptz,
  sent_at timestamptz,
  updated_at timestamptz not null default now(),
  unique (wa_blast_id, phone_number)
);

create index invitations_owner_id_idx on public.invitations(owner_id);
create index invitation_sections_invitation_id_idx on public.invitation_sections(invitation_id);
create index gift_accounts_invitation_id_idx on public.gift_accounts(invitation_id);
create index guests_invitation_id_idx on public.guests(invitation_id);
create index wa_blasts_invitation_id_idx on public.wa_blasts(invitation_id);
create index wa_blast_recipients_blast_id_idx on public.wa_blast_recipients(wa_blast_id);

alter table public.invitations enable row level security;
alter table public.invitation_sections enable row level security;
alter table public.gift_accounts enable row level security;
alter table public.guests enable row level security;
alter table public.wa_blasts enable row level security;
alter table public.wa_blast_recipients enable row level security;

create policy "Owners can manage invitations"
  on public.invitations
  for all
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);

create policy "Owners can manage sections"
  on public.invitation_sections
  for all
  using (
    exists (
      select 1 from public.invitations
      where invitations.id = invitation_sections.invitation_id
        and invitations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations
      where invitations.id = invitation_sections.invitation_id
        and invitations.owner_id = auth.uid()
    )
  );

create policy "Owners can manage gift accounts"
  on public.gift_accounts
  for all
  using (
    exists (
      select 1 from public.invitations
      where invitations.id = gift_accounts.invitation_id
        and invitations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations
      where invitations.id = gift_accounts.invitation_id
        and invitations.owner_id = auth.uid()
    )
  );

create policy "Owners can manage guests"
  on public.guests
  for all
  using (
    exists (
      select 1 from public.invitations
      where invitations.id = guests.invitation_id
        and invitations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations
      where invitations.id = guests.invitation_id
        and invitations.owner_id = auth.uid()
    )
  );

create policy "Owners can manage WA blasts"
  on public.wa_blasts
  for all
  using (
    exists (
      select 1 from public.invitations
      where invitations.id = wa_blasts.invitation_id
        and invitations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.invitations
      where invitations.id = wa_blasts.invitation_id
        and invitations.owner_id = auth.uid()
    )
  );

create policy "Owners can manage WA blast recipients"
  on public.wa_blast_recipients
  for all
  using (
    exists (
      select 1 from public.wa_blasts
      join public.invitations on invitations.id = wa_blasts.invitation_id
      where wa_blasts.id = wa_blast_recipients.wa_blast_id
        and invitations.owner_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.wa_blasts
      join public.invitations on invitations.id = wa_blasts.invitation_id
      where wa_blasts.id = wa_blast_recipients.wa_blast_id
        and invitations.owner_id = auth.uid()
    )
  );
