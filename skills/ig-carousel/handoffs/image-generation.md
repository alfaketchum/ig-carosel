---
status: open
created: 2026-04-21
owner: AJ
priority: low (use skill in practice first, then revisit)
---

# Handoff: Image Support for ig-carousel

## Context

The skill currently produces text-only carousels. Brands sometimes need images — screenshots for product walkthroughs, photos for commentary content (e.g. a Dario Amodei carousel), charts for stats, before/after visuals. The 2026-04-21 session **scoped this work but did NOT build it** — the design kept drifting toward over-engineering, and we agreed to use the skill in practice first to let real pain points drive the design.

**Before picking this up:** ship a couple of real carousels using the text-only flow. Notice where images would have helped and how. Then revisit this doc with that evidence.

## The problem

Images aren't one concept. They're several distinct patterns, each with different CSS, zones, and typography needs:

- **Screenshots** — UI walkthroughs, product demos, proof
- **Full-bleed photos** — cinematic moments, text overlaid on imagery
- **Inset images** — supporting the point (headshot next to a quote)
- **Charts** — data-driven slides with stats

Treating "add image support" as one feature hides this complexity. Each pattern is functionally different.

## Design discussion (what we considered, for reference)

### Extended schema — two axes per slide

Color theme (existing) × slide type (proposed new axis).

Brands would declare slide type per role:
```yaml
slide_types:
  anchor: text           # hooks + CTAs always text
  body: image_inset      # middle slides prefer images for this brand
  alt: text
```

Starting vocabulary considered: `text`, `image_inset`, `screenshot` (3 types, not 6).

### Three modes

```yaml
images:
  mode: optional    # never | optional | encouraged
```

### Sources hierarchy

```yaml
images.sources:
  - user           # prompt paths (Phase 1)
  - local_library  # convention-matched brand assets (Phase 2)
  - stock          # Unsplash/Pexels (Phase 2)
  - nano_banana    # AI gen (Phase 3)
```

### Content inference

Skill scans content for entity signals, suggests images per slide. Rule catalog in `references/content-signals.md`:
- Positive signals: named people ("Dario"), products ("the Claude UI"), specific stats ("$42k MRR"), before/after, physical objects, proof references
- Negative signals: abstract concepts, opinions, rhetorical questions, generalizations
- Role-locked: anchor slides always text unless explicit user override

### Decision hierarchy

```
Narrative hints  (surface)  → "Founder Contrast is stronger with visuals at slide 2+3"
Content inference (suggest) → "slide 2 mentions Dario → image candidate"
Brand role mapping (decide) → honors suggestions only if slide_types allow
User prompt (override)      → "use /tmp/dash.png on slide 3"
Source resolution (fulfill) → user > local > stock > text fallback
```

## The MVP we landed on

The full design above was too much for Phase 1. Stripped down to:

```yaml
images:
  enabled: true
```

User provides paths in the prompt:
> *"Make a Curiosity Gap about the new dashboard. Use /tmp/dash.png on slide 3."*

Skill renders slide 3 as `image_inset`, rest as text. No modes, no sources config, no inference, no scoring, no content signal catalog.

**MVP scope (~2-3 files):**
- Add `images.enabled` field to `.carousel.md` template
- New `references/slide-types.md` — just documents `text` and `image_inset` CSS. Two types.
- Extend SKILL.md Step 5 with one paragraph: "If user provides image path for slide N, render slide N as image_inset. Otherwise text."
- Extend `commands/init-carousel.md` with one question: "Will carousels include images? yes/no"

**Explicitly NOT in MVP:**
- `slide_types` per role
- `images.mode` with three options
- `images.sources` list
- Content inference / signal catalog
- Batch-question UX for uncertain slides
- References for background-images, image-generation
- Narrative type hints
- Confidence scoring

## Open questions (answer with real usage data, not speculation)

1. **Is the MVP (user paths only) actually sufficient?** Or does practice reveal brands need `slide_types` per role for consistency? Decide based on how often generated carousels feel inconsistent.

2. **Is content inference worth building?** It felt useful for entity-heavy content (Dario, Claude UI) and harmful for abstract content. Real question: how often do we wish the skill had auto-suggested images we didn't think to provide?

3. **Which level owns slide-type decisions?** We leaned per-role for consistency. Real usage might show per-narrative is better (e.g. Founder Contrast needs visuals regardless of brand default).

4. **Should `local_library` with filename convention matching be the real Phase 2?** Instead of modes/sources complexity. If a brand has `./assets/imgs/dario.jpg` and the skill finds it by entity name, that might cover most inference needs without an explicit catalog.

5. **Is image generation (Nano Banana) a carousel-skill concern at all?** Or should it be a separate tool the user pipes into before generating? AI gen has aspect ratio matching, style consistency, prompt engineering — its own discipline.

6. **Narrative type hints vs. content inference — are both needed, or does one subsume the other?** Likely redundant.

7. **Full-bleed photos as a slide type** — did the user example of "Claude Mythos with Dario headshot" actually want bleed or inset? Different CSS. Unclear without real test.

## Recommended next steps

1. **Ship the MVP.** 2-3 files, ~30 min of work. `images.enabled: true/false`, user paths in prompt, `image_inset` CSS.
2. **Use for a month of real content.** Text-only + occasional image paths.
3. **Log the friction.** Every time you wish the skill did more with images, write it down specifically.
4. **Revisit this handoff with that log.** Decide whether to add slide_types, sources, inference, etc. based on observed pain, not speculation.

## Out of scope for this handoff

- Gallery-driven init (picasso-style 6 previews for layout direction) — blocked on images being real first
- Agent-based image decisions — avoid unless MVP clearly fails
- Export script location change — separate concern
- Reference HTML template — separate concern

## Related files (if/when we build this)

- `skills/ig-carousel/SKILL.md` — Step 5 is where image-vs-text decisions land
- `skills/ig-carousel/templates/carousel-config.md` — gains `images:` block
- `skills/ig-carousel/commands/init-carousel.md` — gains one question
- `skills/ig-carousel/references/slide-types.md` — new file (MVP)
- `Looplinq/.carousel.md` — first test bed (add `images.enabled: false` initially)

## Key quotes from the session (for future-me context)

> "Consistency comes from defining slide type per role, not per slide. A brand's body slides all look the same. That's the brand signature."

> "The interesting decision is per-slide, not per-brand. Slide 1 (hook) → text. Slide 3 (framework reveal) → screenshot. Slide 5 (CTA) → text. A single carousel weaves types together."

> "We need to actually test it in practice to tweak it."

> "This feels too complex." — (the signal that prompted the MVP simplification)
