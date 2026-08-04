import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // Scraped reference material, not part of the app itself.
    "nextjs.org/**",
    // Vendored transitions.dev demo snippets, imported as-is (see
    // design.txt and app/(main)/components/transitions/page.tsx) — their
    // own @ts-nocheck/style conventions aren't ours to enforce.
    "components/transitions-dev/**",
  ]),
]);

export default eslintConfig;
