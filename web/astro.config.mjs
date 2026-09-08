import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";

// SSR on Vercel: pages render per request and read live from WordPress
// (PUBLIC_WP_URL). Local dev still uses `astro dev` the same way.
export default defineConfig({
  output: "server",
  adapter: vercel(),
  server: { port: 4321, host: true },
});
