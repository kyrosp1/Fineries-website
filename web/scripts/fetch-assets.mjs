/* Build-time: pull content from the local WordPress, download every media file
   into web/public/media/, rewrite URLs to /media/<file>, and write a static
   snapshot to web/src/data/home.json (consumed by wp.js during `astro build`).
   Run automatically by `npm run build`. Requires local WP up on :8080. */
import fs from "node:fs";
import path from "node:path";

const WP = process.env.PUBLIC_WP_URL || "http://localhost:8080";
const ROOT = path.resolve(process.cwd());          // = web/
const MEDIA_DIR = path.join(ROOT, "public", "media");
const DATA_DIR = path.join(ROOT, "src", "data");
fs.mkdirSync(MEDIA_DIR, { recursive: true });
fs.mkdirSync(DATA_DIR, { recursive: true });

async function grab(url) {
  if (!url || typeof url !== "string" || !url.startsWith("http")) return url;
  const base = decodeURIComponent(url.split("?")[0].split("/").pop());
  const dest = path.join(MEDIA_DIR, base);
  if (!fs.existsSync(dest)) {
    const r = await fetch(url);
    if (!r.ok) { console.warn("  ! failed", url, r.status); return url; }
    fs.writeFileSync(dest, Buffer.from(await r.arrayBuffer()));
    console.log("  ↓", base);
  }
  return "/media/" + base;
}

console.log("Fetching content from", WP);
const res = await fetch(`${WP}/wp-json/fineries/v1/home`);
if (!res.ok) throw new Error(`WordPress ${res.status} — is it running on ${WP}?`);
const d = await res.json();

console.log("Downloading media…");
d.home.hero_image = await grab(d.home.hero_image);
d.home.hero_video = await grab(d.home.hero_video);
d.home.truth_image_1 = await grab(d.home.truth_image_1);
for (const s of d.services || []) s.image = await grab(s.image);
for (const w of d.work || []) w.image = await grab(w.image);
d.home.philosophy_rings = d.home.method_circles || [];

fs.writeFileSync(path.join(DATA_DIR, "home.json"), JSON.stringify(d, null, 2));
console.log("✔ snapshot written to src/data/home.json");
