# Image Sources

How image-using slide types (`captioned_image`, `full_frame_image`, `text_over_image`) get their images. Load this when rendering an image slide; not needed for text-only carousels.

## The single load-bearing idea

**Every image source ultimately becomes a local file `slide-NN-source.{ext}` in the carousel folder.** The HTML always references that path — source-agnostic. Whether it's a user screenshot, a downloaded placeholder, an AI-gen output, or an exported CSS chart, the HTML doesn't care. This means swap-and-re-export works trivially: replace the file, run the export script.

## Available sources

| Source | What it does | Status |
|---|---|---|
| `user` | User supplies the image — per-prompt path/URL or filename convention | Always available |
| `placeholder` | Skill downloads a deterministic placeholder (Picsum, solid block, or gradient) and writes a brief file describing what to swap in | **Phase 1 — implemented** |
| `generated` | Skill calls an AI image API (nano-banana, Midjourney, DALL-E) | Phase 2 — opt-in, costs $$ |
| `chart` | Skill renders SVG/CSS using brand tokens | Phase 3 — likely becomes its own slide type |

## Brand config

In `.carousel.md`, the `images:` block declares available sources + how the skill picks:

```yaml
images:
  mode: optional                    # never | optional | encouraged
  default_source: placeholder       # which to use when no signal favors another
  source_priority:                  # resolution order for ambiguous slides
    - user                          # always wins if the user supplies one
    - chart                         # signal: data viz / comparison
    - generated                     # signal: photo / scene / illustration
    - placeholder                   # fallback

  sources:
    user:
      enabled: true
      mechanisms: [per_prompt, filename_convention]
    placeholder:
      enabled: true
      provider: picsum              # picsum | solid | gradient
      seed_strategy: deterministic  # stable per slide; re-exports stay identical
      brief_files: true             # write slide-NN-brief.md alongside placeholder
    generated:
      enabled: false                # opt-in; costs $$
      provider: nano-banana         # nano-banana | midjourney | dall-e
      style_prompt: "editorial photo, natural light, no text"
      api_key_env: NANO_BANANA_API_KEY
      cache: true                   # don't re-bill on re-export
    chart:
      enabled: false                # SVG/CSS-rendered using brand tokens
      style: brand-tokens
```

`mode` semantics:
- `never` — no slide may use an image (image-using slide types fall back to `static_text_only`)
- `optional` — image slides allowed; placeholder fills any unspecified slot
- `encouraged` — same as optional but skill biases toward picking image-using types when content signals are ambiguous

## Resolution flow per slide

For each slide that resolves to an image-using type:

```
1. User passed `slide N image: <path>` in prompt          → source: user
2. File slide-NN-source.{png,jpg,jpeg,webp} exists in folder → source: user (filename convention)
3. Slot's content signal matches `chart` AND chart enabled    → source: chart
4. Slot's content signal matches `generated` AND generated enabled → source: generated
5. Else                                                          → source: placeholder
```

User can override per slide with `slide 3 source: generated` flags in the prompt.

**Content signals:**
- `chart` — copy mentions data, comparison, percentage, "shows X over Y," chart/graph language
- `generated` — copy mentions a scene, photo, illustration, mood, environment that the brand doesn't have a real asset for

## The manifest: `images.yml`

The skill writes `images.yml` in each carousel folder, tracking which source filled each slot. This is the audit trail — re-exports use it verbatim, no re-resolution needed.

```yaml
slides:
  - slide: 1
    source: user
    path: slide-01-source.png

  - slide: 3
    source: placeholder
    provider: picsum
    seed: looplinq-260508-s3
    path: slide-03-source.jpg
    brief: slide-03-brief.md

  - slide: 4
    source: generated
    provider: nano-banana
    prompt: "A creator's home studio at golden hour, editorial photo, natural light"
    path: slide-04-source.png

  - slide: 5
    source: chart
    data: { type: bar, values: [12, 47, 31] }
    path: slide-05-source.svg
```

On re-export, if a slide's `path` already exists AND the source matches what the manifest says, the skill skips re-fetching. Manual user edits (drop a file in, replacing a placeholder) are detected on next generation: skill checks for newer files matching the canonical filename and flips the source to `user`.

## Per-source mechanics

### user

**Mechanism 1 — per-prompt:** user includes `slide N image: <path-or-URL>` in the carousel prompt.

**Mechanism 2 — filename convention:** user drops `slide-NN-source.{png,jpg,jpeg,webp}` in the carousel folder before generation. Skill detects on first read of the folder.

HTML emits: `<img src="slide-NN-source.{ext}">` where `{ext}` matches the supplied file.

### placeholder

Skill picks a `provider` from `images.sources.placeholder.provider`:
- **picsum** — `https://picsum.photos/seed/<seed>/2160/1620` (4:3 by default; matches captioned_image's aspect). Skill downloads once via `curl -L`, saves as `slide-NN-source.jpg`.
- **solid** — generates a single-color SVG using the slide's theme background. Saves as `slide-NN-source.svg`.
- **gradient** — generates a gradient SVG using the brand's primary + primary_dark. Saves as `slide-NN-source.svg`.

Seed is deterministic: `<brand-slug>-<folder-slug>-s<N>` (e.g. `looplinq-260508-claude-skills-stupid-simple-s3`). Re-exports of the same slide get the same image.

Skill writes `slide-NN-brief.md` alongside (see "Brief file shape" below).

HTML emits: `<img src="slide-NN-source.{jpg|svg}">`.

### generated

Skill drafts a prompt from:
- The slide's header + footer copy (gives content context)
- The brand's `images.sources.generated.style_prompt` (gives aesthetic context)
- A negative-prompt baseline ("no text, no watermarks, no logos")

API call (using the configured `provider` + API key from `api_key_env`) → save the output as `slide-NN-source.png`.

Cache: if `slide-NN-source.png` exists AND `images.yml` matches the current prompt verbatim, don't re-bill. Re-exports are free.

HTML emits: `<img src="slide-NN-source.png">`.

### chart

Skill renders SVG using brand tokens (colors from `design.*`, fonts from `design.*_font`). Output is a self-contained SVG saved as `slide-NN-source.svg`.

HTML emits: `<img src="slide-NN-source.svg">`.

> **Note:** `chart` likely graduates to its own slide type (`stat_chart`) in Phase 3 since it doesn't have a "caption" or "footer" in the same sense — the chart is the message. For now, treat it as a captioned_image source if you really want a chart inside a captioned_image's image slot.

## Brief file shape

When source resolves to `placeholder`, skill writes alongside the image:

```markdown
# Slide 3 — Image Brief

**What it should show:** Screenshot of the Looplinq analytics tile showing a creator's earnings graph.

**Framing:** 4:3 aspect, ~2160×1620 pixels.

**Style notes:**
- Dark UI mode preferred (matches the slide's body theme)
- Demo account, no personal data
- Cursor / hover state OK if it adds context

**Currently:** placeholder (picsum seed `looplinq-260508-s3`).

**To swap in:** save your image as `slide-03-source.png` (or `.jpg`) in this folder, then re-export with:

    node "<carousel-skill>/bin/export-slides.mjs" "ig-carousel/<this-folder>/"
```

The brief is written ONCE when the placeholder is first generated. Re-exports don't overwrite it — the user may have edited it. Skill only rewrites the brief if the slide's copy changed materially (different header / footer).

## Swap-and-regenerate flow

1. User reads `slide-03-brief.md`.
2. User sources / creates / screenshots the image.
3. User saves it as `slide-03-source.png` (overwriting the placeholder picsum jpg) or as a new file with a different extension (e.g. `slide-03-source.png` next to the existing `.jpg`).
4. User runs the export script.
5. Skill detects the new file on next generation, updates `images.yml`'s slide-3 entry to `source: user`, and regenerates the HTML to point at the new file.

If the user keeps the brief file around, it serves as documentation for the slide's *intent* — useful when the carousel gets revisited later.

## When the skill auto-resolves vs. asks

**Auto-resolve (no prompt needed):**
- User dropped a file matching the filename convention
- User provided per-prompt paths
- Brand has `images.default_source: placeholder` and skill picks it as fallback

**Ask the user:**
- An image slide resolved to `generated` but `generated.api_key_env` isn't set in the environment — fall back to placeholder with a warning, ask if they want to set the env var
- Multiple sources are eligible by content signal — skill picks per `source_priority`, notes the choice in the manifest's `notes` field, surfaces the decision in the user-facing report
- An image slide resolved to `user` but no path/file is available — skill falls back to `placeholder` and surfaces the swap-in instructions

## Phasing

- **Phase 1 (current):** `user` + `placeholder` (with brief files). Foundation. Zero API cost.
- **Phase 2 (opt-in):** `generated` via nano-banana or similar. Build only when a real carousel needs it.
- **Phase 3 (deferred):** `chart`. Likely promoted to its own slide type rather than living as a source under captioned_image.

## Why this architecture

- **Source-agnostic HTML** — the export script never branches on source. It just renders `<img>` tags pointing at local files. The export script doesn't need to know the difference between a user screenshot and a downloaded picsum.
- **Local-file normalization** — users can swap any source for any other by dropping a file in. The HTML doesn't change.
- **Manifest as audit trail** — preserves the source choice across re-exports without re-resolving. Predictable, debuggable.
- **Brief files** — make the `placeholder` source actionable. The user knows exactly what each slot wants.
- **Phasing-friendly** — adding `generated` later doesn't change anything about how `user` or `placeholder` work. New sources slot into the same resolution flow.
