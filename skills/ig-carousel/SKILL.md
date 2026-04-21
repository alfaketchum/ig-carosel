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

All layout values — theme color mappings, typography scale, slide anatomy zones, emphasis rules, and allowed bottom-element variants — live in `.carousel.md` under the `layout` key. **Do not hardcode layout values in generated slides; pull them from config.** The schema below is universal; values are per-brand.

### Slide Themes

Resolve `layout.themes` from `.carousel.md`. Each theme declares a **role** (how references and narratives refer to it) plus a set of color layers:

- `role` — one of `anchor` (high-contrast brand surface for hooks + CTAs), `body` (readable dark surface for middle content), `alt` (secondary surface for variety). Brands can add more roles as needed.
- `background` — slide background color
- `label` — color of the uppercase label
- `headline` — color of the main headline
- `emphasis` — color applied to `<em>` inside headlines (text or highlight bg, depending on `layout.emphasis.style`)
- `bottom_text` — color of the stat/bullets in the bottom zone

Render each theme as a CSS class **named by role**, not by theme key: `.slide--{role}`. This keeps `references/` and generated HTML aligned — a brand renaming theme keys doesn't break the references. Every role should appear at most once across themes.

### Typography Scale

Resolve `layout.typography` from `.carousel.md`. Each role (`headline`, `label`, `body`, `list`, `cta`) declares `font`, `size`, `weight`, `spacing`, and optionally `transform`. Apply verbatim to the matching CSS class.

Load fonts via Google Fonts (or local `@font-face` if the design system specifies local files).

### Slide Anatomy

Resolve `layout.zones` from `.carousel.md`. Each slide stacks the listed zones top-to-bottom, vertically centered. The default schema is three zones:

```
┌─────────────────────┐
│                     │
│   {zones[0]}        │  ← e.g. label
│                     │
│   {zones[1]}        │  ← e.g. headline (h2, with <em> emphasis)
│                     │
│   {zones[2]}        │  ← e.g. bottom (stat / list / CTA pill / bullets)
│                     │
└─────────────────────┘
```

If a brand defines fewer or more zones in `.carousel.md`, render accordingly.

### Emphasis Pattern

Resolve `layout.emphasis.style` from `.carousel.md`. Emphasis colors live on each theme (`theme.emphasis`), not in a separate lookup.

**Emphasis is earned, not required.** Only wrap a word or phrase in `<em>` when it is the *payload* of the sentence — a specific number, proper noun, twist word, or claim that lands differently without the emphasis.

**The earned test:** remove the `<em>`. If the sentence still works the same way, drop it. If the sentence loses its punch, keep it.

**Distribution across a 6-slide carousel:**
- **Hook slide (slide 1)** — almost always earns emphasis. The twist word is the payload.
- **Proof / reveal / stat slides** — usually earn emphasis. The specific number, name, or term is the payload.
- **Argument slides** — usually do NOT earn emphasis. The whole sentence is the point; italicizing a phrase inside it dilutes the argument.
- **CTA slide** — earns emphasis only when a specific action word or keyword is the payload (e.g. a comment keyword). Share prompts often don't need it.
- **Expected count:** 2-4 slides with emphasis out of 6. Never zero (hook earns at least one); never all six (the pattern becomes decoration and loses its meaning).

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

### Bottom Element Variants

Resolve `layout.bottom_variants` from `.carousel.md`. The allowed components for the bottom zone (default: `stat`, `list`, `pill`, `bullets`). The skill picks one per slide based on content + selected action:

- **Stat text** — `<p class="slide-stat">…</p>`
- **List (struck-through)** — `<div class="tool-list"><span class="tool-item">…</span></div>`
- **CTA pill** — `<a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>`
- **Bullet points** — body font, stacked with small gap, color from `layout.themes[theme].bottom_text`

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

→ See `references/caption-writing.md` for the full rules. The central principle: **the first ~125 characters must earn the reader's "... more" tap.** Everything else is secondary.

**Process:**
1. Load `references/caption-writing.md`.
2. Draft a first line using one of the six opening patterns (story opener / counter-intuitive / specific intrigue / confession / specific observation / question-then-negated). Target `caption.hook_target_length` chars (default 80).
3. Run the earned test: would a creator friend ask "what's this about?" if you sent them just the first line? If not, rewrite.
4. Write the body (length per `caption.body_length`): deliver the hook's payoff → add context the slides couldn't fit → bridge to "why this matters for the reader."
5. Add the engagement prompt. Match to the carousel's selected CTA action (`caption.engagement_style: auto` resolves to the action chosen in Step 6). No generic "let me know what you think!"
6. Pull hashtags from `caption.hashtag_pools` (brand + topic + reach), mix per strategy, cap at `caption.hashtag_count`. Topic hashtags are skill-selected based on this carousel's content.
7. Verify: total caption ≤ 2,200 chars, first ~125 chars stand alone, no anti-patterns (no greetings, no opening hashtags, no duplicating the slide 1 hook verbatim).
8. Write to `{layout.output_dir}/YYMMDD-topic-slug/caption.md`.

The caption.md lives alongside the HTML and (once exported) the PNGs. Human-readable — the user can edit before publishing.

## Step 8: Export Slide Images

After generating the HTML carousel and caption, export each slide as a high-quality PNG for uploading to Postiz or any social media manager.

**Folder naming:** `{layout.output_dir}/YYMMDD-topic-slug/` (e.g. `ig-carousel/260409-nikki-glaser-confession/`)

**Export process:**
1. Run the export script at the path from `.carousel.md` (`layout.export_script`, default `ig-carousel/export-slides.mjs`):
   `node ig-carousel/export-slides.mjs "ig-carousel/YYMMDD-topic-slug/"`
2. The script uses Puppeteer to screenshot each slide at 1080x1350 @ 2x retina (2160x2700 actual pixels)
3. Output: `slide-01.png`, `slide-02.png`, etc.
4. Verify at least slide 1 and the last slide visually using the Read tool

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
├── SKILL.md                      ← this file (construction only)
├── HANDOFF.md                    ← status + open handoffs
├── references/
│   ├── strategy-selection.md     ← strategy table + Specificity Rule
│   ├── hook-formulas.md          ← hook format, psychology, rules, formulas by strategy
│   ├── structural-narratives.md  ← slide-by-slide arcs per strategy
│   ├── action-playbooks.md       ← CTA slide playbooks per action type
│   └── caption-writing.md        ← IG caption craft — earn the "...more" tap
├── templates/
│   └── carousel-config.md        ← `.carousel.md` template for new projects
├── commands/
│   ├── init-carousel.md          ← procedure to generate `.carousel.md` from DESIGN.md
│   └── sync-carousel.md          ← detect + fix drift between `.carousel.md` and DESIGN.md
└── handoffs/
    └── image-generation.md       ← open handoff for image/chart slide support
```
