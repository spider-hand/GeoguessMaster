module.exports = {
  css: {
    requireModuleExtension: true,
    loaderOptions: {
      scss: {
        additionalData: `@import "~@/assets/styles/_variables.scss";`
      },
      css: {
        modules: {
          localIdentName: "[hash:base64:6]"
        }
      }
    }
  }
}