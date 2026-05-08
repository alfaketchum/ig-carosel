# Slide Types

A "slide type" in this skill is just **a primitive + a slot list, given a name**. The 8 types listed below are *presets* — starting configurations brands can paste into `.carousel.md` and edit. They're not architecturally special; the skill's load-bearing concepts are the four layout **primitives** and the **slot system**, not the named types.

A brand declares which types it allows in `.carousel.md` (`slide_types_enabled`) — an object map of `{type-key → {pattern, slots}}`. The skill picks the right type per slide from that set based on content signals and the chosen strategy (`slide_type_strategy`).

> **Naming convention:** display names use Title Case ("Captioned Image"); YAML keys use snake_case (`captioned_image`); CSS classes use kebab-case (`.slide--captioned-image`).

> **Always implicit:** `static_text_only` is always enabled — universal fallback when no other type fits. Brands declare which *additional* types to allow.

> **Compose your own.** Brands aren't limited to the 8 presets. Any combination of `{primitive + slot list + name}` is a valid slide type. Want a `cover_quote` (z_stacked + image background + serif quote foreground)? Define it in your `.carousel.md` with that key — the skill renders it the same way it renders any preset. The presets exist as proven starting points, not as a closed taxonomy.

## Layout Primitives

The skill ships four layout primitives. Each defines a structural shape and a set of valid `position` values. A slide type binds to a primitive — by default in this doc, or by brand override in `.carousel.md`.

> **CSS recipes for each primitive live in `references/slide-build.md` → "Per-Pattern CSS Recipes."** Load that doc when you're rendering. Below is the descriptor only — positions + shape + used-by.

| Primitive | Positions | Shape (one-liner) | Used by (canonical defaults) |
|---|---|---|---|
| `vertical_3_stack` | `top`, `middle`, `bottom` | centered vertical column; `margin-top: auto` magic pins top + bottom | `static_text_only`, `captioned_image`, `pull_quote`, `big_number`, `numbered_list` |
| `grid_2col` | `top`, `left`, `right`, `bottom` | header on top, two equal columns in middle, optional footer | `side_by_side_comparison` (brands may also bind `captioned_image` here) |
| `full_bleed_corner` | `full`, `corner` | image fills the canvas; optional corner annotation with semi-transparent pill | `full_frame_image` |
| `z_stacked` | `background`, `foreground` | image background z-layer + text foreground z-layer with mandatory CSS scrim | `text_over_image` |

Brands cannot invent new primitives — only bind enabled types to one of the four above.

---

## How the skill picks a type per slide

Two layers of decision:

1. **Brand declares which types are *enabled*** (`slide_types_enabled` in `.carousel.md`) — the constraint.
2. **Brand declares the *strategy*** (`slide_type_strategy`) — how the skill picks WITHIN a single carousel from the enabled set.

### Strategy modes

| Mode | What the skill does | When to use |
|---|---|---|
| **`uniform`** (default) | All slides in a single carousel use the same type. Skill picks one type per carousel based on dominant content signals. | Editorial brands, brands that want strong structural rhythm. The Looplinq founder-contrast carousel is uniform `static_text_only`. |
| **`mixed`** | Each slide picks its own type independently from the enabled set, based on content. Cascade applies (see below). | Storytelling brands where layout variety serves the narrative. |
| **`element_locked`** | Specific type per theme role. Brand declares `slide_type_element_map: { anchor: X, body: Y, alt: Z }`. | Brands wanting predictable rhythm — anchor always one shape, body always another. |

### The cascade (when strategy is `mixed`)

```
Brand .carousel.md   →  enables  {static_text_only, captioned_image, big_number}
                          ↓ constrains
Narrative arc role   →  "slide 4 is a body slide"
                          ↓ informs
Content signal       →  copy mentions a specific stat → big_number
                          ↓ overridden by
User prompt          →  optional per-slide override
```

If no signal favors a richer type, fall back to `static_text_only`.

### User per-carousel override

Regardless of brand strategy, the user can override at prompt time:
- `--uniform pull_quote` — force all slides this type for one carousel
- `--mixed` — let the skill pick per slide (overrides brand uniform default)
- per-slide override: `slide 3 → big_number`

---

## Preset Library

The 8 entries below are **starting points** — proven `{primitive + slots}` combinations a brand can paste into `.carousel.md` under `slide_types_enabled.{type-key}` and edit. They are not architectural constraints. A brand can:

- Use a preset as-is (paste, no edits)
- Use a preset and edit slot fields (typography role, size multiplier, max_words, etc.)
- **Swap the pattern** (e.g. rebind `captioned_image` from `vertical_3_stack` to `grid_2col` for image-on-left, caption-on-right)
- **Add slots within a position** (e.g. add a kicker above the headline; add a CTA pill below the stat — the slot zone stacks them automatically; see `references/slide-build.md` "Slot zones")
- **Compose a new type from scratch** (pick a primitive, list slots, give it a key — no skill changes needed)

The names below are conventional, not reserved. Rename `static_text_only` → `text_card` if that fits your mental model better. The skill reads whatever keys exist in `slide_types_enabled`.

### 1. Static Text Only (`static_text_only`)

```yaml
static_text_only:
  pattern: vertical_3_stack
  slots:
    - { class: slide-label,    position: top,    type: label,    typography_role: label }
    - { class: slide-headline, position: middle, type: headline, typography_role: headline, max_words: 25, emphasis: earned }
    - { class: slide-bottom,   position: bottom, type: bottom,   variants: [stat, list, pill, bullets] }
```

**When to pick:** hooks, narrative middle slides, CTAs. The default shape — universal fallback when no other type fits.

**Image role:** none.

---

### 2. Captioned Image (`captioned_image`)

```yaml
captioned_image:
  pattern: vertical_3_stack
  slots:
    - { class: slide-header, position: top,    type: text,  typography_role: headline, size_multiplier: 0.55, max_words: 14, emphasis: earned }
    - { class: slide-image,  position: middle, type: image, aspect: "4/3", radius: 12px, shadow: "0 4px 16px rgba(0,0,0,0.18)" }
    - { class: slide-footer, position: bottom, type: text,  typography_role: body,     size_multiplier: 0.65, max_words: 8,  emphasis: earned }
```

**When to pick:** content references a specific visual artifact (photo, scene, screenshot) AND the visual is the focal element. The image carries the story; the header is a sentence-shaped frame that lands the message, the footer is a small forward-pointing teaser to the next slide.

**Typography hierarchy (intentional inversion vs. `static_text_only`):**
- `slide-header` uses the **headline role at 0.55× size** — serif, sentence case, no letter-spacing. Reads as a sentence, not a tag. Bigger than a `label` would be; smaller than a `static_text_only` headline so it doesn't compete with the image.
- `slide-footer` uses the **body role at 0.65× size** — small, subordinate. Lives at the bottom as a curiosity-prompt or arrow into the next slide ("More on why →"), not as an explanation of what's in the image.

**Image role:** body-zone, framed (rounded corners + drop shadow). NOT full-bleed. **No border by default** — drop shadow is theme-agnostic; explicit borders require theme-aware color logic to read on dark + light backgrounds, which adds config surface for marginal value. Brands that want a visible frame can add `border: "..."` to the image slot.

**Why `slide-header` / `slide-footer`, not `slide-label` / `slide-caption`.** In `static_text_only` the headline is the message and the label is a categorizing tag (`THE TRUTH`, `STEP 3`). In `captioned_image` the *image* is the message — the surrounding text frames it (header) and lands it (footer). The class names encode the writer's intent: `header` is a curiosity-setup leading into the image; `footer` is a closer that creates curiosity in reverse — the image asks a question, the footer plants the seed. Neither slot should explain what's in the image; that's the AI-slop trap of "captions."

**Image source.** The user supplies the image path or URL. Two mechanisms — both checked by the skill, in this order:
1. **Per-prompt:** user includes `slide N image: ./path/to/file.png` (or a URL) in the carousel prompt.
2. **Filename convention:** if a file named `slide-NN-source.{png,jpg,jpeg,webp}` exists in the carousel folder before generation, the skill picks it up automatically.

If neither is provided for a slide that resolves to `captioned_image`, the skill falls back to `static_text_only` for that slide and warns the user.

**Copy rules — header.**
- Max 14 words; target 8–12. Header is the *sentence* of the slide — what the image makes you think or feel, not what it depicts.
- Sentence case. No tags, no labels. ("I haven't stopped thinking about this for *six months.*" — not "TRAVEL #4.")
- Earned emphasis applies. Most headers have one payload phrase that lands harder italicized.

**Copy rules — footer.**
- Max 8 words; target 4–6. Footer is small, subordinate, forward-pointing. A curiosity-bridge to the next slide.
- Often arrow-terminated ("Why I keep going back →", "Here's what surprised me →") to telegraph "swipe."
- Earned emphasis is rare here — the small size means italic styling is barely visible. Save emphasis for the header.
- **Do not explain what's in the image.** The image and the header have already done that work.

**There is no headline slot.** The image carries the message that a headline would carry in `static_text_only`. If a slide truly needs a full prose headline, use `static_text_only` and put the image elsewhere — or pick a different type entirely.

**Theme treatment.** The default `border` and `shadow` apply on every theme — keeps screenshots from disappearing on `alt` (white) backgrounds and adds a subtle frame on `body` (dark). Brands can override per their visual system.

**CSS:** the type's CSS is generated by substituting slot fields (`aspect`, `radius`, `border`, `shadow`) into the layout primitive's recipe. See `references/slide-build.md` → "Per-Pattern CSS Recipes" + "Slot field → CSS mapping."

---

### 3. Full-Frame Image (`full_frame_image`)

```yaml
full_frame_image:
  pattern: full_bleed_corner
  slots:
    - { class: slide-image,   position: full,   type: image, fit: cover }
    - { class: slide-caption, position: corner, type: text,  typography_role: body, max_words: 8, optional: true }
```

**When to pick:** the visual IS the message. Hero shots, product demos, before/after where the photo carries the argument with no annotation needed.

**Image role:** full-bleed. Optional small corner caption with semi-transparent pill background.

**Image source.** Same as `captioned_image` — per-prompt OR filename convention. Image must be 1080×1350 or wider/taller for crop.

**Difference from `captioned_image`:** `captioned_image` gives the visual a frame and balances it with prominent caption text. `full_frame_image` is image-dominant — the caption (if any) is a small corner annotation.

---

### 4. Text Over Image (`text_over_image`)

```yaml
text_over_image:
  pattern: z_stacked
  slots:
    - { class: slide-image,    position: background, type: image,    fit: cover, scrim: "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5))" }
    - { class: slide-headline, position: foreground, type: headline, typography_role: headline, max_words: 22, emphasis: earned, color_override: "var(--white)" }
```

**When to pick:** editorial covers, mood/tone slides, hooks where the imagery sets emotional context for the headline. The image gives feeling; the text gives meaning.

**Image role:** full-bleed background, with a CSS scrim (linear gradient or color overlay) for text legibility.

**Source requirements:** brand-provided image. The skill always applies a scrim — never overlay text on a raw photo without one.

**Critical detail:** legibility is brittle. A dark scrim on a bright photo, or a light scrim on a dark photo, is mandatory. Brands choosing this type should commit to art-direction discipline (consistent scrim treatment across slides). **Build last** in the phase plan — most CSS-fiddly type.

---

### 5. Pull Quote (`pull_quote`)

```yaml
pull_quote:
  pattern: vertical_3_stack
  slots:
    - { class: slide-quote-mark,        position: top,    type: decorative,  content: '"', typography_role: headline, color_override: "theme.emphasis" }
    - { class: slide-quote-text,        position: middle, type: quote,       typography_role: headline, font_style: italic, max_words: 30 }
    - { class: slide-quote-attribution, position: bottom, type: attribution, typography_role: body, opacity: 0.7 }
```

**When to pick:** testimonials, statements from named people, direct quotes from articles or interviews. Anywhere the *who said it* matters as much as *what they said*.

**Image role:** none (the quote is the visual). Optional small avatar in the attribution zone if the brand wants it.

**Why italics here:** pull-quote convention is italic body. Differs from the skill's normal "italics = emphasis only" rule because the entire quoted text is italic by convention. Emphasis inside the quote falls back to bold or underline.

---

### 6. Big Number (`big_number`)

```yaml
big_number:
  pattern: vertical_3_stack
  slots:
    - { class: slide-label,      position: top,    type: label,  typography_role: label }
    - { class: slide-big-number, position: middle, type: number, typography_role: headline, size_multiplier: 1.7, color_override: "theme.emphasis" }
    - { class: slide-context,    position: bottom, type: text,   typography_role: body, max_width: "80%" }
```

**When to pick:** data slides, results, single-stat reveals. The number is the punch; the context anchors it. **One number per slide — never two.**

**Image role:** none.

**Typography rule:** the number itself is roughly **1.5–2× the headline size** of the brand's standard scale (driven by `size_multiplier`). It needs to dominate.

---

### 7. Side-by-Side Comparison (`side_by_side_comparison`)

```yaml
side_by_side_comparison:
  pattern: grid_2col
  slots:
    - { class: slide-label,     position: top,    type: label,   typography_role: label }
    - { class: slide-compare-a, position: left,   type: compare, allows: [text, image, "text+image"] }
    - { class: slide-compare-b, position: right,  type: compare, allows: [text, image, "text+image"] }
    - { class: slide-verdict,   position: bottom, type: text,    typography_role: body, optional: true }
```

**When to pick:** Founder Contrast carousels (Creator A vs Creator B), before/after pairs, this-vs-that arguments. Anywhere the structural pairing IS the message.

**Image role:** optional. Each side can be text-only, image-only, or text+image. Brand declares per-slide if both sides take images.

**Critical detail:** A and B must be visually **symmetric**. Same column widths, same vertical alignment, same internal type scale. Any asymmetry suggests one side is favored — kills the "let the reader pick" effect.

---

### 8. Numbered List (`numbered_list`)

```yaml
numbered_list:
  pattern: vertical_3_stack
  slots:
    - { class: slide-label,   position: top,    type: label, typography_role: label }
    - { class: slide-list,    position: middle, type: list,  item_count: "3-5", item_typography_role: list, number_typography_role: headline, number_color_override: "theme.emphasis" }
    - { class: slide-context, position: bottom, type: text,  typography_role: body, optional: true }
```

**When to pick:** listicle slides where the sequence matters (top 5, ranked items, ordered steps). One slide can hold 3–5 items; for more, break into multiple Numbered List slides or use multiple Static Text Only slides with one item each.

**Image role:** none.

**Difference from `bullets` (a `static_text_only` bottom variant):** bullets are unordered and live in the bottom zone of a Static Text slide. Numbered List is the ENTIRE slide — the items are the message, not a supporting accent.

---

## Authoring rules

These apply to whichever type the skill picks per slide:

1. **Always include a `static_text_only` (or equivalent)** in any brand's enabled set as a universal fallback. Implicit if not declared. The key can be renamed; what matters is that *some* type with simple text-only slots exists for cases where richer types don't fit.
2. **Type is per-slide, not per-carousel** (when strategy is `mixed`). A single carousel can mix any enabled types freely.
3. **Two classes on the slide div.** Generated HTML uses `<div class="slide slide--{role} slide--{type-key-with-dashes}">` — role drives colors; type drives layout.
4. **Themes still apply.** Every type respects the brand's `anchor` / `body` / `alt` theme colors. A `pull_quote` slide can be on the dark `body` theme.
5. **Per-type emphasis behavior.** Most types use `<em>` the standard way (italic on payload words). Pull Quote is the exception — entire quote text is italic by convention; emphasis inside falls back to bold or underline.
6. **Image sources are user-provided in Phase 1.** Per-prompt path/URL OR `slide-NN-source.{ext}` filename in the carousel folder. AI generation, local libraries: Phase 2+. See `references/image-sources.md`.
7. **Slot class names are brand-configurable.** The `class:` values in the presets above are recommendations. Brands can rename any class in their `.carousel.md` slot list — the skill reads the brand's slot config to know what to emit. CSS pattern recipes target zone wrappers (`.slot-zone--{position}`), not slot classes, so renames don't break layout.
8. **Multiple slots can share a position.** Stack a kicker above the headline, a stat + a pill in the bottom zone — list both slots with the same `position` value in `slots[]`; they'll stack inside the zone wrapper. See `references/slide-build.md` "Slot zones."
9. **Primitives are skill-shipped (today).** Currently 4 primitives exist; brands bind any number of types to them but can't write a new primitive directly. **Future:** `/steal-carousel` will extract new primitives by reverse-engineering observed carousels and propose them for vocabulary expansion (see `handoffs/steal-carousel.md`). When that ships, primitives become a growing set rather than a fixed one. Until then, force-fit novel layouts into existing primitives or flag the gap.

## Build phasing (from `handoffs/image-generation.md`)

When Phase 1a starts:
- **Phase 1a:** `static_text_only` (already shipped), `captioned_image`, `full_frame_image`. ~half-day.
- **Phase 1b:** `pull_quote`, `big_number`. Text-only, no image pipeline. ~half-day.
- **Phase 2:** `side_by_side_comparison`, `numbered_list`. ~half-day each.
- **Phase 3:** `text_over_image`. Most CSS-fiddly; legibility on top of arbitrary photos. Last.
