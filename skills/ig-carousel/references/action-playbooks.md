# Last Slide — Optimize for One Action

The last slide exists to make people **do one thing.** Pick the action that matters most for this carousel, then design every element of the slide to drive that single action.

All CTA slides use the `anchor` role (`.slide--anchor`) — same theme as the hook slide. The skill resolves colors via the theme's CSS cascade; HTML below stays classless for `<em>` and style-free for `.slide-stat`. All `cta-pill` text uses `{brand.url}`, `{brand.cta}`, and `{brand.cta_product}` from `.carousel.md`.

## Pick the Action

| Action | What you want | When to use |
|--------|--------------|-------------|
| **💬 Comment keyword** | People comment a specific word to get something | Lead magnets, free guides, giveaways, waitlists |
| **📤 Share** | People send the carousel to someone | Hot takes, belief disruption, scary/surprising content |
| **💾 Save** | People bookmark it for later | Tutorials, frameworks, listicles, educational |
| **🔥 Controversy** | People argue in the comments | Polarizing takes, us vs them, ragebait |
| **🏷️ Tag** | People tag a friend | Relatable content, identity validation, founder contrast |
| **🔗 Product** | People visit the site/sign up | Product-focused carousels, feature announcements |

## CTA Slide Structure

Every CTA slide has 3 zones:

```
┌─────────────────────┐
│                     │
│   Headline          │  ← emotional closer that drives the action
│                     │
│   Subtext           │  ← conversational nudge (optional)
│                     │
│   [ Pill / Badge ]  │  ← the action element
│                     │
└─────────────────────┘
```

## Action Playbooks

**💬 Comment Keyword** — maximize comments for lead magnet delivery

Headline should create urgency around the freebie and include the keyword inline inside `<em>` (the emphasis styling comes from the theme + `layout.emphasis.style`). The keyword is part of the sentence, not a separate badge. Brand pill stays at the bottom.

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">We made a free guide to set this up yourself. Comment <em>"{keyword}"</em> below and we'll send it over.</h2>
  <p class="slide-stat">It takes 2 seconds 👇</p>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>
  </div>
</div>
```

**📤 Share** — maximize sends/forwards

Headline should name who to send it to. Make it specific — "someone who" + a relatable trait. No subtext needed usually — the headline does the work.

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">Send this to a creator who's still <em>doing everything manually</em></h2>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>
  </div>
</div>
```

**💾 Save** — maximize bookmarks

Headline should frame the carousel as a reference they'll need later. Create future anxiety — "you'll wish you saved this."

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">Save this before your <em>next brand pitch</em></h2>
  <p class="slide-stat">You'll need this sooner than you think.</p>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>
  </div>
</div>
```

**🔥 Controversy** — maximize comment volume through debate

Headline should pick a side and dare people to disagree. The more polarizing, the more comments. Subtext should explicitly invite the fight.

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">If you're still posting without a <em>system</em> ... I don't know what to tell you</h2>
  <p class="slide-stat">Agree or disagree? Fight me in the comments.</p>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>
  </div>
</div>
```

**🏷️ Tag** — maximize tags/mentions

Headline should describe a specific person the reader knows. The more specific the description, the more tags.

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">Tag the creator who <em>needs to hear this</em></h2>
  <p class="slide-stat">You know exactly who I'm talking about.</p>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.url} — {brand.cta}</a>
  </div>
</div>
```

**🔗 Product** — maximize clicks/signups

Headline is the emotional closer. Subtext is conversational, not a button label. Pill is a short CTA — pull from `.carousel.md` `brand.cta_product` or project `product.md` if available.

```html
<div class="slide slide--anchor">
  <h2 class="slide-headline">You didn't become a creator to <em>burn out.</em> Get your time back.</h2>
  <p class="slide-stat">Your audience is waiting. Stop grinding.</p>
  <div class="slide-bottom">
    <a class="cta-pill" href="#">{brand.cta_product}</a>
  </div>
</div>
```

## Pill Options

The pill is flexible — pick what fits the action:
- `{brand.url} — {brand.cta}` — default pill for all CTAs (brand + action)
- `{brand.cta_product}` — product signups (e.g. "Get Started Today")
- `Free Guide in Bio` — lead magnets (alternative to keyword badge)
- `{brand.url}/{feature}` — feature-specific
- Any short actionable phrase. Pull from `.carousel.md` or `product.md` if available.

## Auto-Select Action

Pick the action based on strategy + content:

| Strategy | Default action | Why |
|----------|---------------|-----|
| Belief Disruption | 🔥 Controversy or 📤 Share | Polarizing takes spark debate |
| Founder Contrast | 🏷️ Tag | "Tag someone who's still doing this" |
| The Call-Out | 📤 Share | Uncomfortable truths get forwarded |
| FOMO / Lead Magnet | 💬 Comment keyword | Drive DM/comment automation |
| Us vs Them | 🔥 Controversy | Tribal content sparks arguments |
| Curiosity Gap | 💾 Save or 📤 Share | Frameworks get bookmarked |
| Identity Validation | 🏷️ Tag | "You know exactly who this is" |
| Aspiration / Transformation | 📤 Share | Inspiring content gets sent |
| Educational | 💾 Save | Reference content gets saved |
| Listicle | 💾 Save | Lists are bookmarked |
| Story Arc | 📤 Share | Stories get forwarded |
| Problem-Agitate-Solution | 📤 Share or 🔗 Product | Depends on whether product is the solution |
| Hook-Features-CTA | 🔗 Product | Product-focused = product CTA |
| Unpopular Opinion | 🔥 Controversy | Bold takes spark debate |

If the user specifies a different action (e.g. "optimize for comments"), override the default.

## Auto-Select CTA

| Strategy | Default CTA type |
|----------|-----------------|
| Belief Disruption | Share prompt or Discussion |
| Founder Contrast | Comment trigger |
| The Call-Out | Share prompt |
| FOMO / Lead Magnet | DM trigger |
| Us vs Them | Discussion |
| Curiosity Gap | Save prompt or Share prompt |
| Identity Validation | Comment trigger |
| Aspiration / Transformation | Share prompt |
| Educational | Save prompt |
| Listicle | Save prompt |
| Story Arc | Share prompt |
| Problem-Agitate-Solution | Share prompt |
| Hook-Features-CTA | Product pill |
| Unpopular Opinion | Discussion / Controversy |
