module.exports = {
  "parser": "@typescript-eslint/parser",
  "extends": [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/errors",
    "plugin:storybook/recommended",
    "next",
    "next/core-web-vitals"
  ],
  "plugins": [
    "@typescript-eslint",
    "import",
    "unused-imports"
  ],
  "rules": {
    "import/order": [
      "error",
      {
        "groups": [
          "type",
          "builtin",
          "external",
          "internal",
          "parent",
          "sibling",
          "index"
        ],
        "alphabetize": {
          "order": "asc"
        },
        "pathGroups": [
          {
            "pattern": "@/**",
            "group": "internal"
          },
          {
            "pattern": "$/**",
            "group": "internal"
          },
          {
            "pattern": "^/**",
            "group": "internal"
          }
        ],
        "pathGroupsExcludedImportTypes": ["builtin", "external", "type"]
      }
    ],
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": [
      "error",
      {"vars": "all", "varsIgnorePattern": "^_", "args": "after-used", "argsIgnorePattern": "^_"}
    ],
    "import/no-anonymous-default-export": "off",
    "react-hooks/rules-of-hooks": "off"
  }
}
