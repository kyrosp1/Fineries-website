# Fineries Digital — project context (read this first)

Bespoke marketing website with a self-hosted headless CMS. This file is the
handoff/context for any session or model continuing the work. Full run/setup
details are in `README.md`.

## 🔒 Production safety boundaries — ANY model/session MUST follow these
The client (owner: kkksweet@yahoo.ca) granted SSH access to the live WordPress
(cms.fineries.net on Hostinger) for automated **plugin** deploys. These rules are
non-negotiable and apply regardless of which model is running:

1. **Credentials.** Never ask for, accept, type, or store the client's WordPress or
   hosting **password** or any account credential. Live-server auth is ONLY the local
   SSH key `~/.ssh/fineries_deploy` (private key stays on the machine; never print,
   copy, commit, or transmit it). If a task seems to need a password, stop and tell the
   user to do that part themselves.
2. **Scope of live writes.** Automated deploys touch ONLY the `fineries-cms` **plugin
   folder** (`…/cms/wp-content/plugins/fineries-cms/`). Never modify, deactivate, or
   delete ACF Pro or any other plugin, WordPress core, themes, the database schema, the
   uploads/media library, or server/system/hosting settings.
3. **NEVER re-run the full `seed.php` on production.** It overwrites every Home Content
   and Site Settings option with code defaults and would wipe the client's own edits
   (text, the uploaded CTA image, logos, etc.). `seed.php` is for fresh/local installs
   only. To change live content, edit in wp-admin, or run a **targeted** `wp eval-file`
   over SSH that writes only the specific field(s) — after reading current values first.
4. **Treat live content as the client's.** Read before you overwrite; never bulk-write
   option fields; preserve their uploaded media and edits. Before overwriting or
   deleting anything you did not create, inspect it and surface any conflict instead of
   proceeding.
5. **Never delete data on prod** — no emptying trash, hard-deleting posts/media, or
   dropping/altering DB tables. These are irreversible.
6. **Confirm before hard-to-reverse or wide-reaching live actions** (deleting content,
   DB writes beyond a single targeted field, permalink/settings changes, deactivating
   plugins). Deploying the plugin is additive and reversible (redeploy the prior
   version), so it may proceed — but always report exactly what you did and verify
   (`/wp-json/fineries/v1/home` returns 200; the Vercel site returns 200).
7. **Content stays in the CMS, code stays in git.** Don't hardcode site content (see the
   Content convention below). The repo is the source of truth for code; WordPress is the
   source of truth for content.

## Architecture
- **web/** — Astro front-end, SSR (`@astrojs/node`, `output: "server"`). Renders the
  hand-built design from CMS data. Dev server on **http://localhost:4321**.
- **cms-wp/** — ★ ACTIVE CMS ★ headless **WordPress** + MariaDB via Docker Compose,
  on **http://localhost:8080** (admin: `admin` / `Admin12345!`). The `fineries-cms`
  plugin (`cms-wp/wp-plugins/fineries-cms/`) defines everything in code: CPTs
  (Services, Work), ACF field groups, ACF options pages (Home Content, Site Settings),
  and a single REST endpoint the site reads: `GET /wp-json/fineries/v1/home`.
  Requires **ACF Pro** (dropped in `cms-wp/wp-plugins/advanced-custom-fields-pro/`).
- **cms/** — LEGACY Directus 11 + Postgres (still on :8055 but the site no longer uses
  it). Kept for reference; can be removed once WordPress is confirmed in production.
- **site/** — the ORIGINAL static hand-coded site (13 pages). Reference only; the
  design system lives here (`site/css/v3.css`, `site/js/v3.js`). The Astro app uses
  copies in `web/public/css` and `web/public/js`. **If you change design CSS/JS, edit
  the copy in `web/public/…`** (that's what the live app loads).
- **content/** — the client's original hero image + story video (already imported).
- **design-system/** — the brand system (colors, logos, slogans) from the client zip.

## Design language (V3)
Blue hero (`#3C4099`) with the couple knockout; teal (`#08BCB3`) is the lead accent;
light-gray sections; Sora (display) + Manrope (text). GSAP + Lenis for motion. The
current, approved design is V3. (V1/V2 in `site/` history are superseded.)

## Run it
```bash
cd cms-wp && docker compose up -d        # WordPress + MariaDB (Docker Desktop must be running)
# first time only, from project root, once WP responds on :8080:
bash cms-wp/bootstrap.sh                  # installs WP core, activates ACF Pro + fineries-cms, seeds content
cd web && npm install && npm run dev      # site at http://localhost:4321
```
WP REST check: `curl localhost:8080/wp-json/fineries/v1/home`.
Editor experience: WordPress admin → **Home Content** / **Site Settings** (options pages)
and the **Services** / **Work** post types. Changes publish immediately; SSR shows them
on refresh. NOTE: local dev uses MariaDB 10.11 / wordpress:php8.2 images (already on
disk); the compose file was switched from 11/8.3 to avoid a slow pull.
Launch config `.claude/launch.json` runs the Astro app (`fineries-web`, port 4321).

## Credentials & tokens (LOCAL DEV — change before deploy)
- Directus admin + editor logins are in `README.md`. **NOTE:** the user has changed the
  admin email/password in the Directus UI, so `cms/.env` ADMIN_* may be STALE.
- **For admin API scripting, authenticate with the static token
  `fineries_preview_token_dev`** (set on the admin user; survives password changes).
  Example: `curl -H "Authorization: Bearer fineries_preview_token_dev" localhost:8055/...`
- Same token is `DIRECTUS_TOKEN` in `web/.env`, used by the `/preview` route.

## CMS model (WordPress — source of truth = the plugin, defined in code)
- `cms-wp/wp-plugins/fineries-cms/fineries-cms.php` — registers CPTs `service` + `work`,
  ACF field groups + options pages (Home Content, Site Settings), and the REST route.
  Editing the model = editing this plugin (no clicking in the ACF UI needed).
- `cms-wp/wp-plugins/fineries-cms/seed.php` — seeds all content + imports images
  (local hero/video from `seed-assets/`; the rest sideloaded from URLs). Run via
  `wp eval-file` (bootstrap.sh does this).
- `cms-wp/bootstrap.sh` — one-shot install/activate/seed (uses `MSYS_NO_PATHCONV=1` so
  Git Bash doesn't mangle container paths).
- Roles: WordPress-native **Administrator** + **Editor** (Editor can edit content/media,
  not manage users/plugins). Changes publish immediately (options + posts); no separate
  draft/preview workflow like Directus had.
- To deploy on **Hostinger Premium (shared)**: install WordPress, install ACF Pro +
  the `fineries-cms` plugin, activate, run the seed (or add content by hand), set the
  site's `PUBLIC_WP_URL` to the live WP URL, and point the Astro front-end (Vercel) at
  it. WordPress runs fine on shared hosting; the Astro site deploys separately (Vercel).

### Legacy Directus scripts (no longer used)
`cms/bootstrap/*.mjs` built the old Directus model (collections, roles, public read).
Kept for reference only.

## Front-end data flow
- `web/src/lib/wp.js` — ACTIVE. `getHomeBundle()` fetches the WordPress endpoint
  `/wp-json/fineries/v1/home` → `{home, settings, services, work}`. Image fields are
  plain URL strings (used directly in `<img src>`); `home.method_circles` is mapped to
  `home.philosophy_rings` for the template. `PUBLIC_WP_URL` in `web/.env`.
- `web/src/lib/directus.js` — LEGACY (unused).
- `web/src/components/HomePage.astro` — the whole home page; every section reads from CMS.

## ⚠️ Content convention — keep EVERYTHING CMS-editable
All visible text and images on the site must be editable in WordPress. When asked to
change/add any copy or image, wire it through the CMS — do NOT hardcode — unless the
user explicitly says otherwise. The pattern for a new piece of text/image:
1. Add an ACF field in `fineries-cms.php` (Home Content or Site Settings group; use a
   repeater for lists like nav/footer links). Comma-string "words" fields are split to
   arrays in the REST callback (see `hero_words`/`cta_words`).
2. It flows through automatically via `get_fields('option')` in the REST route.
3. Read it in `HomePage.astro` as `home.x || "current text"` (always keep the current
   text as a fallback so the live site never goes blank before the field is populated).
4. Add a default in `seed.php`.
5. Bump the plugin `Version`, then deploy: **`bash cms-wp/deploy-plugin.sh`** pushes the
   plugin to the live WordPress over SSH (tar-over-ssh into
   `…/cms/wp-content/plugins/fineries-cms/`, then `wp plugin activate` + rewrite flush).
   Auth is a local key `~/.ssh/fineries_deploy` (private key never leaves the machine;
   its public key is installed on Hostinger). Host/port/user are in the script. New
   fields start empty (fallbacks show) until filled in WP admin. (The old manual path —
   rebuild `fineries-cms.zip` and upload in wp-admin — still works as a fallback.)
   To set option values on the live CMS without wiping others, run a **targeted**
   `wp eval-file` over SSH (never re-run the full `seed.php` on prod — it overwrites all
   Home options and would clobber the client's edits).
Rotating-word spans (hero + CTA) are driven by any `[data-words]` element via `v3.js`.
- Styles: `web/public/css/v3.css` (base) + `web/public/css/home.css` (V3.1 home sections).

## Home layout V3.1 (current)
Sections: hero (unchanged) → What We Do (5 COLOURED service cards: image + brand-colour
panel; `services.image` + `services.color`) → The Truth (2 images + text) → Our Process
(dark band, 4-step timeline `process_steps`) → Featured Work (4 cards) → The Fineries
Client logo marquee (sliding, from the unlimited `logos` repeater; wordmark fallback
when a logo has no image) → The Fineries
Method (stacked heading + Venn circles from `philosophy_rings` + `method_tagline`) →
Value band ("Good work should do something", gold left + dark right, 6 `bv_items`) →
Final CTA (text + couple image) → footer (4 cols incl `site_settings.address`).
Added by `cms/bootstrap/extend-home-2.mjs`. Dead fields from the old design were
deleted and the Home Page fields reordered to match the site (with section dividers)
by `cms/bootstrap/cleanup-order.mjs` — so the CMS form reads top-to-bottom exactly like
the page: Hero → What We Do → The Truth → Our Process → Featured Work → The Fineries
Method → The Value → Final CTA. (`philosophy_rings` is retained — it powers the Method
Venn circles.)
- `web/src/pages/index.astro` — published home. `web/src/pages/preview.astro` — draft
  preview (needs `?secret=fineries_preview`; reads drafts with the static token).

## Status
- DONE: **home page is fully driven by headless WordPress** (all text, images, hero
  video, rotating words, bg colour, services, work). Astro reads WP via `wp.js`.
- DONE: **LIVE IN PRODUCTION.**
  - Front-end (Astro SSR) on Vercel: **https://fineries-website.vercel.app**
    (GitHub repo `kyrosp1/Fineries-website`, branch `main` → auto-deploys on push).
    Vercel env var `PUBLIC_WP_URL=https://cms.fineries.net`. Root Directory = `web`.
  - CMS: **https://cms.fineries.net** (WordPress + ACF Pro + fineries-cms plugin;
    content migrated from local via All-in-One WP Migration).
  - Custom domain (fineries.net) not pointed yet — user will add in Vercel later.
- Directus is retired from the live path (kept in `cms/` for reference).
- DONE: **What We Do** page — `web/src/pages/what-we-do.astro` → `WhatWeDo.astro`. Hero +
  intro + 5 capabilities (from the `service` CPT, extended with `cap_tagline`,
  `cap_overview`, `cap_skills` [one per line], `cap_explore`) + shared CTA. Page copy in
  the ACF **What We Do Page** options group (`wwd_*`). Nav/footer are now shared
  components: `web/src/components/SiteNav.astro` + `SiteFooter.astro` (used by both
  HomePage and WhatWeDo). Page styles: `web/public/css/wwd.css`.
- NOT DONE: remaining inner pages (Work, About, Insights, Contact) — still old static
  `site/*.html`; not in Astro/WP yet. Those nav links point to `#`. **Next phase.**
- Repo hygiene: large media (videos, `web/public/media/`) are git-ignored; they remain
  in early history — an optional `git filter-repo`/BFG pass could slim the clone.

## Gotchas
- Directus rejects emails with non-real TLDs (e.g. `.local`) at login — use real TLDs.
- After changing content in Directus, **hard-refresh** the browser (Ctrl+Shift+R); SSR
  serves the latest per request, but the browser caches the page/assets.
- The in-app preview pane throttles rAF and often won't repaint mid-page on scroll —
  verify mid/lower sections with `curl … | grep` rather than screenshots; the hero
  (top) screenshots fine.
- The hero video was compressed 77 MB → ~21 MB (1080p, H.264 CRF 23, faststart) with
  ffmpeg; the compressed file is `cms-wp/wp-plugins/fineries-cms/seed-assets/fineries-story.mp4`
  and is the current WP hero video. Small enough to ship free with the site.

## Switching model / continuing
Just `/model <name>` and keep working in this folder — the new session auto-reads this
file. Keep Docker (cms) and `npm run dev` (web) running, or restart with the commands
above. Nothing is stored only in chat; state is on disk + in the running containers.
