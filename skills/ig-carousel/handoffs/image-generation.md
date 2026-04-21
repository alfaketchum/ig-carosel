---
status: open (design settled, not yet built)
created: 2026-04-21
updated: 2026-04-21
owner: AJ
priority: low (use skill in practice first, then revisit)
---

# Handoff: Image Support for ig-carousel

## Context

The skill currently produces text-only carousels. Brands sometimes need images — screenshots for product walkthroughs, photos for commentary content (e.g. a Dario Amodei carousel), charts for stats, before/after visuals. The 2026-04-21 session **scoped this extensively but did NOT build it.**

**Before picking this up:** ship a couple of real carousels using the text-only flow. Notice where images would have helped, what kinds, and how often. Then revisit this doc with concrete evidence.

---

## Key concept: "vocabulary"

**The central design insight of the session:** the skill should operate on a *vocabulary of slide types*, not a binary image-or-not switch.

A vocabulary is the set of named slide types the skill knows about. Each "word" in the vocabulary is a named layout with its own zones, typography behavior, and image treatment.

**Binary vocabulary (what we rejected):**
`{ text, image }` — every slide is just "has image" or "doesn't." Every image slide looks roughly the same.

**Slide types vocabulary (what we want):**
`{ text, image_inset, screenshot }` (for Phase 1) — different layouts with different structures, zones, and image treatments. Extensible to more types later.

### Why vocabulary > binary

Binary forces every image slide into one mold. A brand doing both product screenshots (image dominant) AND commentary with headshots (image supporting text) has to pick one treatment or branch config. Vocabulary lets the same brand use different layouts for different content without branching — the skill picks from the enabled set per slide.

### Images aren't the real framing

Framing the skill around slide types (not images) means the same mechanism that decides "use an image here" also decides "use a stat card here" or "use a pull-quote here." Images become *one facet* of a richer layout system — a better model of how good carousels actually work.

```
Vocabulary item  | Uses image?
-----------------|-------------
text             | No
image_inset      | Yes
screenshot       | Yes
stat             | No (big number + context)   — Phase 2+
quote            | No (pull-quote)              — Phase 2+
comparison       | Usually yes (A vs B)         — Phase 2+
```

### Phase 1 vocabulary (start here)

| Type | Zones | Image role | Use case |
|---|---|---|---|
| `text` (default) | label, headline, bottom | none | Hooks, CTAs, narrative text |
| `image_inset` | label, image, caption | image in body zone | Screenshots + context, supporting visuals |
| `screenshot` | caption (image dominant) | image fills most of slide | Product demos, UI walkthroughs, before/after |

**Don't start with more.** Not `bleed`, not `split`, not `stat`, not `chart`. Add them only when the 3 prove insufficient.

---

## The matrix: who decides the slide type per slide?

With vocabulary settled, the only real open axis is **who picks which type each slide gets.** Five approaches, each with a distinct philosophy:

### A. User Explicit
User specifies type per slide in the prompt.
> *"Curiosity Gap about the dashboard. Slide 3 → image_inset, slide 4 → screenshot."*

- **Feels like:** a command-line tool
- **Pros:** deterministic, no magic
- **Cons:** high effort per carousel, easy to forget
- **Best for:** power users who already have clear mental models

### B. Brand Preset (per role)
Brand declares per-role slide type. Every body slide is the same type.
```yaml
slide_types:
  anchor: text
  body: image_inset
  alt: text
```
- **Feels like:** a uniform
- **Pros:** maximum brand consistency
- **Cons:** rigid — content without images forces awkward fallbacks
- **Best for:** brands with strict visual signatures

### C. Narrative Prescribes
Each narrative arc specifies type per slide. Brand provides assets.
```
Founder Contrast:
  Slide 1: anchor / text         → hook
  Slide 2: body / comparison     → Founder A
  Slide 3: body / comparison     → Founder B
```
- **Feels like:** a playbook
- **Pros:** each strategy knows its ideal shape
- **Cons:** brand has no visual identity; narratives bloat
- **Best for:** a skill where strategy owns the creative direction

### D. Skill Infers from Content
Skill reads each slide's content, picks type based on signals (entity mention → image_inset, stat → chart, pure argument → text). Brand just toggles enabled/not.
- **Feels like:** a collaborator
- **Pros:** rich output matching content shape
- **Cons:** inference can be wrong; output varies per carousel
- **Best for:** content-forward brands where content shape should drive layout

### E. Cascaded (this is the one that landed)
Combines B + D + A:
- Brand sets *which types are enabled* (constraint)
- Skill infers type per slide from content (default decision)
- User can override per slide at prompt time (escape hatch)

```
Brand enables [text, image_inset, screenshot]
    ↓ constrains
Skill infers per slide from content
    ↓ overridden by
User prompt if specified
```
- **Feels like:** smart defaults with escape hatches
- **Pros:** brand constraint keeps it bounded; inference adapts to content; user can always override
- **Cons:** most complex to build — three decision sources need to coexist without conflicting
- **Best for:** balanced use — most real brands

### Comparison

| Approach | Brand effort | Per-carousel effort | Consistency | Inference risk |
|---|---|---|---|---|
| A. User Explicit | None | High | User-controlled | None |
| B. Brand Preset | Set once | None | Maximum (rigid) | None |
| C. Narrative Prescribes | None | None | Per-strategy | None |
| D. Skill Infers | None / 1 toggle | None | Varies per content | Medium |
| E. Cascaded | Set once (types_enabled) | None usually | Brand-bounded + content-driven | Medium |

### Soft variant: narrative hints

C (narrative prescribes) can be softened into "narrative *hints*" — narratives carry suggestions like *"Founder Contrast slide 2+3 strongly benefit from comparison visuals"* — which feed into E's inference layer as one signal among several, without dictating. Hinting fits inside E. Hard prescription is its own model.

---

## The three-level decision cascade (under approach E)

If we go with E, the mental model is:

```
Brand default (.carousel.md)
   ↓ overridden by
Carousel intent (user prompt signals)
   ↓ overridden by
Slide-specific need (content signals)
```

**Brand level** — `.carousel.md` declares:
```yaml
images:
  mode: optional              # never | optional | encouraged
  types_enabled:              # which types this brand uses
    - text
    - image_inset
    - screenshot
  sources:                    # Phase 1: only user paths
    - user
```

Three modes (not "text/image/mixed"):
- `never` — text only. Image types disabled even if user provides paths.
- `optional` (default) — skill uses image types when content signals warrant it. Falls back to text if no source available.
- `encouraged` — skill prefers image types for body slides when sources exist.

**Carousel level — inferred from the prompt:**
- "show the dashboard" → screenshot type
- "before and after", "comparison" → screenshot × 2
- "data from", "2,400 posts", "$42k MRR" → image_inset with a chart (Phase 2+)
- No visual signals → text-only regardless of brand mode
- User explicitly says "make this image-heavy" → override

**Slide level — skill picks per slide based on:**
1. What types are enabled for this brand
2. What the narrative slide's job is (hook / reveal / proof / CTA)
3. What content signals the slide's copy provides
4. Whether a source is actually available

**Narratives stay pure.** They only specify role (`anchor` / `body` / `alt`). No type coupling. Keeps narratives reusable across brands with different image commitments.

---

## Open questions (to answer with real usage data, not speculation)

1. **Is the cascaded approach (E) right, or should it be simpler (B, D alone, or Brand Preset)?** Can only know by using it. Brand Preset might be enough if the skill's output is good.

2. **Is skill inference worth building?** Real question: how often will it propose images the user hadn't thought to include? And how often will it propose poorly? Worth a few real carousels to find out.

3. **Which level owns ambiguous cases?** If content is borderline (mentions a concept abstractly), who decides? User via follow-up? Default to text? The cascade says "default to text if no clear signal" — but feels hand-wavy.

4. **Does narrative hinting add enough value to justify the complexity?** Would a hint on "Founder Contrast wants visuals on 2+3" change outputs meaningfully, or is inference already picking this up from content?

5. **Should `local_library` (filename-based matching) be Phase 2 or part of Phase 1?** It's cheap to add and unblocks a lot of use cases (e.g. the Dario example). Might be worth including in MVP if brand already has an assets folder.

6. **Is image generation (Nano Banana) a carousel-skill concern at all?** Or should it be a separate tool that produces an image which the user then provides a path to? AI gen has its own discipline (aspect ratio matching, style consistency, prompt engineering) — might not belong in this skill.

7. **What happens when types_enabled is violated by content?** E.g., brand enables only `[text]` but content clearly mentions a screenshot-able thing. Silent fallback? Warning? Offer to temporarily enable? Unclear.

8. **Full-bleed vs inset for photo slides** — the Claude Mythos example (Dario headshot) could be either. Different CSS, different feel. Which is the right default when the skill proposes?

---

## Recommended next steps

1. **Ship text-only carousels on the current skill.** Run at least 3-5 real Looplinq carousels end-to-end. Log pain points where images would have helped.
2. **Revisit this handoff with the log.** Which approach (A-E) fits what actually happened?
3. **Build the chosen approach.** Expect it to be E (cascaded) but don't assume.

**Don't build speculatively.** The trap this session revealed: every new abstraction felt necessary in discussion and unnecessary in retrospect. Build against observed friction, not imagined use cases.

---

## Out of scope for this handoff

- Image generation (Nano Banana or similar) — defer to its own handoff if pursued
- Gallery-driven init (picasso-style 6 previews for direction discovery) — blocked on images being real first
- Agent-based image decisions — skip unless skill-inference clearly fails
- Export script location change — separate concern
- Reference HTML template — separate concern

---

## Related files (if/when we build this)

- `skills/ig-carousel/SKILL.md` — Step 5 is where type decisions land
- `skills/ig-carousel/templates/carousel-config.md` — gains `images:` block
- `skills/ig-carousel/commands/init-carousel.md` — gains one question
- `skills/ig-carousel/references/slide-types.md` — **new file** defining the 3 types, their zones, CSS patterns
- `Looplinq/.carousel.md` — first test bed (add `images.mode: optional` when building MVP)

---

## Key quotes from the session (for future-me context)

> "Not 'text vs image' — slide types. Each type is a distinct layout with its own zones, typography hierarchy, and image treatment. Universal vocabulary, not brand-specific."

> "Consistency comes from defining slide type per role, not per slide. A brand's body slides all look the same. That's the brand signature."

> "I agree that there should be a skill inference, like for instance the Claude Mythos example, we could literally show a screenshot of the model or an image of Dario."

> "This feels too complex." — (the signal that prompted the MVP simplification, which was then also rejected)

> "We need to actually test it in practice to tweak it."

> "Like we didn't land on it, I just got confused. But we need to think about it from first principles."

## Session narrative (one-paragraph context)

The 2026-04-21 session designed image support in three passes. Pass 1 proposed a rich schema (slide_types per role, 3 modes, sources list, content inference, batch UX) — got "too complex." Pass 2 stripped to `images.enabled: true/false` + user paths — got "too stripped down, missing the inference that's the whole point." Pass 3 settled on the vocabulary + cascade framing captured above. No code was written. The final plan is to use the text-only skill in practice first, THEN build based on real friction rather than speculation. Approach E (cascaded) is the current working hypothesis but should be validated against observed use.
