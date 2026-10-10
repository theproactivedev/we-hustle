import js from "@eslint/js";
import stylistic from "@stylistic/eslint-plugin";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import globals from "globals";
import tseslint from "typescript-eslint";

export default tseslint.config(
  { ignores: ["node_modules", "dist", "build"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: {
      "@stylistic": stylistic,
      "simple-import-sort": simpleImportSort,
    },
    rules: {
      "@stylistic/semi": ["error", "always"],
      "@stylistic/indent": ["error", 2],
      "@stylistic/quotes": ["error", "double"],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/no-trailing-spaces": "error",
      "@stylistic/eol-last": ["error", "always"],
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
    },
  },
  // Frontend: browser environment
  {
    files: ["frontend/**/*.{js,jsx,ts,tsx}"],
    languageOptions: { globals: globals.browser },
  },

  // Backend: Node environment
  {
    files: ["backend/**/*.{js,ts}"],
    languageOptions: { globals: globals.node },
  },
);
