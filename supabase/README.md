# Supabase Integration

Supabase project: `scholarship-tracking-system`
Project ref: `arhbvuslpfdxkfshedkc`

## Local setup

1. Copy `.env.example` to `.env.local`.
2. Set `VITE_SUPABASE_URL` to the project URL.
3. Set `VITE_SUPABASE_ANON_KEY` to the project's public anon key.
4. Never commit `.env.local`, service-role keys, or database passwords.

## Current schema

The database currently contains:

- `profiles`
- `scholarships`
- `scholarship_criteria`
- `applications`
- `application_documents`
- `evaluations`
- `awards`
- `follow_ups`
- `notifications`

RLS is enabled on all current public tables.

## Change policy

Database structure changes must be made through Supabase migrations and reviewed against the project's ER Diagram before implementation.
