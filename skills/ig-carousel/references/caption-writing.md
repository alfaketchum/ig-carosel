# Caption Writing for IG Carousels

## The central rule: earn the expand tap

The first ~125 characters are the **only caption text most readers will see.** If they don't tap "... more" after reading those characters, the rest of the caption is invisible — the body, the hashtags, the engagement prompt, all behind that gate.

So the first line's job is **not to deliver information.** It's to create a curiosity gap that only expansion resolves.

This runs counter to most content marketing advice ("lead with the value"). On IG, leading with value means the reader got what they needed in the preview and scrolls away. You need a **gap**, not a summary.

## Where the truncation happens

| Context | Truncation point |
|---|---|
| IG feed mobile | ~125 chars OR 3 lines (whichever hits first) |
| IG profile grid | ~180 chars |
| Hashtag / explore pages | ~125 chars |
| IG Stories / Reels | Different rules — not covered here |

**Write to the most restrictive case** (feed mobile, ~125 chars). If it works there, it works everywhere.

Aim for **~80 chars in the opening line**, leaving buffer below the cliff.

## What earns the expand

Six first-line patterns that work. Each creates a loop the reader can only close by tapping "more":

| Pattern | Example first line | Why it earns the tap |
|---|---|---|
| **Story opener** | "For 8 months, nothing worked. Then one change..." | Sets timeline, teases reveal |
| **Counter-intuitive claim** | "Everyone says consistency is key. I disagree." | Opens a loop with friction |
| **Specific intrigue** | "Yann LeCun spent 3 years calling this stupid. He just published the paper that proves it." | Named entity + unresolved turn |
| **Confession** | "I've been getting this wrong for 18 months." | Vulnerability + implied payoff |
| **Specific observation** | "I noticed something weird about 2,400 viral posts." | Time + specific number + unresolved finding |
| **Question → negated answer** | "Why do creator brands fail? It's not what you think." | Creates a gap by negation |

The unifying trait: each is **low-info, high-curiosity.** Concrete enough to feel real, incomplete enough to require more.

## Anti-patterns — kill these in the first 125 chars

- **Greetings** ("Hey creators!", "Good morning!") — wastes the scarce hook real estate
- **Hashtags in the opening** (use at end only — opening hashtags burn the hook space on metadata)
- **Conclusions / summaries** ("Here's how to X") — you just delivered the value pre-tap; they have no reason to expand
- **Poetic abstracts** ("Creativity is a journey...") — zero specificity, reads as AI-slop
- **@ mentions opening** — reads like a reply, not a post
- **Emoji as decoration** (✨, 💫, 🌸 sprinkled into the opening) — emoji as the *payload itself* is fine; emoji as garnish is not
- **Carousel-hook duplication** ("Read this carousel to learn about Yann LeCun") — wastes the opener restating what the slides will show
- **"Today"** as the first word — generic, adds nothing, often the tell of templated content

## Relationship to the carousel hook

Two different hooks, two different moments:

| | Carousel hook (slide 1) | Caption hook (first 125 chars) |
|---|---|---|
| Medium | Visual — stops the scroll | Text — earns the expand |
| Primary tool | Headline + emphasis + color | Sentence construction |
| Available levers | Typography, layout, contrast | Only words |
| Length | ~20 words max | ~80 chars (~15 words) max |

They should **complement, not duplicate.** The caption hook has to stand alone — if the reader only saw the caption hook and nothing else, would they want to see the carousel? If yes, it works.

The carousel hook can be punchier because the visual carries the weight. The caption hook has to work as pure text, so it often leans more narrative (story opener) or more personal (confession, observation).

## After the expand — the body

Once the reader has tapped "more," the body has four jobs. Do them in order:

1. **Deliver the payoff** promised in the hook. Don't tease forever — the reader tapped in good faith; reward them fast.
2. **Add context** the 6 slides couldn't fit. What details, quotes, or nuance got cut in the slide edit?
3. **Bridge to the reader** — "why this matters for YOU." The slides told a story; the caption connects it to the reader's life.
4. **Engagement prompt** — a real question, share ask, or invitation. Matched to the carousel's selected action (Share / Save / Comment / Tag).

**Body length ranges:**
- Short: 100-150 words (hook + quick payoff + prompt)
- Medium: 200-300 words (hook + payoff + context + bridge + prompt) — default
- Long: 400-500 words (full narrative with multiple beats)

## Line-break strategy

IG respects line breaks. Use them deliberately:

- **First line stands alone** on its own line — maximum pre-truncation impact
- **Short paragraphs** (2-3 lines max) — walls of text kill engagement
- **Whitespace between sections** — signals structure
- **Single-line punches** for transitions or emphasis

Structure template:
```
[Hook — 1 line, ~80 chars]

[Empty line — creates visual pause]

[Body paragraph 1 — payoff delivery]

[Body paragraph 2 — context / details]

[Body paragraph 3 — bridge to reader]

[Engagement prompt — 1 line]

[Empty line]

[Hashtags]
```

## Engagement prompt patterns

Match the prompt to the carousel's selected CTA action:

| Carousel action | Caption engagement prompt style |
|---|---|
| 💬 Comment keyword | Mirror: "Comment 'KEYWORD' and I'll send it" |
| 📤 Share | "Send this to [specific-person-type] 👇" |
| 💾 Save | "Save this for next time [specific-trigger]" |
| 🔥 Controversy | "Agree or disagree? Fight me in comments." |
| 🏷️ Tag | "Tag the [specific-person] who needs this" |
| 🔗 Product | Direct CTA, not engagement — softer prompt like "Thoughts?" still works |

**Never use** generic "let me know what you think!" or "drop a comment below 👇" — too generic, reads as AI-generated. Make the prompt specific to the content.

## Hashtags

**Always at the end**, after the engagement prompt. Never open with hashtags — it burns the hook space on metadata and signals low effort.

**Count:** 10-15 is the sweet spot. Not 30 (looks desperate), not 3 (misses discoverability).

**Mix strategy** — draw from three pools:
- **Brand** (1-3): always included — `#Looplinq`, `#CreatorEconomy`, etc.
- **Topic** (5-8): specific to this carousel's content — `#AIResearch`, `#TechNews`, `#YannLeCun`
- **Reach** (2-4): broader tags for discoverability — `#AI`, `#Creators`, `#Marketing`

**Formatting:** separate from body with a line of whitespace (some brands use a row of `·` or `—` as a visual break). Keep them on consecutive lines or wrap naturally — don't fuss with ordering.

## First-comment hashtag strategy (optional)

Some brands put hashtags in the first comment instead of the caption. Reasons:
- Keeps the caption visually cleaner
- Separates metadata from content
- Some algorithms treat first-comment hashtags identically to caption hashtags (no reach penalty)

**When to choose first-comment placement:**
- Brand voice is minimalist / editorial
- Caption is already long and hashtags would bloat it further
- Aesthetic matters more than absolute reach

Set via `caption.hashtag_placement: first-comment` in `.carousel.md`. The skill produces the hashtags as a separate block so the publishing command can post them as the first comment.

## The earned test

Before shipping a caption, run this test mentally:

> Paste just the first line into a group chat to a creator friend. Do they ask "what's this about?" If yes → it earned the expand. If they shrug or ask a generic question → rewrite.

Also run the **remove test:** strip the first line. Does the rest still make sense as a caption? If yes, the first line was skippable — it didn't earn its place as a hook. Rewrite.

## Worked example — LeCun carousel caption

Applied to the Looplinq LeCun carousel:

```
Yann LeCun spent 3 years calling generative AI a dead end.

He just published the paper that proves it.

[... TRUNCATION — reader taps "more" ...]

For three years, Yann was the industry heretic. "Bigger models 
are a waste," he kept saying. Meanwhile, every lab bet billions 
on scaling.

A paper dropped this week from Mila and NYU. One regularizer 
called SIGReg. 15 million parameters. Trains on a single GPU 
in hours. 48x faster at planning than anything OpenAI or 
Google has shipped.

The industry bet trillions. Yann built the fix himself.

For creators: smaller, cheaper AI running locally. Less 
dependency on API costs. More control over your tools.

Send this to anyone still fine-tuning GPT-4 👇

#AI #ArtificialIntelligence #AIResearch #CreatorEconomy 
#LLM #DeepLearning #TechNews #AIforCreators #Looplinq
```

**Breakdown:**
- First line = 57 chars = well under 125 cliff, named entity + unresolved turn (Specific Intrigue pattern)
- Line 2 = 45 chars, completes the hook, may or may not fit pre-expand depending on device
- Empty line visual break → "more" tap
- Body delivers payoff (the paper details), adds context (SIGReg, affiliations), bridges to reader ("for creators...")
- Engagement prompt ("Send this to anyone still fine-tuning GPT-4") = matches the carousel's Share action
- Hashtags at end, mixed pools

## What the skill does

In SKILL.md Step 7, after slides are built and before export:

1. Draft the caption's first line using one of the six patterns, aiming for ~80 chars
2. Run the earned test mentally — does it create a gap?
3. Write the body: payoff → context → bridge → engagement
4. Pull hashtags from `caption.hashtag_pools` in `.carousel.md`, mix per strategy, cap at `caption.hashtag_count`
5. Verify total caption is under 2,200 chars (IG max)
6. Verify the first ~125 chars work standalone (reader without expansion still sees a complete hook)
7. Write to `{output_dir}/{topic-slug}/caption.md`

## Quick checklist

- [ ] First line ≤ 80 characters
- [ ] First line creates a curiosity gap (passes the earned test)
- [ ] First line doesn't duplicate the carousel hook verbatim
- [ ] No greetings, no opening hashtags, no "today," no @mentions opening
- [ ] Body delivers the payoff promised in the hook
- [ ] Body bridges to "why this matters for the reader"
- [ ] Engagement prompt matches the carousel's CTA action
- [ ] Hashtags at the end, 10-15, mixed brand + topic + reach
- [ ] Line breaks used deliberately (no walls of text)
- [ ] Under 2,200 total characters
