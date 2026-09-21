# Modules

Source code will be separated according to the agreed project modules:

- `m01-user-student/` — User & Student Management
- `m02-scholarship/` — Scholarship Management
- `m03-application-document/` — Application & Document Management
- `m04-review-evaluation/` — Scholarship Review & Evaluation
- `m05-award-followup/` — Award & Follow-up Management
- `m06-dashboard-report-notification/` — Dashboard, Report & Notification

Each module should keep its own UI, business logic, and data-access code where practical. Shared Supabase access belongs under `src/lib/`.
