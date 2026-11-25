import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify-adapter";

export default defineConfig({
  site: "https://thelouisian.netlify.app",
  trailingSlash: "always",
  output: "static",
  build: {
    // The Netlify adapter handles the build properly
  },
  integrations: [
    netlify({
      // Netlify adapter options
      // preserveSlashes: true, // Uncomment if needed
    }),
  ],
});