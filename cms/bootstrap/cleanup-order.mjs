/* Remove fields that are no longer used on the site, add section dividers,
   and order the Home Page fields to match the on-page section order.
   Authenticates with the static admin token.
   Run from project root: node cms/bootstrap/cleanup-order.mjs */

const CMS = "http://localhost:8055";
const TOKEN = "fineries_preview_token_dev";

async function api(method, p, body) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(CMS + p, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const t = await res.text(); let j; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
  return { ok: res.ok, status: res.status, json: j };
}
const log = (...a) => console.log(...a);
const exists = async (c, f) => (await api("GET", `/fields/${c}/${f}`)).ok;

// 1) fields to delete (removed sections / dead leftovers)
const DELETE_HOME = [
  "philosophy_heading", "philosophy_eyebrow", "philosophy_body", "philosophy_image",
  "digital_eyebrow", "digital_heading", "digital_body", "digital_image",
  "why_eyebrow", "why_heading", "why_body", "why_image",
  "statement_eyebrow", "statement_heading", "statement_body",
  "wwd_image", "work_sub", "cta_items",
];
const DELETE_WORK = ["accent"];

// 2) section dividers to create (alias / presentation-only)
const DIVIDERS = [
  ["divider_publish", "Publishing"],
  ["divider_hero", "Hero"],
  ["divider_wwd", "What We Do"],
  ["divider_truth", "The Truth"],
  ["divider_process", "Our Process"],
  ["divider_work", "Featured Work"],
  ["divider_method", "The Fineries Method"],
  ["divider_value", "The Value"],
  ["divider_cta", "Final CTA"],
];

// 3) final order (dividers + real fields), top → bottom as on the site
const ORDER = [
  "divider_publish", "status",
  "divider_hero", "hero_words", "hero_bg_color", "hero_image", "hero_video",
  "divider_wwd", "wwd_eyebrow", "wwd_heading", "wwd_heading_accent", "wwd_body", "wwd_cta_label",
  "divider_truth", "truth_eyebrow", "truth_heading", "truth_body", "truth_image_1", "truth_image_2",
  "divider_process", "process_eyebrow", "process_heading", "process_body", "process_cta_label", "process_steps",
  "divider_work", "work_eyebrow", "work_heading",
  "divider_method", "method_eyebrow", "philosophy_rings", "method_body", "method_tagline",
  "divider_value", "bv_eyebrow", "bv_heading", "bv_intro", "bv_items",
  "divider_cta", "cta_eyebrow", "cta_heading", "cta_body",
];

async function main() {
  // --- delete unused ---
  log("Deleting unused fields…");
  for (const f of DELETE_HOME) {
    if (!(await exists("home_page", f))) { log("  • gone:", f); continue; }
    const r = await api("DELETE", `/fields/home_page/${f}`);
    log(r.ok ? "  ✓ deleted home_page." + f : "  ✗ FAILED " + f + " " + JSON.stringify(r.json));
  }
  for (const f of DELETE_WORK) {
    if (!(await exists("work", f))) { log("  • gone: work." + f); continue; }
    const r = await api("DELETE", `/fields/work/${f}`);
    log(r.ok ? "  ✓ deleted work." + f : "  ✗ FAILED work." + f + " " + JSON.stringify(r.json));
  }

  // --- create dividers ---
  log("Ensuring section dividers…");
  for (const [field, title] of DIVIDERS) {
    if (await exists("home_page", field)) { log("  • exists:", field); continue; }
    const r = await api("POST", "/fields/home_page", {
      field, type: "alias",
      meta: { interface: "presentation-divider", special: ["alias", "no-data"], options: { title }, width: "full" },
    });
    log(r.ok ? "  ✓ divider:" + field : "  ✗ FAILED " + field + " " + JSON.stringify(r.json));
  }

  // --- order everything ---
  log("Ordering fields…");
  let i = 0;
  for (const f of ORDER) {
    if (!(await exists("home_page", f))) { log("  ! missing (skip):", f); continue; }
    const r = await api("PATCH", `/fields/home_page/${f}`, { meta: { sort: ++i, group: null } });
    if (!r.ok) log("  ✗ sort FAILED " + f + " " + JSON.stringify(r.json));
  }
  log(`  ✓ ordered ${i} fields`);
  log("\n✔ Cleanup + ordering complete.");
}
main().catch((e) => { console.error(e); process.exit(1); });
