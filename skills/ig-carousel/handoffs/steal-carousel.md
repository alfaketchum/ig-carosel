---
status: open (design only — not built)
created: 2026-05-06
updated: 2026-05-06
owner: AJ
priority: medium (unblocks slide-type vocabulary growth + brand bootstrap)
---

# Handoff: `/steal-carousel` — Reverse-Engineer IG Carousels

## Context

The skill currently writes carousels from scratch given a brand config + source content. There's no path *in* — no way to point at a high-performing IG carousel in the wild and say *"replicate this shape, this type rhythm, this brand stamp, with my content."*

This handoff proposes `/steal-carousel`: a picasso-parallel command that ingests a reference IG carousel (URL or PNG folder) and produces:

1. **A slide-type rhythm map** — what type each slide was, in order. Drives a new "rhythm preset" the user can apply to their own content.
2. **Extracted brand tokens** — palette, typography family inference, padding, theme rotation pattern. Optionally written to a fresh `.carousel.md` skeleton.
3. **A vocabulary diff report** — which observed slides map cleanly to one of our 8 types, and which expose a *missing* type we should consider adding.

The third output is the load-bearing one. **The skill's slide-type vocabulary is currently 8 types defined from first principles** (`references/slide-types.md`). Stealing real carousels stress-tests that vocabulary against what top creators actually ship — and is the cheapest way to surface gaps without building speculatively.

This handoff is the sister doc to `image-generation.md`. That one designed the *internal* slide-type system. This one designs the *intake pipe* that feeds the vocabulary with real-world signal.

---

## Why this matters now

Three pulls:

1. **`image-generation.md` shipped the vocabulary in spec form.** Phase 1a (`static_text_only`, `captioned_image`, `full_frame_image`) is built. Phase 1b+ (the remaining 5) are designed but not yet rendered. The phase order assumed real friction would surface what to build next. Stealing carousels is a faster signal than waiting for organic friction.

2. **Brand bootstrap is currently a 6-question `/init-carousel` interview.** Good for greenfield. Bad if the user already has visual references they love and just wants to clone their feel. `/steal-carousel <url>` skips the interview when a reference exists.

3. **`/clone-carousel` was hinted at in the 2026-05-06 evening session** (see `image-generation.md` "Update 2026-05-06"). That's this command — renamed to `/steal-carousel` per the user's framing in the same conversation that created this handoff. "Steal" is more honest about the action; "clone" implied 1:1 reproduction we don't actually do.

---

## What "stealing" actually extracts

Deliberate scope. The command is NOT a copy machine. It produces a *rhythm and identity skeleton*, not the original carousel's copy.

| Layer | Extracted | Not extracted |
|---|---|---|
| **Per-slide type** | Which of the N slide types this slide is (Static Text Only / Pull Quote / Big Number / etc.) | The exact headline copy |
| **Per-slide role** | `anchor` / `body` / `alt` inferred from background contrast | — |
| **Type rhythm** | The ordered sequence — `[anchor:hook → body:big_number → body:static → alt:static → anchor:cta]` | — |
| **Brand palette** | Top 4-6 dominant colors, mapped to `primary` / `dark` / `white` / `primary_dark` slots | — |
| **Typography family** | Serif vs sans inference per zone (headline / body / mono). Family name is best-guess or "needs user input" | Exact font weights without OCR confidence |
| **Layout signature** | Padding ratio, headline scale (small / loud / massive preset), label position | Pixel-perfect reproduction |
| **Emphasis style** | `italic` / `bold` / `highlight` / `italic+highlight` inferred from emphasized words across the carousel | — |
| **Theme rotation** | Pattern of theme switches across slides (e.g. "anchor → body × 4 → alt break → anchor"). Feeds `hook_themes_allowed` candidates. | — |

What this gives the user: a `.carousel.md` skeleton + a "this carousel uses Static Text Only × 5 with one Big Number break in the middle, primary-dark theme, italic emphasis" rhythm note. They feed their own content to the skill and get a carousel with the same *shape*.

---

## Vocabulary expansion — observed types not yet in the 8

The 8 types in `references/slide-types.md` are sufficient for ~80% of editorial / educational / contrarian carousels we've seen so far. Stealing surfaces the long tail. Candidates observed in real-world IG carousels but not yet in the vocabulary:

| Candidate | What it looks like | Real-world example | Fits existing? |
|---|---|---|---|
| **Cover Slide** | Distinct from the hook — minimal title + slide count badge ("8 / 8" or "Inside →"). Often a separate identity layer. | Many "8 mistakes" / "5 lessons" carousels lead with this before the actual hook | Could be Static Text Only, but rhythm-wise it's a *separate role* — a "title card" before the content. Worth a `cover_slide` type if observed often. |
| **TOC / Index** | "What's inside" — numbered list of upcoming slide topics. Always slide 2. | Common in long-form (10+ slide) educational carousels | Maps to `numbered_list` — but the *intent* is preview, not teaching. Same layout, different purpose. |
| **Annotated Screenshot** | Screenshot with overlaid arrows / circles / handwritten callouts. | Tutorial carousels, before-after UI showcases | Doesn't fit. Captioned Image is too clean — annotations are part of the slide. New type: `annotated_image`. |
| **Chat / DM Screenshot** | Faked or real conversation thread. Speech bubbles, sender names, timestamps. | Sales call recap, "what my client said" carousels | Doesn't fit cleanly. Could be `text_over_image` but the bubbles are structural, not decorative. New type: `chat_screenshot`. |
| **Receipt / Stat Card** | Stylized "card" with a single big metric, contextual subtext, and a small chart line. | Revenue announcements, growth flexes | Big Number covers the metric. The card framing + chart line is extra. Maybe a `metric_card` variant. |
| **Punctuation Slide** | One word or punctuation mark, full-bleed, huge serif. ("WAIT.", "Why?", "...") | Used as a midcarousel pause / pattern interrupt | Functionally a Static Text Only with a 1-word headline. May not need its own type — but worth tracking if the rhythm consistently uses these. |
| **Step-Process** | Numbered or arrowed sequence of mini-frames within one slide. | "How I did it: step 1 → step 2 → step 3" | Different from `numbered_list` — items are visual frames, not text rows. New type: `process_steps`. |
| **Avatar / Headshot Strip** | Row of 3-5 faces or avatars with names. Testimonial / "as seen in" wall. | Social proof slides | New type: `avatar_strip`. |
| **Comparison Grid (3+ cells)** | Like Side-by-Side Comparison but 3 or 4 columns instead of 2. | Tool/service comparisons | Possibly an extension of `side_by_side_comparison` (allow `cells: 3` config) rather than a new type. |
| **Diagram / Flowchart** | Boxes + arrows showing a process or relationship. | Framework slides, system diagrams | New type: `diagram`. CSS-fiddly — defer unless observed often. |

**Decision rule for adding a new type:** observe it in ≥3 stolen carousels across ≥2 different brands before committing. Otherwise, force-fit into existing types and note the awkwardness in the diff report.

---

## Workflow

```
User: /steal-carousel https://www.instagram.com/p/{post-id}/
     |
     v
[1] Acquire slide images
     - Try yt-dlp / instaloader (likely blocked without auth)
     - Fall back to: ask user to paste screenshots / a folder of PNGs
     - Required input: ordered list of 1080x1350 (or similar) PNGs
     |
     v
[2] Per-slide vision pass
     - Send each PNG to a vision-capable model
     - Extract: detected slide type, dominant colors, headline text presence,
       font family guesses (serif/sans), label position, image presence
     - Output: structured JSON per slide
     |
     v
[3] Aggregate
     - Brand palette: cluster colors across all slides, map to design tokens
     - Type rhythm: ordered list of detected types
     - Theme rotation: ordered list of detected roles
     - Typography preset: inferred from headline scale (count chars, measure
       relative size)
     - Emphasis style: which words across the carousel were italicized /
       highlighted / bold
     |
     v
[4] Vocabulary diff
     - For each detected type, check if it maps to one of the 8 known types
     - If not → flag as candidate new type (see table above)
     - Report: "6/7 slides mapped cleanly. Slide 4 was a chat screenshot
       (no type match). Suggest reviewing for vocabulary expansion."
     |
     v
[5] Emit .carousel.md skeleton
     - Pre-populate: design tokens (palette, font guesses), layout
       (typography preset, emphasis style), slide_types_enabled (the
       observed set), slide_type_strategy (uniform if all same, else
       mixed), hook_themes_allowed (the observed roles for slide 1
       across multiple stolen carousels — needs ≥2 inputs for a real signal)
     - Save to: <user-chosen-folder>/.carousel.md
     |
     v
[6] Emit rhythm note
     - Markdown summary: "This carousel is 7 slides. Static Text Only × 5,
       Big Number × 1, Pull Quote × 1. Theme rhythm: anchor → body × 5 →
       anchor. Average headline length: 18 words. Italic emphasis on
       2 of 7 slides (the hook and the big number)."
     - Saved to: <user-chosen-folder>/.steal-notes.md
     |
     v
User reviews, edits the skeleton, runs /ig-carousel against their content
```

### Acquisition — the hard part

Instagram aggressively blocks scraping. Three realistic paths:

1. **Manual screenshots** — user opens the post in their browser, screenshots each slide, drops them in a folder, passes the folder path to the command. Most reliable, lowest tech debt.
2. **`instaloader` (CLI tool)** — works if user is logged in (cookie-based). Fragile when IG ships UI changes.
3. **Postiz / IG Graph API** — only works for posts on accounts the user owns. Doesn't help for stealing competitors' carousels.

Recommend Path 1 as the default; document Path 2 as an optional shortcut for users with `instaloader` set up. Avoid building scraping infrastructure into the skill.

---

## Output: a stolen `.carousel.md` skeleton

Example of what the command emits after stealing a real carousel:

```yaml
# Stolen from: https://www.instagram.com/p/{post-id}/
# Stolen on: 2026-05-06
# Slides analyzed: 7
# See .steal-notes.md for the full rhythm report.

brand:
  name: "REPLACE-WITH-YOUR-BRAND-NAME"
  url: "REPLACE-WITH-YOUR-URL"
  cta: "Start Free"             # default CTA suffix; edit per brand
  cta_product: "Get Started"
  logo_svg: ""                  # not extractable; you'll paste your own SVG

design:
  primary: "#FF5D02"            # extracted from slide 1 background
  primary_dark: "#5F2606"       # extracted from slide 1 label color
  dark: "#1A0E04"               # extracted from slides 2-6 background
  white: "#FFFFFF"

  headline_font: "DM Serif Display"   # GUESS — serif inferred. Verify before use.
  body_font: "DM Sans"                # GUESS — sans inferred.
  mono_font: "JetBrains Mono"         # default; not actually observed

layout:
  themes:
    primary: { role: anchor, ... }    # filled per detected colors
    dark:    { role: body,   ... }
    # alt theme inferred-or-not depending on whether a third color appeared

  slide_types_enabled:
    - static_text_only           # 5 of 7 slides
    - big_number                 # 1 slide (slide 3)
    - pull_quote                 # 1 slide (slide 5)

  slide_type_strategy: mixed     # because >1 type observed

  hook_themes_allowed: [anchor]  # only one carousel observed; widen this if more get stolen

  emphasis:
    style: italic                # detected on the hook slide
```

The user reviews, replaces the `brand.*` fields with their own identity, and runs `/ig-carousel` against their content using this brand stamp.

---

## Open questions

1. **Vision-model dependency.** Step 2 needs a vision-capable model run per slide. Cost-per-steal matters if this becomes routine. Alternative: simpler heuristic-based extraction (color quantization for palette, edge detection for layout zones) without the vision call. Worth prototyping both.

2. **Type detection accuracy.** Vision models confuse `pull_quote` (italic body) with `static_text_only` (italic emphasis). Need an explicit prompt schema with examples per type — or accept some manual correction step.

3. **Font family inference.** Possible to infer "serif vs sans" from a screenshot. Not possible to identify "DM Serif Display" specifically. The skeleton should default to *one safe pick per family* and flag for user verification.

4. **Plagiarism / ethics.** Stealing rhythm and type vocabulary is fair use territory. Stealing actual copy is not. The command extracts the *shape*, not the words. Worth saying that explicitly in the command's prompt — and probably refusing to emit observed copy in the rhythm report (just word counts and structural notes).

5. **Bootstrap vs replication.** Two distinct user intents:
   - **Bootstrap** — "I love this brand's feel; help me start a brand like that." → emits skeleton.
   - **One-off replicate** — "I want to do one carousel in this exact style, then drop it." → no `.carousel.md` write; just the rhythm note.

   Should the command have a flag (`--bootstrap` vs `--rhythm-only`)? Probably yes — defaults matter. Default to `--rhythm-only` (less invasive); user opts into `--bootstrap` when they actually want to lock in the brand.

6. **What to do when no slide type matches.** If a stolen slide is, say, an avatar strip, the diff report flags it. But the emitted skeleton has nowhere to put it (the type isn't in `slide_types_enabled`). Options: omit the slide from the rhythm; include it with a `type: unknown` placeholder; force-fit it into the closest existing type and note the loss.

7. **Multi-carousel stealing.** If the user passes 5 URLs, the aggregate signal is much stronger (palette stable across 5 = real; on 1 = noise). Worth designing for batch input from day one rather than retrofitting later.

8. **Where this lives in the skill.** Probably `commands/steal-carousel.md`. Or a separate plugin if vision dependencies pull in too much weight. Default to in-skill until weight justifies splitting.

---

## Recommended build phasing

1. **Phase 0 — design ratification.** Show this handoff to the user, confirm the scope. Decide on Path 1 (manual screenshots) vs investing in `instaloader` integration. Decide on default mode (`--rhythm-only` vs `--bootstrap`).
2. **Phase 1 — manual ingestion + vision pass.** Build against a folder of PNGs; defer URL-to-PNG. Get the per-slide JSON working. Validate type detection on 5-10 known carousels (use Looplinq's existing carousels as ground truth — we know what types each slide is).
3. **Phase 2 — aggregation + skeleton emit.** Wire the per-slide outputs to a `.carousel.md` writer. Test against a brand we already have (Looplinq) — does the emitted skeleton match the hand-written `.carousel.md` closely? That's the accuracy benchmark.
4. **Phase 3 — vocabulary diff loop.** After 5+ real stolen carousels, audit the diff reports. Promote candidate new types if they appear in ≥3 stolen carousels across ≥2 brands. Update `references/slide-types.md`.
5. **Phase 4 — URL acquisition.** Only if Phase 3 proves the rest of the pipeline is worth the effort. Bolt on `instaloader` or a similar CLI as an optional convenience.

Don't build all phases in one go. Each phase has its own validation gate.

---

## Out of scope for this handoff

- **Vision model selection** — defer. Use whatever's cheapest at build time.
- **AI-generated remix carousels** ("steal this and write me a similar one with my topic") — that's `/ig-carousel` already, just chained after `/steal-carousel`. Don't bake the chain into the command itself; let the user do it.
- **Brand-asset extraction beyond colors + fonts** — no logo extraction (requires segmentation), no avatar extraction.
- **Stealing video / Reels** — different medium, different vocabulary. Out.
- **Cross-platform stealing (TikTok / X threads)** — out. Different pipelines.
- **Republishing stolen content verbatim** — never. The command emits *shape* metadata, not copy.

---

## Related files

- `skills/ig-carousel/HANDOFF.md` — link this handoff into the open-handoffs section once design is ratified
- `skills/ig-carousel/handoffs/image-generation.md` — sister handoff that built the vocabulary this command stress-tests
- `skills/ig-carousel/references/slide-types.md` — the 8-type vocabulary definition; gains new entries if Phase 3 surfaces them
- `skills/ig-carousel/commands/init-carousel.md` — alternate path (interview-driven) that this command bypasses for users with references
- `skills/ig-carousel/commands/steal-carousel.md` — **new file** when built; the command's procedural recipe

---

## Key framing (for future-me context)

> "Create a handoff MD in the skill to get to steal IG carousel, and defining the various slide types."

The command is a vocabulary growth engine before it's a brand bootstrap tool. Bootstrap is the user-facing benefit; vocabulary growth is the long-term skill benefit. Both are real, but priority them in that order during the build — emit the diff report even if the `.carousel.md` writer is unfinished.
