import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@repo/utils": fileURLToPath(
        new URL("../../packages/utils/src", import.meta.url),
      ),
      "@repo/db": fileURLToPath(
        new URL("../../packages/db/src", import.meta.url),
      ),
    },
  },
});
