# Habit & Skill Tracker

A private, sign-in protected tracker for practicing skills: run a timer (countdown or stopwatch), log how many executions you completed in that window, and watch your totals and streaks grow.

## Screens

**Landing (`/`)** — public page explaining the app with a sign-in call to action. Signed-in visitors go straight to the dashboard.

**Auth (`/auth`)** — email + password sign-up/sign-in plus Google sign-in.

**Dashboard (`/dashboard`)** — your skills as cards: name, color, total sessions, total reps, total time, current streak. Add / rename / archive skills here.

**Practice (`/practice/:skillId`)** — the timer:
- Choose **Countdown** (pick a duration, e.g. 20:00) or **Stopwatch** (free run).
- Start / pause / stop. When the countdown finishes or you stop the stopwatch, a dialog asks "How many executions did you complete?".
- Saving writes a session: skill, start date+time, elapsed seconds, timer mode, target duration, execution count, optional note.

**History (`/history`)** — reverse-chronological log of all sessions with date, time, skill, duration, executions, and reps-per-minute. Filter by skill; delete a bad entry.

**Stats (`/stats`)** — per-skill totals, a last-30-days bar chart of time and executions, current and longest daily streak, and best reps-per-minute.

## Behaviour details

- Timer keeps accurate time using timestamps, so tab throttling or a refresh mid-session won't drift; an in-progress session is restored from local state.
- Countdown completion plays a short beep and shows a browser notification if permitted.
- Executions must be a non-negative integer; sessions under 5 seconds warn before saving.
- Streak = consecutive calendar days with at least one session (per skill, and overall).

## Technical notes

- Enable Lovable Cloud for auth and storage.
- Tables:
  - `skills` — id, user_id, name, color, target-per-day (nullable), archived, created_at.
  - `sessions` — id, user_id, skill_id (cascade delete), started_at, ended_at, duration_seconds, mode ('countdown' | 'stopwatch'), target_seconds (nullable), executions, note, created_at.
  - Both tables: grants for `authenticated` + `service_role`, RLS enabled, all policies scoped to `auth.uid() = user_id`.
- No profiles table — email from `auth.users` is enough.
- App routes live under `_authenticated/`; `/` and `/auth` stay public. Data access goes through `createServerFn` with `requireSupabaseAuth`, read via TanStack Query.
- Stats are computed from session rows in the client after a single ranged fetch; charts use Recharts.
- Design: dark, focused "practice room" feel — deep neutral background, one strong accent for the running timer, large tabular-numeral timer type, cards with subtle borders. All colors as semantic tokens in `src/styles.css`.
- Each route gets its own `head()` metadata.
