module.exports = {
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/styles/_colors.scss"; @import "~@/assets/styles/_breakpoints.scss"; @import "~@/assets/styles/_mixin.scss";`,
      },
      css: {
        modules: {
          localIdentName: "[hash:base64:6]",
        },
      },
    },
  },
};
