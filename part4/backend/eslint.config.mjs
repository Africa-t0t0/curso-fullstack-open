import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    files: ["**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: {
      semi: ["error", "always"],          // exige punto y coma
      quotes: ["error", "double"],        // exige comillas dobles
      "no-unused-vars": "warn",            // advierte variables no usadas
      "no-console": "warn",                 // advierte uso de console.log
      "eqeqeq": "error",
      "no-trailing-spaces": "error",
      "no-console": 0
    }
  },
  {
    files: ["**/*.{js,mjs,cjs}"],
    languageOptions: { globals: globals.browser },
  },
]);