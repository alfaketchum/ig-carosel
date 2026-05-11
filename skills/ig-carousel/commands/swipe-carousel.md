# /swipe-carousel — Save a reference carousel for repurposing study

**Trigger:** user says "swipe this carousel", "grab that IG post", "save those slides for inspiration", or runs `/swipe-carousel`.

**Purpose:** save a public IG (or other platform) carousel post locally as PNG slides + a `source.md` credit trail. The output goes into a swipe-file folder, **not** the publishable `ig-carousel/` folder. The intent is study + repurpose with proper attribution — never republish the source images.

**This is not a clone tool.** It captures source material for *learning*. The repurposed version goes through the regular `/ig-carousel` pipeline with the user's brand voice, and the published caption credits the original creator.

## Inputs

```
/swipe-carousel <post-url> [output-slug]
```

- `post-url` — public IG post URL (or other carousel platform)
- `output-slug` — optional folder name; defaults to `swipe-{timestamp}`

Optional env flags:
- `HEADLESS=false` — open a visible browser so the user can dismiss login walls / cookie banners manually
- `WAIT_MS=8000` — wait longer after page load if dynamic content is slow

## Output

```
swipe-file/YYMMDD-handle-slug/
├── slide-01.png   ← original creator's slide 1 at highest available resolution
├── slide-02.png
├── ...
└── source.md      ← URL, handle, capture date, og:description, repurpose checklist with credit line prefilled
```

## Workflow

### Step 1 — Capture

Run the bin script with the post URL:

```bash
node "C:/Users/shah_/dev/carousel-skill/bin/swipe-carousel.mjs" "<post-url>" "swipe-file/<slug>/"
```

If the script reports zero slides found:
- Re-run with `HEADLESS=false` so the user can dismiss login walls / cookie banners
- Or increase `WAIT_MS=8000` for slow-loading pages
- Or fall back to manual screenshots and write `source.md` by hand

### Step 2 — Study

Read each saved slide PNG (use the Read tool on the PNG paths) and analyze through a psychological lens:
- Slide count and theme rhythm
- Which of the 9 emotional-psychology strategies it uses (see `references/structural-narratives.md`)
- Hook formula and emphasis pattern (see `references/hook-formulas.md`)
- CTA action type (see `references/action-playbooks.md`)

**If none of the 9 strategies fits cleanly,** propose a new one rather than force-fitting. The proposal must name the underlying psychological mechanism (anchoring, Zeigarnik effect, reactance, pattern interrupt, retrospective revaluation, etc.), explain *why* the existing 9 don't capture it, and lay out a slide-by-slide arc that does psychological work at every step.

→ See `references/strategy-suggestion.md` for the proposal rubric, the must-clear-three bar (>70% miss + distinct hook + reusable), and a worked example.

Ask the user whether to use the proposed strategy as a one-off or codify it permanently into the taxonomy. Default to one-off.

Summarize the analysis to the user before drafting the repurposed version. This is the part that actually transfers learning — don't skip straight from capture to generation.

### Step 3 — Repurpose

Run the regular `/ig-carousel` pipeline. Pass:
- The user's angle/take in their voice (not the source's)
- The strategy you identified in Step 2 (or let the user pick a different one if they want a different framing)
- The brand tokens from the user's `.carousel.md`

The repurposed carousel is fully original copy in the user's voice, structured by lessons from the swipe — not a slide-by-slide rewrite.

### Step 4 — Credit

Add the credit line to the repurposed `caption.md`. The `source.md` file prefills the original handle:

> h/t @{original-handle} — read the original take that sparked this

Or, for looser inspiration:

> Inspired by a great @{handle} carousel I read this week.

**Don't skip the credit step.** That's what makes this repurposing rather than copying. If you can't tell the user where the idea came from, the carousel isn't ready to publish.

### Step 5 — Optional: tag in IG

When publishing, tag the original creator's account in the IG post if you want them to see it (and potentially reshare).

## What this command does NOT do

- **Does not republish the source images.** PNGs in `swipe-file/` are study material. They never go into Postiz.
- **Does not auto-generate a near-identical carousel.** Slide-by-slide cloning is theft, not repurposing. Generation routes through `/ig-carousel` with the user's own copy.
- **Does not remove credit attribution.** The `source.md` is a permanent audit trail. The credit line in the published caption is mandatory.
- **Does not bypass logins or scrape private accounts.** Public posts only. If a login wall blocks the script, the fix is to re-run headed and login manually — not to bypass auth programmatically.

## Storage convention

`swipe-file/` is for study material. Consider gitignoring it if your repo is shared, or committing it if you want collaborators to share the swipe library. Either way, nothing in `swipe-file/` is ever published.

## Failure modes

| Symptom | Cause | Fix |
|---|---|---|
| `No slides found` | Login wall, private post, slow render | Re-run with `HEADLESS=false` and dismiss the modal manually, or raise `WAIT_MS` |
| Slides save at thumbnail resolution | Page didn't load full srcset before capture | Raise `WAIT_MS=10000`; scroll the post into view before capture |
| Wrong images captured (avatars, suggested posts) | Aspect/size filter let through non-slide images | Manually delete the wrong ones; the filter is conservative and may need a per-platform tweak |
| Handle field empty in `source.md` | og:title format unexpected | Fill in manually before publishing the repurposed version |
| IG ToS / scraping concerns | IG actively fights automated access | Public posts in headed mode generally work; for private/protected content, use manual screenshots and skip the script |

## Where this fits in the skill pipeline

`/swipe-carousel` is an **input** to the regular pipeline, not a replacement for it:

```
/swipe-carousel <url>
       ↓
swipe-file/<slug>/  (study material)
       ↓
/ig-carousel "make a carousel about <topic>, inspired by swipe-file/<slug>"
       ↓
ig-carousel/<slug>/  (publishable carousel in user's voice, with credit)
       ↓
/publish-carousel  (Postiz, with credit line in caption)
```
