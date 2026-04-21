# Common Structures

Slide-by-slide narrative arcs keyed by strategy. Each structure specifies slide count and the **role** of the theme per slide (`anchor` / `body` / `alt`). Roles resolve to concrete CSS classes (`.slide--anchor` etc.) and theme colors via `.carousel.md`.

Role reminder:
- `anchor` — brand-color surface used for hook + CTA (slides that stop the scroll)
- `body` — dark/readable surface for middle content
- `alt` — secondary surface for summaries or contrast sections (optional; defaults to `body` if not defined)

## Emotional Psychology Strategies

**Belief Disruption / Ragebait (5-6 slides):**
Challenge a commonly held belief and replace it with a new frame. Creates cognitive dissonance that demands engagement.
Slide 1: `anchor`, state the common belief as the hook ("You've been told X works"). Slide 2: `body`, create doubt — show evidence it doesn't work (stats, contrast). Slide 3: `body`, introduce the alternative frame ("The real difference is Y"). Slide 4: `body`, show the implication ("Which means you're working 5x harder for 10x worse results"). Slide 5: `body`, the path forward. Slide 6: `anchor`, CTA.

**Founder Contrast (5 slides):**
Side-by-side comparison of two approaches with identical context but wildly different results. Triggers identity validation — reader picks which founder they are.
Slide 1: `anchor`, hook ("Same niche. Same audience. 15x different results."). Slide 2: `body`, Founder A story — the "doing everything right" approach with bad results (use contrast-block--bad component). Slide 3: `body`, Founder B story — the different approach with great results (use contrast-block--good component). Slide 4: `body`, the one difference between them. Slide 5: `anchor`, CTA.

**The Call-Out (5 slides):**
Productive discomfort — expose a gap between what the reader believes and what's actually true, then offer the fix. Makes people feel uncomfortable in a way that motivates action.
Slide 1: `anchor`, uncomfortable truth hook ("Your 'lead magnet' is a 3-page PDF you made in an afternoon"). Slide 2: `body`, deepen the discomfort with specifics. Slide 3: `body`, reframe — it's not their fault, it's the approach. Slide 4: `body`, the fix (what to do instead). Slide 5: `anchor`, CTA.

**FOMO / Lead Magnet Stack (6 slides):**
Stacks multiple psychological triggers to drive comment/DM engagement for a lead magnet. Uses social proof, identity validation, tribal belonging, investment signaling, and aspiration.
Slide 1: `anchor`, curiosity gap hook with specific outcome ("The post structure that books 15-20 calls per week"). Slide 2: `body`, identity validation — validate the reader's struggle, shift blame away from them. Slide 3: `body`, tribal belonging — "most experts teach X, the founders actually booking calls do Y." Slide 4: `body`, investment signaling + proof ("I analyzed 2,400+ posts and spent 8 months building this"). Slide 5: `body`, aspiration — show a specific, believable transformation. Slide 6: `anchor`, CTA with comment trigger ("Comment 'SYSTEM' and I'll send it over").

**Us vs Them / Tribal (5 slides):**
Creates in-group/out-group dynamics. Positions the reader in the sophisticated "us" camp and contrasts against the naive "them." Triggers tribal defensive instincts.
Slide 1: `anchor`, tribal hook ("There are two types of founders…"). Slide 2: `body`, what "they" do — the conventional/naive approach. Slide 3: `body`, what "we" do — the sophisticated approach. Slide 4: `body`, the result gap between the two groups. Slide 5: `anchor`, CTA — implicit invitation to join "us."

**Curiosity Gap (4-5 slides):**
Opens with a specific, almost-too-good-to-be-true result, then progressively reveals the framework behind it. Uses specific numbers and implied insider knowledge.
Slide 1: `anchor`, specific outcome hook ("The LinkedIn post that booked me 47 calls in 72 hours"). Slide 2: `body`, context — what made this different. Slide 3: `body`, the framework/method (partial reveal). Slide 4: `body`, proof — screenshot, stat, or client result. Slide 5: `anchor`, CTA to get the full breakdown.

**Identity Validation (5-6 slides):**
Articulates something the audience has experienced but never had language for. Creates a rush of recognition that's almost impossible not to respond to.
Slide 1: `anchor`, the recognition hook — say the quiet part out loud ("You don't hate sales. You hate feeling like a used car salesman."). Slide 2: `body`, go deeper — describe the specific experience they've had. Slide 3: `body`, validate — "it's not just you, here's why this happens." Slide 4: `body`, reframe — give them new language for the problem. Slide 5: `body`, the shift — what changes when you see it this way. Slide 6: `anchor`, CTA.

**Aspiration / Transformation (5 slides):**
Shows a specific, believable result and makes the reader project themselves into that future. Outcome must feel achievable (impressive but not impossible), with realistic timeframes and accessible methods.
Slide 1: `anchor`, transformation hook with specific numbers ("From 0 to $42k MRR in 90 days using only LinkedIn"). Slide 2: `body`, the before — relatable starting point. Slide 3: `body`, the turning point — what changed. Slide 4: `body`, the after — specific results with proof. Slide 5: `anchor`, CTA — "this is possible for you too."

**Unpopular Opinion (5-6 slides):**
Lead with a bold, divisive stance that most people will instinctively disagree with. Then methodically back it up until the reader can't dismiss it. The psychology is contrarian identity — people who agree feel validated, people who disagree feel compelled to comment. Either way, engagement wins.
Slide 1: `anchor`, state the take directly as the hook — own it, don't hedge. ("I think most creators should *stop posting every day.* I know ... hear me out.") Slide 2: `body`, acknowledge the backlash — show you know this sounds crazy. ("I know what you're thinking. 'Consistency is everything.' That's what everyone says.") Slide 3: `body`, dismantle the common wisdom — stats, experience, or logic that creates doubt. Slide 4: `body`, present your alternative frame — what you believe instead and why. Slide 5: `body`, the proof — what happened when you/someone followed this take. Slide 6: `anchor`, CTA — lean into controversy ("Agree or disagree? I'll die on this hill.").

## Structural Strategies

**Problem-Agitate-Solution (5 slides):**
Slide 1: `anchor`, bold hook. Slides 2-3: `body`, pain points. Slide 4: `body`, solution reveal. Slide 5: `anchor`, CTA.

**Hook-Features-CTA (4 slides):**
Slide 1: `anchor`, bold hook. Slides 2-3: `body`, features/benefits. Slide 4: `anchor`, CTA.

**Educational (5-7 slides):**
Slide 1: `anchor`, topic hook. Slides 2-5: `body`, teaching points (one idea per slide). Slide 6: `body` or `alt`, summary. Slide 7: `anchor`, CTA.

**Listicle (5-6 slides):**
Slide 1: `anchor`, "X things you need to know about…". Slides 2-5: `body`, one item per slide. Slide 6: `anchor`, CTA.

**Story Arc (6-7 slides):**
Slide 1: `anchor`, hook question. Slide 2: `body`, context/backstory. Slides 3-5: `body`, key beats. Slide 6: `body`, takeaway. Slide 7: `anchor`, CTA.
