// Minimal Directus data layer for the Fineries front-end.
const URL = import.meta.env.PUBLIC_DIRECTUS_URL || "http://localhost:8055";

export const DIRECTUS_URL = URL;

/** Build an asset (file) URL. Accepts a file id string OR a file object
 *  ({id, modified_on}); when modified_on is present it is appended as a
 *  cache-buster so replaced images always refresh. `params` e.g. "width=1200". */
export function assetUrl(file, params = "") {
  const id = typeof file === "string" ? file : file && file.id;
  if (!id) return "";
  let q = params || "";
  const mod = file && typeof file === "object" ? file.modified_on : null;
  if (mod) { const t = Date.parse(mod) || 0; q += (q ? "&" : "") + "c=" + t; }
  return `${URL}/assets/${id}${q ? "?" + q : ""}`;
}

async function get(path, token) {
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const res = await fetch(URL + path, { headers });
  if (!res.ok) throw new Error(`Directus ${res.status} on ${path}`);
  const json = await res.json();
  return json.data;
}

// Expand file fields to { id, modified_on } so assetUrl can cache-bust.
const HOME_FILES = ["hero_image", "hero_video", "truth_image_1"]
  .flatMap((f) => [`${f}.id`, `${f}.modified_on`]).join(",");

export async function getHome({ token, version } = {}) {
  let path = `/items/home_page?fields=*,${HOME_FILES}`;
  if (version) path += "&version=" + encodeURIComponent(version);
  return get(path, token);
}
export const getSettings = (token) => get("/items/site_settings?fields=*", token);
export const getServices = (token) => get("/items/services?fields=*,image.id,image.modified_on&sort=sort", token);
export const getWork = (token) => get("/items/work?fields=*,image.id,image.modified_on&sort=sort", token);

/** Fetch everything the home page needs, in parallel. */
export async function getHomeBundle({ token, version } = {}) {
  const [home, settings, services, work] = await Promise.all([
    getHome({ token, version }),
    getSettings(token),
    getServices(token),
    getWork(token),
  ]);
  return { home, settings, services, work };
}
