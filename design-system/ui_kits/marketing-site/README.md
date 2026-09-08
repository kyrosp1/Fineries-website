# Marketing Site — UI Kit

An interactive, modular recreation of the **Fineries Digital** agency website
(fineries.net). Single-page, scroll-based, with a sticky nav, filterable work grid and a
working contact form. Built to the brand foundations in `../../colors_and_type.css`.

> Reconstruction note: the live fineries.net is a light WordPress/Slider-Revolution
> page; no production source or Figma was available. This kit reinterprets the brand's
> known positioning, palette and color-field system into a contemporary agency site.
> It is a faithful *brand* recreation, not a pixel copy of the current live HTML.

## Run
Open `index.html`. React + Babel load from CDN; Lucide provides icons. Fonts (Sora,
Manrope) load from Google Fonts via the shared CSS.

## Components
| File | What it is |
| --- | --- |
| `Nav.jsx` | Sticky top nav — transparent over hero, frosted-white once scrolled; logo swaps white→blue; mobile burger menu |
| `Hero.jsx` | Dark-blue hero, big Sora headline, faint wordmark watermark, dual CTAs |
| `Capabilities.jsx` | 3-col capability cards with tinted Lucide icons (one accent per card) |
| `Work.jsx` | Filterable case-study grid — white cards with a tinted category chip + blue metric |
| `Band.jsx` | Dark proof band: mission quote + stats in gold |
| `Contact.jsx` | CTA + interactive contact form with fake submit → success state |
| `Footer.jsx` | Dark footer with link columns + brand mark |

## Interactions
- Nav solidifies on scroll; mobile menu toggles.
- Work filters re-filter the grid live.
- Contact form validates required fields and shows a success state (no backend).

## Patterns to reuse
- **Pill buttons** (`.btn--pill .btn--pri`) with the brand glow + hover lift.
- **Color fields** — full-bleed solid brand color with the wordmark recolored for contrast.
- **Accent-on-white cards** for work/case studies — tinted category chip + blue metric, color used sparingly.
- Section rhythm: `.eyebrow` → `.section__title` → content.
