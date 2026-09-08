# Supabase Integration

Supabase project: `scholarship-tracking-system`
Project ref: `arhbvuslpfdxkfshedkc`

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Put the Supabase Project URL in `VITE_SUPABASE_URL`.
3. Put the public anon key in `VITE_SUPABASE_ANON_KEY`.
4. Run `npm install` then `npm run dev`.

Never commit `.env.local`, service-role keys, database passwords, or other secrets.

Database schema changes should be applied only after the approved ER Diagram is finalized.
