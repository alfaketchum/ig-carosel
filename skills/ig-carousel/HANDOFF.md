---
status: active
updated: 2026-05-06 (evening)
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

## Recent activity (2026-05-06 evening session)

Typography iteration drove the first concrete config-vs-skill separation lesson. Two carousels shipped (one published, one scheduled). `/init-carousel` gained typography preset support so future brands inherit the lesson without touching the skill template.

### Completed this session

| Change | What |
|---|---|
| **Typography presets added to `/init-carousel`** | Step 3 Batch 2 now asks for typography scale (`standard` \| `loud` \| `massive`). Step 4 substitutes the chosen preset into `layout.typography` instead of inheriting template defaults. New "Typography Presets" reference table with clamp values + 1080px reference points. Fallback flow (no DESIGN.md) also asks emphasis style + typography scale. Skill template stays at `standard` for hand-editors. Commit `84dd041`. |
| **Looplinq's `.carousel.md` bumped to `massive` preset** | After 5 publish iterations of `founder-contrast-psychology` (v1 standard fonts: too small in IG grid; v2 +37% with reduced padding: too dominant; v3 +18% modest: still small; v4 +37% padding restored: better; v5 +47%: landed). Final values: headline `clamp(34px, 8.1vw, 104px)`, label `clamp(13px, 2.8vw, 34px)`, body `clamp(17px, 3.6vw, 44px)`. Padding stays `14% 10%`. **Looplinq config only — skill template untouched** per user direction. |
| **founder-contrast-psychology published (v5 keeper)** | `Looplinq/ig-carousel/260506-founder-contrast-psychology/`. 7 slides, "Two Creators" framing about comparison-carousel manipulation. 5 publishes (`runs[]` in published.json), v5 final. Live: https://www.instagram.com/p/DYAuY7JkhSJ/ — alongside v2/v3/v4 (user accepted duplicates rather than deleting iterations). |
| **tribe-v2-unpopular-opinion scheduled** | `Looplinq/ig-carousel/260506-tribe-v2-unpopular-opinion/`. Strategy: Unpopular Opinion (canonical 6-slide arc). Hook: "Social media marketing as we know it is *dead.* Neuromarketing just took its job. Hear me out." Postiz post: `cmoukvcmd053al70y7j9a6thl`. Fires 2026-05-07T13:00Z (9am EDT). |
| **25-word cap docs tightened** | `references/hook-formulas.md` and `references/caption-writing.md`: bumped headline cap 20 → 25 words with "hard ceiling, not a target; most should land 15-22" framing. Carried in working tree from a prior session, validated and committed this session. |
| **Process lesson: consult references before writing** | First Tribe V2 attempt skipped Step 2 (strategy selection) — built intuitively, output landed but with no documented strategy. Re-ran with proper flow (Curiosity Gap canonical 5-slide arc), then user pivoted to Unpopular Opinion. Surfaced as accountability moment in conversation. |

### Validated by real-world iteration

- **Typography lesson**: bumping font size alone doesn't fix IG-grid readability. Word count on slide 1 matters more — a 24-word hook even at `massive` size still reads dense as a thumbnail. The Looplinq founder-contrast hook is 24 words; user accepted the trade-off rather than rewriting. Worth keeping the "cover slide ≤ ~8 words" instinct as a future iteration.
- **No em dashes in slide copy (Rule 7)**: missed in first Tribe V2 build, caught on the rerun. Existing published Looplinq carousels still contain em dashes from older sessions — OK to leave, but worth knowing for re-render decisions.
- **Iterate-then-publish multiplies on IG**: 5 publish iterations of the same content created 4 duplicates on the IG account (v1 was deleted before v2). User chose to publish-then-clean rather than delete-before-republish; both are valid but doubling-up the IG grid is the side effect.

---

## Recent activity (2026-05-06 morning session)

Architectural cleanup. The export pipeline moved from per-brand to skill-resident; HANDOFF was corrected to match disk reality. No new content features.

### Completed this session

| Change | What |
|---|---|
| **`bin/export-slides.mjs` moved into the skill repo** | Was `Looplinq/ig-carousel/export-slides.mjs` — every brand needed their own copy. Now lives once at `carousel-skill/bin/export-slides.mjs`. Added `package.json` declaring `puppeteer ^24.40.0` at the carousel-skill root + `.gitignore` for `node_modules/`. Ran `npm install` once in the skill repo (33s; puppeteer reused cached Chromium from the prior Looplinq install — no fresh download). Resolves the architectural follow-up that was on the prior list. |
| **All export-script references updated** | `SKILL.md` Step 8, `templates/carousel-config.md`, `Looplinq/.carousel.md`, `Looplinq/test-brands/nova/.carousel.md` now point at the absolute path `C:/Users/shah_/dev/carousel-skill/bin/export-slides.mjs`. The template uses an `<absolute-path-to>/...` placeholder so new brands know to substitute. Smoke-tested: invoked from `Looplinq/` cwd, the script resolves puppeteer from `carousel-skill/node_modules` correctly. |
| **HANDOFF file tree corrected** | Tree under "Current file tree" had `agents/` nested inside `skills/ig-carousel/`. On disk, `agents/` lives at the repo root next to `skills/`. Tree now shows the real layout with the new `bin/` and `package.json` entries. |
| **Looplinq lead-magnet scripts left in place (intentional)** | `Looplinq/ig-carousel/generate-guide.mjs` and `preview-pdf.mjs` are hardcoded Looplinq lead-magnet PDF tooling (brand colors, paths to a specific guide folder). Not part of the skill. They stay in Looplinq. |

### Confirmed (not changed)

- **Skill is junctioned into `~/.claude/skills/ig-carousel/`** via Windows directory junction (`mklink /J`, no admin needed). Edits in `C:\Users\shah_\dev\carousel-skill\skills\ig-carousel\` go live immediately — Claude Code reads through the junction. To remove: `Remove-Item "$HOME\.claude\skills\ig-carousel"` (only deletes the link, not the source).
- **Postiz CLI is global, not bundled.** `npm install -g postiz`, creds at `~/.postiz/credentials.json`. The brand only declares `publishing.postiz.integration_id` in `.carousel.md`. Matches invariant #7 — "skill produces files; CLI handles auth, uploads, posting."

---

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
carousel-skill/                         ← repo root
├── package.json                        ← declares puppeteer (run `npm install` once)
├── .gitignore
├── bin/
│   └── export-slides.mjs               ← Puppeteer screenshotter, brand-agnostic
├── agents/
│   └── ig-carousel.md                  ← empty stub
└── skills/
    └── ig-carousel/
        ├── SKILL.md                    ← orchestration, brand-agnostic
        ├── HANDOFF.md                  ← this file
        ├── references/
        │   ├── strategy-selection.md   ← 13 strategies + Specificity Rule
        │   ├── hook-formulas.md        ← Fear>Positive, conversation test, hook rules
        │   ├── structural-narratives.md← slide-by-slide arcs (uses roles, not theme names)
        │   ├── action-playbooks.md     ← 6 CTA playbooks (Comment/Share/Save/etc)
        │   └── caption-writing.md      ← IG caption craft (earn the "...more" tap)
        ├── templates/
        │   └── carousel-config.md      ← `.carousel.md` template for new brands
        ├── commands/
        │   ├── init-carousel.md        ← bootstrap config from DESIGN.md
        │   ├── sync-carousel.md        ← drift detection between DESIGN.md and config
        │   └── publish-carousel.md     ← Postiz publishing flow
        └── handoffs/
            └── image-generation.md     ← Phase 1 image support (designed, not built)
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
- **Typography preset: `massive`** (set 2026-05-06 evening after 5 publish iterations). Headline `clamp(34px, 8.1vw, 104px)`, label `clamp(13px, 2.8vw, 34px)`, body `clamp(17px, 3.6vw, 44px)`. CTA pill stays at the constant `clamp(11px, 2vw, 22px)` across all presets.

### Postiz integration (Looplinq)
- CLI installed globally: `npm install -g postiz`
- Authenticated via OAuth2 device flow → credentials at `~/.postiz/credentials.json`
- Org ID: `f78143e9-e2a5-4a1b-a805-38271c76dcea`
- Two integrations connected:
  - **Instagram (instagram-standalone)**: `cmoszdgm901t8mq0y2su6zxe3` — wired in `.carousel.md`
  - **X**: `cmnqmxuwu006yoz0yvk7nwp6y` — connected, not yet wired

### Export infrastructure (skill-side, was Looplinq-side)
- Puppeteer-based export script at `carousel-skill/bin/export-slides.mjs` (moved from `Looplinq/ig-carousel/` so brands no longer need their own copy)
- `package.json` at carousel-skill root declares puppeteer; one `npm install` in carousel-skill replaces per-brand installs
- Brand `.carousel.md` `layout.export_script` now points at the absolute path to `carousel-skill/bin/export-slides.mjs`
- Reads from `{output-folder}/index.html` (fixed in the 2026-05-05 session — was reading wrong template)
- Uses `scrollIntoView({behavior: 'instant'})` for reliable per-slide positioning
- 1080×1350 viewport @ 2x retina (2160×2700 actual pixels)

### Known good carousels
- `Looplinq/ig-carousel/260506-founder-contrast-psychology/` — **published live (v5 of 5)** at https://www.instagram.com/p/DYAuY7JkhSJ/. 7 slides, "Two Creators" comparison-content framing. Validates the `massive` typography preset end-to-end.
- `Looplinq/ig-carousel/260506-tribe-v2-unpopular-opinion/` — **scheduled** (fires 2026-05-07T13:00Z). 6 slides, Unpopular Opinion strategy, Tribe V2 / neuromarketing topic. Post id `cmoukvcmd053al70y7j9a6thl`.
- `Looplinq/ig-carousel/260506-tribe-v2-neuromarketing/` — Curiosity Gap version of the same Tribe V2 topic (5 slides). Rejected in favor of the Unpopular Opinion variant; kept as reference for strategy comparison.
- `Looplinq/ig-carousel/260506-creators-claude-skills/` — draft only, never published. 7 slides, "5 things creators don't know about Skills" listicle. User said "meh" and pivoted.
- `Looplinq/ig-carousel/260505-ai-vs-social-media-managers/` — fully shipped local (HTML + caption + 6 PNGs, no published.json)
- `Looplinq/ig-carousel/260421-claude-design-economics/` — was published as draft, draft deleted; published.json points to deleted post (annotation needed)
- `Looplinq/ig-carousel/260421-lecun-vindicated/` — predates the layout pattern fix; HTML uses old left-aligned no-spacer pattern; no PNGs

---

## Open handoffs

### `handoffs/image-generation.md` — slide-type vocabulary (renamed + expanded 2026-05-06)

The vocabulary system was renamed and expanded this session in preparation for a future `/clone-carousel` command (picasso-parallel — ingest reference carousels, extract style, write `.carousel.md`). The 8 named types now live in the handoff:

1. **Static Text Only** (`static_text_only`) — current default, always implicit
2. **Captioned Image** (`captioned_image`)
3. **Full-Frame Image** (`full_frame_image`)
4. **Text Over Image** (`text_over_image`)
5. **Pull Quote** (`pull_quote`)
6. **Big Number** (`big_number`)
7. **Side-by-Side Comparison** (`side_by_side_comparison`)
8. **Numbered List** (`numbered_list`)

**Status:** design settled, naming locked, **ready to build**. The `/clone-carousel` command depends on this — can't extract a brand's style without a vocabulary to map findings into. Phasing in the handoff: 1a (3 types) → 1b (2 text types) → 2 (2 layout-complex types) → 3 (text-over-image, last because legibility is fiddly).

**Recommendation:** when next session has a couple-hour block, build Phase 1a (`captioned_image` + `full_frame_image` on top of the existing `static_text_only`). That validates the cascade, the `slide_types_enabled` config block, and the schema migration path before committing to the full vocabulary.

---

## Lingering follow-ups (no handoff, just open)

### Active backlog (would improve quality if built)

1. **First-comment hashtags.** `caption.hashtag_placement: first-comment` is in the schema but the publish flow doesn't honor it. ~2-3 hours of work — split caption from hashtags, use Postiz's multi-`-c` syntax.

2. **Multi-platform publishing.** Postiz supports 28+ platforms but `publish-carousel` only wires one integration. Adding X requires per-platform caption + slide selection logic (X has 4-image limit and 280-char captions). ~1-1.5 days for a robust Path B (per-platform config), much less for Path A (same content everywhere — generally produces bad cross-posts).

3. **Style presets reference.** Picasso has 22 curated presets. We have zero. A `references/style-presets.md` with 8-10 carousel aesthetics (Editorial / Punk / Magazine / Brutalist / etc.) would speed new-brand onboarding dramatically. Each preset bundles fonts + colors + emphasis + weight choices.

4. **Older carousels need re-render.** `260421-lecun-vindicated/` and `test-brands/nova/ig-carousel/260421-lecun-vindicated/` use the pre-layout-fix HTML pattern (left-aligned, no spacer). Cosmetic, not blocking. ~30 min total.

5. **Re-publish the AI-vs-SMM carousel.** It's local-only; never went to Postiz. When you're ready to test the publish flow again, this is the carousel ready to go.

### Architectural follow-ups

6. **`agents/ig-carousel.md` is an empty stub.** Either delete (less noise) or build (would enable picasso-style discovery: 6 preview directions, user reacts, narrow). No urgency.

7. **`published.json` annotation when post is deleted.** When a Postiz post gets deleted via `postiz posts:delete`, the carousel's `published.json` becomes a stale reference. Either add `deleted_at` annotations or build a `/sync-published` command that reconciles.

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
| Architecture | Reconcile `published.json` when Postiz drafts get deleted (follow-up #7) — add a `deleted_at` annotation or build a `/sync-published` command. |
| Real usage | Generate 3-5 more carousels on different topics. Surface what actually hurts. Update handoff with friction notes. |

---

## Status snapshot

- **Skill repo**: `C:\Users\shah_\dev\carousel-skill\` — last commit `84dd041` ("Add typography presets to /init-carousel; tighten 25-word cap docs", 2026-05-06 evening, pushed). Still untracked from prior session: `bin/`, `package.json`, `.gitignore` — see lingering follow-up below.
- **Brand repo**: `C:\Users\shah_\dev\Looplinq\` — last commit `5da998d` ("Bump Looplinq typography (+47%) and ship founder-contrast carousel", 2026-05-06 evening, pushed). Clean working tree at session end.
- **Skill install**: directory junction at `~/.claude/skills/ig-carousel` → `~/dev/carousel-skill/skills/ig-carousel`. Live across all projects. `~/.claude/skills/` now has `graphify`, `picasso`, `ig-carousel`.
- **Postiz**: authenticated. **One scheduled post pending fire**: Tribe V2 Unpopular Opinion at 2026-05-07T13:00Z. Live posts: 4 iterations of `founder-contrast-psychology` on Looplinq IG (v5 is the keeper; v2/v3/v4 are duplicates that can be deleted manually).
- **Latest carousels**: see "Known good carousels" above. v5 founder-contrast is the visual reference for the `massive` typography preset.
