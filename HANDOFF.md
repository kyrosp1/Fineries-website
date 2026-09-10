# Fineries Project Handoff

Last updated: 2026-09-10

## Current state

- Frontend: Astro SSR in `web/`.
- Production frontend: `https://fineries-website.vercel.app`.
- CMS: headless WordPress at `https://cms.fineries.net`.
- Production branch: `main`; pushes trigger the Vercel deployment.
- Latest completed feature: shared video-modal feedback for loading, buffering, playback-ready, and failure states across the homepage and capability pages.
- No known incomplete implementation work.

## Key architecture

- `web/src/lib/wp.js` reads the live WordPress REST endpoint at `/wp-json/fineries/v1/home`.
- `cms-wp/wp-plugins/fineries-cms/fineries-cms.php` defines CMS fields and the REST response.
- `web/src/components/HomePage.astro` renders the homepage.
- `web/src/components/WhatWeDo.astro` renders the What We Do page.
- `web/src/data/capabilities.js` is the single frontend source of truth for every capability's sub-service names and icons. The lists were transcribed from the What We Do section of `Fineries_Website_Content.docx`.
- `web/src/components/ServiceArtwork.astro` embeds and scopes the layered service SVGs.
- `web/public/css/home.css` contains the shared service-art animation language.
- `web/public/css/wwd.css` contains the What We Do page and sticky capability-story layout.
- `web/public/js/wwd.js` switches capability chapters and artwork using GSAP ScrollTrigger, with an IntersectionObserver fallback.
- `web/public/js/v3.js` owns the shared video modal, including loading/buffering feedback and playback errors. `web/public/css/v3.css` styles the responsive 16:9 desktop and 9:16 mobile player states.

The What We Do cards initially show six sub-services. Their accessible `+ more` buttons reveal the remaining canonical items and switch to `Show less`. Brand & Strategy and Digital Products & Technology have custom page components; the other three share `CapabilityPage.astro`, but all five import the same canonical data module.

## Service artwork

- Brand & Strategy: `web/src/assets/brand.svg`
- Content & Production: `web/src/assets/content.svg`
- Digital Products & Technology: `web/src/assets/digital.svg`
- Executive & Personal Branding: `web/src/assets/executive.svg`
- Marketing & Growth is currently drawn directly in `ServiceArtwork.astro`.

The SVGs are imported as raw strings and rendered inline. Their CorelDRAW `.fil*` classes are renamed per artwork so CSS styles cannot collide. Inline rendering is required for independent path animation.

The animated SVG files currently belong to the Vercel frontend and do not appear in the WordPress Media Library. WordPress manages service text, links, colours, fallback images, and capability copy. Making the SVG source CMS-managed would require a dedicated SVG field/upload workflow and safe inline delivery; this has not yet been implemented.

## Current animation behaviour

- Homepage service cards animate on hover/focus.
- Brand: opposing chess-piece movement.
- Marketing: megaphone recoil and expanding broadcast bars.
- Content: converging and rotating playheads.
- Digital: arrow halves accelerate along their diagonal.
- Executive: foreground scales by 40% and rotates 40 degrees.
- `/what-we-do` reuses the same motion language as chapters enter the active scroll zone.
- Reduced-motion handling is present in the shared CSS and What We Do CSS.

## Verification and deployment

From `web/`:

```powershell
$env:ASTRO_TELEMETRY_DISABLED='1'
npm run build
node --check public/js/wwd.js
```

Before committing:

```powershell
git diff --check
git status --short
```

Commit only task-related files. `.claude/settings.local.json` is an unrelated untracked user file and must not be included. Push completed commits to `origin main`, then verify the production URL returns the new cache-versioned CSS/JS references.

When changing a public CSS or JavaScript file, increment its query-string version in the Astro component that loads it so browsers and Vercel do not serve stale assets.

## Working conventions

- Preserve unrelated user changes and untracked files.
- Use `apply_patch` for source edits.
- Keep changes in focused commits with descriptive messages.
- Run the full Astro build after UI work.
- Visually inspect important layout or motion changes locally before deployment.
- Push only after the implementation and checks pass.
