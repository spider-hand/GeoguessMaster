import { configDefaults, defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [vue()],
  mode: "test",
  test: {
    globals: true,
    environment: "happy-dom",
    setupFiles: "src/__tests__/unit/setup.ts",
    exclude: [...configDefaults.exclude, "src/__tests__/unit/setup.ts"],
    coverage: {
      provider: "istanbul",
    },
  },
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
});
