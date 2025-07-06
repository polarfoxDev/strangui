// @ts-check
import eslint from "@eslint/js";
import * as tseslint from "typescript-eslint";
import * as angular from "angular-eslint";
import * as importPlugin from "eslint-plugin-import";
import stylistic from "@stylistic/eslint-plugin";

export default tseslint.config(
  {
    files: ["**/*.ts"],
    plugins: {
      import: importPlugin,
      "@stylistic": stylistic,
    },
    settings: {
      "import/resolver": {
        typescript: {
          project: "./tsconfig.json",
        },
      },
    },
    extends: [
      eslint.configs.recommended,
      stylistic.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@stylistic/semi": [
        "error",
        "always",
        {
          omitLastInOneLineBlock: true,
          omitLastInOneLineClassBody: true,
        },
      ],
      "@stylistic/object-curly-spacing": [
        "error",
        "always",
        {
          objectsInObjects: true,
          arraysInObjects: true,
        },
      ],
      "@stylistic/object-property-newline": [
        "error",
        {
          allowAllPropertiesOnSameLine: true,
          allowMultiplePropertiesPerLine: true,
        },
      ],
      "@stylistic/quote-props": ["error", "as-needed"],
      "@stylistic/quotes": [
        "error",
        "single",
        {
          avoidEscape: true,
          allowTemplateLiterals: true,
        },
      ],
      "@stylistic/space-before-function-paren": [
        "error",
        {
          anonymous: "always",
          named: "never",
          asyncArrow: "always",
        },
      ],
      "@stylistic/comma-dangle": ["error", "always-multiline"],
      "@stylistic/member-delimiter-style": [
        "error",
        {
          multiline: {
            delimiter: "semi",
            requireLast: true,
          },
          singleline: {
            delimiter: "comma",
            requireLast: false,
          },
          overrides: {
            interface: {
              multiline: {
                delimiter: "semi",
                requireLast: true,
              },
              singleline: {
                delimiter: "comma",
                requireLast: false,
              },
            },
          },
        },
      ],
      "@angular-eslint/directive-selector": [
        "error",
        {
          type: "attribute",
          prefix: "app",
          style: "camelCase",
        },
      ],
      "@angular-eslint/component-selector": [
        "error",
        {
          type: "element",
          prefix: "app",
          style: "kebab-case",
        },
      ],
      "import/no-unresolved": "error",
      "import/order": [
        "warn",
        {
          groups: [
            "builtin",
            "external",
            "internal",
            "parent",
            "sibling",
            "index",
          ],
          pathGroups: [
            {
              pattern: "@env/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@auth-state/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@auth/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@core-state/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@core/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@game-state/**",
              group: "internal",
              position: "before",
            },
            {
              pattern: "@game/**",
              group: "internal",
              position: "before",
            },
          ],
          pathGroupsExcludedImportTypes: ["builtin"],
          alphabetize: {
            order: "asc",
            caseInsensitive: true,
          },
        },
      ],
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
