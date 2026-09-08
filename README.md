# Fineries Digital — Website + CMS

A bespoke marketing site (Astro front-end) backed by a self-hosted headless CMS
(Directus) with **Admin** and **Editor** roles and a **draft → preview → publish**
workflow. The design is hand-built; editors change content, images, and video
through the Directus admin panel without touching code.

```
fineries/
├─ web/      # Astro front-end (renders the design from CMS data)
├─ cms/      # Directus + Postgres (Docker) + bootstrap scripts
└─ site/     # Original static build (reference; pre-CMS pages not yet migrated)
```

## Stack

- **Front-end:** Astro (SSR via @astrojs/node) — `web/`
- **CMS/API:** Directus 11 — `cms/` (Docker)
- **Database:** Postgres 16 (Docker volume)
- **Media:** stored in Directus (`cms/uploads`; move to S3 for production)

## Run it locally

**1. Start the CMS (Directus + Postgres):**
```bash
cd cms
docker compose up -d
```
Directus admin: http://localhost:8055

**2. (First time only) create schema, roles, seed content:**
```bash
# from the project root
node cms/bootstrap/bootstrap.mjs         # collections, fields, media, seed, Editor role
node cms/bootstrap/public-read.mjs       # public read access for the website
node cms/bootstrap/ensure-editor-user.mjs # creates the editor login
```

**3. Start the website:**
```bash
cd web
npm install       # first time
npm run dev       # http://localhost:4321
```

## Accounts (LOCAL DEV — change before deploying)

| Role | Login | Password | Can do |
|---|---|---|---|
| Admin | `admin@fineries.net` | `Admin12345!` | Everything: users, settings, delete, publish |
| Editor | `editor@fineries.net` | `Editor12345!` | Edit content & media, draft/preview/publish; no user mgmt, no delete |

## Editing workflow (for the editor)

1. Log in at **http://localhost:8055**.
2. Open **Home Page** (or Work / Services / Site Settings).
3. Edit text fields, pick/replace images and video from the media library, edit the
   rotating hero words, change the hero background colour, etc.
4. Use **Live Preview** to see the real site update beside the fields; content
   versioning lets you keep a draft and **promote** it to publish. Only `published`
   content appears on the live site.

## What's CMS-driven today

The **entire home page** is editable:

- **Site Settings** (singleton): footer tagline, contact email, location, social links
- **Home Page** (singleton): every section — hero (rotating words, image, video,
  background colour), What We Do (eyebrow/heading/body + portrait image), philosophy
  (heading/body, the three rings, visual image), Business Value (eyebrow/heading/intro
  + the icon items), the "different kind of agency" statement (rich text), Selected Work
  header, Digital (heading/body/image), Why Fineries (heading/body/image), and the final
  CTA (eyebrow/heading/prompt lines)
- **Services** (collection): the numbered What-We-Do list
- **Work** (collection): the selected-work cards (image or image URL, accent colour)

Next phase: migrate the other pages (What We Do, Work, About, Insights, Contact) into
Astro + the CMS. Their nav links currently point to `#`.

The extra home-page fields are added by `cms/bootstrap/extend-home.mjs` (idempotent;
authenticates with the static admin token so it works even after you change the admin
password).

## Content model

See `cms/bootstrap/bootstrap.mjs` — it is the source of truth for collections and
fields and is safe to re-run (idempotent).

## Production checklist (later)

- Regenerate all secrets in `cms/.env`; use strong admin/editor passwords.
- Postgres with managed backups; S3-compatible media storage.
- Compress/host the hero video (currently 77 MB) on a CDN or Vimeo/YouTube.
- Build the front-end (`npm run build`) and run behind a reverse proxy; lock CORS.
- Restrict `directus_files` public read or serve assets via CDN.
- Do **not** commit `.env` files or `node_modules`.
```
