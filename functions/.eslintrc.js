module.exports = {
  root: true,
  env: {
    es2021: true,
    node: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.json", "./tsconfig.dev.json"],
    sourceType: "module",
  },
  plugins: [
    "@typescript-eslint",
    "import",
  ],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:import/typescript",
    "prettier" // Optional: use Prettier for code formatting
  ],
  ignorePatterns: [
    "lib/**/*",         // Compiled outputs
    "generated/**/*",   // Firebase Connectors or Codegen
    "node_modules/**/*"
  ],
  rules: {
    "quotes": ["error", "double"],
    "indent": ["error", 2],
    "import/no-unresolved": "off",
    "@typescript-eslint/no-unused-vars": ["warn"],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "no-console": "off" // Allow console.* in cloud functions
  },
  globals: {
    logger: "readonly",
    functions: "readonly"
  }
};
