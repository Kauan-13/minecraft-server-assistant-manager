import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    // Substitui o antigo .eslintignore
    ignores: ["dist/", "node_modules/", "build/"],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["**/*.ts"],
    languageOptions: {
      parserOptions: {
        // Isso permite regras que dependem de informações de tipos
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      // Aqui você pode adicionar regras manuais de estilo se desejar
      "semi": ["error", "always"],
      "quotes": ["error", "single"],
      "@typescript-eslint/no-explicit-any": "warn",
      "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "no-console": "off",
    },
  }
);