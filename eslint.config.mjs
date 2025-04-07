import { baseConfig } from "@schleifner/eslint-config-base/config.mjs";
export default [
  {
    ignores: [
      "dist/", // exclude specific folder
      "**/*.mjs", // exclude all JavaScript files
    ],
  },
  ...baseConfig,
];
