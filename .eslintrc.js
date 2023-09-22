/* eslint-env node */
// This file is managed by code-skeleton. Do not make changes.
// We don't transpile this file, so ignore eslint's complaint about the use of require
// eslint-disable-next-line @typescript-eslint/no-var-requires
const { readFileSync } = require("fs");

const ignorePatterns = readFileSync("./.gitignore", { encoding: "utf8" })
  .split("\n")
  .filter((line) => !line.startsWith("#") && line.trim() !== "");

module.exports = {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:@typescript-eslint/strict",
  ],
  rules: {
    // require semi-colons via @typescript-eslint
    semi: "off",
    "@typescript-eslint/semi": "error",
    "@typescript-eslint/member-delimiter-style": "error",

    // 2 space indentation, allow anything for switch statements and template strings
    indent: "off", // disable eslint's core indent rule
    "@typescript-eslint/indent": ["error", 2, {
      SwitchCase: 1,
      ignoredNodes: ["TemplateLiteral"],
    }],

    // allow multiple spaces for comments after a line, property values, and variable declarations
    // these are here to allow for aligning blocks
    "no-multi-spaces": ["error", {
      ignoreEOLComments: true,
      exceptions: {
        Property: true,
        VariableDeclarator: true,
      },
    }],

    // don't allow trailing spaces
    "no-trailing-spaces": "error",

    // only allow whitespace before property access when chaining on new lines
    "no-whitespace-before-property": "error",

    // require that dots for property access are on the same line as the property
    "dot-location": ["error", "property"],

    // require no spaces around parens in function calls
    "func-call-spacing": "off",
    "@typescript-eslint/func-call-spacing": ["error", "never"],

    // require double quotes, but avoid escaping
    quotes: "off",
    "@typescript-eslint/quotes": ["error", "double", {
      avoidEscape: true,
      allowTemplateLiterals: true,
    }],

    // IIFE wrap -> (function foo() {})()
    "wrap-iife": ["error", "inside"],

    // don't allow spaces before commas, require at least one after
    "comma-spacing": "off",
    "@typescript-eslint/comma-spacing": "error",

    // require at least one space before and after keywords
    "keyword-spacing": "off",
    "@typescript-eslint/keyword-spacing": "error",
  },
  ignorePatterns,
  overrides: [{
    files: ["test/**/*"],
    rules: {
      // non-null assertions can be useful in tests where we've already asserted something
      // exists before attempting to assert its value
      "@typescript-eslint/no-non-null-assertion": "off",
    },
  }],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["tsconfig.json"],
  },
  plugins: [
    "@typescript-eslint",
  ],
  root: true,
};
