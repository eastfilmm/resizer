import coreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import eslintConfigPrettier from "eslint-config-prettier";

// eslint-config-next 16은 flat config를 직접 내보낸다.
// FlatCompat.extends()로 감싸면 설정 검증 단계에서 순환 참조로 터진다.
// core-web-vitals는 내부에서 기본 설정(index)을 포함하므로 따로 붙이지 않는다.
const eslintConfig = [
  {
    // 빌드 산출물은 깊이와 무관하게 무시한다 (잘못된 경로에 생긴 중첩 .next 포함).
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/out/**",
      "**/build/**",
      "next-env.d.ts",
    ],
  },
  ...coreWebVitals,
  ...nextTypescript,
  eslintConfigPrettier,
  {
    // 빌드와 무관한 Node CommonJS 스크립트.
    files: ["scripts/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },
];

export default eslintConfig;
