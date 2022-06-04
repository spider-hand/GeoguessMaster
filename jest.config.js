module.exports = {
  preset: "@vue/cli-plugin-unit-jest/presets/typescript-and-babel",
  transform: {
    "^.+\\.vue$": "vue-jest",
  },
  transformIgnorePatterns: [
    "<rootDir>/node_modules/(?!(vue-material-design-icons)/)",
  ],
  collectCoverage: true,
  collectCoverageFrom: ["src/**/*.{ts,vue}", "!src/main.ts"],
  globals: {
    "vue-jest": {
      experimentalCSSCompile: true,
      resources: {
        scss: ["src/assets/styles/_variables.scss"],
      },
    },
  },
};

process.env = Object.assign(process.env, {
  VUE_APP_FIREBASE_API_KEY: "test",
  VUE_APP_FIREBASE_PROJECT_ID: "test",
  VUE_APP_FIREBASE_MESSAGING_SENDER_ID: "test",
  VUE_APP_FIREBASE_APP_ID: "test",
  VUE_APP_FIREBASE_MEASUREMENT_ID: "test",
});
