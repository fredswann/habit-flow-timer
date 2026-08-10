---
name: Repwise
description: A dark, focused timer and rep-logging tracker for deliberate practice.
colors:
  deep-slate: "oklch(0.18 0.012 264)"
  slate-panel: "oklch(0.225 0.014 264)"
  slate-raised: "oklch(0.27 0.014 264)"
  hairline: "oklch(1 0 0 / 12%)"
  input-line: "oklch(1 0 0 / 16%)"
  paper-white: "oklch(0.96 0.006 260)"
  slate-mist: "oklch(0.7 0.014 260)"
  warm-amber: "oklch(0.79 0.13 68)"
  ink-on-amber: "oklch(0.19 0.02 60)"
  warning-red: "oklch(0.64 0.2 22)"
  skill-apricot: "#f0a35e"
  skill-mint: "#7fd1a6"
  skill-sky: "#7fa8f0"
  skill-orchid: "#d78ff0"
  skill-coral: "#f07f8f"
  skill-wheat: "#e3d97f"
typography:
  headline:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.25rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.05
    letterSpacing: "-0.01em"
  title:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "-0.01em"
  body:
    fontFamily: "Space Grotesk, ui-sans-serif, system-ui, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.75rem"
    fontWeight: 500
    letterSpacing: "0.3em"
  readout:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "clamp(2.5rem, 8vw, 4.5rem)"
    fontWeight: 600
    lineHeight: 1
    letterSpacing: "-0.02em"
rounded:
  sm: "8px"
  md: "10px"
  lg: "12px"
  xl: "16px"
  2xl: "20px"
  full: "9999px"
spacing:
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "20px"
  xl: "24px"
  2xl: "40px"
components:
  button-primary:
    backgroundColor: "{colors.warm-amber}"
    textColor: "{colors.ink-on-amber}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-outline:
    backgroundColor: "{colors.deep-slate}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.slate-mist}"
    rounded: "{rounded.md}"
    padding: "8px 16px"
  card-surface:
    backgroundColor: "{colors.slate-panel}"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.xl}"
    padding: "20px"
  input-field:
    backgroundColor: "transparent"
    textColor: "{colors.paper-white}"
    rounded: "{rounded.md}"
    padding: "4px 12px"
    height: "36px"
---

# Design System: Repwise

## Overview

**Creative North Star: "The Practice Room"**

Repwise reads like a quiet, low-lit room built for one thing: repetition. The interface stays out of the way — deep slate surfaces, near-black by design, lit only by a single warm amber accent that behaves like a lamp over a music stand or a workbench light left on after hours. Nothing else in the palette competes with it: red exists only for destructive actions, and color otherwise belongs to the user, not the system, in the six identity colors they assign to their own skills.

The system is built around measurement. Every number that represents something real — a countdown, a rep count, a streak, a timestamp — renders in JetBrains Mono, tabular and exact, the way a stopwatch or a mixing console would show it. Everything else — headings, labels, buttons, body copy — speaks in Space Grotesk, a single sans voice with no separate "display" face; the room doesn't need two typefaces to feel considered, it needs one that stays consistent while the mono readouts carry the drama.

Surfaces are flat and bordered, not lifted. Depth comes from a single step of lightness (cards sit one shade brighter than the page behind them) plus a barely-there hairline border, not from shadows. The one deliberate exception is the app's top navigation, which floats a translucent, blurred bar over content — the single "glass" moment in an otherwise matte system, reserved for the chrome that has to stay legible while everything scrolls beneath it.

**Key Characteristics:**
- One accent color (warm amber), used sparingly — buttons, active timer state, streak flame, focus rings
- Mono digits for anything measured or timestamped; sans for everything else
- Flat, bordered surfaces — no drop shadows as the depth mechanism
- A single dark theme; no light mode exists (see Named Rule under Colors)
- User-assigned skill colors are the only other saturated color in the system

## Colors

A near-monochrome dark neutral field with exactly one saturated system color; every other color in the interface belongs to the user's own skills, not to the UI itself.

### Primary
- **Warm Amber** (`oklch(0.79 0.13 68)`): the system's only accent. Used for primary buttons, the accent icon in the wordmark, focus rings, the running-timer digits and progress bar (when a skill has no distinct color context), and the streak flame. Text on top of it uses **Ink on Amber** (`oklch(0.19 0.02 60)`), a near-black warm tone, never pure white.

### Neutral
- **Deep Slate** (`oklch(0.18 0.012 264)`): page background. The base of the "room."
- **Slate Panel** (`oklch(0.225 0.014 264)`): card and popover surfaces — one lightness step above the background, the system's primary depth cue.
- **Slate Raised** (`oklch(0.27 0.014 264)`): secondary surfaces — muted backgrounds, the tab-list track, hover/active states in navigation.
- **Paper White** (`oklch(0.96 0.006 260)`): primary text.
- **Slate Mist** (`oklch(0.7 0.014 260)`): secondary/muted text — captions, helper copy, timestamps, inactive nav labels.
- **Hairline** (`oklch(1 0 0 / 12%)`): borders and dividers — translucent white over the dark surfaces, never an opaque gray.
- **Input Line** (`oklch(1 0 0 / 16%)`): the slightly-stronger translucent border reserved for form field outlines.

### User Identity Colors (not a system palette)
Six hex swatches — Apricot `#f0a35e`, Mint `#7fd1a6`, Sky `#7fa8f0`, Orchid `#d78ff0`, Coral `#f07f8f`, Wheat `#e3d97f` — offered as the picker when someone creates a skill. These belong to the user's data, not the chrome: they mark skill-color dots, the running-timer glow and progress bar when practicing that skill, and per-skill chart legends. Never repurpose one as a system/UI color, and never add a seventh without deliberate reason — the set is a fixed, memorizable palette.

### Named Rules
**The Single Accent Rule.** Warm Amber is the only saturated color the *system* controls. If a screen needs a second point of emphasis, reach for weight, size, or the mono readout treatment before reaching for a second hue.

**The One Theme Rule.** Repwise has exactly one visual theme — the dark palette defined above. A `.dark` class block exists in `styles.css` as unused shadcn scaffolding with different, mismatched token values; it is never toggled anywhere in the app and must not be treated as an alternate mode. Any future light or alternate theme is a deliberate redesign decision, not a matter of activating what's already there.

## Typography

**Body & Headline Font:** Space Grotesk (with `ui-sans-serif, system-ui, sans-serif` fallback)
**Mono/Label Font:** JetBrains Mono (with `ui-monospace, monospace` fallback)

**Character:** One confident geometric sans for structure and voice, one monospace for anything measured. There is no separate display face — Space Grotesk carries headlines at weight and size rather than switching families.

### Hierarchy
- **Headline** (600, `clamp(2.25rem, 4vw, 3rem)`, 1.05 line-height, −0.01em tracking): the landing page's single H1 only.
- **Title** (600, 1.5rem/24px, 1.2 line-height, −0.01em tracking): page-level headings inside the app (Skills, Stats, History, a skill's practice page).
- **Body** (400, 0.875rem/14px, 1.5 line-height): default copy, descriptions, form labels' companion text.
- **Label** (500, 0.75rem/12px, 0.3em letter-spacing, uppercase): mono eyebrows ("Repwise" wordmark tag, table column headers) and small mono captions (session counts, timestamps).
- **Readout** (600, `clamp(2.5rem, 8vw, 4.5rem)`, 1 line-height, −0.02em tracking, mono, tabular-nums): the practice timer's live clock — the single largest, loudest element in the product.

### Named Rules
**The Readout Rule.** Any number that represents a live measurement or a logged fact — the timer, executions, reps/minute, streak counts, stat tiles, timestamps — is set in JetBrains Mono with tabular figures. Any number or word that is a label, instruction, or narrative copy is set in Space Grotesk. Mixing the two within the same value is the tell that something is being treated as decoration instead of data.

## Layout

Three container widths, chosen by task: `max-w-4xl` for single-column reading moments (landing page, sign-in), `max-w-5xl` for the authenticated app shell (nav bar and all main content), `max-w-xl` for the practice/timer page, which is deliberately narrow and centered — the one screen where the user shouldn't be scanning, just watching a clock.

Grids follow the content: skills are `sm:grid-cols-2` cards, stat tiles are `sm:grid-cols-2 lg:grid-cols-4`, the two stats charts sit `lg:grid-cols-2`, and the landing page's three feature cards are `sm:grid-cols-3`. Everything collapses to a single column below its breakpoint.

Spacing rhythm is built from a small set of steps actually in use: `8px`/`12px` for tight inline gaps (icon-to-label, badge clusters), `16px` for form field stacks, `20px` (`p-5`) as the standard interior padding for card-like surfaces, `24px` (`p-6`) inside dialogs, and `40px` (`p-10`) inside the practice timer's hero surface. Page-level top padding is generous: `py-24` on the landing page, `py-8` inside the authenticated shell.

## Elevation & Depth

Repwise is flat by design: no card in the dashboard, stats, or history views carries a drop shadow. Depth reads through two channels instead — a single lightness step (Slate Panel sits above Deep Slate) and a translucent hairline border. Buttons and form inputs carry the barely-visible `shadow-sm` that ships with the underlying component library, but it's residual, not a depth statement; nothing in the product relies on it to read as "raised."

The one intentional exception is the top navigation bar, which uses a translucent panel (`bg-card` at 40% opacity) with a backdrop blur, so it reads as a pane of glass floating over scrolling content rather than a flat strip. This is reserved for persistent chrome only.

### Named Rules
**The Border-Not-Shadow Rule.** When a surface needs to separate from what's behind it, reach for the hairline border and a lightness step first. Reserve blur-and-translucency for chrome that must float above scrolling content (so far: only the top nav); it is not a general card treatment.

## Shapes

Corner radius scales with a surface's role, not its size: small interactive controls (buttons, inputs, tabs, table cells) use `10px` (`rounded-md`); everyday content cards (skill cards, stat tiles, chart panels, the history table's outer frame) use `16px` (`rounded-xl`); the single hero surface — the practice timer card — steps up to `20px` (`rounded-2xl`) to mark it as the screen's one focal object. Skill-color markers, the streak flame's badge, and the timer's progress track are fully rounded (`rounded-full`), the only circular geometry in the system. Borders are always the translucent Hairline color, 1px, never a heavier stroke.

## Components

### Buttons
- **Shape:** `10px` radius (`rounded-md`) at every size.
- **Primary:** Warm Amber background, Ink on Amber text, 90%-opacity hover. Used for the single most important action per view (Add skill, Start timer, Save session, Sign in).
- **Secondary:** Slate Raised background, Paper White text, 80%-opacity hover — used when an action is real but not primary (e.g. "Continue with Google").
- **Outline:** transparent/background fill, Hairline border, hover fills with the muted-surface tone — the default for secondary navigation actions like "Back to skills."
- **Ghost:** no border or fill at rest; hover picks up the muted-surface tone. Used for low-emphasis actions inside dense rows (Archive, Sign out).
- **Destructive:** Warning Red background, used only for irreversible actions (delete skill/session), always confirmed before firing.
- **Sizes:** `sm` (32px), default (36px), `lg` (40px), `icon` (36px square). The practice page's Start/Pause/Stop controls always use `lg`.

### Cards / Containers
The recurring content-surface recipe, used identically across the skills grid, stat tiles, chart panels, the history table frame, and landing feature cards: Slate Panel background, `16px` corner radius, 1px Hairline border, `20px` interior padding, no shadow. A dialog/popover variant of this same surface exists as the shared `Card` component (adds `24px` padding and a residual `shadow` class) for modal contexts.

### Inputs / Fields
- **Style:** transparent background, Hairline-strength border (Input Line, slightly stronger than the card border), `10px` radius, `36px` height.
- **Focus:** a 1px ring in Warm Amber (`focus-visible:ring-ring`), no background change.
- **Disabled:** 50% opacity, cursor disabled.

### Navigation
The top bar is the system's one glass surface: `bg-card` at 40% opacity with backdrop blur, a Hairline bottom border, `max-w-5xl` inner row. Nav links are Slate Mist by default, promote to Paper White with a Slate Raised pill background on hover or when active (`activeProps`) — no underline, no color-only active state.

### The Timer Readout (signature component)
The practice page's defining moment: a centered `Readout`-scale mono clock inside the `2xl`-radius hero card. At rest it's Paper White; the instant the timer is running, the digits (and, for countdown mode, the thin progress bar beneath them) switch to the active skill's own color rather than the system's Warm Amber — the one place a user's identity color is allowed to take over the interface's primary visual role. This is deliberate: the room's lamp is amber, but while you're practicing, the light is *your* skill's color.

## Do's and Don'ts

### Do:
- **Do** set every measured or logged number (timer, reps, reps/min, streaks, stat tiles, timestamps) in JetBrains Mono with tabular figures.
- **Do** build new content surfaces with the card recipe: Slate Panel background, `16px` radius, Hairline border, `20px` padding, no shadow.
- **Do** let the practicing skill's own color take over the timer readout and progress bar while a session is running.
- **Do** keep Warm Amber as the only system-controlled accent; introduce a second hue only through the user's own skill-color picker.

### Don't:
- **Don't** add drop shadows to cards or panels as a way to show emphasis or hierarchy — use the lightness-step + hairline-border language instead.
- **Don't** activate or extend the `.dark` class block in `styles.css` — it's unused, mismatched legacy scaffolding, not a real second theme.
- **Don't** use a skill's user-chosen identity color for system chrome (buttons, nav, system states) — that color belongs to the skill, not the UI.
- **Don't** mix mono and sans within the same value (e.g. a partly-mono timestamp) — a value is either data (mono) or prose (sans), never both.
