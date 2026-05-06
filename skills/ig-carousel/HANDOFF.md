---
status: active
updated: 2026-05-05
owner: AJ
---

# ig-carousel — Status & Open Handoffs

This doc tracks what's shipped, what's open, and lingering questions. **Read this first when picking up the skill in a new session.**

## Where to start a new session

1. **Read this file** — orientation + status
2. **Read `SKILL.md`** — the orchestration recipe (~300 lines, the core)
3. **Skim `references/caption-writing.md`** as an example of how craft references are written
4. **Look at `Looplinq/.carousel.md`** — a live, working brand config
5. **Look at one carousel folder** — `Looplinq/ig-carousel/260505-ai-vs-social-media-managers/` for the latest end-to-end output (HTML + caption + 6 PNGs)

## Recent activity (2026-05-05 session)

This session shipped a lot. The skill went from "designed and committed" to "validated end-to-end with real publishing."

### Completed this session

| Commit | What |
|---|---|
| `a902081` | **Emphasis is earned, not required.** Replaced "1-3 emphasized words per headline" rule with payload-based earning. Distribution target: 2-4 of 6 slides, never zero, never all six. Stops the "every slide italicized" AI-slop pattern. |
| `8c3e222` | **`references/caption-writing.md` shipped.** Central rule: first ~125 chars must earn the "...more" tap. Six opening patterns (story / counter-intuitive / specific intrigue / confession / observation / question-then-negated). SKILL.md gained Step 7 for caption generation. |
| `58b9ae8` | **Slide layout pattern prescribed + auto-export mandated.** Step 5 now requires `text-align: center`, `align-items: center`, `padding: 14% 10%`, `margin-top: auto` on `.slide-label` and `.slide-bottom`, plus mandatory `.slide-spacer` div on slides without a `.slide-bottom`. Step 8 now mandates auto-export — "a carousel is not complete until PNGs are exported." Fixes the layout drift seen in early generations. |
| `546e7a5` | **`/publish-carousel` command shipped.** Wires the carousel pipeline to Postiz via the official `postiz` CLI (`npm install -g postiz`, `postiz auth:login`). Two-step safety: skill writes `post.json` → command uploads PNGs sequentially → confirms before submitting → writes `published.json` audit trail. Default `type: draft` for first-time publishes. |

### Validated by real-world use

Three carousels generated end-to-end this session:

1. **LeCun vindicated** (`260421-lecun-vindicated/`) — first run, surfaced layout bug (left-aligned, no bottom-pin). HTML only, no PNGs.
2. **Claude Design economics** (`260421-claude-design-economics/`) — full pipeline including PNGs + Postiz draft submission. Verified the layout pattern fix and auto-export. Draft was deleted at end of session.
3. **AI vs Social Media Managers** (`260505-ai-vs-social-media-managers/`) — current latest. Belief Disruption strategy, 6 slides, 3 of 6 earn emphasis, full export. Demonstrates the publishing-ready output shape.

**Multi-brand validation**: `test-brands/nova/` proves the same skill produces visually distinct output for a punk/grotesk/highlight-emphasis brand without changing any references.

**Multi-platform reality check**: Postiz CLI handles 28+ platforms, but the `publish-carousel` command currently wires only one integration. Multi-platform = scoped but not built.

---

## Current file tree

```
carousel-skill/skills/ig-carousel/
├── SKILL.md                            ← orchestration, brand-agnostic
├── HANDOFF.md                          ← this file
├── references/
│   ├── strategy-selection.md           ← 13 strategies + Specificity Rule
│   ├── hook-formulas.md                ← Fear>Positive, conversation test, hook rules
│   ├── structural-narratives.md        ← slide-by-slide arcs (uses roles, not theme names)
│   ├── action-playbooks.md             ← 6 CTA playbooks (Comment/Share/Save/etc)
│   └── caption-writing.md              ← IG caption craft (earn the "...more" tap)
├── templates/
│   └── carousel-config.md              ← `.carousel.md` template for new brands
├── commands/
│   ├── init-carousel.md                ← bootstrap config from DESIGN.md
│   ├── sync-carousel.md                ← drift detection between DESIGN.md and config
│   └── publish-carousel.md             ← Postiz publishing flow
├── handoffs/
│   └── image-generation.md             ← Phase 1 image support (designed, not built)
└── agents/
    └── ig-carousel.md                  ← empty stub
```

---

## Architecture invariants (do not break)

These are the principles the skill is built on. Every change should preserve them. The first one is the founding principle of the entire refactor — guard it carefully.

1. **Psychology is separated from construction.** `SKILL.md` is the *construction manual* — slide anatomy, themes, typography, layout pattern, export pipeline. **All copywriting strategy lives in `references/`** — strategy selection, hook formulas, structural narratives, action playbooks, caption writing. SKILL.md never embeds psychology; references never embed construction. If you find yourself writing "the hook should feel conversational" in SKILL.md, that's a violation — it belongs in `references/hook-formulas.md`. If you find yourself writing CSS pixel values in a reference, that's also a violation. This separation is what makes the skill brand-agnostic and the references reusable across content strategies.

2. **Three-tier config flow:** `DESIGN.md` (brand foundation, humans read) → `.carousel.md` (skill-readable bridge, per-project) → `SKILL.md` (universal recipe). Changes flow downward; never edit a generated carousel folder to "fix the brand."

3. **Roles, not theme names.** Narratives reference `anchor` / `body` / `alt` — never literal theme names. A brand can rename theme keys in `.carousel.md`; references still work.

4. **Classless `<em>`, CSS cascade.** Generated HTML has bare `<em>` tags. Color and style come from `.slide--{role} em { ... }` rules.

5. **Earned emphasis.** 2-4 of 6 slides get emphasis. Never zero, never all. The earned test: remove the `<em>`; if the sentence still works, drop it.

6. **Consistency over variation.** Carousels are scanned sequences; the brand signature comes from STRUCTURAL consistency across slides while CONTENT varies. This explicitly inverts picasso's variation principle.

7. **Skill ↔ Postiz CLI separation.** The skill produces files; the CLI handles auth, uploads, posting. Swapping publishers only touches `commands/publish-carousel.md`.

8. **Caption first line earns the expand.** The first ~125 chars of a caption must create a curiosity gap; never deliver value pre-truncation.

---

## Operational state

### Looplinq's brand config
- `.carousel.md` at repo root — fully populated (brand, voice, design tokens, layout themes, typography scale, emphasis style: italic, caption pools, publishing config)
- `Design System/DESIGN.md` is the canonical source of truth
- `voice.hook_style: fear-first`, `layout.emphasis.style: italic`

### Postiz integration (Looplinq)
- CLI installed globally: `npm install -g postiz`
- Authenticated via OAuth2 device flow → credentials at `~/.postiz/credentials.json`
- Org ID: `f78143e9-e2a5-4a1b-a805-38271c76dcea`
- Two integrations connected:
  - **Instagram (instagram-standalone)**: `cmoszdgm901t8mq0y2su6zxe3` — wired in `.carousel.md`
  - **X**: `cmnqmxuwu006yoz0yvk7nwp6y` — connected, not yet wired

### Export infrastructure (Looplinq-side)
- Puppeteer-based export script at `ig-carousel/export-slides.mjs`
- Reads from `{output-folder}/index.html` (fixed in this session — was reading wrong template)
- Uses `scrollIntoView({behavior: 'instant'})` for reliable per-slide positioning
- 1080×1350 viewport @ 2x retina (2160×2700 actual pixels)
- node_modules installed; Puppeteer + Chromium ready

### Known good carousels
- `Looplinq/ig-carousel/260505-ai-vs-social-media-managers/` — most recent, fully shipped (HTML + caption + 6 PNGs, no published.json)
- `Looplinq/ig-carousel/260421-claude-design-economics/` — was published as draft, draft deleted; published.json points to deleted post (annotation needed)
- `Looplinq/ig-carousel/260421-lecun-vindicated/` — predates the layout pattern fix; HTML uses old left-aligned no-spacer pattern; no PNGs

---

## Open handoffs

### `handoffs/image-generation.md`

Phase 1 image support — designed but NOT built. Settled on **vocabulary + cascaded approach**:
- Slide types vocabulary: `text` / `image_inset` / `screenshot`
- Brand declares `slide_types_enabled` in config
- Skill picks per-slide based on content + brand mode
- User overrides at prompt time

**Recommendation:** use the text-only skill in practice for a few weeks before building images. Watch for what actually hurts. The image-generation handoff has 8 open questions that need real-usage data before the design can be finalized.

---

## Lingering follow-ups (no handoff, just open)

### Active backlog (would improve quality if built)

1. **First-comment hashtags.** `caption.hashtag_placement: first-comment` is in the schema but the publish flow doesn't honor it. ~2-3 hours of work — split caption from hashtags, use Postiz's multi-`-c` syntax.

2. **Multi-platform publishing.** Postiz supports 28+ platforms but `publish-carousel` only wires one integration. Adding X requires per-platform caption + slide selection logic (X has 4-image limit and 280-char captions). ~1-1.5 days for a robust Path B (per-platform config), much less for Path A (same content everywhere — generally produces bad cross-posts).

3. **Style presets reference.** Picasso has 22 curated presets. We have zero. A `references/style-presets.md` with 8-10 carousel aesthetics (Editorial / Punk / Magazine / Brutalist / etc.) would speed new-brand onboarding dramatically. Each preset bundles fonts + colors + emphasis + weight choices.

4. **Older carousels need re-render.** `260421-lecun-vindicated/` and `test-brands/nova/ig-carousel/260421-lecun-vindicated/` use the pre-layout-fix HTML pattern (left-aligned, no spacer). Cosmetic, not blocking. ~30 min total.

5. **Re-publish the AI-vs-SMM carousel.** It's local-only; never went to Postiz. When you're ready to test the publish flow again, this is the carousel ready to go.

### Architectural follow-ups

6. **Export script location.** Currently lives in `Looplinq/ig-carousel/export-slides.mjs` — every brand using the skill needs their own copy. Should move to `carousel-skill/bin/export-slides.mjs` so brands reference it via path. Cheap fix.

7. **`agents/ig-carousel.md` is an empty stub.** Either delete (less noise) or build (would enable picasso-style discovery: 6 preview directions, user reacts, narrow). No urgency.

8. **`published.json` annotation when post is deleted.** When a Postiz post gets deleted via `postiz posts:delete`, the carousel's `published.json` becomes a stale reference. Either add `deleted_at` annotations or build a `/sync-published` command that reconciles.

### Questions worth answering with usage

9. **Does first-line-earning work in practice?** The caption rule says first ~125 chars must create a curiosity gap. Anecdotal validation only — no engagement data yet. Worth tracking once a few real publishes go live.

10. **Does the earned-emphasis rule produce better engagement** than the all-six-slides pattern? Same — needs real data.

11. **Is 6 slides the right default?** Rule of thumb from current narratives. May need to vary per strategy.

---

## Key architectural quotes (for future-me context)

> "Consistency comes from defining slide type per role, not per slide. A brand's body slides all look the same. That's the brand signature."

> "Picasso emphasizes variation. For carousels, that's *wrong* — readers swipe a sequence, consistency creates rhythm."

> "Emphasis is earned, not required. Only wrap a word in `<em>` when it's the payload of the sentence."

> "The first ~125 chars of a caption are the only text most readers will see. They must earn the expand tap, not deliver the value."

> "A carousel is not complete until PNGs are exported."

> "The skill produces files; the CLI handles auth, uploads, posting."

---

## How to pick up next session

Pick by energy:

| Energy | Pick |
|---|---|
| Light (5 min) | Re-publish the AI-vs-SMM carousel as a draft, verify it lands in Postiz cleanly. |
| Medium (1-2 hr) | Build first-comment hashtags. Smallest valuable feature. |
| Bigger (1 day) | Build the `stat` slide type (Phase 1 of image-generation handoff). Big visual variety win, no external dependencies. |
| Architecture | Move `export-slides.mjs` into `carousel-skill/bin/`. Eliminates per-brand drift on the export pipeline. |
| Real usage | Generate 3-5 more carousels on different topics. Surface what actually hurts. Update handoff with friction notes. |

---

## Status snapshot

- **Skill repo**: `C:\Users\shah_\dev\carousel-skill\` — clean, latest commit `546e7a5`
- **Brand repo**: `C:\Users\shah_\dev\Looplinq\` — clean (or near-clean — see uncommitted notes if any)
- **Postiz**: authenticated, no active drafts (deleted at session end)
- **Latest carousel**: `Looplinq/ig-carousel/260505-ai-vs-social-media-managers/` — local only, ready to publish
