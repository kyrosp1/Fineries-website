/* Grant the Public policy read access for the website. Idempotent.
   Run from project root: node cms/bootstrap/public-read.mjs */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CMS = "http://localhost:8055";
const PUBLIC_POLICY = "abf8a154-5b1c-4a46-ac9c-7300570f4f17";

const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, "cms/.env"), "utf8")
    .split("\n").filter(l => l.includes("=") && !l.trim().startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);

let TOKEN = "";
async function api(m, p, b) {
  const h = { Authorization: `Bearer ${TOKEN}` };
  if (b) h["Content-Type"] = "application/json";
  const r = await fetch(CMS + p, { method: m, headers: h, body: b ? JSON.stringify(b) : undefined });
  const t = await r.text(); let j; try { j = t ? JSON.parse(t) : null; } catch { j = t; }
  return { ok: r.ok, status: r.status, json: j };
}

const grants = [
  { collection: "home_page", rule: { status: { _eq: "published" } } },
  { collection: "site_settings", rule: {} },
  { collection: "services", rule: {} },
  { collection: "work", rule: {} },
  { collection: "directus_files", rule: {} },
];

const login = async () => {
  const r = await api("POST", "/auth/login", null);
  // login needs body; do manually
};

async function main() {
  const lr = await fetch(CMS + "/auth/login", {
    method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD })
  });
  TOKEN = (await lr.json()).data.access_token;
  console.log("✓ logged in");

  for (const g of grants) {
    const ex = await api("GET", `/permissions?filter[policy][_eq]=${PUBLIC_POLICY}&filter[collection][_eq]=${g.collection}&filter[action][_eq]=read&limit=1`);
    if (ex.ok && ex.json.data && ex.json.data.length) { console.log("• public read exists:", g.collection); continue; }
    const r = await api("POST", "/permissions", {
      policy: PUBLIC_POLICY, collection: g.collection, action: "read",
      fields: ["*"], permissions: g.rule, validation: {}
    });
    console.log(r.ok ? "✓ public read:" : "✗ FAILED:", g.collection, r.ok ? "" : JSON.stringify(r.json));
  }
  console.log("done");
}
main().catch(e => { console.error(e); process.exit(1); });
