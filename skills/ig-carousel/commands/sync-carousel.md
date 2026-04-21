# /sync-carousel — Detect Drift Between DESIGN.md and `.carousel.md`

**Trigger:** user says "sync carousel", "check carousel config", "is carousel config up to date", or runs `/sync-carousel`.

**Purpose:** `.carousel.md` mirrors design tokens from `DESIGN.md`. When DESIGN.md changes (color tweaks, font swaps, logo replacement), `.carousel.md` can silently fall out of sync. This command detects and optionally fixes the drift.

**Scope:** this command only checks fields `.carousel.md` claims to mirror from DESIGN.md. It does **not** touch carousel-specific config (voice, layout, themes, typography scale, CTAs, brand.url) — those live only in `.carousel.md` by design.

## Preconditions

1. Both files must exist at the project root (or in paths referenced by `.carousel.md` via `design.design_md`). If either is missing, tell the user and stop.
2. If `.carousel.md` has no `design.design_md` pointer, ask the user: "Which DESIGN.md should I compare against? (Defaults to `DESIGN.md` at project root.)"

## Step 1 — Load Both Files

Read the current `.carousel.md` and the DESIGN.md it points at. Parse the `.carousel.md` frontmatter into memory.

## Step 2 — Re-Extract Tokens from DESIGN.md

Using the same extraction rules as `commands/init-carousel.md` Step 2, pull these fields **fresh** from DESIGN.md:

| Field | Source |
|-------|--------|
| `brand.name` | Top heading / first paragraph |
| `design.primary` | Primary brand color hex |
| `design.primary_dark` | Dark variant of primary |
| `design.dark` | Darkest background color |
| `design.white` | White/surface color |
| `design.headline_font` | Display/serif font |
| `design.body_font` | Sans-serif/UI font |
| `design.mono_font` | Monospace font (optional) |
| `brand.logo_svg` | Logo SVG path (check file exists on disk) |
| `brand.logo_svg_white` | White logo variant path or inline reference (check file / section exists) |

## Step 3 — Compare and Build the Drift Report

For each field, compare the value in `.carousel.md` against what you just extracted. Classify each field:

- **✓ synced** — values match exactly
- **✗ drift** — values differ (report both)
- **⚠ missing** — field exists in DESIGN.md but not `.carousel.md`, or vice versa
- **? ambiguous** — couldn't confidently find the value in DESIGN.md (multiple candidates, none labeled clearly)
- **✗ broken** — path/file referenced in `.carousel.md` no longer exists

Present the report like this:

```
Carousel Config Sync Report
───────────────────────────
Brand
  ✓ brand.name              Looplinq
  ✓ brand.logo_svg          Design System/Logo and Word Mark/Looplinq SVG logo 2085662426.svg

Design tokens
  ✓ design.primary          #FF5D02
  ✗ design.primary_dark     .carousel.md: #5F2606  →  DESIGN.md: #6B2A08  (drift)
  ✓ design.dark             #1A0E04
  ✓ design.white            #FFFFFF

Fonts
  ✓ design.headline_font    DM Serif Display
  ✓ design.body_font        DM Sans
  ⚠ design.mono_font        Not in DESIGN.md  |  .carousel.md: JetBrains Mono  (kept)

Files
  ✓ Logo path exists        Design System/Logo and Word Mark/Looplinq SVG logo 2085662426.svg
  ✗ Logo white path broken  Design System/DESIGN.md  (file exists, but ## Logo section not found)

Summary: 1 drift, 1 warning, 1 broken reference.
```

## Step 4 — Offer Auto-Fix

After the report, ask:

> "Apply the 1 drift fix and update `.carousel.md`? (y/n)"
> "Investigate the broken reference? (it may need a manual fix)"

**What auto-fix does:**
- Replaces the drifted value in `.carousel.md` with the DESIGN.md value.
- Leaves warnings (`⚠`) alone — they're informational, not fixable without user input.
- Leaves broken references (`✗`) alone — user has to investigate whether the file moved or the section was renamed.
- Preserves formatting and comments in `.carousel.md` (parse + edit in place, don't regenerate from the template).

If the user agrees, write the updated `.carousel.md`.

## Step 5 — Post-Sync Confirmation

If any changes were applied, re-run Step 3 and print a short confirmation:

> "Updated `.carousel.md`: `design.primary_dark` changed from `#5F2606` to `#6B2A08`. All fields now synced."

If nothing changed, just say:

> "`.carousel.md` is in sync with DESIGN.md. No changes needed."

## What This Command Does NOT Do

- Does not modify DESIGN.md (DESIGN.md is the source of truth).
- Does not touch `layout.*`, `voice.*`, or any carousel-only config.
- Does not regenerate themes or typography — even if primary color changed, the theme structure stays the same; only the `design.primary` field is updated, and the `{design.primary}` placeholder resolves to the new value automatically at render time.
- Does not check `references/` or skill files — sync only covers per-project config.

## Run as a pre-flight (optional)

This command can also be run automatically as a pre-flight check before building a carousel — add `/sync-carousel` as an optional first step when the user invokes the main skill. If drift is found, warn before generating.
