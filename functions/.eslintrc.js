module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true,
  },
  extends: [
    // ESLintの推奨設定とTypeScriptのプラグインを無効化
    // "eslint:recommended",
    // "plugin:@typescript-eslint/recommended"
  ],
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint"],
  rules: {
    // 全てのルールを無効化
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/no-var-requires": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // その他の全てのルールも無効化
    "no-unused-vars": "off",
    "no-undef": "off"
  },
};
