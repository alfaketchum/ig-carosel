# /init-carousel — Generate `.carousel.md` from a project's DESIGN.md

**Trigger:** user says "init carousel", "set up carousel", "generate .carousel.md", or runs `/init-carousel`.

**Purpose:** bootstrap a new `.carousel.md` config at the project root by reading whatever design system documentation exists, extracting tokens, and prompting only for the carousel-specific fields that aren't in DESIGN.md.

## What you're configuring

Before running questions, hold the architecture in mind so you can explain it crisply if the user asks:

- **Layout primitives** (4, skill-shipped) — `vertical_3_stack`, `grid_2col`, `full_bleed_corner`, `z_stacked`. The structural shapes any slide can take. Brands cannot invent new ones.
- **Slot types** (preset library, customizable) — named `{primitive + slot list}` configurations. The skill ships 8 starter presets (`static_text_only`, `captioned_image`, `pull_quote`, `big_number`, `side_by_side_comparison`, `numbered_list`, `full_frame_image`, `text_over_image`). Brands can use them as-is, edit slot fields, swap the primitive, or compose their own from scratch.
- **Image sources** (4 options, configurable per brand) — `user` (paths/files), `placeholder` (Picsum + brief), `generated` (AI gen, opt-in), `chart` (CSS-rendered, opt-in).

The init flow asks the user to pick from existing presets in most cases. Composing custom types from primitives is documented but advanced.

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

These are not in DESIGN.md — ask the user (batch them, not 6 separate prompts):

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
- Hook theme variation — which theme roles can the HOOK slide use? Multiple roles here means the IG profile grid shows variety (different first-slide backgrounds across carousels) instead of every hook being the same brand color. The CTA slide always uses the anchor theme regardless.
  - `anchor only` (default) — every hook uses the brand's primary surface. No grid variety.
  - `anchor + body` — hook can be anchor OR body. Skill picks per carousel based on `--hook-theme` flag (default: first in list = anchor).
  - `anchor + body + alt` — full variation. Hook can be any of the three theme roles. When `alt` is picked as the hook, the skill skips the mid-carousel `alt` variety break (slide 1 IS the variety).

  Write the picked role names to `hook_themes_allowed` in the brand config. e.g., `[anchor]` (default), `[anchor, body]`, or `[anchor, body, alt]`.

**Batch 3 (slide-type presets):**

The skill ships an 8-preset starter library — proven `{primitive + slot list}` configurations that brands paste into `.carousel.md` and edit. Full spec in `references/slide-types.md`. Brands aren't limited to these 8; any combination of `{primitive + slots + name}` is valid (advanced mode below). For most brands, the presets are enough.

Ask:

> Which slide-layout presets should this brand's carousels use? Pick any combination — the skill will choose per-slide based on content. (Reply with names, `text-only` for static-text-only carousels, `all` to enable everything, or `custom` to compose your own.)

Show this list as the menu:

| Preset | What it is | Primitive |
|---|---|---|
| Static Text Only | Label + headline + bottom (stat / list / pill / bullets). Default fallback. | `vertical_3_stack` |
| Captioned Image | Header (sentence) + image + footer (small forward teaser). | `vertical_3_stack` |
| Full-Frame Image | Image fills the entire slide, optional small corner caption. | `full_bleed_corner` |
| Text Over Image | Image as background, headline overlaid with a darkening scrim. | `z_stacked` |
| Pull Quote | Big quote mark, italic quoted text, attribution. For testimonials and direct quotes. | `vertical_3_stack` |
| Big Number | Huge stat as the focal point, label above, context below. For data slides. | `vertical_3_stack` |
| Side-by-Side Comparison | Two columns (A vs B), often with a verdict line. For Founder Contrast and before/after. | `grid_2col` |
| Numbered List | Ordered stack of items with numbers. For listicle slides. | `vertical_3_stack` |

Parse the user's reply:
- Match by display name (case-insensitive, partial-match OK — "quote" → `pull_quote`, "side by side" → `side_by_side_comparison`).
- `text-only` → enabled set is just `[static_text_only]`.
- `all` → all 8 presets enabled.
- `custom` → branch to the **Custom-type composer** sub-flow below.
- Always include `static_text_only` (or an equivalent text-only preset) in the enabled set as the universal fallback.

**Custom-type composer (advanced):**

If the user picks `custom`, walk them through composing one or more types:

1. Ask for the type name (e.g. `cover_quote`, `feature_card`, `metric_card`).
2. Pick a primitive from the four available — show the primitives table with positions:
   - `vertical_3_stack` — positions: `top`, `middle`, `bottom`
   - `grid_2col` — positions: `top`, `left`, `right`, `bottom`
   - `full_bleed_corner` — positions: `full`, `corner`
   - `z_stacked` — positions: `background`, `foreground`
3. For each slot, ask:
   - Slot class name (e.g. `slide-quote-mark`, `slide-feature-image`)
   - Position (must be one valid for the chosen primitive)
   - Content type (`text` / `image` / `number` / `decorative`)
   - Typography role (`label` / `headline` / `body` / `list` / `cta`) — only for text slots
   - Optional: `size_multiplier`, `max_words`, `aspect`, `radius`, `shadow` (see slot field → CSS mapping in `references/slide-build.md`)
4. Repeat 2–3 for additional custom types if the user wants more.

If composing one custom type takes more than 4 slots or feels heavy, suggest the user start by pasting a preset and editing — `references/slide-types.md` has each preset's YAML ready to copy.

**Image-source question** — only ask if the user enabled any image-using preset (`captioned_image`, `full_frame_image`, `text_over_image`) OR composed a custom type with an image slot:

> Which image sources should this brand support? The skill normalizes every source to a local file `slide-NN-source.{ext}` so the HTML is source-agnostic — you can mix and match.
>
> - **`user`** (always available) — you supply image paths or drop files into the carousel folder. Best for product screenshots and brand-owned imagery.
> - **`placeholder`** (default, free) — Picsum or solid blocks fill any slot you haven't supplied. Skill writes a brief file telling you what to source. Lets you draft a carousel before sourcing assets.
> - **`generated`** (opt-in, costs $$) — AI image generation via nano-banana / Midjourney / DALL-E. Best for storytelling carousels needing photographic imagery the brand doesn't own. Disabled by default; flip on when ready and add an API key.
> - **`chart`** (opt-in, free) — SVG charts/diagrams rendered using brand tokens. Narrow use case; likely promoted to its own slide type later. Off by default.
>
> Default config: `user` + `placeholder` enabled, `generated` + `chart` declared but disabled. You can flip them later. Press enter to accept the default, or specify which sources to enable.

Write the answer into the `images:` top-level block per the schema in `references/image-sources.md`.

**Strategy question** — only if the user enabled more than one preset (or composed multiple custom types). If they're text-only single-type, skip; the strategy doesn't matter.

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
- Keep the `layout` section at the template defaults for `themes` and `bottom_variants`.
- **Apply the chosen typography preset** (see "Typography Presets" below) to `layout.typography`. Replace the template's clamp values with the preset's values. Default to `standard` if the user skipped the question.
- Apply the chosen emphasis style to `layout.emphasis.style`.
- **Write the `slide_types_enabled` block** as an object map. For each enabled preset, paste the canonical default YAML from `references/slide-types.md` "Preset Library" → the corresponding entry. For each custom type, write the user-specified `{pattern, slots}` config.
- **Write the `slide_type_strategy` field** based on Batch 3 (`uniform` default, or `mixed` / `element_locked`). If `element_locked`, also write the `slide_type_element_map` with the user's role→type mapping.
- **Write the top-level `images:` block** based on the image-source question. Default config: `user` + `placeholder` enabled with sensible defaults; `generated` + `chart` declared with `enabled: false`.

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

Slot fields can override these per-slot via `size_multiplier` (e.g. `captioned_image`'s header uses `typography_role: headline, size_multiplier: 0.55` — sentence-feel, not full-billboard). See `references/slide-build.md` "Slot field → CSS mapping."

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
9. Slide-type presets — which to enable (see Batch 3 menu in Step 3 above; `static_text_only` always implicit; `text-only` / `all` / comma-separated names / `custom` accepted)
10. Image sources if any image-using preset/custom-type was picked (`user` + `placeholder` defaults; `generated` + `chart` opt-in)
11. Slide-type strategy: `uniform` (default) / `mixed` / `element_locked`. If `element_locked`, ask the role→type mapping.
12. Logo SVG path (or "skip" — fallback to gradient circle)

Then fill the template, applying the chosen typography preset to `layout.typography`, writing the `slide_types_enabled` object map, and writing the `images:` block. Proceed as in Step 5–6.
