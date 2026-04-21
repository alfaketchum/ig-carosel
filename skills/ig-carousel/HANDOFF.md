---
status: open
created: 2026-04-19
owner: AJ
---

# Handoff: Separate Psychology from Construction + Make `ig-carousel` Extensible

## The problems

**Problem 1 — Psychology is tangled with construction.** `SKILL.md` blends two distinct concerns:

1. **Psychology / copywriting strategy** — strategy selection, hook framing (Fear > Positive), conversational tone, the conversation test, hook formulas by strategy, action playbooks, "Common Structures" narratives.
2. **Construction mechanics** — typography scale, color system, emphasis pattern, slide anatomy, IG frame markup, export process.

These don't belong in the same document. Psychology is **content strategy** (what to say, how to frame it, why it works). Construction is **skill scaffolding** (how to build the HTML carousel, what tokens to plug in, where things go on the slide).

**Problem 2 — The skill is LoopLinq-specific; it should be extensible.** The skill currently assumes LoopLinq's brand — it references `looplinq.com` in CTAs, the LoopLinq logo in the IG avatar, LoopLinq's design tokens, and LoopLinq's product context. Any other brand trying to use it has to fork and hand-edit. The skill should be **brand-agnostic** — brand-specific details get resolved at run time from a project config file, not baked into the skill itself.

## Reference implementation

A more extensible version of this skill already exists at `C:\Users\AJ\Dev\carousel-skill`. Study its architecture before refactoring:

```
C:\Users\AJ\Dev\carousel-skill\
├── package.json             # npm-installable skill
├── bin/install.mjs          # installer
├── skills/carousel/SKILL.md # the skill entry point — brand-agnostic
├── commands/                # /brand, /carousel, /export, /hook, /roast-carousel, /series, /swipe-test, /template
├── agents/carousel.md       # carousel agent
├── references/              # on-demand knowledge files:
│   ├── anti-patterns.md
│   ├── brand-consistency.md
│   ├── carousel-anatomy.md       ← pure construction (header/body/footer/logo)
│   ├── color-psychology.md
│   ├── cta-patterns.md
│   ├── data-slides.md
│   ├── export-formats.md
│   ├── platform-specs.md         ← IG / LinkedIn / TikTok dimensions
│   ├── social-typography.md      ← pure construction (type scale for social)
│   ├── strategy-selection.md     ← pure psychology
│   └── style-presets.md
├── templates/carousel-config.md  # the .carousel.md template
├── checklists/pre-ship.md
└── autoresearch/evaluate.sh
```

**Key extensibility pattern — `.carousel.md` config file** (like `.picasso.md`):

- Lives in the project root, not in the skill.
- Holds all brand-specific settings: name, voice, audience, fonts, colors, aspect ratio, hook style, preset, platform, export format.
- Auto-generated on first run via discovery mode (skill asks 4 questions if no config exists).
- The skill reads this config at run time instead of hardcoding any brand.

**Key extensibility pattern — reference loading on demand.** The SKILL.md is lean; heavy content lives in `references/*.md` and is pulled in only when relevant to the current task. Construction refs vs strategy refs are already separated in that structure — use it as the model.

## The goal

Refactor `looplinq/.claude/skills/ig-carousel/` to match the `carousel-skill` architecture:

1. **Brand-agnostic SKILL.md** — no hardcoded LoopLinq references. All brand tokens come from a config file.
2. **Split psychology and construction** — psychology lives in `references/strategy-selection.md` (or equivalent), construction mechanics live in SKILL.md + `references/carousel-anatomy.md` + `references/social-typography.md`.
3. **Config-driven** — introduce a `.carousel.md` (or reuse `DESIGN.md` + a new `.carousel.md`) that LoopLinq's project populates. Other projects populate their own.

**Rule:** nothing in `SKILL.md` should assume what the content is, who the audience is, what brand is publishing, or what frame to use. Those decisions happen *before* the skill runs, via config or explicit input.

## The goal

Split them cleanly. `SKILL.md` should be a **pure construction manual** — the recipe for assembling an IG carousel from any content. Psychology moves elsewhere (separate doc, separate skill, or into the user's prompt as input).

**Rule:** nothing in `SKILL.md` should assume what the content is, who the audience is, or what frame to use. Those decisions happen *before* the skill runs.

## What stays in `SKILL.md` (construction only)

- **Design token resolution** — finding `DESIGN.md`, extracting colors/fonts/logo SVG.
- **Typography scale** — headline, label, body, list, CTA pill sizing and weights.
- **Color switching on text** — emphasis pattern (`<em class="primary">`, `<em class="white">`), which color on which background.
- **Layout structure** — the 3-zone slide anatomy (label → headline → bottom), plus the IG frame shell:
  - **Header:** avatar (logo SVG, white variant on gradient), username, location line, `···` more button.
  - **Body:** the slide viewport with scroll-snap, aspect-ratio 1080/1350, 3-zone vertical rhythm.
  - **Footer:** dots + arrows + IG action row.
  - **Logo:** where the brand mark goes in the avatar, fallback to gradient circle if no SVG.
- **Background images** — how to apply a full-bleed image to a slide, overlay gradients for text legibility, per-slide background variants (`slide--image`, `slide--image-dark`, etc.).
- **Image generation / sourcing** — pulling images via Nano Banana (or any image gen), image prompts tied to slide content, acceptable sources, how to place them (cover vs inset vs decorative).
- **Slide variants** — `slide--dark`, `slide--primary`, `slide--white` — pure theme mapping, no psychology attached.
- **Bottom element variants** — stat text, list, CTA pill, bullets — as reusable components.
- **Output shape** — single HTML file, inline CSS/JS, no build step, 1080x1350 portrait.
- **Export pipeline** — Puppeteer script, folder naming `YYMMDD-topic-slug/`, retina export.
- **Quick checklist** — pure mechanical checks (dot count, ARIA, responsive, fonts loaded, logo SVG in avatar).

## What moves OUT of `SKILL.md`

Everything below leaves — put it in a separate file (suggestions: `ig-carousel-psychology.md`, or a sibling skill `ig-carousel-writer`):

- Strategy Selection table (Belief Disruption, Founder Contrast, etc.).
- Specificity Rule.
- Hook Psychology: Fear > Positive.
- Hook Style: Conversational, Not Billboard.
- The Conversation Test.
- Hook Formula by Strategy table.
- Hook Rules (1-7).
- Action Playbooks (💬 Comment, 📤 Share, 💾 Save, 🔥 Controversy, 🏷️ Tag, 🔗 Product).
- Auto-Select Action + Auto-Select CTA tables.
- Common Structures → Emotional Psychology Strategies (Belief Disruption through Unpopular Opinion narratives).
- Common Structures → Structural Strategies (PAS, Hook-Features-CTA, Educational narratives — the slide-by-slide *narrative* descriptions).

The structural strategies are borderline — they describe slide counts and theme sequences (construction-adjacent) but also dictate narrative arc (psychology-adjacent). Default: move them to the psychology doc, and leave only the *mechanical* bits in the skill (e.g. "carousels are 4-7 slides, default is 6, last slide is always CTA").

## Suggested new sections to add to `SKILL.md`

When doing the split, use the opportunity to flesh out what's currently underdeveloped:

1. **Background images** — section covering:
   - Full-bleed image slides (image as background, text overlay).
   - Inset images (image in body zone, headline above/below).
   - Decorative images (small graphic, not primary content).
   - Overlay gradients (`linear-gradient(0deg, rgba(0,0,0,0.7), transparent)`) for text legibility.
   - When to use each.
2. **Image generation via Nano Banana** — section covering:
   - Prompt construction (aspect ratio 1080:1350, style tied to design system mood).
   - How to translate slide content into an image prompt.
   - Output path convention (`ig-carousel/YYMMDD-topic-slug/bg-01.png`, etc.).
   - Fallback: pulling from stock/existing assets if no gen available.
3. **Header / Body / Footer / Logo** — explicit subsections under "Slide Anatomy" or a new "Frame Anatomy" section. Currently the IG frame is described in passing; make it a first-class section.
4. **Color switching on text** — consolidate the emphasis pattern + label colors + headline colors into one clear table keyed by background variant.

## How to execute (next session)

1. **Study the reference.** Read `C:\Users\AJ\Dev\carousel-skill\skills\carousel\SKILL.md` and `C:\Users\AJ\Dev\carousel-skill\references\carousel-anatomy.md` / `social-typography.md` / `strategy-selection.md` to see the construction-vs-strategy split done cleanly.
2. **Set up the folder structure** under `.claude/skills/ig-carousel/`:
   ```
   ig-carousel/
   ├── SKILL.md              # lean, brand-agnostic, construction-only
   ├── HANDOFF.md            # this file
   ├── references/
   │   ├── carousel-anatomy.md       # header/body/footer/logo + slide zones
   │   ├── social-typography.md      # type scale for IG
   │   ├── color-system.md           # emphasis pattern, slide variants
   │   ├── background-images.md      # full-bleed, inset, overlay gradients
   │   ├── image-generation.md       # Nano Banana prompts, output paths, fallbacks
   │   ├── export.md                 # Puppeteer pipeline
   │   ├── strategy-selection.md     # all psychology content (moved verbatim)
   │   ├── hook-formulas.md          # hook patterns by strategy
   │   └── action-playbooks.md       # CTA action selection
   └── templates/
       └── carousel-config.md        # .carousel.md template
   ```
3. **Migrate content:**
   - Move all psychology sections (Strategy Selection, Specificity Rule, Hook Psychology, Hook Style, Conversation Test, Hook Formula by Strategy, Hook Rules, Action Playbooks, Auto-Select tables, Emotional Psychology Strategies, Structural Strategies) into the psychology references — **verbatim, just relocate**.
   - Move construction pieces (Typography Scale, Slide Anatomy, Emphasis Pattern, Bottom Element Variants, Reference Implementation, Quick Checklist) into the construction references.
   - Keep the lean orchestration in `SKILL.md`: config resolution → layout → typography → color → backgrounds → components → output → export.
4. **Strip LoopLinq specifics from `SKILL.md`:**
   - Remove `looplinq.com` references — pull CTA text from `.carousel.md`.
   - Remove the hardcoded LoopLinq logo SVG reference — pull logo from config / `DESIGN.md`.
   - Remove the LoopLinq-specific `--primary: #FF5D02` defaults — all colors come from config.
   - CTAs like "Start Free" become templates with `{brand.cta}` substitution.
5. **Add a `.carousel.md` template** at `templates/carousel-config.md`:
   - Brand: name, voice, audience, URL, logo path.
   - Typography: headline font, body font, mono font, sizes.
   - Color: primary, primary-dark, dark, white, muted variants.
   - Carousel: default slide count, aspect ratio, default hook style.
   - CTA defaults: pill text, product signup URL, keyword triggers.
6. **Discovery mode** — if no `.carousel.md` exists when the skill runs, ask the user 4 questions and generate one. Mirror the carousel-skill pattern.
7. **Write the LoopLinq `.carousel.md`** in the project root once the template exists — that's how LoopLinq's brand gets reconnected after the refactor.
8. **Add new sections** that are currently missing:
   - `references/background-images.md` — full-bleed, inset, overlay gradients.
   - `references/image-generation.md` — Nano Banana prompts, output paths, fallbacks.
9. **Frontmatter:** update skill description to drop any brand assumption — "Use when creating Instagram carousel slides for any brand. Reads `.carousel.md` for brand tokens."

## Why this matters

- **The skill becomes reusable for any content strategy.** Right now the skill assumes a specific school of psychology (fear-first, conversational, etc.). If a user wants a different voice, the skill fights them.
- **The psychology doc becomes a standalone asset.** It's actually well-developed copywriting guidance that's currently buried inside a build manual.
- **The skill stays lean.** Easier to update construction mechanics without touching strategy, and vice versa.

## Out of scope for this handoff

- Don't rewrite the psychology doc — just relocate it.
- Don't change the HTML/CSS template (`ig-carousel/index.html`) unless the background-image or Nano Banana sections require new scaffolding.
- Don't touch the export script.
