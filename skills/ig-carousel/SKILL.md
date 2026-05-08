---
name: ig-carousel
description: Use when creating Instagram carousel slides — social media content, carousel posts, IG slides, slide decks for Instagram. Triggers on "carousel", "IG post", "instagram slides", "social content". Reads a project-level `.carousel.md` for brand tokens so the same skill works for any brand.
---

# IG Carousel Generator

Generate on-brand Instagram carousel slides as a single HTML file with swipeable preview. Skip brainstorming — go straight to building. This file is the **construction manual**. All copywriting strategy lives in `references/`.

## Step 1: Resolve the Brand Config

Every carousel is driven by a per-project config. Find it in this order:

1. **`.carousel.md`** at the project root — the primary source of brand tokens, voice, and defaults. If found, read and use it.
2. **`DESIGN.md`** at the project root — fallback for design tokens when `.carousel.md` delegates to it (or doesn't exist).
3. **`product.md`** at the project root — optional product context used to tailor CTAs.
4. **None of the above** — run the init flow at `commands/init-carousel.md`, which either extracts tokens from DESIGN.md (if found) or asks the user for each one, then writes `.carousel.md` from `templates/carousel-config.md`.

If the user explicitly asks to "init carousel", "set up carousel", or "generate .carousel.md", go directly to `commands/init-carousel.md`.

Extract and bind these tokens (all referenced as `{brand.*}` / `{design.*}` in the slide examples):

| Token | Source | Notes |
|-------|--------|-------|
| `brand.name` | `.carousel.md` | IG header username, first-person references |
| `brand.url` | `.carousel.md` | Pill text (e.g. `looplinq.com`) |
| `brand.cta` | `.carousel.md` | Default pill suffix (e.g. `Start Free`) |
| `brand.cta_product` | `.carousel.md` | Product-signup CTA (e.g. `Get Started Today`) |
| `brand.logo_svg` | `.carousel.md` or DESIGN.md | Inline SVG for the IG avatar, white variant on gradient |
| `voice.hook_style` | `.carousel.md` | `fear-first` (default) or `positive` |
| `design.primary` | `.carousel.md` or DESIGN.md | `--primary` — brand/accent color |
| `design.primary_dark` | `.carousel.md` or DESIGN.md | `--primary-dark` — dark variant |
| `design.dark` | `.carousel.md` or DESIGN.md | `--dark` — darkest background |
| `design.white` | `.carousel.md` or DESIGN.md | `--white` |
| `design.muted_white` | derive or config | `rgba(255,255,255,0.45)` if unspecified |
| `design.dim_white` | derive or config | `rgba(255,255,255,0.35)` if unspecified |
| `design.headline_font` | `.carousel.md` or DESIGN.md | Display/serif |
| `design.body_font` | `.carousel.md` or DESIGN.md | Sans-serif/UI |
| `design.mono_font` | `.carousel.md` or DESIGN.md | Monospace for CTA pills (falls back to body) |

**Rule:** nothing hardcoded in this file is brand-specific. If you find yourself writing a literal brand name or color value into the output, pull it from the config instead.

## Long-source workflow (optional)

If the user provided a long source (article, thread, transcript, paper ≥ ~800 words), spawn the **source-distillation subagent** before doing Steps 2–7 yourself. The subagent parses + drafts in isolation and returns a small structured plan; main context picks up at Step 5 to render HTML.

→ See `agents/distill-source.md` for when to spawn, the inputs to pass, the output format, and the skip conditions.

For short prompts where the angle is already framed, skip the subagent and proceed through Steps 2–7 in main context.

## Step 2: Pick the Strategy

Read the user's content (article, thread, topic, bullets, or vibe). Pick the strategy that makes the strongest carousel for this content — don't ask the user which to use.

→ See `references/strategy-selection.md` for the full selection table and the Specificity Rule.

## Step 3: Write the Hook

The hook (slide 1) is non-negotiable — if it doesn't stop the scroll, slides 2-6 don't exist.

→ See `references/hook-formulas.md` for: Hook Format, Hook Psychology (Fear > Positive), Hook Style (Conversational, Not Billboard), The Conversation Test, Hook Formula by Strategy, and Hook Rules 1-7.

Respect `voice.hook_style` from `.carousel.md` — if set to `positive`, skip the Fear > Positive default.

## Step 4: Pick the Narrative Structure

Each strategy has a slide-by-slide arc that specifies slide count and theme per slide.

→ See `references/structural-narratives.md` for the 8 emotional-psychology arcs and 5 structural arcs.

## Step 5: Build the Slides

Pull theme/typography values from `.carousel.md` `layout`. Pull slot/pattern config from `.carousel.md` `slide_types_enabled.{T}`. Substitute brand slot class names into the layout primitive's CSS recipe. Each slide div carries two classes: `.slide--{role}` (colors) and `.slide--{type-key-with-dashes}` (layout).

→ See `references/slide-build.md` for the full execution detail: theme & typography resolution, slide type resolution, hook theme resolution, slide anatomy, per-pattern CSS recipes, emphasis pattern, and bottom element variants for `static_text_only`.

→ See `references/slide-types.md` for canonical defaults per type (paste-into-`.carousel.md` starter configs + when-to-pick guidance).

→ For image-using slide types (`captioned_image`, `full_frame_image`, `text_over_image`), see `references/image-sources.md` for source resolution (user / placeholder / generated / chart), the `images.yml` manifest, and brief-file conventions. Images normalize to local files `slide-NN-source.{ext}`; the HTML is source-agnostic.

## Step 6: Build the CTA Slide

The last slide drives one action. Pick the action, then design every element of the slide to drive it.

→ See `references/action-playbooks.md` for: action picker, CTA slide structure, HTML playbooks for each of the 6 actions, pill options, Auto-Select Action (by strategy), and Auto-Select CTA.

Substitute `{brand.url}`, `{brand.cta}`, and `{brand.cta_product}` from `.carousel.md` into the action HTML.

## Output

Single HTML file at `{layout.output_dir}/index.html` (default `ig-carousel/index.html`, or user-specified path) with:
- All CSS/JS inline, no build step
- Swipeable carousel with scroll-snap
- Dot indicators + arrow navigation
- IG post frame shell (avatar with logo SVG, username, actions)
- 1080x1350 (4:5 portrait) aspect ratio per slide

## Reference Implementation

Use the template at `{layout.output_dir}/index.html` as a structural reference for the HTML/CSS/JS shell (IG frame, arrows, dots, actions, scroll-snap, responsive breakpoints). Replace design tokens and slide content to match the resolved config.

When changing slide count, update:
- Number of `.slide` divs
- Number of `<button class="dot">` elements
- ARIA labels (`Slide N of M`)

## Step 7: Write the Caption

If `caption.enabled: true` in `.carousel.md`, generate a caption alongside the slides. The caption is a first-class deliverable — without it, the carousel can't be posted.

Central principle: **the first ~125 characters must earn the reader's "... more" tap.** Everything else is secondary.

→ See `references/caption-writing.md` for the full process — opening patterns, body structure, engagement prompts matched to action, hashtag mix, anti-patterns to avoid.

Output: `{layout.output_dir}/YYMMDD-topic-slug/caption.md` — human-readable, the user can edit before publishing.

## Step 8: Export Slide Images (MANDATORY)

**A carousel is not complete until PNGs are exported.** Instagram takes images, not HTML. Unless the user explicitly says "draft only" or "skip export," run the export script as the final step of every generation. Do not end your turn with only HTML.

**Folder naming:** `{layout.output_dir}/YYMMDD-topic-slug/` (e.g. `ig-carousel/260409-nikki-glaser-confession/`)

**Export process:**
1. Run the export script at the path from `.carousel.md` (`layout.export_script`). The script lives in the carousel-skill repo at `bin/export-slides.mjs` (puppeteer is installed there, not per-brand). Invoke it with the carousel folder as argument:
   `node "<carousel-skill>/bin/export-slides.mjs" "ig-carousel/YYMMDD-topic-slug/"`
2. The script uses Puppeteer to screenshot each slide at 1080x1350 @ 2x retina (2160x2700 actual pixels). It reads `{output-folder}/index.html` (not a root-level template).
3. Output: `slide-01.png`, `slide-02.png`, etc.
4. Verify at least slide 1 and the last slide visually using the Read tool. Check:
   - Content matches the slide copy
   - Label is near the upper-middle
   - Headline is centered horizontally, wraps correctly
   - Bottom element (if present) is pinned near the bottom
   - No bleed from adjacent slides at the edges
   - Emphasis rendering (italic / highlight / etc) looks correct

**If PNGs look wrong:** common causes are (a) HTML layout violates the Step 5 Slide Anatomy CSS pattern, (b) missing `.slide-spacer` on slides without `.slide-bottom`, (c) node_modules not installed (run `npm install` first). Fix the root cause, re-run the script.

**When to skip export:** only when the user explicitly asks for a draft, wants to iterate on copy before committing compute, or says "skip export." Otherwise the deliverable is incomplete.

## Quick Checklist

- [ ] `.carousel.md` resolved — all `{brand.*}` and `{design.*}` tokens mapped
- [ ] Fonts loaded (headline, body, mono)
- [ ] CSS variables use the project's actual colors
- [ ] Slides use `aspect-ratio: 1080/1350` with `scroll-snap-align: start`
- [ ] Emphasis earned, not required — 2-4 of 6 slides have `<em>`, never all six
- [ ] Labels are uppercase via CSS `text-transform`
- [ ] Dot count matches slide count
- [ ] IG header shows correct `{brand.name}` username
- [ ] IG avatar uses `{brand.logo_svg}` (white variant on gradient background) — if no logo SVG found, fall back to gradient circle
- [ ] ARIA: carousel region, slide groups, arrow labels, dot labels
- [ ] Responsive: full-bleed at <500px, padded + rounded at 501px+
- [ ] Last slide has a CTA (pill or text) driven by the selected action
- [ ] `caption.md` generated — first ~125 chars earn the expand tap; hashtags at end
- [ ] Slide images exported to `{layout.output_dir}/YYMMDD-topic-slug/` via export script
- [ ] Slide 1 and last slide verified visually

## File Map

```
ig-carousel/
├── SKILL.md                      ← this file (orchestrator only — no step-execution detail)
├── HANDOFF.md                    ← status + open handoffs
├── references/
│   ├── strategy-selection.md     ← strategy table + Specificity Rule
│   ├── hook-formulas.md          ← hook format, psychology, rules, formulas by strategy
│   ├── structural-narratives.md  ← slide-by-slide arcs per strategy
│   ├── action-playbooks.md       ← CTA slide playbooks per action type
│   ├── caption-writing.md        ← IG caption craft — earn the "...more" tap
│   ├── slide-types.md            ← 8-type slide vocabulary (canonical YAML defaults + when-to-pick)
│   ├── slide-build.md            ← Step 5 execution detail (themes, types, anatomy, CSS recipes, emphasis, variants)
│   └── image-sources.md          ← image source resolution (user/placeholder/generated/chart) + manifest + briefs
├── templates/
│   └── carousel-config.md        ← `.carousel.md` template for new projects
├── commands/
│   ├── init-carousel.md          ← procedure to generate `.carousel.md` from DESIGN.md
│   ├── sync-carousel.md          ← detect + fix drift between `.carousel.md` and DESIGN.md
│   └── publish-carousel.md       ← publish an exported carousel to IG via Postiz
├── agents/
│   └── distill-source.md         ← subagent definition for long-source carousels (≥800-word articles, threads, transcripts)
└── handoffs/
    └── image-generation.md       ← open handoff for image/chart slide support
```
