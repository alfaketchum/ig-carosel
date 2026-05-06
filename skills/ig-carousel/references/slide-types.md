# Slide Types

The vocabulary of slide layouts the skill can produce. Each type is a distinct structural shape with its own zones, typography hierarchy, and image treatment. A brand declares which types it allows in `.carousel.md` (`slide_types_enabled`); the skill picks the right type per slide from that set based on the content and the narrative role.

> **Naming convention:** display names use Title Case ("Static Text Only"); YAML keys use snake_case (`static_text_only`). The skill outputs `.slide--{type-key}` CSS classes — e.g. `.slide--captioned-image` (note: dashes, not underscores, for CSS).

> **Always implicit:** `static_text_only` is always enabled — it's the universal fallback when no other type fits. Brands declare which *additional* types to allow.

## How the skill picks a type per slide

Cascade (Approach E from `handoffs/image-generation.md`):

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

---

## The 8 Types

### 1. Static Text Only (`static_text_only`)

**Layout:** label / headline / bottom-stat (current default — every slide today).

**Zones:**
```
┌──────────────────────────┐
│                          │
│        LABEL             │  ← .slide-label (uppercase, small)
│                          │
│        HEADLINE          │  ← .slide-headline (large serif)
│                          │
│        BOTTOM            │  ← .slide-stat / list / pill / bullets
└──────────────────────────┘
```

**When to pick:** hooks, narrative middle slides, CTAs. The default shape; if no other type fits, this one does. Always enabled.

**Image role:** none.

**Existing CSS:** see `SKILL.md` Step 5 — this is the shape the skill ships today.

---

### 2. Captioned Image (`captioned_image`)

**Layout:** label / image / caption. Image sits in the body zone where the headline would normally go.

**Zones:**
```
┌──────────────────────────┐
│        LABEL             │
│                          │
│  ┌────────────────────┐  │
│  │                    │  │
│  │      IMAGE         │  │  ← .slide-image (4:3 or 16:9, rounded)
│  │                    │  │
│  └────────────────────┘  │
│                          │
│       CAPTION            │  ← .slide-caption (1-2 lines, sans body)
└──────────────────────────┘
```

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

**Layout:** image fills the canvas; minimal caption pinned to the bottom corner (or absent entirely).

**Zones:**
```
┌──────────────────────────┐
│                          │
│                          │
│        IMAGE             │  ← fills entire 1080×1350 canvas
│       (full bleed)       │
│                          │
│                          │
│  ┌─────────┐             │
│  │ caption │             │  ← optional, bottom-left or absent
│  └─────────┘             │
└──────────────────────────┘
```

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

**Layout:** image as background, headline overlaid on top with a darkening scrim for legibility.

**Zones:**
```
┌──────────────────────────┐
│                          │
│   ╔══════════════════╗   │
│   ║                  ║   │  ← image (full bleed)
│   ║   HEADLINE TEXT  ║   │  ← overlaid, large serif, white
│   ║                  ║   │
│   ╚══════════════════╝   │
│                          │
└──────────────────────────┘
```

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

**Layout:** large opening quote-mark / quoted text / attribution.

**Zones:**
```
┌──────────────────────────┐
│                          │
│         "                │  ← .slide-quote-mark (huge serif)
│                          │
│   "the quoted text       │  ← .slide-quote-text (large serif, italic)
│    in italic, centered"  │
│                          │
│   — Source Name          │  ← .slide-quote-attribution (small sans)
│      Source Title         │
└──────────────────────────┘
```

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

**Layout:** label / huge statistic / context line.

**Zones:**
```
┌──────────────────────────┐
│      LABEL               │
│                          │
│                          │
│        $42M              │  ← .slide-big-number (HUGE serif)
│                          │
│                          │
│   in 90 days from        │  ← .slide-context (sans, 1-2 lines)
│   one LinkedIn post.     │
└──────────────────────────┘
```

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

**Layout:** two columns with mirrored content (A vs B), often with a verdict line below.

**Zones:**
```
┌──────────────────────────┐
│      LABEL               │
│                          │
│   ┌─────────┬─────────┐  │
│   │         │         │  │
│   │    A    │    B    │  │  ← .slide-compare-a, .slide-compare-b
│   │         │         │  │     each can hold text or image
│   │         │         │  │
│   └─────────┴─────────┘  │
│                          │
│      VERDICT             │  ← .slide-verdict (optional)
└──────────────────────────┘
```

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

**Layout:** label / vertical stack of numbered items / context line.

**Zones:**
```
┌──────────────────────────┐
│      LABEL               │
│                          │
│   ① First item           │  ← .slide-list-item (numbered)
│   ② Second item          │
│   ③ Third item           │
│   ④ Fourth item          │
│                          │
│   Context line below.    │  ← .slide-context (optional)
└──────────────────────────┘
```

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
