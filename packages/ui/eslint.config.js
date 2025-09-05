import baseConfig from "@reservatior/eslint-config/base";
import reactConfig from "@reservatior/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: ["dist/**"],
  },
  ...baseConfig,
  ...reactConfig,
];
