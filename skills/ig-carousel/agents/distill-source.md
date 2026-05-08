# Source Distillation Subagent

Spawn this subagent (via the `Agent` tool, `subagent_type: general-purpose`) when the user provides a **long source** to convert into a carousel: an article, thread, transcript, paper, research notes, or any block of source material over ~800 words.

The subagent does the heavy parsing + drafting work in isolation and returns a small structured plan. Main context then takes the plan and handles HTML build + export.

## When to spawn

| Signal | Spawn? |
|---|---|
| User pasted ≥ 800 words of source content | **Yes** |
| User pasted a URL to fetch and convert | **Yes** (subagent uses `WebFetch`) |
| User asked for a carousel from a long thread / transcript | **Yes** |
| User wrote a short prompt (≤ 800 words) with the angle already framed | No — work in main context |
| User said "I'll write the copy, just build the slides" | No — main context |
| `.carousel.md` is missing | No — run `commands/init-carousel.md` first |

## Inputs to pass

Compose the subagent prompt with these fields. The subagent sees nothing else from the main conversation — the prompt must be self-contained.

1. **Source content** (verbatim, full text or URL).
2. **Brand config summary** — copy these fields from `.carousel.md`:
   - `voice.hook_style` (`fear-first` or `positive`)
   - `voice.tone`
   - `voice.audience`
   - `hook_themes_allowed`
   - `slide_types_enabled` keys + each type's `pattern`
   - `slide_type_strategy`
   - `caption.body_length`
   - `caption.hook_target_length`
   - `caption.hashtag_count`
   - `caption.hashtag_pools`
   - `default_slide_count` (usually 6)
3. **User flags from prompt** (if present):
   - `--hook-theme {role}` → carousel hook theme override
   - `--strategy {key}` → strategy override
   - `--action {key}` → CTA action override
   - Slide count override (e.g. "make it 7 slides")
   - Per-slide type override (e.g. "slide 3 should be a big_number")
4. **Reference paths** (so the subagent knows where to load craft rules):
   - `references/strategy-selection.md`
   - `references/hook-formulas.md`
   - `references/structural-narratives.md`
   - `references/action-playbooks.md`
   - `references/caption-writing.md`

## Subagent task

The subagent does the following, loading reference docs only as needed:

1. **Parse the source.** Identify the dominant angle. Extract specific data — names, numbers, dates, quotes, durations, model names, results. Apply the **Specificity Rule** from `references/strategy-selection.md`: prefer concrete details over generalizations.

2. **Pick a strategy** from `references/strategy-selection.md` based on dominant content signals. Don't ask the user; pick the strongest fit. Honor `--strategy` override if present.

3. **Pick the hook theme.** Default to first role in `hook_themes_allowed`. Honor `--hook-theme` flag if it appears in `hook_themes_allowed`. If resolved theme is `alt`, skip the mid-carousel `alt` variety break.

4. **Draft the hook (slide 1)** per `references/hook-formulas.md`:
   - ≤ 25 words, target 15–22
   - Conversational not billboard
   - Fear-first if `voice.hook_style: fear-first`; positive if `voice.hook_style: positive`
   - Earned `<em>` on the payload word
   - No em dashes — use `...` for pauses

5. **Draft slides 2 through N-1** per `references/structural-narratives.md` arc for the chosen strategy. For each slide pick:
   - `role` (`anchor`/`body`/`alt`) per the arc
   - `type` per `slide_type_strategy` (uniform = same type as slide 1; mixed = pick per content signal; element_locked = pick per role mapping)
   - `label` (uppercase contextual tag)
   - `headline` / equivalent body content
   - Bottom slot content (variant + text, for `static_text_only`)
   - Whether this slide earns `<em>` (target 2–4 of N slides total)

6. **Pick the action** from `references/action-playbooks.md` Auto-Select Action table. Draft slide N (the CTA) per the action's playbook.

7. **Draft the caption** per `references/caption-writing.md`:
   - First line ~80 chars using one of the six opening patterns
   - Body length per `caption.body_length`
   - Engagement prompt matched to the action
   - Hashtags from `caption.hashtag_pools` (mix brand + topic + reach), capped at `caption.hashtag_count`
   - Topic hashtags chosen from this carousel's content

## Output format

Return ONE message containing this YAML block (no extra prose, no commentary). Main context parses it and proceeds to render.

```yaml
strategy: <strategy-key>           # e.g. belief_disruption
hook_theme: <role>                 # e.g. body
action: <action-key>               # e.g. save
slide_count: 6
folder_slug: <yymmdd-topic-slug>   # for output dir naming
slides:
  - index: 1
    role: <role>
    type: <type-key>
    label: "..."
    headline: "..."
    emphasis_words: ["..."]        # words to wrap in <em>; [] if none
    bottom:
      variant: stat                # only for static_text_only; omit for other types
      content: "..."
    notes: "any specifics main context should preserve verbatim"
  - index: 2
    ...
caption:
  hook: "..."                       # first line, ~80 chars
  body: "..."                       # multi-paragraph
  engagement: "..."                 # last line before hashtags
  hashtags: ["#Tag1", "#Tag2", ...]
notes: "callouts main context needs — e.g. specific quotes to preserve, image references, fallback if a slide type can't be filled"
```

## What the subagent does NOT do

- HTML / CSS rendering — main context handles that per `references/slide-build.md`.
- PNG export — main context runs the export script per Step 8.
- File writes — return the plan as a single message; main context writes files.
- Postiz publishing — separate command (`commands/publish-carousel.md`).
- Asking the user clarifying questions — make the call, report it in `notes` if non-obvious.

## Why this is a subagent and not main-context work

Long source material means lots of reads + draft iterations + reference loads. Doing it in main context blows the conversation window: the source itself is heavy, plus 5+ reference files, plus 6 slide drafts with revisions. The subagent does that in isolation and returns ~2KB of structured plan.

Only spawn it when source size justifies the cost. For short prompts, main context is faster.
