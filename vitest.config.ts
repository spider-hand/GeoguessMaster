import { configDefaults, defineConfig } from "vitest/config";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath } from "url";

export default defineConfig({
  plugins: [vue()],
  mode: "test",
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "src/__tests__/unit/setup.ts",
    exclude: [...configDefaults.exclude, "src/__tests__/unit/setup.ts"],
    coverage: {
      provider: "istanbul",
    },
    css: {
      modules: {
        classNameStrategy: "non-scoped",
      },
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
