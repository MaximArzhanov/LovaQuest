import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    ignores: [
      // Игнорируем папки сборки
      ".next/**",
      "out/**",
      "dist/**",
      "build/**",
      
      // Игнорируем зависимости
      "node_modules/**",
      
      // Игнорируем конфигурационные файлы
      "*.config.js",
      "*.config.mjs",
      "*.config.ts",
      "tsconfig.json",
      "eslint.config.mjs",
      
      // Игнорируем файлы с типами
      "**/*.d.ts",
      
      // Игнорируем тестовые файлы
      "**/*.test.*",
      "**/*.spec.*",
      
      // Игнорируем файлы с миграциями и SQL
      "*.sql",
      "*.md",
      
      // Игнорируем файлы с переводами
      "**/translations.ts",
      "**/i18n/**",
      
      // Игнорируем файлы с константами
      "**/constants.ts",
      "**/config.ts",
    ],
    rules: {
      // Игнорируем предупреждения о неиспользуемых переменных
      "@typescript-eslint/no-unused-vars": "off",
      
      // Игнорируем предупреждения о типах any
      "@typescript-eslint/no-explicit-any": "off",
      
      // Игнорируем предупреждения о пустых интерфейсах
      "@typescript-eslint/no-empty-object-type": "off",
      
      // Игнорируем предупреждения о React hooks зависимостях
      "react-hooks/exhaustive-deps": "off",
      
      // Игнорируем предупреждения о использовании img вместо Image
      "@next/next/no-img-element": "off",
      
      // Игнорируем все остальные TypeScript предупреждения
      "@typescript-eslint/no-non-null-assertion": "off",
      "@typescript-eslint/no-var-requires": "off",
      "@typescript-eslint/ban-ts-comment": "off",
      "@typescript-eslint/ban-types": "off",
      
      // Игнорируем предупреждения о React
      "react/no-unescaped-entities": "off",
      "react/display-name": "off",
      
      // Игнорируем предупреждения о доступности
      "jsx-a11y/alt-text": "off",
      "jsx-a11y/anchor-has-content": "off",
      "jsx-a11y/anchor-is-valid": "off",
      "jsx-a11y/click-events-have-key-events": "off",
      "jsx-a11y/no-static-element-interactions": "off",
      
      // Игнорируем общие предупреждения
      "no-console": "off",
      "prefer-const": "off",
      "no-var": "off",
    },
  },
];

export default eslintConfig;
