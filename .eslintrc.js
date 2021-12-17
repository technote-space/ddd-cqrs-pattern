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
    "unused-imports",
    "@technote-space/strict-dependencies"
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
    "react-hooks/rules-of-hooks": "off",
    "@technote-space/strict-dependencies/strict-dependencies": [
      "error",
      [
        {
          "module": "react-native-web",
          "allowReferenceFrom": ["src/infra/web/components/**"]
        },
        {
          "module": "native-base",
          "allowReferenceFrom": ["src/infra/web/components/**", "src/infra/web/theme/nativeBase/view.tsx"]
        },
        {
          "module": "src/domain",
          "allowReferenceFrom": ["src/infra/**", "src/usecase/**", "src/presentation/**"],
          "allowSameModule": true
        },
        {
          "module": "src/infra",
          "allowReferenceFrom": ["src/pages/**", "src/config/registry.*", "src/__mocks__/**"],
          "allowSameModule": true
        },
        {
          "module": "src/infra/web/components",
          "allowReferenceFrom": ["src/infra/web/pages/**/components/**", "src/config/registry.components", "src/infra/web/theme/nativeBase/**"],
          "allowSameModule": true
        },
        {
          "module": "src/usecase",
          "allowReferenceFrom": ["src/presentation/**", "src/infra/web/**", "src/bin/**"],
          "allowSameModule": true
        },
        {
          "module": "src/presentation",
          "allowReferenceFrom": ["src/pages/api/**"],
          "allowSameModule": true
        }
      ],
      {
        "resolveRelativeImport": true,
        "allowTypeImport": true
      }
    ]
  }
}
