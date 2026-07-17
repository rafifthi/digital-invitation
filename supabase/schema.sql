create extension if not exists "pgcrypto";

create type public.invitation_status as enum ('draft', 'published', 'archived');
create type public.rsvp_status as enum ('pending', 'attending', 'not_attending');
create type public.gift_account_type as enum ('bank', 'ewallet', 'qris');
create type public.wa_blast_status as enum ('draft', 'scheduled', 'sent');

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  slug text not null unique,
  couple_names text not null,
  wedding_date date not null,
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
  personalized_slug text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (invitation_id, phone_number)
);

create table public.wa_blasts (
  id uuid primary key default gen_random_uuid(),
  invitation_id uuid not null references public.invitations(id) on delete cascade,
  template text not null,
  status public.wa_blast_status not null default 'draft',
  sent_at timestamptz,
  created_at timestamptz not null default now()
);

create index invitations_owner_id_idx on public.invitations(owner_id);
create index invitation_sections_invitation_id_idx on public.invitation_sections(invitation_id);
create index gift_accounts_invitation_id_idx on public.gift_accounts(invitation_id);
create index guests_invitation_id_idx on public.guests(invitation_id);
create index wa_blasts_invitation_id_idx on public.wa_blasts(invitation_id);

alter table public.invitations enable row level security;
alter table public.invitation_sections enable row level security;
alter table public.gift_accounts enable row level security;
alter table public.guests enable row level security;
alter table public.wa_blasts enable row level security;

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
