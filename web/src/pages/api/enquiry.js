// Contact form endpoint: receives the submission from the browser (same-origin, no CORS)
// and forwards it to the WordPress REST route, which stores it + emails via ZeptoMail.
export const prerender = false;

const WP = import.meta.env.PUBLIC_WP_URL || "https://cms.fineries.net";

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { "Content-Type": "application/json" } });

export async function POST({ request }) {
  let data;
  try {
    data = await request.json();
  } catch {
    return json({ ok: false, message: "Invalid request." }, 400);
  }
  try {
    const r = await fetch(`${WP}/wp-json/fineries/v1/enquiry`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const body = await r.json().catch(() => ({}));
    return json(body, r.status);
  } catch {
    return json({ ok: false, message: "Could not reach the server. Please try again." }, 502);
  }
}
