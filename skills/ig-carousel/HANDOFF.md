---
status: active
updated: 2026-04-21
owner: AJ
---

# ig-carousel — Status & Open Handoffs

This doc tracks what's shipped, what's open, and lingering questions. It replaces the original refactor spec (which was completed on 2026-04-21 — see git history for the prior version).

## Completed (2026-04-21 session)

The original handoff goal — **separate psychology from construction + make the skill extensible for any brand** — is done.

**Architecture shipped:**
- `SKILL.md` — lean construction manual, brand-agnostic. No hardcoded brand values.
- `references/` — psychology relocated verbatim from the monolithic SKILL.md:
  - `strategy-selection.md` — 13 strategies + Specificity Rule
  - `hook-formulas.md` — Fear > Positive, conversation test, hook rules 1-7
  - `structural-narratives.md` — slide-by-slide arcs per strategy
  - `action-playbooks.md` — 6 CTA playbooks (Comment/Share/Save/Controversy/Tag/Product)
- `templates/carousel-config.md` — the `.carousel.md` template for new projects
- `commands/init-carousel.md` — bootstrap `.carousel.md` from a project's DESIGN.md
- `commands/sync-carousel.md` — drift detection + auto-fix between DESIGN.md and `.carousel.md`
- `agents/ig-carousel.md` — empty stub (see lingering Q #1)

**Config architecture:**
- Three-tier: `DESIGN.md` (brand foundation, humans read) → `.carousel.md` (skill-readable bridge, per-project) → `SKILL.md` (universal recipe)
- Looplinq's `.carousel.md` lives at the Looplinq repo root — added in commit `03f89d7`

**Extras beyond the original refactor scope:**
- **Role-based themes.** Narratives reference `anchor` / `body` / `alt` instead of literal theme names (`slide--primary`/`dark`/`white`). Brands can rename theme keys without breaking references.
- **Classless `<em>`.** Color + style cascades from `.slide--{role}`. No `em.primary` / `em.white` class coupling.
- **Emphasis style as config.** `layout.emphasis.style` accepts `italic` / `bold` / `italic-underline` / `highlight` / `italic+highlight`. Brands can use highlighter effects instead of italics.

**Commits:**
- `36daf6b` — initial commit (scaffold)
- `9461e50` — /sync-carousel added

---

## Current file tree

```
carousel-skill/skills/ig-carousel/
├── SKILL.md                            ← construction manual, brand-agnostic
├── HANDOFF.md                          ← this file (status + open items)
├── references/
│   ├── strategy-selection.md
│   ├── hook-formulas.md
│   ├── structural-narratives.md
│   └── action-playbooks.md
├── templates/
│   └── carousel-config.md
├── commands/
│   ├── init-carousel.md
│   └── sync-carousel.md
├── handoffs/
│   └── image-generation.md             ← open
└── agents/ig-carousel.md               ← stub (see below)
```

---

## Open handoffs

### [image-generation.md](handoffs/image-generation.md)

Image support (screenshots, photos, charts) was scoped and designed this session but NOT built. Final plan is an MVP (`images.enabled: true/false` + user-provided paths in prompt, ~2-3 files). Full design discussion (slide_types, modes, sources, content inference) is preserved in the handoff for when real usage reveals what's actually needed.

**Priority: low.** Use the skill in practice first. Let pain points drive the design.

---

## Lingering questions (no handoff, just open)

1. **Agent layer — build, delete, or leave as stub?** `agents/ig-carousel.md` is currently empty. Picasso's agent does two things the carousel skill doesn't: gallery-driven discovery (6 preview layouts → user reacts) and visual validation (screenshot audits after generation). Both are plausible future features. Neither is urgent. Defer until there's a real pain point — or delete the stub to remove dead code.

2. **Export script location.** `ig-carousel/export-slides.mjs` lives in each brand's project repo. When export logic changes (new aspect, bug fix, retina tweaks), every brand has to update their copy. Moving it to `carousel-skill/bin/export-slides.mjs` eliminates drift but requires brands to reference it by path. Low priority until drift actually happens.

3. **Reference HTML template.** The old skill relied on `ig-carousel/index.html` as a template in each brand's repo. We removed the dependency but didn't replace it with a skill-side template. Each generation writes HTML from scratch based on SKILL.md instructions. Pro: flexible, no template maintenance. Con: potential inconsistency across generations. Unknown impact without real usage data.

4. **Silent pre-flight sync.** `/sync-carousel` is user-triggered. Should the main build flow run it silently before generating a carousel, warning if drift exists? Or is manual enough?

5. **Gallery-driven init (picasso-style).** Six preview variants, user reacts, skill writes `.carousel.md` from the chosen direction. Blocked on image support landing first (variants need real visual diversity). Phase 3+.

6. **Viral hook / creator exemplar library.** Static references with 100+ real hooks and creator carousel transcripts tagged by strategy. Would give Claude concrete material to imitate instead of just formulas. Mentioned in the 2026-04-21 session, never built. Likely meaningful output-quality improvement.

7. **Narrative-level type hints.** When image support ships, some narratives (Founder Contrast, Curiosity Gap) have specific slide positions that dramatically benefit from visuals. Should narratives carry optional type hints? Or is that redundant with content inference? Open — decide alongside image support work.

---

## Key architectural principles (don't break these)

1. **Nothing in `SKILL.md` assumes brand or content.** All brand tokens flow through `.carousel.md`.
2. **References are universal knowledge.** Narratives, hook formulas, action playbooks don't know which brand is running them.
3. **Three-tier config flow:** `DESIGN.md` → `.carousel.md` → skill runtime.
4. **Role-based theme references.** Narratives and HTML use roles (`anchor`/`body`/`alt`), not literal theme names.
5. **CSS cascade over class multiplication.** `<em>` stays classless; parent `.slide--{role}` resolves styling.
6. **Config is human-editable markdown with YAML frontmatter.** No JSON config, no custom DSL. Keeps the "read and edit by eye" ergonomics.
7. **Relocation over rewriting.** When moving content between files, preserve prose verbatim unless the refactor specifically requires changes.

## When picking up work next session

1. Read this file first (status + open items).
2. If working on images, read `handoffs/image-generation.md` for full design context.
3. Read `SKILL.md` + skim one reference to re-orient on the construction model.
4. Check `Looplinq/.carousel.md` for a live example of a filled-in config.
