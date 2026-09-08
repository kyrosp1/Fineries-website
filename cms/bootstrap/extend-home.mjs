/* Phase 2: make the rest of the home page editable.
   Adds fields (Business Value, statement, philosophy rings, section
   eyebrows/headings, section images), imports current images into the
   media library, and seeds values. Authenticates with the static admin
   token so it works regardless of admin email/password changes.
   Run from project root: node cms/bootstrap/extend-home.mjs */

const CMS = "http://localhost:8055";
const TOKEN = "fineries_preview_token_dev";

async function api(method, p, body, { form } = {}) {
  const headers = { Authorization: `Bearer ${TOKEN}` };
  let payload = body;
  if (body && !form) { headers["Content-Type"] = "application/json"; payload = JSON.stringify(body); }
  const res = await fetch(CMS + p, { method, headers, body: payload });
  const t = await res.text(); let j; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
  return { ok: res.ok, status: res.status, json: j };
}
const log = (...a) => console.log(...a);

async function fieldExists(c, f) { return (await api("GET", `/fields/${c}/${f}`)).ok; }
async function ensureField(coll, field, type, meta = {}, schema = {}) {
  if (await fieldExists(coll, field)) { log("  • exists:", coll + "." + field); return; }
  const r = await api("POST", "/fields/" + coll, { field, type, meta, schema });
  log(r.ok ? "  ✓ field:" : "  ✗ FAILED:", coll + "." + field, r.ok ? "" : JSON.stringify(r.json));
}
async function ensureFileField(coll, field, note) {
  if (await fieldExists(coll, field)) { log("  • exists:", coll + "." + field); return; }
  const r = await api("POST", "/fields/" + coll, { field, type: "uuid", meta: { interface: "file-image", special: ["file"], note, display: "file" }, schema: {} });
  if (!r.ok) { log("  ✗ file field FAILED:", field, JSON.stringify(r.json)); return; }
  const rel = await api("POST", "/relations", { collection: coll, field, related_collection: "directus_files" });
  log(rel.ok ? "  ✓ file field:" : "  ✗ relation FAILED:", coll + "." + field, rel.ok ? "" : JSON.stringify(rel.json));
}
async function importImage(url, title) {
  const found = await api("GET", `/files?filter[title][_eq]=${encodeURIComponent(title)}&limit=1`);
  if (found.ok && found.json.data && found.json.data.length) { log("  • image exists:", title); return found.json.data[0].id; }
  const r = await api("POST", "/files/import", { url, data: { title } });
  if (!r.ok) { log("  ✗ import FAILED:", title, JSON.stringify(r.json)); return null; }
  log("  ✓ imported:", title);
  return r.json.data.id;
}

async function main() {
  // sanity: token must have admin access to create fields
  const me = await api("GET", "/fields/home_page/status");
  if (!me.ok) { log("✗ token cannot read schema — is Directus up and the token valid?"); process.exit(1); }

  log("Adding fields…");
  // section eyebrows / headings
  await ensureField("home_page", "wwd_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "philosophy_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "work_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "work_heading", "string", { interface: "input" });
  await ensureField("home_page", "work_sub", "text", { interface: "input-multiline" });
  await ensureField("home_page", "digital_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "why_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "cta_eyebrow", "string", { interface: "input" });

  // business value
  await ensureField("home_page", "bv_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "bv_heading", "string", { interface: "input" });
  await ensureField("home_page", "bv_intro", "text", { interface: "input-multiline" });
  await ensureField("home_page", "bv_items", "json", { interface: "list", note: "Each: title, description, icon (Lucide name)",
    options: { fields: [
      { field: "title", type: "string", meta: { interface: "input", width: "half" } },
      { field: "icon", type: "string", meta: { interface: "input", width: "half", note: "Lucide icon name" } },
      { field: "description", type: "text", meta: { interface: "input-multiline" } },
    ] } });

  // statement
  await ensureField("home_page", "statement_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "statement_heading", "text", { interface: "input-multiline" });
  await ensureField("home_page", "statement_body", "text", { interface: "input-rich-text-html", note: "Short lines; bold key words" });

  // philosophy rings + image
  await ensureField("home_page", "philosophy_rings", "json", { interface: "list", note: "The 3 discipline rings",
    options: { fields: [
      { field: "title", type: "string", meta: { interface: "input", width: "half" } },
      { field: "description", type: "text", meta: { interface: "input-multiline" } },
    ] } });

  // section images
  await ensureFileField("home_page", "wwd_image", "What We Do portrait");
  await ensureFileField("home_page", "philosophy_image", "Philosophy visual");
  await ensureFileField("home_page", "digital_image", "Digital section image");
  await ensureFileField("home_page", "why_image", "Why Fineries image");

  log("Importing images…");
  const wwdImg = await importImage("https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=800&q=75", "WWD portrait");
  const philoImg = await importImage("https://images.unsplash.com/photo-1487958449943-2429e8be8625?auto=format&fit=crop&w=1400&q=75", "Philosophy visual");
  const digitalImg = await importImage("https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=1000&q=75", "Digital visual");
  const whyImg = await importImage("https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?auto=format&fit=crop&w=800&q=75", "Why Fineries visual");

  log("Seeding values…");
  const seed = await api("PATCH", "/items/home_page", {
    wwd_eyebrow: "What We Do",
    philosophy_eyebrow: "Our Philosophy",
    work_eyebrow: "Selected Work",
    work_heading: "Brands. Products. Experiences.",
    work_sub: "A few of the things we've helped organisations build, launch and grow.",
    digital_eyebrow: "Digital",
    why_eyebrow: "Why Fineries",
    cta_eyebrow: "Let's Build",

    bv_eyebrow: "The Business Value",
    bv_heading: "Real solutions. Tangible impact.",
    bv_intro: "We help organisations build stronger brands, reach more people, create better experiences and work more efficiently.",
    bv_items: [
      { title: "Grow", icon: "trending-up", description: "Reach new markets, expand your audience and increase revenue." },
      { title: "Convert", icon: "user-round-check", description: "Turn interest into action and attention into loyal customers." },
      { title: "Serve Better", icon: "heart-handshake", description: "Make it easier for your customers to find, buy and get the most from you." },
      { title: "Work Smarter", icon: "settings-2", description: "Replace manual work with systems that save time and reduce friction." },
      { title: "Build Something New", icon: "sparkles", description: "Explore new models, new products and new opportunities." },
    ],

    statement_eyebrow: "A Different Kind of Agency",
    statement_heading: "We don't believe strategy, creativity and technology should live in separate rooms.",
    statement_body: "<p>A sharper strategy makes <strong>better creative</strong> possible.</p><p>Better creative makes <strong>technology more useful</strong>.</p><p>Better technology makes <strong>ideas more powerful</strong>.</p><p>That's how we work.</p>",

    philosophy_rings: [
      { title: "Strategy", description: "Find the opportunity. Make the plan." },
      { title: "Creativity", description: "Turn ideas into impact." },
      { title: "Technology", description: "Build what matters." },
    ],

    wwd_image: wwdImg || null,
    philosophy_image: philoImg || null,
    digital_image: digitalImg || null,
    why_image: whyImg || null,
  });
  log(seed.ok ? "✓ seeded new home fields" : "✗ seed FAILED: " + JSON.stringify(seed.json));
  log("\n✔ Home page fully modeled.");
}
main().catch(e => { console.error(e); process.exit(1); });
