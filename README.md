# Wedding Invitation Dashboard

Next.js, Tailwind CSS, shadcn-style components, and Supabase-ready data models for a digital wedding invitation SaaS dashboard.

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Temporary demo account

Authentication currently uses one server-side account from `.env.local`.

```bash
AUTH_NAME=Rafif & Kanza
AUTH_EMAIL=demo@riuhmerekah.com
AUTH_PASSWORD=riuh-demo-2026
AUTH_SESSION_TOKEN=replace-with-a-long-random-local-token
```

The sign-up screen activates this same configured account and does not persist new users yet. Replace this flow when database-backed authentication is connected.

## Supabase setup

1. Create a Supabase project.
2. Copy `.env.example` to `.env.local` and fill in your project URL and anon key.
3. Run `supabase/schema.sql` in the Supabase SQL editor.
4. Generate fresh types later with the Supabase CLI if the schema changes.

The current UI uses local React state. The Supabase helpers in `lib/supabase` are ready for wiring save/publish, guest import, gifts, RSVP, and WA blast persistence.
