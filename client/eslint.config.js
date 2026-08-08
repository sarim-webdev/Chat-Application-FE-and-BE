import js from "@eslint/js";
import globals from "globals";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";
import { defineConfig, globalIgnores } from "eslint/config";

export default defineConfig([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{js,jsx}"],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },

    rules: {
      // React 19 ke strict rules off
      "react-hooks/set-state-in-effect": "off",
      "react-refresh/only-export-components": "off",

      // Warnings only
      "react-hooks/exhaustive-deps": "warn",

      // Try/catch warning off
      "no-useless-catch": "off",

      // Unused variables warning
      "no-unused-vars": "warn",
    },
  },
]);