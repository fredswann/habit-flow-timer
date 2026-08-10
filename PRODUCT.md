# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Anyone doing deliberate practice of a skill — an instrument, a sport, a craft, a language, anything repeatable — who wants to time practice blocks and log how much they got through. A real multi-user product: people sign up independently (Supabase auth), and every skill and session is strictly scoped to its owner via row-level security.

## Product Purpose

Repwise runs a countdown or stopwatch for a practice session, then asks the user to log how many executions (reps) they completed in that window. It exists to make deliberate practice measurable in two dimensions at once — time invested and volume produced — so users can see totals, per-skill breakdowns, and streaks build over time. Success is a user who keeps coming back to log sessions and can watch consistency (streaks) and output (reps/time) accumulate.

## Positioning

Unlike simple checkbox habit trackers that only record "did you do it today," Repwise pairs a timer with per-session rep logging. It captures both how long someone practiced and how much they produced in that time, for any skill they define — not a fixed catalog of habits.

## Operating Context

A single practice session: pick a skill, choose countdown (with a target length) or stopwatch, run the timer, then log executions and an optional note when it ends. Countdown completion triggers a beep (Web Audio) and, if permitted, a browser Notification. Sessions, once logged, feed the dashboard (per-skill totals and current streak), a stats view (30-day executions/day and minutes/day charts, current/longest streak, per-skill breakdown), and a history log. Usage is expected across devices under the same account.

## Capabilities and Constraints

- **Skills**: name, color, optional daily execution goal, can be archived/restored, deleted (cascades its sessions).
- **Sessions**: mode (`countdown` | `stopwatch`), started_at/ended_at, duration_seconds, target_seconds (countdown only), executions count, optional note.
- **Security**: Supabase Postgres with row-level security — every skills/sessions row is scoped to `auth.uid() = user_id`; no cross-account data access.
- **Stack**: TanStack Start + TanStack Router + TanStack Query, Supabase (auth + Postgres), Tailwind v4, shadcn/Radix UI components. This is a durable constraint, not an open decision.
- **Lovable sync**: the repo stays connected to the Lovable editor. Published git history must not be rewritten (no force-push, rebase, or amend of pushed commits) or the sync breaks and the user loses project history in Lovable.

## Brand Commitments

- Name: **Repwise** — confirmed canonical (used in the app's page titles/meta). The README's "Skill Timer Pro" and the repo name `habit-flow-timer` are stale/legacy naming and not binding.
- Tagline in current use: "Time your practice. Count your reps."

## Evidence on Hand

- A live deployment exists at the Lovable-hosted URL referenced in the README, but it may reflect an earlier build rather than the current TanStack Start codebase. No case studies, testimonials, benchmarks, or press exist — future work must not invent any.

## Product Principles

1. Every logged session carries both a duration and a rep count — never design a flow that captures one without the other.
2. Show habit signal (streaks) and volume (totals/reps) together; neither alone tells the full story.
3. Minimize friction between "I want to practice" and a running timer — this is used in the moment, not planned in advance.
4. Multi-tenant by default: every skill and session is user-scoped; never let UI or queries imply shared/global data.
5. Preserve Lovable's sync workflow — no destructive git history operations on the connected branch.

## Accessibility & Inclusion

WCAG 2.2 AA is the required baseline across all surfaces: color contrast, full keyboard operability, screen reader support, visible focus states, and adequate target size.
