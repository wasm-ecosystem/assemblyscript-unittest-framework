module.exports = {
  root: true,
  extends: ["@schleifner/base"],
  rules: {
    "import/named": "off",
    "import/no-unresolved": [
      "error",
      {
        ignore: ["wasi"],
      },
    ],
  },
  ignorePatterns: ["src/core/instrument.ts", "src/utils/import.js", "resource/*", "third_party/*"],
};
