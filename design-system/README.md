# Fineries Digital — Design System

A living design system for **Fineries Digital**, a digital advertising & communications
agency based in Lagos, Nigeria. Fineries helps ambitious brands accelerate growth by
creating digital experiences that drive results — its stated mission is to *help brands
build lasting love relationships with humans.*

> ⚠️ **Context note.** No codebase or Figma file was supplied for this project. The
> system was built from two brand assets — the primary logo (`Fineries-Logo_Blue.png`)
> and a brand color sheet (`Fineries COlors.jpg`) — supplemented by publicly
> available company copy. Type, spacing, components and the UI kit are an *informed
> reconstruction* in the spirit of the brand, not a 1:1 copy of a production product.
> Treat foundations (logo, the four brand colors, mission/positioning copy) as ground
> truth; treat everything else as a strong, editable starting point.

---

## Sources

| Source | What it gave us |
| --- | --- |
| `uploads/Fineries-Logo_Blue.png` | Primary wordmark + exact blue `#3C4099` |
| `uploads/Fineries COlors.jpg` | The four brand squares (blue, gold, magenta, teal) |
| https://fineries.net | Positioning & nav ("Capabilities", "Work", "Contact"), tagline copy |
| Public listings / job posts | Mission, service lines, Lagos HQ |

There was **no** GitHub repo, Figma URL, or local codebase attached. If you have these,
re-attach them via the Import menu and we can raise fidelity considerably.

---

## What Fineries does

A full-service digital agency. Capability lines observed across public materials:

- **Brand strategy & identity** — positioning, naming, visual identity
- **Content & creative** — copy, design, animated video, photography
- **Social & paid media** — social management, digital campaigns, PPC
- **Experience design** — web, mobile apps, digital products
- **Digital PR & growth** — SEO, marketing automation

**Voice in one line:** *We help ambitious brands accelerate growth — we create digital
experiences that drive results.*

---

## The products represented here

Because Fineries is an agency, its primary owned "product" is its **marketing website**.
The UI kit recreates that surface:

- `ui_kits/marketing-site/` — the Fineries agency website (hero, capabilities, work
  grid, CTA, footer, nav) as interactive, modular components.

If client-facing pitch decks or app products are shared later, add UI kits / slide
templates for those here.

---

## Index / manifest

| Path | Purpose |
| --- | --- |
| `README.md` | This file — context, content & visual foundations, iconography |
| `colors_and_type.css` | All color + type tokens (brand ramps, semantic vars, type scale, spacing, radii, shadows) |
| `SKILL.md` | Agent-Skill entry point (Claude Code compatible) |
| `assets/` | Logos (blue + white, 3×), color sheet |
| `preview/` | Design-system preview cards (rendered in the Design System tab) |
| `ui_kits/marketing-site/` | Marketing website UI kit — `index.html` + JSX components |

---

## CONTENT FUNDAMENTALS

How Fineries writes. Derived from site copy, job posts and mission statements.

**Vibe.** Confident, warm, growth-minded. The agency speaks like an ambitious partner,
not a vendor. Human-centric: the word *humans* (not "users" or "consumers") recurs —
*"build lasting love relationships with humans."*

**Person & address.** First-person plural for the agency ("**We** help…", "**We**
create…"); second person for the client ("**your** brand", "**your** audience"). The
reader is always *you*, the ambitious brand.

**Tense & energy.** Present tense, active voice, verbs of momentum: *accelerate, grow,
drive, build, win, resonate, connect.* Outcomes over features.

**Casing.** Sentence case for body and most headlines. **ALL-CAPS used sparingly and
deliberately** for nav items and section labels ("HOME / CAPABILITIES / WORK / CONTACT")
and short eyebrow labels — never for long strings. Headlines are Title-light (sentence
case), e.g. *"We help ambitious brands accelerate growth."*

**Sentence length.** Short, declarative, punchy. One idea per line. Taglines are often
two clauses split across a slide/hero ("We help ambitious brands accelerate growth." /
"We create digital experiences that drive results.").

**Emoji.** Not part of the brand voice — avoid in product/marketing surfaces. (Social
channels may use them, but the core brand reads clean and professional.)

**Words to favor:** ambitious, growth, accelerate, results, experiences, brands,
humans, connection, story, love, bold.

**The slogan / tagline.** Fineries' signature slogan is **“We build brands people love”**,
set in a stylized all-caps treatment where the *O* in PE**O**PLE becomes a small group
pictogram and the *O* in L**O**VE becomes a heart. It is sometimes **locked up with the
logo** (logo │ slogan, divided by a vertical rule). Use the prepared assets rather than
re-typesetting it. The mark is **multi-color**: blue wordtext, a **teal** people
pictogram for the *O* in PE**O**PLE, a **gold** price-tag for the *A* in BR**A**NDS
(with blue detail), and a **magenta** heart for the *O* in L**O**VE. Use the prepared
assets: `assets/slogan-color.svg` / `slogan-color-dark.svg` (full color, light / dark
backgrounds) and `assets/slogan-lockup-color.svg` / `slogan-lockup-color-dark.svg` (with
logo). Mono `assets/slogan-{blue,white}.svg` exist for single-color contexts only
(tiny sizes, one-color print). Never recolor the glyphs yourself — the accent colors are
fixed; only the wordtext/logo flip between blue (light bg) and white (dark bg).

**Words to avoid:** generic jargon ("synergy", "leverage solutions"), cold terms for
people ("end-users", "targets"). Keep it human.

**Examples (on-brand):**
- *"We help ambitious brands accelerate growth."*
- *"We create digital experiences that drive results."*
- *"Building lasting love relationships between brands and humans."*
- Eyebrow: `WHAT WE DO` · CTA: `Start a project` · Nav: `WORK`

---

## VISUAL FOUNDATIONS

**Overall feeling.** Bold, optimistic, modern. A confident blue anchor energized by a
vivid trio of accents (gold, magenta, teal). Clean, generous whitespace; geometric type;
flat color blocks rather than skeuomorphism. Think contemporary creative agency.

**Color.**
- **Primary:** Blue `#3C4099` — **the** Fineries blue (the logo color *and* the brand's
  signature full-bleed field). Used for primary text emphasis, buttons, and large solid
  blue panels behind B&W imagery. This exact value is the approved blue — do **not**
the field is the bright `#3C4099` itself.
- **Accent trio:** Gold `#FFC80C`, Magenta `#C01891`, Teal `#08BCB3` — the other three
  brand colors. Used as punchy highlights, category coding, and large full-bleed color
  fields behind the logo, work and case imagery. Use **one color per moment** — a surface
  is one solid brand color, never a clash of several.
- **Neutrals** are cool / blue-tinted (not pure gray), keeping everything in the same
  temperature family. Page background is a near-white `--paper #FAFAFD`.
- **Imagery vibe:** high-contrast **black & white** photography of expressive people,
  knocked out and placed on a solid `#3C4099` blue field. See the IMAGERY section below.

**The color-field system.** The defining brand device is the **wordmark on a solid
brand-color field**: a single full-bleed block of blue, gold, magenta or teal, with the
Fineries logo placed in a *contrasting brand color* on top (e.g. blue logo on gold,
teal logo on magenta, gold logo on blue, white logo on magenta). Always pair the logo
with the field for legible contrast — recolored logo variants live in `assets/`
(`fineries-logo-{blue,white,gold,magenta,teal}-3x.png`). This swatch-and-logo pairing is
the brand's signature; there is **no** geometric icon or symbol mark beyond the wordmark.

**Type.**
- **Display / headlines:** `Sora` (geometric, bold, 700–800), tight tracking
  (`-0.02em`). Big, confident, sentence-case.
- **Text / UI:** `Manrope` (humanist sans, 400–700). Readable, friendly, modern.
- **Mono (rare):** `IBM Plex Mono` for code/labels only.
- *Substitution flag:* the wordmark is a custom heavy geometric face; Sora is the
  closest free match for headlines. If you have the original brand font, drop it in
  `fonts/` and update `--font-display`.

**Spacing & layout.** 8-pt spacing scale. Generous section padding (`96–128px` vertical
on desktop). Content max-width ~1200px, 12-col mental model. Left-aligned text as the
default; centered only for short hero/CTA moments. Fixed sticky top nav.

**Backgrounds.** Mostly solid flat color — `--paper` for light sections, the brand blue
`#3C4099` (`--blue`) for dark sections, occasional full-bleed accent blocks
(gold/magenta/teal). **No** noisy
gradients or purple-haze gradients. A subtle low-opacity wordmark watermark is
acceptable on dark fields. Photo
sections are full-bleed with a dark blue scrim for text legibility.

**Corner radii.** Soft but not pill-everything. Cards `16px` (`--r-md`), large feature
panels `24px`, buttons are **fully rounded pills** (`--r-pill`) for primary CTAs and
`10px` for compact/secondary controls. Inputs `10px`.

**Cards.** White surface, `16px` radius, hairline `--line` border *or* a soft cool
shadow (`--shadow-md`) — not both heavy. On hover, lift to `--shadow-lg` and translate
up 2–4px. **Work/case cards are white** with a tinted category chip for color-coding and
the metric set in brand blue — color is an accent, not a full field. Reserve full
brand-color fields for single featured moments (the imagery band), never a whole grid of
competing saturated blocks.

**Shadows.** Soft, cool, blue-tinted (never pure-black). Four-step elevation
(`sm → xl`) plus a `--shadow-brand` colored glow for primary buttons on hover.

**Borders.** Hairline `1px` `--line` for structure. Accent borders only for selected/
active states (e.g. 2px blue or teal).

**Animation.** Purposeful and quick. Fades + short upward translates (12–16px) on
scroll-in. Easing `cubic-bezier(.22,.61,.36,1)` (ease-out-ish), `200–320ms`. No bounces,
no spinning, no parallax overload. Hover transitions `~160ms`.

**Hover states.** Buttons darken to `--accent-hover` and gain the brand glow; links go
blue + underline; cards lift. **Press states:** darken further to `--accent-press` and
scale `0.98`. Keep motion subtle.

**Transparency & blur.** Used lightly: sticky nav gets a translucent white background
with `backdrop-filter: blur(10px)` once scrolled. Dark image scrims use blue at
55–70% opacity. Avoid frosted-glass everywhere.

---

## IMAGERY

This is the most distinctive part of the Fineries look — confirmed by the brand's own
example designs (see `assets/examples/`).

**The rule:** *high-contrast black & white photos of expressive people, placed on a solid
`#3C4099` blue field.*

- **Treatment.** Photos are **desaturated to grayscale** with a small contrast boost
  (`filter: grayscale(1) contrast(1.08)`). No color photography in the core brand look.
- **The field.** The photo sits on a full-bleed **`#3C4099`** blue rectangle. Subjects
  are often **knocked out / cut out** so the blue wraps around them and they appear to
  float on the field (see `photo-knockout-person.png`). Full-bleed rectangular photos
  on the blue field also work (Vision / Mission examples).
- **Text over imagery.** A big **gold (`#FFC80C`) keyword** ("Vision", "Mission") sits
  over the subject, with **white** supporting copy beneath it. Bold weight is used to
  emphasise key phrases in the white copy (e.g. **love relationships**). A small white
  caption paragraph may sit in a lower corner.
- **Selective color pop (optional).** One element of an otherwise B&W photo may keep its
  colour for impact — e.g. the **magenta trousers** in the Mission example. Use sparingly,
  and pull the colour from the brand palette.
- **Gold field variant.** The field can invert to **gold** (`#FFC80C`) with **blue**
  heading + **white** words, no photo (see the Core Values example) — used for
  typographic, word-driven layouts.
- **People.** Editorial, expressive, real people; movement and emotion (a dancer
  mid-leap, a thinking face). Not corporate stock smiles.

**CSS helpers** (in `colors_and_type.css`): `.fnr-photo` (B&W filter), `.fnr-image-field`
/ `.fnr-image-field--gold` (the field), `.fnr-image-keyword` (gold word),
`.fnr-image-copy` (white copy). Reference compositions live in `assets/examples/`.

---

## ICONOGRAPHY

No proprietary icon set was supplied. The brand has **no symbol/logomark** — its identity
is the **wordmark** placed on solid brand-color fields (see Visual Foundations and
`assets/`). There is no geometric icon device.

- **Icon library:** Use **[Lucide](https://lucide.dev)** (loaded from CDN) as the working
  icon set — its clean, geometric, `2px`-stroke outline style matches the brand's modern
  geometric character. Stroke `1.75–2px`, rounded line caps, `currentColor`.
- **Sizing:** 20px inline / 24px standalone / 28–32px feature. Keep stroke weight
  consistent across sizes.
- **Color:** icons inherit text color (`currentColor`); accent icons use a single brand
  accent, never multicolor.
- **Emoji:** not used in brand/product surfaces.
- **Unicode glyphs:** avoid as functional icons — use Lucide instead for consistency.
- *Substitution flag:* Lucide is a substitute for an unknown original set. If Fineries
  has a custom icon library, drop the SVGs into `assets/icons/` and document here.
