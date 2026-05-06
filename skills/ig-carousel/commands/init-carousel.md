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

**Batch 2 (voice + emphasis + typography):**
- Hook style: `fear-first` (default) or `positive`?
- Audience (one short phrase, e.g. "creators", "B2B founders", "indie devs")
- Emphasis style on headline key words:
  - `italic` (default) — italicized text in the theme's emphasis color
  - `bold` — bolded text in the emphasis color
  - `italic-underline` — italic + underline
  - `highlight` — highlighter background behind the text (text stays normal headline color)
  - `italic+highlight` — italic text on a highlight
- Typography scale — how dominant should slide text be?
  - `standard` (default) — desktop-friendly, less grid-dominant. Headline ~59px at 1080.
  - `loud` — mid-tier, readable on IG-grid thumbnails. Headline ~70px at 1080.
  - `massive` — thumbnail-first, dominates the grid (creator-led brands). Headline ~87px at 1080.

**Batch 3 (slide-type vocabulary):**

The skill ships an 8-type vocabulary of slide layouts (full spec in `references/slide-types.md`). Brands declare which types their carousels are allowed to use. **`static_text_only` is always implicit** — it's the universal fallback. The user picks which *additional* types to enable.

Ask:

> Which slide-type layouts should this brand's carousels use? Pick any combination — the skill will choose per-slide based on content. (Reply with names, or `text-only` for static-text-only carousels, or `all` to enable everything.)

Show this list as the menu:

| Type | What it is |
|---|---|
| Captioned Image | Image with a caption underneath. Image is the body; caption explains it. |
| Full-Frame Image | Image fills the entire slide. Optional small corner caption. |
| Text Over Image | Image as background, headline overlaid with a darkening scrim. |
| Pull Quote | Big quote mark, italic quoted text, attribution. For testimonials and direct quotes. |
| Big Number | Huge stat as the focal point, label above, context below. For data slides. |
| Side-by-Side Comparison | Two columns (A vs B), often with a verdict line. For Founder Contrast and before/after. |
| Numbered List | Ordered stack of items with numbers. For listicle slides. |

Parse the user's reply:
- Match by display name (case-insensitive, partial-match OK — "quote" → `pull_quote`, "side by side" → `side_by_side_comparison`).
- `text-only` → enabled set is just `[static_text_only]`.
- `all` → all 8 types enabled.
- Always include `static_text_only` in the enabled set regardless of user input.

If the user picks any image-using types (`captioned_image`, `full_frame_image`, `text_over_image`, or `side_by_side_comparison`), follow up with one more question:

> What's the image source for this brand? `user` (you'll provide image paths per slide), `local_library` (a folder of brand assets the skill can reference by name), or `none for now` (Phase 1: only `user` is wired up — pick this if you're enabling image types but not ready to provide images yet).

Default to `user`. `local_library` is documented but not yet built (Phase 2).

**Then ask the strategy question** — only if the user enabled more than just `static_text_only`. If they're text-only, skip this; the strategy doesn't matter when there's only one type:

> How should the skill mix slide types within a single carousel?
>
> - **`uniform`** (default) — every slide in a carousel uses the same type. The skill picks one type per carousel based on content. Strongest brand signature. Good for editorial brands and testimonial roundups.
> - **`mixed`** — each slide picks its own type independently from the enabled set, based on content signals. Strongest content fit. Best for storytelling brands.
> - **`element_locked`** — specific type per theme role (anchor / body / alt). Predictable rhythm without full uniformity. e.g., "anchor slides are always Static Text Only, body slides are always Captioned Image."

Default to `uniform`.

If the user picks `element_locked`, ask the mapping:

> Map each role to a slide type. Anchor = ?, Body = ?, Alt = ?

Validate that each chosen type is in `slide_types_enabled`. If not, prompt to either add it or pick a different type.

**Batch 4 (any TODOs from Step 2):**
Ask only for tokens that were missing from DESIGN.md.

## Step 4 — Fill the Template

Load `templates/carousel-config.md` and substitute:

- Every extracted value from Step 2
- Every answer from Step 3
- Keep the `layout` section at the template defaults for `themes` and `bottom_variants`. (Zones are no longer brand-level; they're owned per slide type in `references/slide-types.md`.)
- **Apply the chosen typography preset** (see "Typography Presets" below) to `layout.typography`. Replace the template's clamp values with the preset's values. Default to `standard` if the user skipped the question.
- Apply the chosen emphasis style to `layout.emphasis.style`.
- **Write the `slide_types_enabled` block** based on Batch 3. Always include `static_text_only` first, then any types the user picked. If the user picked image-using types, also write the `images.sources` value from the follow-up question.
- **Write the `slide_type_strategy` field** based on Batch 3 (`uniform` default, or `mixed` / `element_locked`). If `element_locked`, also write the `slide_type_element_map` with the user's role→type mapping.

## Step 5 — Write `.carousel.md`

Write the filled template to `.carousel.md` at the project root.

## Step 6 — Confirm

Show the user the generated file and ask:

> "Generated `.carousel.md` at the project root. Review the values — anything to change before we start building carousels?"

If they request edits, apply them and rewrite. Otherwise, done.

## Typography Presets

When the user picks a scale in Step 3 Batch 2, substitute the `layout.typography` block with these values. The clamp triple is `(min, vw-scaled, max)`. CTA pill text uses the mono font and stays constant across presets — pill text shouldn't grow with body copy.

| Role | `standard` | `loud` | `massive` |
|---|---|---|---|
| `headline` | `clamp(24px, 5.5vw, 72px)` | `clamp(28px, 6.5vw, 84px)` | `clamp(34px, 8.1vw, 104px)` |
| `label` | `clamp(10px, 2.2vw, 24px)` | `clamp(11px, 2.5vw, 27px)` | `clamp(13px, 2.8vw, 34px)` |
| `body` | `clamp(12px, 2.6vw, 28px)` | `clamp(14px, 3vw, 32px)` | `clamp(17px, 3.6vw, 44px)` |
| `list` | `clamp(10px, 2.2vw, 24px)` | `clamp(11px, 2.5vw, 27px)` | `clamp(13px, 2.8vw, 34px)` |
| `cta` | `clamp(11px, 2vw, 22px)` | `clamp(11px, 2vw, 22px)` | `clamp(11px, 2vw, 22px)` |

**Reference points (at 1080px export width):**
- `standard` — 59px headline, 24px label, 28px body. Suits desktop-feed brands and serif-heavy editorial layouts.
- `loud` — 70px headline, 27px label, 32px body. Middle-ground; readable on IG grid without dominating in-feed.
- `massive` — 87px headline, 30px label, 39px body. Thumbnail-first: text fills the canvas. Best for creator-led brands where the IG grid is primary discovery.

Headline / label / body / list scale together so the visual hierarchy stays intact across presets. CTA stays constant intentionally.

## Fallback: No DESIGN.md

If Step 1 found nothing, skip token extraction and run the full question flow:

1. Brand name, URL, default CTA, product CTA
2. Primary color hex
3. Primary-dark color hex (or say "derive" — compute a darker variant of primary)
4. Dark background hex (or say "derive" — default to `#0A0A0F`)
5. Headline font, body font, mono font (offer Google Fonts suggestions if they don't know)
6. Voice hook style + audience
7. Emphasis style (`italic` default, or `bold` / `italic-underline` / `highlight` / `italic+highlight`)
8. Typography scale (`standard` default, or `loud` / `massive` — see Typography Presets above)
9. Slide types — which layouts to enable (see Batch 3 menu in Step 3 above; `static_text_only` always implicit; `text-only` / `all` / comma-separated names accepted)
10. Image source if any image-using types were picked (`user` default; `local_library` not yet built)
11. Slide-type strategy: `uniform` (default) / `mixed` / `element_locked`. If `element_locked`, ask the role→type mapping.
12. Logo SVG path (or "skip" — fallback to gradient circle)

Then fill the template, applying the chosen typography preset to `layout.typography` and writing the `slide_types_enabled` block, and proceed as in Step 5-6.
