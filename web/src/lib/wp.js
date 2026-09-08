// WordPress (headless) data layer for the Fineries front-end.
// Reads the single tidy endpoint exposed by the fineries-cms plugin.
const WP = import.meta.env.PUBLIC_WP_URL || "http://localhost:8080";

export const WP_URL = WP;

export async function getHomeBundle() {
  // Reads live from WordPress at request time (SSR) — both in dev and in
  // production. PUBLIC_WP_URL points at localhost:8080 locally and at the live
  // Hostinger WordPress in production (set as a Vercel env var).
  const res = await fetch(`${WP}/wp-json/fineries/v1/home`);
  if (!res.ok) throw new Error(`WordPress ${res.status} on /fineries/v1/home`);
  const d = await res.json();
  const home = d.home || {};
  home.philosophy_rings = home.method_circles || [];
  return {
    home,
    settings: d.settings || {},
    services: d.services || [],
    work: d.work || [],
  };
}
