import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

// SSR on Vercel: pages render per request and read live from WordPress
// (PUBLIC_WP_URL). Local dev still uses `astro dev` the same way.
export default defineConfig({
  output: "server",
  // Analytics is handled by Cloudflare Web Analytics (beacon in SiteNav, token in CMS
  // Site Settings → cf_analytics_token). Vercel Web Analytics intentionally left off to
  // avoid double-counting.
  adapter: vercel(),
  server: { port: 4321, host: true },
});
