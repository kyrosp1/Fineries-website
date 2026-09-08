/* Ensure an Editor user exists. Run from project root:
   node cms/bootstrap/ensure-editor-user.mjs */
import fs from "node:fs";
import path from "node:path";
const ROOT = process.cwd();
const CMS = "http://localhost:8055";
const env = Object.fromEntries(
  fs.readFileSync(path.join(ROOT, "cms/.env"), "utf8").split("\n")
    .filter(l => l.includes("=") && !l.trim().startsWith("#"))
    .map(l => { const i = l.indexOf("="); return [l.slice(0, i).trim(), l.slice(i + 1).trim()]; })
);
const EDITOR = { email: "editor@fineries.net", password: "Editor12345!", first_name: "Content", last_name: "Editor" };

const login = async () => {
  const r = await fetch(CMS + "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: env.ADMIN_EMAIL, password: env.ADMIN_PASSWORD }) });
  const j = await r.json();
  if (!j.data) throw new Error("login failed: " + JSON.stringify(j));
  return j.data.access_token;
};
const g = (t, p, m = "GET", b) => fetch(CMS + p, { method: m,
  headers: { Authorization: `Bearer ${t}`, ...(b ? { "Content-Type": "application/json" } : {}) },
  body: b ? JSON.stringify(b) : undefined }).then(async r => ({ ok: r.ok, json: await r.json().catch(() => null) }));

const token = await login();
const roleRes = await g(token, "/roles?filter[name][_eq]=Editor&limit=1");
const roleId = roleRes.json?.data?.[0]?.id;
if (!roleId) throw new Error("Editor role not found");

const uRes = await g(token, `/users?filter[email][_eq]=${encodeURIComponent(EDITOR.email)}&limit=1`);
if (uRes.json?.data?.length) {
  const u = uRes.json.data[0];
  // make sure role + password are set
  await g(token, "/users/" + u.id, "PATCH", { role: roleId, password: EDITOR.password });
  console.log("• editor user existed — role/password ensured:", EDITOR.email);
} else {
  const c = await g(token, "/users", "POST", { ...EDITOR, role: roleId });
  console.log(c.ok ? "✓ created editor user:" : "✗ create FAILED:", EDITOR.email, c.ok ? "" : JSON.stringify(c.json));
}

const list = await g(token, "/users?fields=email,role.name,status&limit=20");
console.log("\nUsers:");
for (const u of list.json.data) console.log("  -", u.email, "→", u.role?.name || "(no role)", "[" + u.status + "]");
