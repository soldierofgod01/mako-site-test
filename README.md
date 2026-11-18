# Mako — marketing site

Next.js 14 landing page for makoapp.xyz. Separate from the Mako app on purpose.

## Before you deploy
1. Replace `public/mako-star.svg` with the real star logo (the file here is a stand-in).
2. Create the waitlist table in Supabase (SQL editor):
   ```sql
   create table if not exists waitlist (
     id bigint generated always as identity primary key,
     email text not null unique,
     source text,
     created_at timestamptz default now()
   );
   alter table waitlist enable row level security; -- only the server key can write
   ```
3. In Vercel → Project → Settings → Environment Variables add
   `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`.
   Until both are set, the form tells people the waitlist isn't open yet instead of losing their email.

## Deploy
New GitHub repo → upload these files → import the repo in Vercel (framework: Next.js). When you're happy, point makoapp.xyz at the Vercel project (this replaces the Framer site).

## What's live
- Hero halftone: last 90 minutes of HL BTC 1m volume (`components/Field.tsx`).
- Live read card: HL `metaAndAssetCtxs`, simple funding/price rules (`components/LiveRead.tsx`). Labelled as simplified on the page.
