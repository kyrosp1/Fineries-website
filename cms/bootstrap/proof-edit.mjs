/* Proves: Editor role can update content, and the site reflects it.
   Run from project root: node cms/bootstrap/proof-edit.mjs */
const CMS = "http://localhost:8055";
const SITE = "http://localhost:4321/";
const ORIGINAL = "Everything your brand needs. Under one roof.";
const TEST = "EDITOR-TEST heading is live";

const login = async () => {
  const r = await fetch(CMS + "/auth/login", { method: "POST", headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: "editor@fineries.net", password: "Editor12345!" }) });
  const j = await r.json();
  if (!j.data) throw new Error("editor login failed: " + JSON.stringify(j));
  return j.data.access_token;
};
const patch = (t, body) => fetch(CMS + "/items/home_page", { method: "PATCH",
  headers: { Authorization: `Bearer ${t}`, "Content-Type": "application/json" }, body: JSON.stringify(body) })
  .then(async r => ({ ok: r.ok, json: await r.json().catch(() => null) }));

const token = await login();
console.log("✓ editor logged in");

let r = await patch(token, { wwd_heading: TEST });
console.log(r.ok ? "✓ editor updated home_page.wwd_heading" : "✗ editor UPDATE denied: " + JSON.stringify(r.json));

// give SSR a moment, then fetch the live site
await new Promise(res => setTimeout(res, 500));
const html = await fetch(SITE).then(r => r.text());
console.log(html.includes(TEST) ? "✓ site now shows the edited heading (live)" : "✗ site did NOT reflect the edit");

// revert
r = await patch(token, { wwd_heading: ORIGINAL });
console.log(r.ok ? "✓ reverted heading to original" : "✗ revert failed");
