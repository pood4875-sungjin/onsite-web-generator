# Probe Notes — Minimum Pack Completeness

Source: `core/probe/out.html` (rendered from `core/probe/sample-page.js` via the sample pack + the base scaffold hardcoded in `core/renderer.js`).

## Tokens actually consumed by the 5 sections + scaffold
The scaffold `<style>` block only references these 9 of the 14 tokens the sample pack defines (`grep 'var(--' core/renderer.js`):
- `--accent` (`.btn.primary` background/border)
- `--bg`, `--bg-2` (`body` background, `.band.alt` / `.hero-media` background)
- `--ink`, `--ink-2` (`body` text, `.gnb a` text)
- `--line` (`.btn` border, `.card` border, `.gnb` border-bottom)
- `--radius` (`.btn`, `.card`, `.hero-media`)
- `--fs-h1`, `--fs-h2` (`h1`, `.h-sec`)

Defined in `tokens.css.js` but **never consumed anywhere in the scaffold**: `--fs-body`, `--sp-2`, `--sp-4`, `--sp-6`. Section markup that would need body-text sizing or a real spacing scale (e.g. `.lead`, `.sub`, `.muted`, gaps between cards/rows) falls back to browser defaults or the scaffold's few hardcoded pixel values (`gap:24px`, `gap:40px`, `padding:64px 0`, etc.) instead of these tokens — i.e. the token set is aspirational, not yet wired up.

## Layout/grid rules that had to exist
Currently all living in the renderer's base scaffold (pack-agnostic), which is exactly the problem a real StylePack must solve differently:
- `.container` — max-width + centering (page-wide constraint, generic enough to belong in scaffold)
- `.band` / `.band.alt` — vertical rhythm wrapper used by `feature` and `cta` (generic, scaffold-owned is reasonable, but only 1 background variant exists — no elevated/bordered/boxed variant even though `cta`'s `boxed` variant class is emitted by section code)
- `.hero` 2-col grid + `.hero.center` 1-col override — hero-specific layout, arguably should be pack-owned since packs will want different hero proportions (e.g. 60/40, asymmetric)
- `.grid` auto-fit feature grid (`repeat(auto-fit,minmax(220px,1fr))`) — feature-specific, should be pack-owned (a real pack may want a fixed 4-col grid, different minmax breakpoint, etc.)
- `.gnb` flex nav bar — nav-specific layout, scaffold-owned for now
- `.footer` — only `padding` + `margin-top` + `background`; the actual footer **column layout is entirely missing** (see Gaps)

None of this is namespaced as "base" vs "pack" in code today — it's all one hardcoded block in `renderDocument()`. A real StylePack would need to own the hero/grid/footer layout choices; only `.container`/`.band`/reset-level rules feel safely scaffold-level.

## Component styles needed
Present in the scaffold and actually exercised by the probe output:
- `.btn` / `.btn.primary` — both variants render correctly (bordered secondary + solid accent primary)
- `.card` — bordered box, used by feature grid, renders correctly
- `.gnb` (+ `.gnb nav`, `.gnb a`) — nav bar renders with working link color
- `.hero` / `.hero.center` — 2-col and center layouts both defined
- `.footer` — background band exists, but its children (`.fbrand`, `.fcols`, `.fcol`) are unstyled (see Gaps)

## Gaps / things that look incomplete
Full diff of every class emitted by the 5 sections' `render()` (grepped `class="..."` from `out.html`, plus variant-only classes visible in the section source but not exercised by this probe page) against the scaffold's CSS selectors in `core/renderer.js`:

Classes with **no CSS rule at all** in the scaffold:
- `.sx` — the outer `<section class="sx" data-sec="...">` wrapper the renderer puts around every section is completely unstyled (no spacing/reset).
- `.logo` — nav brand text (`nav.js`), no font-weight/size, just inherits body text.
- `.eyebrow` — hero + feature eyebrow label, no styling (would visually look identical to a normal `<div>`, no small-caps/color/tracking treatment expected of an "eyebrow").
- `.lead` — hero lead paragraph, no styling (renders as default `<p>` size = same as body text, no visual hierarchy under `<h1>`).
- `.muted` — feature card description (`feature.js`), no color rule, so it doesn't actually look "muted" — same ink color as headings.
- `.sub` — cta subtext (`cta.js`), same problem as `.lead`, no distinct styling.
- `.fbrand` — footer brand name, unstyled.
- `.fcols` — footer column container, **no layout at all** — the two `.fcol` blocks stack as plain block divs (`display:block` default), not a flex/grid row. This is the most visible breakage: footer columns render as a single unstyled vertical dump of text.
- `.fcol` — individual footer column, unstyled (no width/spacing between title and its links).
- Footer `<a>` links (inside `.fcol`) — no `.footer a` / `.fcol a` rule, so they fall back to browser default (blue, underlined), visually inconsistent with `.gnb a` which does get `--ink-2` + no-underline treatment. This is a direct visual inconsistency between nav links and footer links in the same rendered page.
- `.hero-media.placeholder` — `.hero-media` itself gets a background box + radius from the scaffold, but the `placeholder` modifier class adds nothing further, so an empty hero image slot just renders as a plain gray box with no "missing media" affordance (no icon, no dashed border, no label).

Variant classes referenced by section `render()` code but **exercised by zero sample-pack variant and given zero CSS anywhere** (would break silently if a pack picked them via `variantMap`):
- `.trans` (nav `transparent` variant, `nav.js`)
- `.stack` (feature `list` variant layout class, `feature.js`)
- `.boxed` (cta `boxed` variant, `cta.js`)
- `.slim` (footer `slim` variant, `footer.js`)

Minor hygiene (not a styling gap, but worth flagging): the renderer emits trailing-space classes for the non-modifier branch of each ternary, e.g. `class="gnb "`, `class="hero "`, `class="footer "`, `class="btn "` — cosmetically harmless but signals the variant-class logic (`${cond ? 'x' : ''}`) was written without trimming, which will look sloppy in generated source view / dev tools if that's ever surfaced to a real user.

## Conclusion — minimum a StylePack must ship (feeds PRD §6)
- A StylePack must ship typography/utility rules for **content-role classes**, not just component boxes: `.eyebrow`, `.lead`, `.sub`, `.muted`, `.logo`, `.fbrand` currently have zero visual distinction from plain text — these are exactly the classes a pack's "voice" (editorial vs. dense vs. minimal) would style differently, and today none of them render as anything but inherited body text.
- A StylePack must ship the **footer column layout** (`.fcols` flex/grid + `.fcol` spacing) and **footer link color/decoration** — the scaffold only gives the footer a background band, so this section is the least "pack-agnostic-safe" of the five; without pack CSS it's visibly broken (unstyled link-dump), not just plain.
- A StylePack must ship **every variant class a pack's `variantMap` can select** (`.trans`, `.stack`, `.boxed`, `.slim`) — the section code emits these classes unconditionally based on the pack's own variant choice, but the scaffold gives them zero rules, so picking an untested variant currently produces a silently unstyled section with no visual difference from its base form.
- The token set is bigger than what the scaffold consumes (`--fs-body`, `--sp-2/4/6` are defined but dead) — a pack's CSS is what would actually put a real typographic scale and spacing rhythm to use; until then those 4 tokens are unverified/untested by this probe.
