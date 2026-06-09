import js from "@eslint/js";
import globals from "globals";
import reactPlugin from "eslint-plugin-react";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import tseslint from "typescript-eslint";

export default [
  // 1. Archivos a ignorar
  {
    ignores: ["dist/**", "node_modules/**", ".astro/**", "public/**", ".vscode/**"],
  },

  // 2. Configuración base para TODOS los archivos JS/TS (incluyendo archivos de configuración)
  {
    files: ["**/*.{js,jsx,ts,tsx,mjs,cjs}"],
    languageOptions: {
      globals: {
        ...globals.node, // Node.js globals (URL, process, __dirname, etc.)
        ...globals.browser,
      },
    },
  },

  // 3. Configuración base recomendada de ESLint
  js.configs.recommended,

  // 4. Configuración base recomendada de TypeScript
  ...tseslint.configs.recommended,

  // 5. Configuración específica para archivos de configuración (.config.js, .config.ts, .mjs)
  {
    files: ["**/*.config.{js,ts,mjs}", "astro.config.mjs", "vite.config.ts"],
    languageOptions: {
      globals: {
        ...globals.node, // Prioridad para Node.js en archivos de configuración
      },
    },
    rules: {
      // Reglas más permisivas para archivos de configuración
      "no-console": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  // 6. Configuración completa para archivos de React (JSX/TSX)
  {
    files: ["**/*.{jsx,tsx}"],
    plugins: {
      react: reactPlugin,
      "react-hooks": reactHooksPlugin,
    },
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
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

      // Reglas específicas de React
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
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
  },

  // 7. Configuración para archivos JavaScript/TypeScript sin JSX
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.browser,
      },
    },
    rules: {
      "no-console": ["warn", { allow: ["warn", "error"] }],
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
];
