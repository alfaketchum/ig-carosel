# Slide Types

The vocabulary of slide layouts the skill can produce. Each type is a distinct structural shape with its own zones, typography hierarchy, and image treatment. A brand declares which types it allows in `.carousel.md` (`slide_types_enabled`); the skill picks the right type per slide from that set based on the content and the narrative role.

> **Naming convention:** display names use Title Case ("Static Text Only"); YAML keys use snake_case (`static_text_only`). The skill outputs `.slide--{type-key}` CSS classes — e.g. `.slide--captioned-image` (note: dashes, not underscores, for CSS).

> **Always implicit:** `static_text_only` is always enabled — it's the universal fallback when no other type fits. Brands declare which *additional* types to allow.

## Universal element names

Each slide type has **elements** (named content slots) placed in **zones** (positions on the canvas). Where the layout supports a vertical 3-stack — which is most types — the element names are universal:

| Element | Default zone | What goes here |
|---|---|---|
| `header` | top | Small uppercase label / contextual tag (or, for Pull Quote, a decorative quote mark) |
| `body` | middle | The main content — text, image, big number, or quoted text. Whatever the type's defining element is. |
| `footer` | bottom | Stat / caption / context line / attribution / CTA pill |

Two types break this pattern with type-specific element names because their spatial structure isn't a vertical stack:

- **Side-by-Side Comparison** uses `header / body_left / body_right / footer` (4 elements; body splits into 2 cells)
- **Text Over Image** uses `image / body` (2 elements on z-stacked layers; no top/bottom split)
- **Full-Frame Image** uses `image / footer` (1 full-bleed element + 1 optional corner)

Within element specs below, the **Zone** column tells you where the element sits; the **Content** column tells you what kind of content the element holds.

## How the skill picks a type per slide

Two layers of decision:

1. **Brand declares which types are *enabled*** (`slide_types_enabled` in `.carousel.md`) — the constraint.
2. **Brand declares the *strategy*** (`slide_type_strategy`) — how the skill picks WITHIN a single carousel from the enabled set.

### Strategy modes

| Mode | What the skill does | When to use |
|---|---|---|
| **`uniform`** (default) | All slides in a single carousel use the same type. Skill picks one type per carousel based on dominant content signals. | Editorial brands, testimonial roundups, brands that want strong structural rhythm. The Looplinq founder-contrast carousel is implicitly uniform (all `static_text_only`). |
| **`mixed`** | Each slide picks its own type independently from the enabled set, based on content. Cascade applies (see below). | Storytelling brands where layout variety serves the narrative. |
| **`element_locked`** | Specific type per theme role. Brand declares `slide_type_element_map: { anchor: X, body: Y, alt: Z }`. | Brands wanting predictable rhythm — anchor always one shape, body always another. |

### The cascade (when strategy is `mixed`)

```
Brand .carousel.md   →  enables  [static_text_only, captioned_image, big_number]
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

## The 8 Types

### 1. Static Text Only (`static_text_only`)

**Layout pattern:** vertical 3-stack.

**Zones:**
```
┌──────────────────────────┐
│                          │
│        TOP               │  ← header element
│                          │
│        MIDDLE            │  ← body element
│                          │
│        BOTTOM            │  ← footer element
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | uppercase label | yes | `.slide-label` | Inherits `layout.typography.label` |
| `body` | middle | text headline | yes | `.slide-headline` | Inherits `layout.typography.headline`. 1-3 words may use `<em>` |
| `footer` | bottom | stat / list / pill / bullets | yes | `.slide-stat` etc. | Picks from `layout.bottom_variants` based on content |

**When to pick:** hooks, narrative middle slides, CTAs. The default shape; if no other type fits, this one does. Always enabled.

**Image role:** none.

**Existing CSS:** see `SKILL.md` Step 5 — this is the shape the skill ships today.

---

### 2. Captioned Image (`captioned_image`)

**Layout pattern:** vertical 3-stack (body slot is an image instead of headline text).

**Zones:**
```
┌──────────────────────────┐
│        TOP               │  ← header element
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │      MIDDLE        │  │  ← body element (image)
│  │                    │  │
│  └────────────────────┘  │
│                          │
│        BOTTOM            │  ← footer element (caption)
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | uppercase label | yes | `.slide-label` | Same as Static Text Only's header |
| `body` | middle | image | yes | `.slide-image` | Default 4:3 aspect, rounded corners, `object-fit: cover` |
| `footer` | bottom | text caption (1-2 sentences) | yes | `.slide-caption` | Sans body type; explains what the reader is looking at |

**When to pick:** content references a specific visual artifact (screenshot, photo, chart) AND the visual is *supporting* the argument, not the argument itself. Caption explains what the reader is looking at.

**Image role:** body-zone, framed (rounded corners, optional border). NOT full-bleed.

**Source requirements:** brand provides image path or URL via `slide.image` or per-prompt override. No AI-generation in Phase 1.

**CSS skeleton (to implement):**
```css
.slide--captioned-image .slide-image {
  width: 100%;
  aspect-ratio: 4 / 3;          /* or 16/9 — brand override */
  object-fit: cover;
  border-radius: 12px;
}
.slide--captioned-image .slide-caption {
  font-family: var(--font-body);
  font-size: clamp(14px, 3vw, 32px);
  margin-top: 4%;
}
```

---

### 3. Full-Frame Image (`full_frame_image`)

**Layout pattern:** full-bleed + corner overlay.

**Zones:**
```
┌──────────────────────────┐
│                          │
│                          │
│         FULL             │  ← image element (entire canvas)
│       (full bleed)       │
│                          │
│                          │
│  ┌─────────┐             │
│  │ CORNER  │             │  ← footer element (optional, pinned)
│  └─────────┘             │
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `image` | full | image | yes | `.slide-image` (background) | Fills entire 1080×1350 canvas. `object-fit: cover` |
| `footer` | corner | text caption (5-10 words) | no | `.slide-caption` | Optional. Pinned to bottom-left or bottom-right with semi-transparent pill background for legibility |

**Note on element names:** this type doesn't have a `header` or `body` slot — the image *is* the content. The optional caption uses `footer` for naming consistency with other types (it's the closer/annotation), even though it sits in a corner rather than a bottom band.

**When to pick:** the visual IS the message. Product demos. Hero shots. Before/after where the photo carries the argument with no annotation needed.

**Image role:** full-bleed. Image is the slide. Optional caption sits in a corner (semi-transparent pill background for legibility).

**Source requirements:** brand-provided image, must be 1080×1350 or wider/taller for crop.

**Difference from Captioned Image:** Captioned Image gives the visual a frame and balances it with prominent caption text. Full-Frame Image is image-dominant — the caption (if any) is a small corner annotation.

**CSS skeleton:**
```css
.slide--full-frame-image {
  padding: 0;                    /* override the slide default padding */
  background-image: var(--slide-image);
  background-size: cover;
  background-position: center;
  position: relative;
}
.slide--full-frame-image .slide-caption {
  position: absolute;
  bottom: 6%;
  left: 6%;
  background: rgba(0,0,0,0.6);
  color: var(--white);
  padding: 0.5em 1em;
  border-radius: 6px;
}
```

---

### 4. Text Over Image (`text_over_image`)

**Layout pattern:** z-stacked layers (image background + foreground text).

**Zones:**
```
┌──────────────────────────┐
│                          │
│   ╔══════════════════╗   │
│   ║   BACKGROUND     ║   │  ← image element (z-layer below)
│   ║                  ║   │
│   ║   FOREGROUND     ║   │  ← body element (z-layer above, with scrim)
│   ║                  ║   │
│   ╚══════════════════╝   │
│                          │
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `image` | background | image | yes | `.slide-image` (z-layer below) | Full-bleed. CSS scrim (gradient or color overlay) is mandatory for legibility |
| `body` | foreground | text headline | yes | `.slide-headline` (z-layer above) | Large serif, white text, optional `text-shadow` for additional legibility |

**Note on element names:** this type doesn't have `header` or `footer` — the image is the visual context, the body is the message. Optional small label or attribution can be added to the foreground but isn't part of the canonical spec.

**When to pick:** editorial covers, mood/tone slides, hooks where the imagery sets emotional context for the headline. The image gives feeling; the text gives meaning.

**Image role:** full-bleed background, with a CSS scrim (linear gradient or color overlay) for text legibility.

**Source requirements:** brand-provided image. The skill must apply a scrim — never overlay text on a raw photo without one.

**Critical detail:** legibility is brittle. A dark scrim on a bright photo, or a light scrim on a dark photo, is mandatory. Brands choosing this type should commit to an art-direction discipline (consistent scrim treatment across slides). **Build last** in the phase plan — most CSS-fiddly type.

**CSS skeleton:**
```css
.slide--text-over-image {
  background-image:
    linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)),
    var(--slide-image);
  background-size: cover;
  color: var(--white);
}
.slide--text-over-image .slide-headline {
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0,0,0,0.4);
}
```

---

### 5. Pull Quote (`pull_quote`)

**Layout pattern:** vertical 3-stack (header is decorative quote-mark instead of label).

**Zones:**
```
┌──────────────────────────┐
│                          │
│         TOP              │  ← header element (decorative quote-mark)
│                          │
│        MIDDLE            │  ← body element (italic quoted text)
│                          │
│                          │
│        BOTTOM            │  ← footer element (attribution)
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | decorative quote-mark `"` | yes | `.slide-quote-mark` | Huge serif, theme.emphasis color. NOT a label here — the visual punctuation marks this as a quote |
| `body` | middle | quoted text | yes | `.slide-quote-text` | Large serif, italic by convention. Differs from skill's "italics = emphasis only" rule — entire quote is italic |
| `footer` | bottom | attribution (`— Name, Title`) | yes | `.slide-quote-attribution` | Small sans body, lower opacity. Optional small avatar to the left |

**When to pick:** testimonials, statements from named people, direct quotes from articles or interviews. Anywhere the *who said it* matters as much as *what they said*.

**Image role:** none (the quote is the visual). Optional small avatar in the attribution zone if the brand wants it.

**Why italics here**: Pull-quote convention is italic body. Differs from the skill's normal "italics = emphasis only" rule because the entire quoted text is italic by convention.

**CSS skeleton:**
```css
.slide--pull-quote .slide-quote-mark {
  font-family: var(--font-headline);
  font-size: 6em;
  line-height: 0.8;
  color: var(--primary);
  margin-bottom: 4%;
}
.slide--pull-quote .slide-quote-text {
  font-family: var(--font-headline);
  font-style: italic;
  font-size: clamp(28px, 6.5vw, 84px);
  line-height: 1.25;
}
.slide--pull-quote .slide-quote-attribution {
  font-family: var(--font-body);
  font-size: clamp(14px, 2.8vw, 28px);
  margin-top: 6%;
  opacity: 0.7;
}
```

---

### 6. Big Number (`big_number`)

**Layout pattern:** vertical 3-stack (body is a huge statistic).

**Zones:**
```
┌──────────────────────────┐
│       TOP                │  ← header element
│                          │
│                          │
│       MIDDLE             │  ← body element (huge stat)
│                          │
│                          │
│       BOTTOM             │  ← footer element (context line)
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | uppercase label | yes | `.slide-label` | Same as Static Text Only's header |
| `body` | middle | a single stat / number / percentage | yes | `.slide-big-number` | Huge serif, ~1.5-2× the brand's standard headline size. Color from `theme.emphasis` |
| `footer` | bottom | context line (1-2 sentences) | yes | `.slide-context` | Sans body, ~70-80% width. Anchors the number with what it means |

**When to pick:** data slides, results, single-stat reveals. The number is the punch; the context anchors it. One number per slide — never two.

**Image role:** none.

**Typography rule:** the number itself is roughly **1.5–2× the headline size** of the brand's standard scale. It needs to dominate.

**CSS skeleton:**
```css
.slide--big-number .slide-big-number {
  font-family: var(--font-headline);
  font-size: clamp(64px, 16vw, 200px);
  line-height: 1;
  font-weight: 400;
  color: var(--primary);          /* or theme.emphasis */
}
.slide--big-number .slide-context {
  font-family: var(--font-body);
  font-size: clamp(16px, 3.6vw, 40px);
  margin-top: 8%;
  max-width: 80%;
}
```

---

### 7. Side-by-Side Comparison (`side_by_side_comparison`)

**Layout pattern:** grid (top + middle-split + bottom).

**Zones:**
```
┌──────────────────────────┐
│         TOP              │  ← header element
│                          │
│   ┌─────────┬─────────┐  │
│   │         │         │  │
│   │ MIDDLE  │ MIDDLE  │  │  ← body_left + body_right (2 cells)
│   │  LEFT   │ RIGHT   │  │
│   │         │         │  │
│   └─────────┴─────────┘  │
│                          │
│        BOTTOM            │  ← footer element (verdict, optional)
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | uppercase label | yes | `.slide-label` | Same as Static Text Only's header |
| `body_left` | middle-left | text and/or image | yes | `.slide-compare-a` | The "A" side. Can hold text-only, image-only, or text+image |
| `body_right` | middle-right | text and/or image | yes | `.slide-compare-b` | The "B" side. Must be structurally symmetric to `body_left` |
| `footer` | bottom | verdict / takeaway line | no | `.slide-verdict` | Optional. Sans body, often the punchline of the comparison |

**Note on element names:** breaks the `header / body / footer` triplet because the body is split into 2 cells. Names are `body_left` and `body_right` to keep the body-prefix consistent.

**When to pick:** Founder Contrast carousels (Creator A vs Creator B), before/after pairs, this-vs-that arguments. Anywhere the structural pairing IS the message.

**Image role:** optional. Each side can be text-only, image-only, or text+image. Brand declares per-slide if both sides take images.

**Critical detail:** A and B must be visually **symmetric**. Same column widths, same vertical alignment, same internal type scale. Any asymmetry suggests one side is favored — kills the "let the reader pick" effect.

**CSS skeleton:**
```css
.slide--side-by-side-comparison .slide-compare-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4%;
  width: 100%;
  flex: 1;
}
.slide--side-by-side-comparison .slide-compare-a,
.slide--side-by-side-comparison .slide-compare-b {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 6%;
  border-radius: 8px;
}
.slide--side-by-side-comparison .slide-verdict {
  margin-top: 6%;
  font-family: var(--font-body);
  font-weight: 600;
}
```

---

### 8. Numbered List (`numbered_list`)

**Layout pattern:** vertical 3-stack (body is a stack of numbered items).

**Zones:**
```
┌──────────────────────────┐
│        TOP               │  ← header element
│                          │
│   ① First item           │
│   ② Second item          │  ← body element (stack of 3-5 items)
│   ③ Third item           │
│   ④ Fourth item          │
│                          │
│        BOTTOM            │  ← footer element (optional context)
└──────────────────────────┘
```

**Elements:**

| Element | Zone | Content | Required | CSS class | Notes |
|---|---|---|---|---|---|
| `header` | top | uppercase label | yes | `.slide-label` | Same as Static Text Only's header |
| `body` | middle | 3-5 numbered items | yes | `.slide-list-item` (each) | Each item is `[number, text]` pair. Number uses headline serif color (`theme.emphasis`); text uses body sans |
| `footer` | bottom | context line | no | `.slide-context` | Optional. Sans body, anchors what the list is for |

**When to pick:** listicle slides where the sequence matters (top 5, ranked items, ordered steps). One slide can hold 3-5 items; for more, break into multiple Numbered List slides or use multiple Static Text Only slides with one item each.

**Image role:** none.

**Difference from `bullets` (a Static Text Only bottom variant):** bullets are unordered and live in the bottom zone of a Static Text slide. Numbered List is the ENTIRE slide — the items are the message, not a supporting accent.

**CSS skeleton:**
```css
.slide--numbered-list .slide-list-item {
  display: flex;
  align-items: baseline;
  gap: 0.8em;
  margin-bottom: 4%;
  font-family: var(--font-body);
  font-size: clamp(20px, 4.5vw, 56px);
  text-align: left;
}
.slide--numbered-list .slide-list-number {
  font-family: var(--font-headline);
  color: var(--primary);
  font-size: 1.2em;
  flex-shrink: 0;
}
```

---

## Authoring rules

These apply to whichever type the skill picks per slide:

1. **Always include `static_text_only`** in any brand's enabled set. It's the universal fallback.
2. **Type is per-slide, not per-carousel.** A single carousel can mix Static Text Only / Captioned Image / Pull Quote slides freely as long as all those types are enabled for the brand.
3. **Type-class on the slide div.** Generated HTML uses `<div class="slide slide--{role} slide--{type}">` — both role and type classes. The role drives colors; the type drives layout.
4. **Themes still apply.** Every type respects the brand's `anchor` / `body` / `alt` theme colors. A `pull_quote` slide can be on the dark `body` theme.
5. **Per-type emphasis behavior.** Most types use `<em>` the standard way (italic on payload words). Pull Quote is the exception — entire quote text is italic by convention; emphasis inside it falls back to bold or underline.
6. **Image sources are brand-provided in Phase 1.** `.carousel.md` may declare `images.sources: [user]` (default). AI generation, local libraries, and other sources come in Phase 2+.

## Build phasing (from `handoffs/image-generation.md`)

When Phase 1a starts:
- **Phase 1a:** `static_text_only` (codify schema), `captioned_image`, `full_frame_image`. ~half-day.
- **Phase 1b:** `pull_quote`, `big_number`. Text-only, no image pipeline. ~half-day.
- **Phase 2:** `side_by_side_comparison`, `numbered_list`. ~half-day each.
- **Phase 3:** `text_over_image`. Most CSS-fiddly; legibility on top of arbitrary photos. Last.
