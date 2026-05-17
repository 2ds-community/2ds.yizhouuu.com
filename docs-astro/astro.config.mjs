import { defineConfig } from "astro/config";

export default defineConfig({
  site: "https://2ds.yizhouuu.com",
  base: "/docs",
  output: "static",
  outDir: "../docs",
  trailingSlash: "always",
});

