# /init-carousel — Generate `.carousel.md` from a project's DESIGN.md

**Trigger:** user says "init carousel", "set up carousel", "generate .carousel.md", or runs `/init-carousel`.

**Purpose:** bootstrap a new `.carousel.md` config at the project root by reading whatever design system documentation exists, extracting tokens, and prompting only for the carousel-specific fields that aren't in DESIGN.md.

## Preconditions

1. If `.carousel.md` already exists at the project root — **stop and confirm**:
   > "A `.carousel.md` already exists. Overwrite it (y) or back it up to `.carousel.md.bak` first (b)?"

   Do not proceed without an answer.

2. If no writable project root is clear, ask the user where to write the config.

## Step 1 — Locate the Design System

Search for the design system file in this order:

1. `DESIGN.md` at project root
2. `Design System/DESIGN.md` or similar subfolder
3. Any `*.design.md` in `docs/`
4. None found → **fallback mode**: skip to Step 3, ask the user for tokens directly.

## Step 2 — Extract Tokens from DESIGN.md

If DESIGN.md was found, read it and extract these into a draft:

| `.carousel.md` field | Extract from DESIGN.md |
|----------------------|------------------------|
| `brand.name` | The product/brand name (usually in the top `# Heading` or first paragraph) |
| `design.primary` | Primary brand/accent color hex (look for "primary", "accent", "brand color", first chromatic hex) |
| `design.primary_dark` | Dark variant of primary, or the "warm dark"/"secondary dark" token |
| `design.dark` | Darkest background color (look for "dark section", "deep", "background dark") |
| `design.white` | White or off-white surface color |
| `design.headline_font` | Display/serif font (look for "Display", "Serif", "Headline", "H1") |
| `design.body_font` | Sans-serif/UI font (look for "Body", "Sans", "UI") |
| `design.mono_font` | Monospace font (look for "Mono", "Code", "Nav") — optional, falls back to body_font |
| `brand.logo_svg` | Path to logo SVG, OR inline SVG from a `## Logo` section |

Also set the `design.design_md` pointer to the DESIGN.md path you found — serves as a breadcrumb for future editors.

**Rules while extracting:**
- Prefer hex values that appear in structured tables over hex values embedded in prose.
- If a token appears multiple times with different values, prefer the one labeled "Primary" or listed first in a "Colors" section.
- Never invent a value. If you can't find it in DESIGN.md, mark it as `# TODO` in the draft and ask the user in Step 3.

## Step 3 — Ask for Carousel-Only Fields

These are not in DESIGN.md — ask the user (batch them into 2-3 questions, not 6):

**Batch 1 (brand):**
- Brand URL for the CTA pill (e.g. `looplinq.com`)
- Default CTA text (e.g. `Start Free`, `Join Waitlist`)
- Product-signup CTA (e.g. `Get Started Today`) — optional, defaults to match the default CTA

**Batch 2 (voice + emphasis):**
- Hook style: `fear-first` (default) or `positive`?
- Audience (one short phrase, e.g. "creators", "B2B founders", "indie devs")
- Emphasis style on headline key words:
  - `italic` (default) — italicized text in the theme's emphasis color
  - `bold` — bolded text in the emphasis color
  - `italic-underline` — italic + underline
  - `highlight` — highlighter background behind the text (text stays normal headline color)
  - `italic+highlight` — italic text on a highlight

**Batch 3 (any TODOs from Step 2):**
Ask only for tokens that were missing from DESIGN.md.

## Step 4 — Fill the Template

Load `templates/carousel-config.md` and substitute:

- Every extracted value from Step 2
- Every answer from Step 3
- Keep the `layout` section at the template defaults (themes, typography, zones, emphasis, bottom_variants). The user can tweak later if needed.

## Step 5 — Write `.carousel.md`

Write the filled template to `.carousel.md` at the project root.

## Step 6 — Confirm

Show the user the generated file and ask:

> "Generated `.carousel.md` at the project root. Review the values — anything to change before we start building carousels?"

If they request edits, apply them and rewrite. Otherwise, done.

## Fallback: No DESIGN.md

If Step 1 found nothing, skip token extraction and run the full question flow:

1. Brand name, URL, default CTA, product CTA
2. Primary color hex
3. Primary-dark color hex (or say "derive" — compute a darker variant of primary)
4. Dark background hex (or say "derive" — default to `#0A0A0F`)
5. Headline font, body font, mono font (offer Google Fonts suggestions if they don't know)
6. Voice hook style + audience
7. Logo SVG path (or "skip" — fallback to gradient circle)

Then fill the template and write as in Step 5-6.
