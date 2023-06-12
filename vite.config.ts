import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import { ViteEjsPlugin } from "vite-plugin-ejs";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // @see https://github.com/vitejs/vite/issues/3105
    ViteEjsPlugin((viteConfig) => ({
      // viteConfig is the current Vite resolved config
      env: viteConfig.env,
    })),
    vue(),
  ],
  resolve: {
    alias: [
      {
        find: "@",
        replacement: fileURLToPath(new URL("./src", import.meta.url)),
      },
    ],
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @import "./src/assets/styles/_breakpoints.scss"; 
          @import "./src/assets/styles/_colors.scss"; 
          @import "./src/assets/styles/_mixin.scss";
        `,
      },
    },
  },
});
