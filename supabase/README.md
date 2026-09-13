# Supabase Integration

Supabase project: `scholarship-tracking-system`
Project ref: `arhbvuslpfdxkfshedkc`

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `NEXT_PUBLIC_SUPABASE_URL` to the project URL.
3. Set `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to the project's public publishable key.
4. Never commit `.env.local`, service-role keys, or database passwords.

## Schema

The canonical database schema is maintained in:

`supabase/migrations/20260913_final_scholarship_schema.sql`

The schema is based on the agreed Scholarship Tracking System ER design and includes users/profiles, student and staff roles, scholarships, criteria, document requirements, applications, documents, status history, committee assignments/evaluations, results, disbursements, notifications, permissions, and audit logs.

## Development rules

- Database structure changes must be made through Supabase migrations.
- Review schema changes against the project's ER Diagram before implementation.
- Do not put Supabase service-role or other secret keys in Next.js client-side code.
