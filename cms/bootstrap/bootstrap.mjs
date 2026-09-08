/* ============================================================
   Fineries CMS bootstrap — idempotent.
   Creates collections (with versioning + live preview), the
   Editor role/policy/permissions, uploads hero media, and seeds
   the home page content. Run from the PROJECT ROOT:
     node cms/bootstrap/bootstrap.mjs
   ============================================================ */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CMS = "http://localhost:8055";
const WEB = "http://localhost:4321";

// --- read admin creds from cms/.env ---
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, "cms/.env"), "utf8")
    .split("\n").filter(l => l.includes("=") && !l.trim().startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

let TOKEN = "";
async function api(method, p, body, { form } = {}) {
  const headers = {};
  if (TOKEN) headers.Authorization = `Bearer ${TOKEN}`;
  let payload = body;
  if (body && !form) { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body); }
  const res = await fetch(CMS + p, { method, headers, body: payload });
  const text = await res.text();
  let json; try { json = text ? JSON.parse(text) : null; } catch { json = text; }
  return { ok: res.ok, status: res.status, json };
}
const log = (...a) => console.log(...a);

async function login() {
  const r = await api("POST", "/auth/login", { email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD });
  if (!r.ok) throw new Error("login failed: " + JSON.stringify(r.json));
  TOKEN = r.json.data.access_token;
  log("✓ logged in as", env.ADMIN_EMAIL);
}

async function collectionExists(name) {
  const r = await api("GET", "/collections/" + name);
  return r.ok;
}
async function ensureCollection(name, meta, note) {
  if (await collectionExists(name)) { log("• collection exists:", name); return; }
  const body = {
    collection: name,
    meta: { icon: meta.icon || "article", note: note || null, singleton: !!meta.singleton,
            versioning: true, collection: name,
            preview_url: meta.preview_url || null },
    schema: { name },
    fields: [{
      field: "id", type: meta.singleton ? "integer" : "integer",
      meta: { hidden: true, interface: "input", readonly: true },
      schema: { is_primary_key: true, has_auto_increment: true }
    }]
  };
  const r = await api("POST", "/collections", body);
  log(r.ok ? "✓ created collection:" : "✗ collection FAILED:", name, r.ok ? "" : JSON.stringify(r.json));
}

async function fieldExists(coll, field) {
  const r = await api("GET", `/fields/${coll}/${field}`);
  return r.ok;
}
async function ensureField(coll, field, type, meta = {}, schema = {}) {
  if (await fieldExists(coll, field)) { log("  • field exists:", coll + "." + field); return; }
  const r = await api("POST", "/fields/" + coll, { field, type, meta, schema });
  log(r.ok ? "  ✓ field:" : "  ✗ field FAILED:", coll + "." + field, r.ok ? "" : JSON.stringify(r.json));
}
async function ensureFileField(coll, field, note, imageOnly = true) {
  if (await fieldExists(coll, field)) { log("  • field exists:", coll + "." + field); return; }
  const r = await api("POST", "/fields/" + coll, {
    field, type: "uuid",
    meta: { interface: imageOnly ? "file-image" : "file", special: ["file"], note, display: "file" },
    schema: {}
  });
  if (!r.ok) { log("  ✗ file field FAILED:", coll + "." + field, JSON.stringify(r.json)); return; }
  const rel = await api("POST", "/relations", {
    collection: coll, field, related_collection: "directus_files"
  });
  log(rel.ok ? "  ✓ file field:" : "  ✗ relation FAILED:", coll + "." + field, rel.ok ? "" : JSON.stringify(rel.json));
}

async function uploadFile(relPath, title) {
  // idempotent by title
  const found = await api("GET", `/files?filter[title][_eq]=${encodeURIComponent(title)}&limit=1`);
  if (found.ok && found.json.data && found.json.data.length) {
    log("• file exists:", title); return found.json.data[0].id;
  }
  const abs = path.join(ROOT, relPath);
  const buf = fs.readFileSync(abs);
  const ext = path.extname(abs).toLowerCase();
  const mime = ext === ".mp4" ? "video/mp4" : ext === ".png" ? "image/png" : "application/octet-stream";
  const fd = new FormData();
  fd.append("title", title);
  fd.append("file", new Blob([buf], { type: mime }), path.basename(abs));
  const r = await api("POST", "/files", fd, { form: true });
  if (!r.ok) { log("✗ upload FAILED:", title, JSON.stringify(r.json)); return null; }
  log("✓ uploaded:", title);
  return r.json.data.id;
}

async function seedSingleton(coll, data) {
  const r = await api("PATCH", "/items/" + coll, data);
  log(r.ok ? "✓ seeded singleton:" : "✗ seed FAILED:", coll, r.ok ? "" : JSON.stringify(r.json));
}
async function seedCollectionIfEmpty(coll, items) {
  const cur = await api("GET", `/items/${coll}?limit=1`);
  if (cur.ok && cur.json.data && cur.json.data.length) { log("• already has items:", coll); return; }
  for (const it of items) {
    const r = await api("POST", "/items/" + coll, it);
    if (!r.ok) log("  ✗ item FAILED:", coll, JSON.stringify(r.json));
  }
  log("✓ seeded items:", coll, "(" + items.length + ")");
}

async function ensureEditorRole() {
  // policy
  let pol = await api("GET", `/policies?filter[name][_eq]=Editor&limit=1`);
  let policyId = pol.ok && pol.json.data && pol.json.data[0] ? pol.json.data[0].id : null;
  if (!policyId) {
    const r = await api("POST", "/policies", {
      name: "Editor", icon: "edit_note", description: "Can edit content and media; cannot manage users or delete.",
      app_access: true, admin_access: false, enforce_tfa: false
    });
    if (!r.ok) { log("✗ policy FAILED:", JSON.stringify(r.json)); return; }
    policyId = r.json.data.id; log("✓ created policy: Editor");
  } else log("• policy exists: Editor");

  const perms = [
    ["home_page", ["read", "update"]],
    ["site_settings", ["read", "update"]],
    ["services", ["create", "read", "update"]],
    ["work", ["create", "read", "update"]],
    ["directus_files", ["create", "read", "update"]],
    ["directus_folders", ["read"]],
  ];
  for (const [coll, actions] of perms) {
    for (const action of actions) {
      const exists = await api("GET", `/permissions?filter[policy][_eq]=${policyId}&filter[collection][_eq]=${coll}&filter[action][_eq]=${action}&limit=1`);
      if (exists.ok && exists.json.data && exists.json.data.length) continue;
      const r = await api("POST", "/permissions", { policy: policyId, collection: coll, action, fields: ["*"], permissions: {}, validation: {} });
      if (!r.ok) log("  ✗ perm FAILED:", coll, action, JSON.stringify(r.json));
    }
  }
  log("✓ permissions set for Editor");

  // role
  let role = await api("GET", `/roles?filter[name][_eq]=Editor&limit=1`);
  let roleId = role.ok && role.json.data && role.json.data[0] ? role.json.data[0].id : null;
  if (!roleId) {
    const r = await api("POST", "/roles", { name: "Editor", icon: "edit_note", description: "Content editor" });
    if (!r.ok) { log("✗ role FAILED:", JSON.stringify(r.json)); return; }
    roleId = r.json.data.id; log("✓ created role: Editor");
  } else log("• role exists: Editor");

  // link role <-> policy via access junction
  const acc = await api("GET", `/access?filter[role][_eq]=${roleId}&filter[policy][_eq]=${policyId}&limit=1`);
  if (!(acc.ok && acc.json.data && acc.json.data.length)) {
    const r = await api("POST", "/access", { role: roleId, policy: policyId });
    log(r.ok ? "✓ linked Editor role → policy" : "✗ access FAILED: " + JSON.stringify(r.json));
  } else log("• role already linked to policy");
}

async function main() {
  await login();

  const homePreview = `${WEB}/preview?secret=fineries_preview&collection=home_page`;

  // ---- collections ----
  await ensureCollection("site_settings", { singleton: true, icon: "settings" }, "Global site settings, footer, contact");
  await ensureCollection("home_page", { singleton: true, icon: "home", preview_url: homePreview }, "The home page content");
  await ensureCollection("services", { icon: "grid_view" }, "What We Do — capability list");
  await ensureCollection("work", { icon: "work" }, "Selected work / case study cards");

  // ---- site_settings fields ----
  await ensureField("site_settings", "footer_tagline", "string", { interface: "input", note: "Footer tagline" });
  await ensureField("site_settings", "contact_email", "string", { interface: "input" });
  await ensureField("site_settings", "location", "string", { interface: "input" });
  await ensureField("site_settings", "social_linkedin", "string", { interface: "input" });
  await ensureField("site_settings", "social_instagram", "string", { interface: "input" });
  await ensureField("site_settings", "social_x", "string", { interface: "input" });

  // ---- home_page fields ----
  await ensureField("home_page", "status", "string",
    { interface: "select-dropdown", display: "labels",
      options: { choices: [{ text: "Published", value: "published" }, { text: "Draft", value: "draft" }] } },
    { default_value: "draft" });
  await ensureField("home_page", "hero_words", "json", { interface: "tags", note: "Rotating hero words, in order" });
  await ensureField("home_page", "hero_bg_color", "string", { interface: "select-color", note: "Hero background" }, { default_value: "#3C4099" });
  await ensureFileField("home_page", "hero_image", "Hero couple image (transparent PNG)", true);
  await ensureFileField("home_page", "hero_video", "‘Watch our story’ video", false);
  await ensureField("home_page", "wwd_heading", "string", { interface: "input" });
  await ensureField("home_page", "wwd_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "philosophy_heading", "string", { interface: "input" });
  await ensureField("home_page", "philosophy_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "digital_heading", "string", { interface: "input" });
  await ensureField("home_page", "digital_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "why_heading", "string", { interface: "input" });
  await ensureField("home_page", "why_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "cta_heading", "string", { interface: "input" });
  await ensureField("home_page", "cta_items", "json", { interface: "list", note: "CTA prompt lines" });

  // ---- services fields ----
  await ensureField("services", "sort", "integer", { interface: "input", hidden: true });
  await ensureField("services", "num", "string", { interface: "input", note: "e.g. 01" });
  await ensureField("services", "title", "string", { interface: "input" });
  await ensureField("services", "description", "text", { interface: "input-multiline" });
  await ensureField("services", "link", "string", { interface: "input", note: "target page/anchor" });

  // ---- work fields ----
  await ensureField("work", "sort", "integer", { interface: "input", hidden: true });
  await ensureField("work", "client", "string", { interface: "input" });
  await ensureField("work", "category", "string", { interface: "input" });
  await ensureField("work", "description", "text", { interface: "input-multiline" });
  await ensureField("work", "accent", "string",
    { interface: "select-dropdown", options: { choices: [{ text: "Teal", value: "teal" }, { text: "Blue", value: "blue" }, { text: "None", value: "none" }] } },
    { default_value: "none" });
  await ensureFileField("work", "image", "Card image", true);
  await ensureField("work", "image_url", "string", { interface: "input", note: "Fallback image URL if no file" });

  // ---- media ----
  const heroImg = await uploadFile("site/assets/hero-couple.png", "Hero couple");
  const heroVid = await uploadFile("site/assets/fineries-story.mp4", "Fineries story video");

  // ---- seed ----
  await seedSingleton("site_settings", {
    footer_tagline: "We build brands, products, content people love.",
    contact_email: "info@fineries.net",
    location: "Lagos, Nigeria",
    social_linkedin: "#", social_instagram: "#", social_x: "#"
  });

  await seedSingleton("home_page", {
    status: "published",
    hero_words: ["brands", "products", "content"],
    hero_bg_color: "#3C4099",
    hero_image: heroImg || null,
    hero_video: heroVid || null,
    wwd_heading: "Everything your brand needs. Under one roof.",
    wwd_body: "The right work rarely fits neatly into one discipline. A brand may need a clearer position. A business may need more customers. A team may need a better way to work. A new idea may need to become a product. We bring the thinking, creativity and technology together to make those things happen.",
    philosophy_heading: "One philosophy. Three disciplines.",
    philosophy_body: "Strategy gives us direction. Creativity gives us expression. Technology gives us scale. The best work happens when all three work together, not in separate rooms.",
    digital_heading: "Your digital experience is part of your business.",
    digital_body: "Customers don't separate your website from your brand. Your app from your service. Or your digital experience from the business itself. We design and build digital experiences that help organisations attract customers, serve them better, operate smarter and create new opportunities.",
    why_heading: "Big enough to think broadly. Close enough to care about the details.",
    why_body: "We work across strategy, brand, marketing, content and technology without handing the work from one disconnected team to another. One team. One understanding of the problem. One standard for the work.",
    cta_heading: "Have something worth building?",
    cta_items: ["A brand to rethink.", "A business problem to solve.", "A product to create.", "An opportunity to explore."]
  });

  await seedCollectionIfEmpty("services", [
    { sort: 1, num: "01", title: "Brand & Strategy", description: "Find the right position. Build a brand with something to say.", link: "/services#brand-strategy" },
    { sort: 2, num: "02", title: "Marketing & Growth", description: "Reach the right people. Turn attention into action.", link: "/services#digital-marketing" },
    { sort: 3, num: "03", title: "Content & Production", description: "Create work worth noticing, remembering and sharing.", link: "/services#content-production" },
    { sort: 4, num: "04", title: "Digital Products & Technology", description: "Build digital experiences, products and systems that make the business better.", link: "/technology" },
    { sort: 5, num: "05", title: "Executive & Personal Branding", description: "Help leaders become known for what they know and what they stand for.", link: "/services#executive-branding" },
  ]);

  await seedCollectionIfEmpty("work", [
    { sort: 1, client: "Meristem", category: "Brand & digital", description: "Brand & digital for a leading investment firm.", accent: "teal", image_url: "https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=700&q=75" },
    { sort: 2, client: "CrusaderSterling", category: "Communications", description: "Communications for a financial services organisation.", accent: "blue", image_url: "https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=700&q=75" },
    { sort: 3, client: "Farmfresh / reFresh", category: "Brand & marketing", description: "Brand and marketing for iconic yoghurt brands.", accent: "none", image_url: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=700&q=75" },
    { sort: 4, client: "IBOM Air", category: "Creative & comms", description: "Creative and communications for a Nigerian airline brand.", accent: "none", image_url: "https://images.unsplash.com/photo-1529074963764-98f45c47344b?auto=format&fit=crop&w=700&q=75" },
  ]);

  await ensureEditorRole();

  log("\n✔ Bootstrap complete.");
  log("  Admin panel: " + CMS + "  (" + env.ADMIN_EMAIL + " / " + env.ADMIN_PASSWORD + ")");
}

main().catch(e => { console.error(e); process.exit(1); });
