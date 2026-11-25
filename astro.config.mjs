import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://thelouisian.netlify.app",
  trailingSlash: "always",
  output: "static",
  build: { format: "directory" },
  integrations: [
    sitemap({
      filter: (page) =>
        !page.includes("/search/") &&
        !page.includes("/contact/thanks/") &&
        !page.includes("/og/"),
    }),
  ],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
});