import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { resolveSiteOrigin } from "./src/site-metadata.ts";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "canonical-site-origin",
      transformIndexHtml: {
        order: "pre",
        handler(html) {
          const origin = resolveSiteOrigin(process.env, "http://localhost:3000");
          const canonicalOrigin = process.env.PUBLIC_SITE_URL?.trim() ? origin : "";
          return html
            .replaceAll("__SITE_ORIGIN__", origin)
            .replace('<meta name="site-origin" content="" />', `<meta name="site-origin" content="${canonicalOrigin}" />`);
        },
      },
    },
  ],
  server: {
    host: "127.0.0.1",
    port: 3000,
  },
});
