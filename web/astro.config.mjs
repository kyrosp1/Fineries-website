import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

// SSR on Vercel: pages render per request and read live from WordPress
// (PUBLIC_WP_URL). Local dev still uses `astro dev` the same way.
export default defineConfig({
  output: "server",
  // webAnalytics injects Vercel Web Analytics on every page (enable it once in the
  // Vercel dashboard: Project → Analytics → Enable Web Analytics).
  adapter: vercel({ webAnalytics: { enabled: true } }),
  server: { port: 4321, host: true },
});
