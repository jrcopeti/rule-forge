import path from "node:path";
import { defineConfig } from "vitest/config";

// jsdom is the single environment for the whole suite. The rule engine itself
// is pure and would run fine in node, but component tests land in the same
// suite later, and one environment keeps the config free of per-file pragmas.
export default defineConfig({
  test: {
    environment: "jsdom",
    include: ["**/*.test.{ts,tsx}"],
    exclude: ["node_modules/**", ".next/**"],
  },
  resolve: {
    alias: {
      // Mirrors tsconfig.json's "@/*" path so tests import the same way
      // application code does.
      "@": path.resolve(import.meta.dirname, "."),
    },
  },
});
