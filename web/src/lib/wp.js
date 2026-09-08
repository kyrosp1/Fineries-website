// WordPress (headless) data layer for the Fineries front-end.
// Reads the single tidy endpoint exposed by the fineries-cms plugin.
const WP = import.meta.env.PUBLIC_WP_URL || "http://localhost:8080";

export const WP_URL = WP;

// In production we hide the CMS domain: any WordPress media URL
// (…/wp-content/uploads/…) is rewritten to our own /media/… path, which Vercel
// proxies back to WordPress (see web/vercel.json). Locally we leave URLs as-is
// so images still load straight from the dev WordPress on :8080.
const PROXY_MEDIA = !WP.includes("localhost");
function proxyUrl(u) {
  if (typeof u !== "string" || !PROXY_MEDIA) return u;
  return u.replace(/^https?:\/\/[^/]+\/wp-content\/uploads\//i, "/media/");
}
function deepProxy(v) {
  if (typeof v === "string") return proxyUrl(v);
  if (Array.isArray(v)) return v.map(deepProxy);
  if (v && typeof v === "object") {
    for (const k in v) v[k] = deepProxy(v[k]);
    return v;
  }
  return v;
}

export async function getHomeBundle() {
  // Reads live from WordPress at request time (SSR) — both in dev and in
  // production. PUBLIC_WP_URL points at localhost:8080 locally and at the live
  // Hostinger WordPress in production (set as a Vercel env var).
  const res = await fetch(`${WP}/wp-json/fineries/v1/home`);
  if (!res.ok) throw new Error(`WordPress ${res.status} on /fineries/v1/home`);
  const d = await res.json();
  const home = d.home || {};
  home.philosophy_rings = home.method_circles || [];
  return deepProxy({
    home,
    settings: d.settings || {},
    services: d.services || [],
    work: d.work || [],
  });
}
