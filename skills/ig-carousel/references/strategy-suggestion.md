# Strategy Suggestion — When None of the 9 Fit

**Scope: swipe-carousel only.** This rubric fires only when analyzing a swiped reference carousel via `commands/swipe-carousel.md` Step 2. The regular `/ig-carousel` pipeline (generating from the user's own content) always picks from the codified strategies in `strategy-selection.md` — original generation doesn't invent strategies on the fly.

The reason for the asymmetry: when analyzing someone else's carousel, you're discovering what they did. Forcing a square-peg-round-hole match loses the lesson. When generating your own carousel, the 9 are deep enough — picking outside them mid-flow is over-engineering, not insight.

This file defines: when to propose (during swipe analysis), what to output, the psychological inventory to draw from, and how to design a slide arc that exploits the mechanism.

## When to propose (must clear all three)

1. **No existing strategy hits >70% match.** If Belief Disruption is "kind of close" — use Belief Disruption. Don't invent a new one for marginal differences.
2. **The carousel has a distinct psychological hook the 9 don't capture.** Not just "this combines two of them" — a genuinely different mechanism.
3. **Naming it would be useful for future work.** If this is a one-off oddity that won't recur, force-fit to the closest existing strategy and move on. New strategies earn their place by being reusable.

If any of the three fail, force-fit. The strategy taxonomy stays disciplined.

## What to output

When proposing, deliver this block to the user. Keep it tight — proposals over ~250 words become unreadable.

```markdown
## Proposed Strategy: {Memorable Name}

**What it's doing:**
{1-2 sentences naming the move in plain language. What action is the reader expected to take, mentally or behaviorally?}

**Psychological mechanism:**
{Name the underlying bias/effect/trigger explicitly. Cite the term — "loss aversion", "Zeigarnik effect", "reactance", etc. Then 1-2 sentences on why this works: what cognitive or emotional state does it create?}

**Why this isn't one of the 9:**
{1-2 sentences. The closest existing strategy is X, but this differs because Y. Be specific — vague differences mean force-fit to the existing one.}

**Slide-by-slide arc ({N} slides):**
- Slide 1: `{role}` — {what the slide does psychologically, not just what it says}
- Slide 2: `{role}` — {ditto}
- ...
- Slide N: `{role}` — CTA, {action type from action-playbooks.md}

**Hook formula:**
{Template the user can drop their content into. Show the structure with [BRACKETED] variables.}

**Default CTA action:**
{One of: comment / share / save / controversy / tag / product. Pick based on the psychological mechanism — what's the reader most likely to do after the rush?}

**Best for:**
{1 sentence on the kind of content this strategy fits. Describe by content shape, not topic — "stories where the protagonist makes a single choice that compounds" not "stories about entrepreneurship".}

**Codify it?**
- [ ] One-off — use for this carousel only, don't add to the taxonomy
- [ ] Permanent — add to `strategy-selection.md` and `structural-narratives.md` as the 10th strategy
```

The user picks codify-or-not. Default to **one-off** unless they explicitly opt in. Permanent additions to the taxonomy require their say-so, since the canonical strategies shape every future carousel.

## Psychological inventory

A menu of mechanisms beyond the 9 already mapped. When proposing, name the specific one — don't say "this uses curiosity" if you mean "this uses the Zeigarnik effect."

### Already mapped (don't reuse names)

| Mechanism | Existing strategy |
|---|---|
| Cognitive dissonance | Belief Disruption |
| Social comparison + identity validation | Founder Contrast |
| Productive shame | The Call-Out |
| Loss aversion + curiosity (lead magnet) | FOMO / Lead Magnet Stack |
| In-group / out-group bias | Us vs Them |
| Information gap theory | Curiosity Gap |
| Recognition rush ("that's me") | Identity Validation |
| Mental simulation of future self | Aspiration / Transformation |
| Contrarian identity + status signaling | Unpopular Opinion |

### Available to draw from

These are mechanisms the 9 don't fully capture. When you cite one, name it explicitly so the user knows what lens you're using.

**Cognitive biases**
- **Anchoring** — first number/claim sets the frame. Carousel exploits when slide 1 plants a reference point that distorts how every subsequent slide reads.
- **Sunk cost fallacy** — people stay in losing situations because they've invested. Carousel exploits when it names what the reader is already invested in and re-frames the cost.
- **IKEA effect** — overvaluing self-built. Works when the content makes the reader feel they "earned" the insight.
- **Endowment effect** — owning increases perceived value. Works for "you already have X, you're underusing it" framing.
- **Mere exposure** — familiarity breeds preference. Long-tail brand-building, not single-carousel.
- **Halo effect** — one trait colors all judgments. Works for "this one thing reveals everything" framing.
- **Pratfall effect** — small admitted flaws make a source more likable/credible. Works for confessional hooks.

**Emotional / motivational triggers**
- **Reactance** — being told what to do triggers the opposite. "I'm not going to tell you to X" carousels exploit this.
- **Schadenfreude** — pleasure at others' failure. Risky and often slop, but works for "watch this fail in real time" carousels.
- **Vicarious experience** — feeling what the protagonist feels. Story carousels lean here, but as a *primary* mechanism (not just structural arc) it's distinct.
- **Hope vs fear framing** — same content, different valence. The 9 lean fear (per `voice.hook_style: fear-first`); a hope-framed equivalent is its own pattern.
- **Awe / scale** — content that reframes the reader's sense of size, time, possibility. Uncommon but powerful when earned.

**Social dynamics**
- **Authority transfer** — borrowing credibility from a named source. "Naval said this. Here's why." carousels.
- **Reciprocity** — giving creates obligation. Free-value-first carousels that don't pitch.
- **Commitment and consistency** — small "yes" → bigger "yes". Carousel slides that get tiny agreements early.
- **Bandwagon (vs Us vs Them)** — "everyone's doing this, you should too." Different from tribal in that it's inclusive, not divisive.

**Attention mechanics**
- **Zeigarnik effect** — unfinished tasks/stories pull attention until closed. Open-loop carousels that don't fully resolve until the last slide.
- **Specificity bias** — concrete details feel truer than abstract claims. Already a *technique* (Specificity Rule); could be a primary *strategy* for hyper-detailed micro-stories.
- **Pattern interrupt** — breaking expected flow grabs attention. Carousels where slide 2 violates the genre convention slide 1 set up.

**Narrative**
- **Hero's mistake** — protagonist makes the wrong choice on purpose, reader is in on it. Very different from Aspiration (which projects success).
- **Reveal arc** — content withholds the key fact until late, recontextualizing everything before. Different from Curiosity Gap (which teases a known endpoint).

When citing a mechanism, link it to the slide arc explicitly: "Slides 1-3 plant the anchor (anchoring), slide 4 reveals the true scale, slide 5 makes the comparison feel like a discovery the reader earned (IKEA effect)."

## How to design the slide arc

The slide arc is where psychology becomes layout. Each slide should do *psychological work*, not just deliver information. When proposing an arc:

1. **Slide 1 must do the mechanism's setup move.** If the mechanism is anchoring, slide 1 plants the anchor. If it's the Zeigarnik effect, slide 1 opens the loop. If it's reactance, slide 1 issues the don't-do-this command.
2. **Middle slides escalate.** Each slide should deepen the psychological state slide 1 created — more dissonance, more curiosity, more recognition. If slide 3 is a flat "additional info" slide, the arc is broken.
3. **The reveal/payoff slide is usually slide N-1.** Closing the loop, releasing the tension, snapping the frame — whatever the mechanism is, its release is the second-to-last slide. Slide N is the CTA, which converts the released energy into action.
4. **Pick the role rhythm intentionally.** `anchor → body → body → body → alt → anchor` is the safe default. Use `alt` (white) at the moment the frame snaps — the visual break reinforces the psychological one. Don't put `alt` randomly mid-carousel; place it at the payoff.

## How to name a new strategy

Names are short, specific, and describe the *move* not the topic.

**Good names** describe what the carousel *does* to the reader: "Anchored Reveal", "Hero's Mistake", "Zeigarnik Open Loop", "Reactance Reverse".

**Bad names** describe topic or genre: "AI Hot Take", "Founder Story", "Tutorial Listicle". (Topics don't determine psychology; the same topic can use any of the 9 + new strategies.)

Stay under 4 words. If you can't name it tightly, the strategy probably isn't distinct enough to be its own thing — force-fit to the closest existing one.

## Worked example

A swiped carousel walks through an entrepreneur who took the WRONG advice from every mentor for two years, lost $200k, and only succeeded after he stopped listening to anyone. The carousel doesn't disrupt a belief, doesn't compare two founders, doesn't call out the reader, doesn't validate identity. The closest existing strategies are Belief Disruption (~50%) and Story Arc (structural, but doesn't carry the psychology).

Proposal:

```markdown
## Proposed Strategy: Hero's Mistake

**What it's doing:**
Walks the reader through a protagonist's deliberate wrong turns, letting the reader silently judge the bad calls — then reveals at the end that the bad calls were the path. The reader's earlier judgments get retroactively flipped.

**Psychological mechanism:**
Pattern interrupt + retrospective revaluation. The reader builds confidence in their assessment slide-by-slide ("I'd never do that"); the final reveal collapses it. The disorientation creates a stronger memory imprint than a straightforward success story.

**Why this isn't one of the 9:**
Belief Disruption attacks a belief the *reader* holds. This attacks beliefs the reader *forms during the carousel*. The disruption is internal to the reading experience, not external to the audience's worldview.

**Slide-by-slide arc (6 slides):**
- Slide 1: `anchor` — establish protagonist + first "obviously wrong" decision (sets up reader's judgmental stance)
- Slide 2: `body` — second wrong call, stakes rise (reader's judgment compounds)
- Slide 3: `body` — third wrong call, things look catastrophic (reader is fully bought into "this is a cautionary tale")
- Slide 4: `body` — the moment everything clicks (Zeigarnik close, partial reveal)
- Slide 5: `alt` — the recontextualization: those weren't mistakes (frame snaps; alt theme reinforces visually)
- Slide 6: `anchor` — CTA, share-style ("send this to anyone still asking everyone for advice")

**Hook formula:**
"[PROTAGONIST] did [OBVIOUSLY WRONG THING] for [DURATION]. Lost [SPECIFIC BAD OUTCOME]. Then [TWIST PHRASING THAT HINTS AT REVELATION WITHOUT SPOILING]."

**Default CTA action:**
Share. Recontextualization moments get forwarded — readers want others to feel the same flip.

**Best for:**
Stories with a counterintuitive lesson where the lesson can't be stated up-front without losing power.

**Codify it?**
- [ ] One-off — use for this carousel only
- [x] Permanent — add to taxonomy (recommended; this pattern recurs in startup/career narratives)
```

Notice: the proposal cites specific mechanisms, names them with terms (Zeigarnik, pattern interrupt, retrospective revaluation), explains *why* the 9 don't capture it, and gives a slide arc that does psychological work each step. That's the bar.
