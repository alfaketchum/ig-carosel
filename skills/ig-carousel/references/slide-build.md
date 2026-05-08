# Slide Build Reference

Execution detail for **Step 5** of the SKILL.md pipeline. Load this when you're about to render slide HTML/CSS — main context shouldn't carry it in advance.

This doc covers: theme & typography resolution, slide type resolution, hook theme resolution, slide anatomy, per-pattern CSS recipes, emphasis pattern, and bottom element variants for `static_text_only`.

---

## Slide Themes

Resolve `layout.themes` from `.carousel.md`. Each theme declares a **role** (how references and narratives refer to it) plus a set of color layers:

- `role` — one of `anchor` (high-contrast brand surface for hooks + CTAs), `body` (readable dark surface for middle content), `alt` (secondary surface for variety). Brands can add more roles as needed.
- `background` — slide background color
- `label` — color of the uppercase label
- `headline` — color of the main headline
- `emphasis` — color applied to `<em>` inside headlines (text or highlight bg, depending on `layout.emphasis.style`)
- `bottom_text` — color of the stat/bullets in the bottom zone

Render each theme as a CSS class **named by role**, not by theme key: `.slide--{role}`. This keeps `references/` and generated HTML aligned — a brand renaming theme keys doesn't break the references. Every role should appear at most once across themes.

---

## Typography Scale

Resolve `layout.typography` from `.carousel.md`. Each role (`headline`, `label`, `body`, `list`, `cta`) declares `font`, `size`, `weight`, `spacing`, and optionally `transform`. Apply verbatim to the matching CSS class.

Load fonts via Google Fonts (or local `@font-face` if the design system specifies local files).

---

## Slide Type Resolution

Before building each slide, resolve which slide **TYPE** it should be. This is a separate axis from theme/role:
- **Theme (role)** controls colors — `anchor` / `body` / `alt`
- **Type** controls layout structure — `static_text_only` / `captioned_image` / `pull_quote` / etc.

Resolution flow per slide:

1. **Read the keys of `slide_types_enabled`** from `.carousel.md` — an object map of `{type-key → {pattern, slots}}`. Only types appearing as keys can be picked. `static_text_only` is implicit even if not declared.

2. **Read `slide_type_strategy`** from `.carousel.md` (default `uniform`):
   - **`uniform`** — pick ONE type for the entire carousel. Skill chooses from the enabled keys based on dominant content signals; same type for every slide.
   - **`mixed`** — pick a type per slide independently. Skill reads each slide's content and picks from the enabled keys. Different slides may have different types.
   - **`element_locked`** — read `slide_type_element_map` from `.carousel.md`. Each role maps to a fixed type. Pick by role.

3. **Per-slide override:** if the user prompt specifies a type for a specific slide ("slide 3 → big_number"), use that — overrides the strategy.

4. **Fallback:** if no signal favors a richer type, use `static_text_only`. The universal default.

5. **For each slide resolved as type T:**
   - Look up T's brand config at `slide_types_enabled.{T}` in `.carousel.md` for `pattern` + `slots`. The `pattern` (one of `vertical_3_stack`, `grid_2col`, `full_bleed_corner`, `z_stacked`) is the CSS recipe; the `slots` tell you which class names to substitute and where each slot sits.
   - Cross-reference `references/slide-types.md` → "Canonical Defaults" for the type's recommended config if the brand hasn't customized.
   - Output `<div class="slide slide--{role} slide--{type-key-with-dashes}">` — TWO classes: role drives colors, type drives layout.
   - Type key uses dashes for CSS: `static_text_only` → `slide--static-text-only`, `captioned_image` → `slide--captioned-image`.

**Content signals for `mixed` strategy:**
- "show / image of / screenshot of X" → `captioned_image` or `full_frame_image` (depending on whether the image is supporting context vs the message itself)
- Specific stat / number / percentage is the payload → `big_number`
- Direct quote with attribution → `pull_quote`
- A vs B / two creators / before-and-after → `side_by_side_comparison`
- Ranked items / numbered list → `numbered_list`
- Image as backdrop with text overlay → `text_over_image`
- Otherwise → `static_text_only`

---

## Hook Theme Resolution

The hook slide (slide 1) doesn't necessarily use the brand's anchor theme. Resolve which theme it uses:

1. **Read `hook_themes_allowed`** from `.carousel.md` (default: `[anchor]`).
2. **Check user prompt for `--hook-theme {role}` flag.** If specified AND the role appears in `hook_themes_allowed`, use it.
3. **Otherwise:** use the first role in `hook_themes_allowed` (typically `anchor`).
4. **If the resolved hook theme is `alt`:** skip the mid-carousel `alt` variety break. Slide 1 IS the variety; doubling up weakens the rhythm.
5. **CTA slide (last slide):** always uses `anchor` regardless of the hook theme. Brand stamp closes every carousel consistently.

This lets brands create IG-grid variety across carousels without diluting the brand stamp at the close. See `references/hook-formulas.md` for the full pattern.

---

## Slide Anatomy

Each slide gets **two CSS classes** on its outer div: `.slide--{role}` (colors) and `.slide--{type-key-with-dashes}` (layout). The role class colors come from `layout.themes` resolution above. The type class layout comes from the **layout primitive** bound to that type.

```html
<!-- Static Text Only on body theme -->
<div class="slide slide--body slide--static-text-only">...</div>

<!-- Captioned Image on anchor theme -->
<div class="slide slide--anchor slide--captioned-image">...</div>
```

**Universal base CSS** (applies to all slides regardless of pattern):

```css
.slide {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 14% 10%;
  position: relative;
}
```

**Slot zones.** Each position declared by a primitive becomes a `<div class="slot-zone slot-zone--{position}">` wrapper in the rendered HTML. The wrapper holds one or more slots that target that position. CSS rules target the zone wrapper, not individual slot classes — this means the brand can rename slot classes freely without breaking layout, and **multiple slots at the same position stack naturally inside the zone**.

Always emit a zone div for every position the primitive declares, even if it has no slots in this slide type. The empty zone preserves the layout's spatial distribution (replaces the older `.slide-spacer` workaround).

```html
<!-- Static text only — three zones, single slot per zone -->
<div class="slide slide--body slide--static-text-only">
  <div class="slot-zone slot-zone--top">
    <div class="slide-label">The Problem</div>
  </div>
  <div class="slot-zone slot-zone--middle">
    <h2 class="slide-headline">...</h2>
  </div>
  <div class="slot-zone slot-zone--bottom">
    <p class="slide-stat">...</p>
  </div>
</div>

<!-- Same primitive, multi-slot per zone — stack a kicker above the headline,
     and a stat + a CTA pill in the bottom zone. The CSS doesn't change. -->
<div class="slide slide--body slide--static-text-only">
  <div class="slot-zone slot-zone--top">
    <div class="slide-kicker">Behind the scenes</div>
    <div class="slide-label">Step 3</div>
  </div>
  <div class="slot-zone slot-zone--middle">
    <h2 class="slide-headline">...</h2>
    <p class="slide-subhead">...</p>
  </div>
  <div class="slot-zone slot-zone--bottom">
    <p class="slide-stat">...</p>
    <a class="cta-pill" href="#">...</a>
  </div>
</div>
```

**Horizontal alignment.** Text centered, content block centered. This is the established carousel convention — feeds read better with centered copy than left-aligned. Do not left-align headlines except in `grid_2col` cells, where left-align inside the cell can be appropriate.

---

## Per-Pattern CSS Recipes

The skill ships four layout primitives. Each defines a structural shape, a set of valid `position` values, and the CSS recipe below. **Recipes target `.slot-zone--{position}` wrappers, not slot classes** — slot class names are brand-controlled and shouldn't appear in pattern CSS.

A slide type binds to one primitive (declared in `slide_types_enabled.{T}.pattern`). Inside each zone, slots flow in the order declared in `slots[]` for that position, separated by the zone's `gap`.

### `vertical_3_stack`

**Positions:** `top`, `middle`, `bottom`

**Shape:** centered vertical column. Top zone pins to top of content area, bottom zone pins to bottom, middle zone fills the remaining space. Powered by `margin-top: auto` on the wrappers.

```css
.slide--{type-key} .slot-zone--top {
  margin-top: auto;
  margin-bottom: 6%;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2%;
}
.slide--{type-key} .slot-zone--middle {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4%;
}
.slide--{type-key} .slot-zone--bottom {
  margin-top: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2%;
}
```

Empty zones still take a div and the auto-margins still apply, so a slide with only top + middle (no bottom slots) keeps the zones distributed correctly without a spacer.

**Used by (canonical defaults):** `static_text_only`, `captioned_image`, `pull_quote`, `big_number`, `numbered_list`.

### `grid_2col`

**Positions:** `top`, `left`, `right`, `bottom`

**Shape:** header on top, two equal columns in the middle, optional footer on bottom. Used for paired comparisons or any layout where visual symmetry IS the message.

```css
.slide--{type-key} {
  padding: 14% 10%;
  display: grid;
  grid-template-rows: auto 1fr auto;
  grid-template-columns: 1fr 1fr;
  gap: 4%;
  align-items: center;
}
.slide--{type-key} .slot-zone--top,
.slide--{type-key} .slot-zone--bottom {
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2%;
  text-align: center;
}
.slide--{type-key} .slot-zone--left,
.slide--{type-key} .slot-zone--right {
  display: flex;
  flex-direction: column;
  gap: 2%;
}
.slide--{type-key} .slot-zone--left  { grid-column: 1; }
.slide--{type-key} .slot-zone--right { grid-column: 2; }
```

**Used by (canonical defaults):** `side_by_side_comparison`. Brands may also bind `captioned_image` to this primitive for an image-on-left, caption-on-right layout.

### `full_bleed_corner`

**Positions:** `full`, `corner`

**Shape:** image (or other media) fills the entire 1080×1350 canvas; optional small annotation pinned to a corner with a semi-transparent background pill for legibility.

```css
.slide--{type-key} {
  padding: 0;
  position: relative;
  overflow: hidden;
}
.slide--{type-key} .slot-zone--full {
  position: absolute;
  inset: 0;
}
.slide--{type-key} .slot-zone--full > img,
.slide--{type-key} .slot-zone--full > picture {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.slide--{type-key} .slot-zone--corner {
  position: absolute;
  bottom: 6%;
  left: 6%;
  z-index: 2;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
.slide--{type-key} .slot-zone--corner > * {
  background: rgba(0, 0, 0, 0.6);
  color: var(--white);
  padding: 0.5em 1em;
  border-radius: 6px;
}
```

**Used by (canonical defaults):** `full_frame_image`.

### `z_stacked`

**Positions:** `background`, `foreground`

**Shape:** image as background z-layer + text content as foreground z-layer with a CSS scrim (gradient overlay) between them for legibility.

```css
.slide--{type-key} {
  position: relative;
  color: var(--white);
}
.slide--{type-key} .slot-zone--background {
  position: absolute;
  inset: 0;
  z-index: 0;
}
.slide--{type-key} .slot-zone--background > img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
.slide--{type-key} .slot-zone--background::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5));
}
.slide--{type-key} .slot-zone--foreground {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.4);
}
```

**Used by (canonical defaults):** `text_over_image`.

---

## Slot field → CSS mapping

Slots in `.carousel.md` declare CSS via shorthand fields. Substitute them into the type's CSS rules at generation time:

| Slot field | CSS rule | Example value → emitted CSS |
|---|---|---|
| `typography_role: <role>` | `font-family` + `font-size` + `font-weight` + `letter-spacing` + `text-transform` from `layout.typography.{role}` | `typography_role: headline` → headline font/size/weight applied |
| `aspect` | `aspect-ratio: <value>` | `aspect: "4/3"` → `aspect-ratio: 4 / 3` |
| `radius` | `border-radius: <value>` | `radius: 12px` → `border-radius: 12px` |
| `border` | `border: <value>` | `border: "1px solid rgba(255,255,255,0.12)"` → emitted verbatim |
| `shadow` | `box-shadow: <value>` | `shadow: "0 2px 8px rgba(0,0,0,0.15)"` → emitted verbatim |
| `fit` | `object-fit: <value>` (for `<img>`) or `background-size: <value>` (for primitive backgrounds) | `fit: cover` |
| `scrim` | overlay for `z_stacked` background | `scrim: "linear-gradient(...)"` → composited with image in `background-image` |
| `font_style` | `font-style: <value>` | `font_style: italic` |
| `opacity` | `opacity: <value>` | `opacity: 0.7` |
| `size_multiplier` | scales `typography_role`'s size by N | `size_multiplier: 1.7` → font-size is 1.7× the typography role's size |
| `color_override` | `color: <value>` (overrides theme cascade) | `color_override: "var(--white)"` or `"theme.emphasis"` (resolves to current theme's emphasis color) |
| `max_words` | content-side constraint, no CSS emitted | enforced at copy generation |
| `max_width` | `max-width: <value>` | `max_width: "80%"` |
| `optional` | `true`/`false`, not emitted as CSS | tells the build to omit the slot's HTML if no content |
| `variants` | enumerates allowed sub-elements for the slot (used by `static_text_only` bottom slot) | see "Bottom Element Variants" below |
| `item_count` | content-side constraint for list-style slots | enforced at copy generation |

When a slot field isn't listed above, treat it as documentation only — no CSS is emitted.

---

## Emphasis Pattern

Resolve `layout.emphasis.style` from `.carousel.md`. Emphasis colors live on each theme (`theme.emphasis`), not in a separate lookup.

**Emphasis is earned, not required.** Only wrap a word or phrase in `<em>` when it is the *payload* of the sentence — a specific number, proper noun, twist word, or claim that lands differently without the emphasis.

**The earned test:** remove the `<em>`. If the sentence still works the same way, drop it. If the sentence loses its punch, keep it.

**Distribution across a 6-slide carousel:**
- **Hook slide (slide 1)** — almost always earns emphasis. The twist word is the payload.
- **Proof / reveal / stat slides** — usually earn emphasis. The specific number, name, or term is the payload.
- **Argument slides** — usually do NOT earn emphasis. The whole sentence is the point; italicizing a phrase inside it dilutes the argument.
- **CTA slide** — earns emphasis only when a specific action word or keyword is the payload (e.g. a comment keyword). Share prompts often don't need it.
- **Expected count:** 2–4 slides with emphasis out of 6. Never zero (hook earns at least one); never all six (the pattern becomes decoration and loses its meaning).

If you find yourself adding `<em>` just because a slide "looks bare" without it, that's the AI-slop signal — drop it.

**Write `<em>` with no class.** Let CSS cascade from the parent `.slide--{role}` do the work:

```css
/* Generated per theme/role */
.slide--anchor em { /* applies theme.anchor.emphasis */ }
.slide--body em   { /* applies theme.body.emphasis */ }
.slide--alt em    { /* applies theme.alt.emphasis */ }
```

How `theme.emphasis` is applied depends on `layout.emphasis.style`:

| Style | How `theme.emphasis` is used | CSS shape |
|---|---|---|
| `italic` (default) | text color | `font-style: italic; color: {theme.emphasis}` |
| `bold` | text color | `font-weight: 700; color: {theme.emphasis}` |
| `italic-underline` | text color | `font-style: italic; text-decoration: underline; color: {theme.emphasis}` |
| `highlight` | background (highlighter effect) | `background: {theme.emphasis}; padding: 0.05em 0.2em; box-decoration-break: clone` |
| `italic+highlight` | structured `{text, bg}` on each theme | italic text on highlight |

For `italic+highlight`, each theme's `emphasis` becomes an object: `emphasis: { text: "{design.white}", bg: "{design.primary_dark}" }`.

**Output in all cases:** `<em>key words</em>` — no class, no inline style. The theme class on the parent slide resolves everything.

---

## Bottom Element Variants (Static Text Only)

**Scope:** this section applies only to slides typed `static_text_only`. Other slide types have their own bottom slot defined per-type in `references/slide-types.md`:
- `captioned_image` → caption text
- `full_frame_image` → optional corner caption
- `pull_quote` → attribution
- `big_number` → context line
- `numbered_list` → optional context line
- `side_by_side_comparison` → verdict line
- `text_over_image` → no footer

For Static Text Only slides, resolve `layout.bottom_variants` from `.carousel.md`. The allowed components for the bottom zone (default: `stat`, `list`, `pill`, `bullets`). The skill picks one per slide based on content + selected action:

- **Stat text** — `<p class="slide-stat">…</p>`
- **List (struck-through)** — `<div class="tool-list"><span class="tool-item">…</span></div>`
- **CTA pill** — `<a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>`
- **Bullet points** — body font, stacked with small gap, color from `layout.themes[theme].bottom_text`
