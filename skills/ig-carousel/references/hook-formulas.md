# The Hook (Slide 1) — THE MOST IMPORTANT SLIDE

The hook is everything. If slide 1 doesn't stop the scroll, slides 2-6 don't exist.

## Hook Format

- Use the `anchor` role theme (highest-contrast brand surface).
- **Top:** `.slide-label` — short contextual label (e.g. "Free Guide", "Hot Take", strategy name). Same uppercase label as every other slide.
- **Middle:** `.slide-headline` — headline font, 1-2 sentences, max ~20 words. 1-3 key words inside `<em>` for emphasis (italic, highlight, or whatever `.carousel.md` specifies — colors cascade from `.slide--anchor`).
- **Bottom:** `.slide-stat` — a short teaser line (5-10 words) that creates forward momentum. This is the "keep swiping" nudge.
- The hook should feel like a person talking, not a billboard. First-person and editorial tone beats punchy one-liners.

**Hook slide structure:**
```html
<div class="slide slide--anchor">
  <div class="slide-label">Label</div>
  <h2 class="slide-headline">
    The main hook text with <em>emphasis</em>
  </h2>
  <div class="slide-bottom">
    <p class="slide-stat">The teaser line that makes you swipe →</p>
  </div>
</div>
```

All colors are resolved via CSS cascade from `.slide--anchor` using `layout.themes[anchor]` in `.carousel.md`. No inline color styles, no emphasis class, no modifier classes on label/headline.

**Bottom teaser examples:**
- "Here's what the landing page won't tell you →"
- "The numbers don't lie →"
- "One change made all the difference →"
- "What I found surprised me →"
- "Let me show you what I mean →"

## Hook Psychology: Fear > Positive

Hooks that lean into **fear, warnings, or mistakes** consistently outperform positive hooks. This is the dominant psychology — people scroll past inspiration but stop for danger.

When writing the hook, prefer framing around:
- **What they're losing** (not what they could gain)
- **What they're doing wrong** (not what to do right)
- **What they don't know** (not what they should learn)
- **What's at risk** (not what's possible)

Not every strategy can use a fear/warning angle — but when it fits, always prefer it over the positive version. If the project's `.carousel.md` sets `voice.hook_style` to something other than `fear-first`, respect that override.

| Positive (weaker) | Fear/warning (stronger) |
|---|---|
| "Here's how to negotiate better brand deals" | "Most creators are leaving *thousands* on the table every brand deal. Here's why." |
| "A media kit helps you close more deals" | "If you don't have a media kit, brands are *lowballing you* and you don't even know it." |
| "This AI can find software bugs" | "An AI escaped its sandbox last week. The researcher was eating a sandwich when he got *the email.*" |

## Hook Style: Conversational, Not Billboard

The hook should feel like the opening line of a conversation — someone leaning in at a dinner party and saying something you can't walk away from. NOT a poster. NOT a headline. NOT an ad.

**BAD hooks** (punchy/billboard — avoid these):
- "Stan Store costs *$2,976/year* and they don't tell you upfront"
- "Posting 'value' is why *nobody engages*"
- "Everything you know about *cold email* is wrong"
- "There are two types of *founders*"

These feel like marketing. They're declarations. They tell you the conclusion before you've been given a reason to care.

**GOOD hooks** (conversational/editorial — do these):
- "I added up what Stan Store *actually costs* once you need email and AI. It's not $29/mo."
- "I've spent 18 months studying why some posts *explode* while others die in silence."
- "One of our clients posted 'valuable' content for *8 months straight.* Here's what it got him."
- "An AI escaped its sandbox last week. The researcher who built it was eating a sandwich when he got *the email.*"

**Why these work:**
- They sound like someone **talking**, not announcing
- They **build up** to the tension instead of leading with the punch
- They use **small, human details** (eating a sandwich, 8 months straight, "it's not $29/mo")
- They make you lean in and think "wait, what?" instead of "oh, another ad"
- The emphasis words feel **natural** in conversation, not bolted on for effect

## The Conversation Test

Before writing a hook, imagine saying it out loud to a friend at coffee. If it sounds like a person sharing something interesting, it works. If it sounds like a billboard or a tweet trying to go viral, rewrite it.

## Hook Formula by Strategy

| Strategy | Hook pattern | Example |
|----------|-------------|---------|
| Belief Disruption | "I looked into X and found something that changes everything" | "I studied *2,400 viral posts* and the ones that blew up had one thing in common. It wasn't 'value.'" |
| Founder Contrast | Set the scene, then tease the gap | "One of our clients posted for *8 months straight.* 12 likes a post. Another founder in the same niche booked *47 calls* in one month." |
| The Call-Out | "I noticed something most people don't realize" | "I added up what Stan Store *actually costs* once you need email and AI. It's not $29/mo." |
| FOMO / Lead Magnet | Share what you built + tease the result | "We spent 8 months building a framework that added *$901k in combined MRR.* I wrote the whole thing down." |
| Us vs Them | Casual observation of a pattern | "I keep noticing the same thing... the founders *booking calls* aren't doing what the LinkedIn gurus say." |
| Curiosity Gap | Lead with the weirdest detail | "An AI escaped its sandbox last week. The researcher was eating a sandwich when he got *the email.*" |
| Identity Validation | Describe their feeling before naming it | "You've been posting consistently for months. Good content. Real effort. And the *engagement* is basically silence." |
| Aspiration | Start with the before, tease the after | "For 8 months, nothing worked. Then one change and *96 calls in 30 days.* Same content. Same audience." |
| Educational | Share what you studied + hint at findings | "I've spent 18 months studying *viral psychology.* Most people are optimizing for the wrong things entirely." |
| Listicle | Personal experience framing | "I've made all *5 of these mistakes* myself. Number 3 cost me an entire year." |
| Story Arc | Set the scene with a human detail | "Anthropic built an AI model last month. During testing, it *figured out it was being tested* — and played dumb." |
| Problem-Agitate-Solution | Empathetic observation, not accusation | "You're doing everything the gurus say. Posting daily. Engaging in comments. And the *results* just aren't there." |
| Hook-Features-CTA | Share what you did + what changed | "We were paying for *5 different tools* to do what one does now. Here's what switching looked like." |
| Unpopular Opinion | State the take, then own it | "I think most content creators should *stop posting every day.* I know ... hear me out." |

## Hook Rules

1. **Conversational > punchy.** Write like you're telling a friend something interesting, not writing a headline.
2. **Build up > lead with the punch.** Let the tension arrive naturally. "I added up the real cost..." is better than "It costs $2,976!"
3. **Small human details sell it.** "Eating a sandwich", "8 months straight", "number 3 cost me a year" — these make hooks feel real.
4. **Emphasis words should feel natural.** If you wouldn't stress that word when saying it out loud, don't wrap it in `<em>`.
5. **First-person grounds it.** "I studied...", "We built...", "One of our clients..." gives the hook credibility and warmth.
6. **The conversation test:** Say it out loud. Does it sound like a person or a poster? If poster, rewrite.
7. **Never use em dashes (—) in slide copy.** Use `...` instead for pauses, breaks, or asides. Em dashes feel too editorial/written. Ellipses feel more conversational and natural on social.
