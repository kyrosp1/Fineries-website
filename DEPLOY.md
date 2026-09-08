# Deploying Fineries — WordPress on Hostinger + Astro on Vercel

**Architecture:** WordPress (CMS) lives on your Hostinger; the Astro site lives on
Vercel and reads content live from WordPress at request time (SSR). Code lives on GitHub;
every push auto-deploys to Vercel.

```
Editor → WordPress (Hostinger)  ──REST──►  Astro site (Vercel)  ──►  visitors
Developer → GitHub push  ──►  Vercel auto-deploy
```

---

## Part A — WordPress on Hostinger (the CMS)

1. **Subdomain (recommended):** hPanel → Domains → Subdomains → create `cms.yourdomain.com`.
   (Keeps the CMS separate from the public site domain.)
2. **Install WordPress** on that subdomain: hPanel → Auto Installer → WordPress. Save the
   admin URL + credentials.
3. In `wp-admin`: **Settings → Permalinks → "Post name" → Save** (needed for the REST API).
4. **Install two plugins** (Plugins → Add New → Upload):
   - **ACF Pro** — your `advanced-custom-fields-pro` zip → Activate.
   - **Fineries CMS** — the `fineries-cms.zip` in this project's root → Activate.
   (This recreates the exact fields/CPTs — Home Content, Site Settings, Services, Work.)
5. **Get your content in** — pick one:
   - **Migrate (recommended, keeps your images + edits):** install the free
     **All-in-One WP Migration** plugin on *both* your local WP (http://localhost:8080/wp-admin,
     `admin` / `Admin12345!`) and the Hostinger WP. Local → **Export → File**; Hostinger →
     **Import** that file. It rewrites URLs automatically.
   - **Fresh:** enter content by hand in Home Content / Site Settings / Services / Work and
     upload images. Upload the compressed hero video
     (`cms-wp/wp-plugins/fineries-cms/seed-assets/fineries-story.mp4`, ~21 MB) via **Media**
     and set it as the Hero video.
6. **Verify the API:** open `https://cms.yourdomain.com/wp-json/fineries/v1/home` — you
   should see JSON with your content and image URLs on your domain.

---

## Part B — Front-end on Vercel

1. **Push to GitHub:**
   ```bash
   git remote add origin <your-new-github-repo-url>
   git branch -M main
   git push -u origin main
   ```
2. **Vercel → Add New → Project → import the repo.** Then:
   - **Root Directory: `web`**  ← important (the Astro app is in `web/`).
   - Framework: Astro (auto-detected).
   - **Environment Variable:** `PUBLIC_WP_URL = https://cms.yourdomain.com` (no trailing slash).
   - **Deploy.** You get a `…vercel.app` URL to test.

---

## Part C — Domains

- Point `yourdomain.com` (and `www`) at the **Vercel** project (Vercel → Project → Domains).
- `cms.yourdomain.com` stays on **Hostinger** (WordPress).

---

## Ongoing workflow

- **Content:** edit in live WordPress → appears on the site on refresh (SSR).
- **Design/code:** edit locally → `git push` → Vercel redeploys automatically.
- **New fields/model:** edit the `fineries-cms` plugin locally, re-zip, upload the new
  version to Hostinger, re-activate.

## Local dev (unchanged)
```bash
cd cms-wp && docker compose up -d     # local WordPress
cd web && npm run dev                 # local site → http://localhost:4321
```

## Before go-live
- Set a strong WordPress admin password.
- Confirm the hero video is uploaded and selected.
- (Optional) delete the legacy Directus (`cms/`).
