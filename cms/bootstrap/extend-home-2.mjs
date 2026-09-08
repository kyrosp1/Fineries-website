/* Phase 3: adopt the richer home layout. Adds fields for the new sections
   (colored service cards, Truth band, Process timeline, Method circles,
   two-tone value band, CTA body, footer address), imports images, seeds
   values. Authenticates with the static admin token.
   Run from project root: node cms/bootstrap/extend-home-2.mjs */

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
  if (!r.ok) { log("  ✗ file FAILED:", field, JSON.stringify(r.json)); return; }
  const rel = await api("POST", "/relations", { collection: coll, field, related_collection: "directus_files" });
  log(rel.ok ? "  ✓ file field:" : "  ✗ relation FAILED:", coll + "." + field, rel.ok ? "" : JSON.stringify(rel.json));
}
async function importImage(url, title) {
  const found = await api("GET", `/files?filter[title][_eq]=${encodeURIComponent(title)}&limit=1`);
  if (found.ok && found.json.data && found.json.data.length) { log("  • image exists:", title); return found.json.data[0].id; }
  const r = await api("POST", "/files/import", { url, data: { title } });
  if (!r.ok) { log("  ✗ import FAILED:", title, JSON.stringify(r.json)); return null; }
  log("  ✓ imported:", title); return r.json.data.id;
}

async function main() {
  log("Fields → home_page");
  await ensureField("home_page", "wwd_heading_accent", "string", { interface: "input", note: "Coloured part of the What-We-Do heading" });
  await ensureField("home_page", "wwd_cta_label", "string", { interface: "input" });

  await ensureField("home_page", "truth_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "truth_heading", "string", { interface: "input" });
  await ensureField("home_page", "truth_body", "text", { interface: "input-rich-text-html" });
  await ensureFileField("home_page", "truth_image_1", "Truth section — left image");
  await ensureFileField("home_page", "truth_image_2", "Truth section — right image");

  await ensureField("home_page", "process_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "process_heading", "string", { interface: "input" });
  await ensureField("home_page", "process_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "process_cta_label", "string", { interface: "input" });
  await ensureField("home_page", "process_steps", "json", { interface: "list", note: "4 steps: num, title, description, icon (Lucide)",
    options: { fields: [
      { field: "num", type: "string", meta: { interface: "input", width: "half" } },
      { field: "icon", type: "string", meta: { interface: "input", width: "half", note: "Lucide icon name" } },
      { field: "title", type: "string", meta: { interface: "input" } },
      { field: "description", type: "text", meta: { interface: "input-multiline" } },
    ] } });

  await ensureField("home_page", "method_eyebrow", "string", { interface: "input" });
  await ensureField("home_page", "method_body", "text", { interface: "input-multiline" });
  await ensureField("home_page", "method_tagline", "string", { interface: "input" });

  await ensureField("home_page", "cta_body", "text", { interface: "input-multiline" });

  log("Fields → services (image + colour)");
  await ensureFileField("services", "image", "Card image");
  await ensureField("services", "color", "string",
    { interface: "select-dropdown", options: { choices: [
      { text: "Blue", value: "blue" }, { text: "Gold", value: "gold" },
      { text: "Magenta", value: "magenta" }, { text: "Teal", value: "teal" }] } },
    { default_value: "blue" });

  log("Fields → site_settings (address)");
  await ensureField("site_settings", "address", "text", { interface: "input-multiline" });

  log("Importing images…");
  const t1 = await importImage("https://images.unsplash.com/photo-1522529599102-193c0d76b5b6?auto=format&fit=crop&w=900&q=75", "Truth left");
  const t2 = await importImage("https://images.unsplash.com/photo-1552168324-d612d77725e3?auto=format&fit=crop&w=900&q=75", "Truth right");
  const svcImgs = {
    "01": await importImage("https://images.unsplash.com/photo-1531384441138-2736e62e0919?auto=format&fit=crop&w=700&q=75", "Svc Brand"),
    "02": await importImage("https://images.unsplash.com/photo-1573497019236-17f8177b81e8?auto=format&fit=crop&w=700&q=75", "Svc Marketing"),
    "03": await importImage("https://images.unsplash.com/photo-1594751543129-6701ad444259?auto=format&fit=crop&w=700&q=75", "Svc Content"),
    "04": await importImage("https://images.unsplash.com/photo-1573167243872-43c6433b9d40?auto=format&fit=crop&w=700&q=75", "Svc Technology"),
    "05": await importImage("https://images.unsplash.com/photo-1607990281513-2c110a25bd8c?auto=format&fit=crop&w=700&q=75", "Svc Executive"),
  };

  log("Seeding home_page…");
  const seed = await api("PATCH", "/items/home_page", {
    wwd_heading: "From strategy to",
    wwd_heading_accent: "real-world impact.",
    wwd_body: "We bring strategy, creativity and technology together to help ambitious organisations build brands, reach the right people, create meaningful experiences and grow.",
    wwd_cta_label: "Explore our capabilities",

    truth_eyebrow: "The Truth",
    truth_heading: "Every brand wants to be loved.",
    truth_body: "<p>People choose brands they understand. They return to experiences they enjoy. They share stories that move them. And they use products that make their lives better.</p><p>But sometimes, something gets in the way.</p>",

    process_eyebrow: "Our Process",
    process_heading: "A clear process for real results.",
    process_body: "We combine strategic thinking, creative exploration and technical capability at every step — to solve the right problem and create work that delivers.",
    process_cta_label: "See how we work",
    process_steps: [
      { num: "01", icon: "search", title: "Understand", description: "Research. Listen. Find the real problem." },
      { num: "02", icon: "lightbulb", title: "Create", description: "Ideas. Concepts. Experiences." },
      { num: "03", icon: "target", title: "Execute", description: "Bring it to life. Ruthlessly." },
      { num: "04", icon: "bar-chart-3", title: "Transform", description: "New perspectives. Real business impact." },
    ],

    method_eyebrow: "The Fineries Method",
    method_body: "Three disciplines. One integrated approach. So good ideas don't get lost between thinking and execution.",
    method_tagline: "One team. Fewer gaps. Greater impact.",
    philosophy_rings: [
      { title: "Strategy", description: "Find the problem worth solving." },
      { title: "Creativity", description: "Find the idea worth pursuing." },
      { title: "Technology", description: "Build what makes it possible." },
    ],

    bv_eyebrow: "The Value",
    bv_heading: "Good work should do something.",
    bv_intro: "It should change perception, create demand, win customers, improve experiences, make work easier and create new opportunities.",
    bv_items: [
      { title: "Stronger Brands", icon: "star", description: "Sharper positioning and identity that lasts." },
      { title: "Higher Engagement", icon: "heart", description: "Content and campaigns people act on." },
      { title: "Better Experiences", icon: "badge-check", description: "Products and services people enjoy using." },
      { title: "Bigger Customers", icon: "users", description: "Reach the right people and convert them." },
      { title: "Smarter Operations", icon: "zap", description: "Systems that save time and reduce friction." },
      { title: "New Opportunities", icon: "arrow-up-right", description: "New models, products and markets to explore." },
    ],

    work_eyebrow: "Featured Work",
    work_heading: "Real brands. Real impact.",
    work_sub: "",

    cta_heading: "Have something worth building?",
    cta_body: "A brand to rethink. A campaign to launch. A product to create. An experience to improve. Let's talk.",

    truth_image_1: t1 || null,
    truth_image_2: t2 || null,
  });
  log(seed.ok ? "✓ home_page seeded" : "✗ seed FAILED: " + JSON.stringify(seed.json));

  log("Seeding services image + colour…");
  const svc = await api("GET", "/items/services?fields=id,num&sort=sort&limit=-1");
  const colorByNum = { "01": "blue", "02": "gold", "03": "magenta", "04": "teal", "05": "blue" };
  for (const s of (svc.json?.data || [])) {
    const patch = { color: colorByNum[s.num] || "blue" };
    if (svcImgs[s.num]) patch.image = svcImgs[s.num];
    const r = await api("PATCH", "/items/services/" + s.id, patch);
    if (!r.ok) log("  ✗ svc FAILED:", s.num, JSON.stringify(r.json));
  }
  log("✓ services updated");

  await api("PATCH", "/items/site_settings", { address: "AHON Towers, 38 CIPM Road, Alausa, Lagos." });
  log("✓ site_settings.address seeded");

  log("\n✔ Phase 3 schema + content ready.");
}
main().catch(e => { console.error(e); process.exit(1); });
