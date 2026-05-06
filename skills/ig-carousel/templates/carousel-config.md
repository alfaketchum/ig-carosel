---
# `.carousel.md` — per-project config for the ig-carousel skill.
# Drop this file in the project root. The skill reads it at runtime
# so the same skill works for any brand.

brand:
  name: "Your Brand"                # IG header username, first-person mentions
  url: "yourbrand.com"              # CTA pill text
  cta: "Start Free"                 # Default pill suffix (pairs with brand.url)
  cta_product: "Get Started Today"  # Product-signup CTA (for 🔗 Product action)
  logo_svg: "path/to/logo.svg"      # Path to inline-able SVG, OR paste SVG inline below
  # logo_svg_inline: |
  #   <svg ...>...</svg>

voice:
  tone: conversational              # conversational | editorial | punchy
  hook_style: fear-first            # fear-first (default) | positive
  audience: "your audience"         # Short descriptor, used for framing
  # Optional keyword triggers that override Auto-Select Action for specific topics
  # keyword_actions:
  #   "free guide": comment-keyword
  #   "hot take": controversy

design:
  # Either point at DESIGN.md…
  design_md: "DESIGN.md"
  # …or set tokens inline. Inline tokens win if both are present.
  primary: "#FF5D02"
  primary_dark: "#1B1F3B"
  dark: "#0A0A0F"
  white: "#FFFFFF"
  muted_white: "rgba(255,255,255,0.45)"  # optional; derived if omitted
  dim_white: "rgba(255,255,255,0.35)"    # optional; derived if omitted

  headline_font: "DM Serif Display"
  body_font: "DM Sans"
  mono_font: "JetBrains Mono"            # falls back to body_font if omitted

# =====================================================================
# LAYOUT — brand-agnostic schema, per-project values.
# Every field resolves to a design token (e.g. "{design.primary}") or a
# literal value. Override whatever you want; the shape itself is universal.
# =====================================================================
layout:
  aspect_ratio: "1080/1350"         # slide aspect
  default_slide_count: 6
  output_dir: "ig-carousel"
  # Absolute path to bin/export-slides.mjs in the carousel-skill repo.
  # The script and its puppeteer dependency live there, not per-brand.
  export_script: "<absolute-path-to>/carousel-skill/bin/export-slides.mjs"

  # The 3 vertical zones inside every slide, top to bottom.
  # Rename or reorder if your brand uses a different anatomy.
  zones:
    - label        # small uppercase tag
    - headline     # primary message, large serif (or whatever)
    - bottom       # stat, list, CTA pill, or bullets

  # Slide themes — 3 variants mapped from design tokens.
  # Each theme declares a `role` (how narratives reference it) and a set
  # of color layers. The skill generates `.slide--{role}` CSS classes.
  #
  # Roles:
  #   anchor  — high-contrast brand surface used for hooks + CTAs
  #   body    — readable dark surface used for middle content
  #   alt     — secondary surface for variety (summaries, white variants)
  #
  # Theme keys below (dark/primary/white) can be renamed freely; what
  # matters is the `role` value. Each role should appear at most once.
  themes:
    dark:
      role: body
      background: "{design.dark}"
      label: "{design.primary}"
      headline: "{design.white}"
      emphasis: "{design.primary}"
      bottom_text: "{design.muted_white}"
    primary:
      role: anchor
      background: "{design.primary}"
      label: "{design.primary_dark}"
      headline: "{design.primary_dark}"
      emphasis: "{design.white}"
      bottom_text: "{design.primary_dark}"
    white:
      role: alt
      background: "{design.white}"
      label: "{design.primary}"
      headline: "{design.dark}"
      emphasis: "{design.primary}"
      bottom_text: "#8C8C8C"

  # Typography scale — role → font/size/weight/spacing.
  # If you ran /init-carousel, the values below were chosen by preset
  # (standard | loud | massive). See commands/init-carousel.md →
  # Typography Presets for the full table. Hand-editors can tweak
  # the clamp() triples directly; the skill reads them verbatim.
  typography:
    headline:
      font: "{design.headline_font}"
      size: "clamp(24px, 5.5vw, 72px)"
      weight: 400
      spacing: normal
    label:
      font: "{design.body_font}"
      size: "clamp(10px, 2.2vw, 24px)"
      weight: 600
      spacing: "0.2em"
      transform: uppercase
    body:
      font: "{design.body_font}"
      size: "clamp(12px, 2.6vw, 28px)"
      weight: 400
      spacing: normal
    list:
      font: "{design.body_font}"
      size: "clamp(10px, 2.2vw, 24px)"
      weight: 500
      spacing: normal
    cta:
      font: "{design.mono_font}"
      size: "clamp(11px, 2vw, 22px)"
      weight: 600
      spacing: "0.03em"

  # Emphasis — how `<em>` inside headlines renders.
  # Each theme above declares its own `emphasis` color; this block picks
  # WHICH rendering mode uses that color.
  #
  #   italic          → italic text, color = theme.emphasis
  #   bold            → bold text, color = theme.emphasis
  #   italic-underline→ italic + underline, color = theme.emphasis
  #   highlight       → highlighter background, bg = theme.emphasis
  #                     (text stays the normal headline color)
  #   italic+highlight→ italic text ON a highlight; each theme's
  #                     `emphasis` becomes { text, bg } (see note below)
  emphasis:
    style: italic

  # Bottom element variants — the components allowed in the bottom zone.
  # The skill picks one per slide based on content + action.
  bottom_variants:
    - stat       # single-line stat text
    - list       # struck-through list (tools, options)
    - pill       # CTA pill (most common on last slide)
    - bullets    # stacked bullet points

  # Slide-type vocabulary — which layouts this brand's carousels can use.
  # `static_text_only` is always implicit (universal fallback). Brands
  # declare which *additional* layouts the skill is allowed to pick from.
  # Full spec: skills/ig-carousel/references/slide-types.md
  #
  # Available types:
  #   static_text_only           — label/headline/bottom (default, always enabled)
  #   captioned_image            — label/image/caption
  #   full_frame_image           — image fills slide, optional caption
  #   text_over_image            — image background + overlaid headline
  #   pull_quote                 — quote mark/quoted text/attribution
  #   big_number                 — label/huge stat/context
  #   side_by_side_comparison    — A/B columns + verdict
  #   numbered_list              — label/numbered stack/context
  slide_types_enabled:
    - static_text_only

  # Strategy — how the skill picks slide types WITHIN a single carousel.
  # Only matters when more than one type is enabled.
  #   uniform                   — all slides in a carousel use the same type (default)
  #                               skill picks the dominant type per carousel from content
  #   mixed                     — each slide picks independently from enabled types
  #                               based on content signals; max content fit, less rhythm
  #   element_locked            — specific type per theme role (see slide_type_element_map)
  #   auto_select_slide_type    — skill picks the strategy per carousel based on content
  #                               (cedes control to the skill; lowest friction)
  slide_type_strategy: uniform

  # Only used when slide_type_strategy: element_locked
  # Map theme roles (anchor / body / alt) to specific slide types.
  # Each mapped type MUST appear in slide_types_enabled above.
  # slide_type_element_map:
  #   anchor: static_text_only
  #   body: captioned_image
  #   alt: pull_quote

  # Image sources — only relevant if any image-using types are enabled.
  # Phase 1 supports `user` (paths provided per-slide). Phase 2: `local_library`.
  images:
    mode: optional               # never | optional | encouraged
    sources:
      - user

# =====================================================================
# CAPTION — every carousel ships with a caption generated alongside
# the slides. The core rule: the first ~125 chars must earn the
# reader's "... more" tap. See references/caption-writing.md.
# =====================================================================
caption:
  enabled: true
  hook_target_length: 80            # chars — aim well below the 125 truncation cliff
  body_length: medium               # short (100-150w) | medium (200-300w) | long (400-500w)
  engagement_style: auto            # auto (match carousel action) | question | share | save | controversial
  hashtag_count: 12
  hashtag_placement: caption        # caption | first-comment
  hashtag_pools:
    brand: []                       # always included (1-3 tags)
    topic: []                       # skill adds content-relevant tags (5-8)
    reach: []                       # broad discoverability tags (2-4)

# =====================================================================
# PUBLISHING — wire the carousel to Postiz for scheduled IG posts.
# Opt-in per brand. Disabled by default to prevent accidental publishes.
# Auth: run `postiz auth:login` once; credentials stored at
# ~/.postiz/credentials.json. The skill never sees the API key.
# See commands/publish-carousel.md for the procedure.
# =====================================================================
publishing:
  postiz:
    enabled: false                  # opt-in flag — must be true to publish
    integration_id: ""              # from `postiz integrations:list` (e.g. cmoszdgm901t8mq0y2su6zxe3)
    integration_type: "instagram-standalone"  # instagram | instagram-standalone
    post_type: "post"               # post | story
    default_type: "draft"           # draft | schedule  (start with draft for safety)
    default_offset_minutes: 60      # if schedule, post N minutes from now (or use --at)
    require_confirmation: true      # always show preview + confirm before submitting
---

# Notes (free-form, optional)

Use this section for brand-specific guidance the skill should absorb but doesn't fit above:

- Common CTAs / lead magnets your brand uses
- Phrases to avoid (banned words, trademarked terms, off-brand voice)
- Recurring series names or hashtags
- Example hooks that nailed your voice (good reference material for the skill)
