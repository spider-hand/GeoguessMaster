import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { fileURLToPath, URL } from "url";
import { ViteEjsPlugin } from "vite-plugin-ejs";

// @see https://stackoverflow.com/a/67923998/11043317
const removeDataTestAttrs = (node) => {
  if (node.type === 1 /* NodeTypes.ELEMENT */) {
    node.props = node.props.filter((prop) =>
      prop.type === 6 /* NodeTypes.ATTRIBUTE */
        ? prop.name !== "data-test"
        : true
    );
  }
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    // @see https://github.com/vitejs/vite/issues/3105
    ViteEjsPlugin((viteConfig) => ({
      // viteConfig is the current Vite resolved config
      env: viteConfig.env,
    })),
    vue({
      template: {
        compilerOptions: {
          nodeTransforms:
            process.env.NODE_ENV !== "test" ? [removeDataTestAttrs] : [],
        },
      },
    }),
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
          @import "./src/assets/styles/breakpoints.scss"; 
          @import "./src/assets/styles/colors.scss"; 
          @import "./src/assets/styles/mixin.scss";
          @import "./src/assets/styles/fonts";
        `,
      },
    },
  },
});
