module.exports = {
  extends: [
    "eslint:recommended",
    // 'plugin:import/typescript',
    // "plugin:promise/recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
    "prettier/@typescript-eslint",
  ],
  parserOptions: {
    project: "./tsconfig.json",
  },
  parser: "@typescript-eslint/parser",
  env: {
    es6: true,
    node: true,
  },
  rules: {
    "@typescript-eslint/explicit-function-return-type": ["off"],
  },
}
