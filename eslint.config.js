import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  // Configuración base recomendada
  js.configs.recommended,

  // Configuración para TypeScript
  ...tseslint.configs.recommended,

  // Configuración general para todos los archivos JavaScript/TypeScript
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: "module",
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Reglas generales
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",

      // Reglas de React
      ...reactPlugin.configs.recommended.rules,
      ...reactHooksPlugin.configs.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off",
      "react/jsx-curly-brace-presence": ["warn", { props: "never", children: "never" }],
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  },

  // Archivos a ignorar
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      ".astro/**",
      "public/**",
      "*.config.js",
      "*.config.ts",
      ".vscode/**",
    ],
  },
];
