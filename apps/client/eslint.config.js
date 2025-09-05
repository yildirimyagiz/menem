import baseConfig, { restrictEnvAccess } from "@reservatior/eslint-config/base";
import nextjsConfig from "@reservatior/eslint-config/nextjs";
import reactConfig from "@reservatior/eslint-config/react";

/** @type {import('typescript-eslint').Config} */
export default [
  {
    ignores: [".next/**"],
  },
  ...baseConfig,
  ...reactConfig,
  ...nextjsConfig,
  ...restrictEnvAccess,
];
