import js from "@eslint/js";
import tseslint from "typescript-eslint";
import reactHooks from "eslint-plugin-react-hooks";
import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * 워크스페이스 전체를 덮는 단일 flat config.
 *
 * 코드 대부분이 packages/로 옮겨간 뒤에도 린트 설정은 apps/web에만 있어서,
 * 실제로 검사되는 파일이 전체 57개 중 12개뿐이었다. 통과처럼 보이던 exit 0은
 * 범위가 비어 있었던 것이다. 루트에서 한 번에 덮는다.
 *
 * apps/web만 Next 규칙을 받고(서버/클라이언트 경계, 이미지, 링크 등 Next에만
 * 의미가 있다), 나머지는 TypeScript + React Hooks 기본 규칙을 받는다. 두
 * 그룹은 겹치지 않는다 — 같은 플러그인을 두 설정이 각자 등록하면 ESLint가
 * 중복 정의로 거부하기 때문이다.
 */

const WEB = "apps/web";
// 하위 디렉토리에서 eslint를 실행해도 같은 위치를 가리키도록 절대 경로로 고정한다.
const WEB_DIR = resolve(dirname(fileURLToPath(import.meta.url)), WEB);
const SOURCE_GLOB = "**/*.{js,jsx,mjs,ts,tsx,mts,cts}";

/** Next 설정 배열을 apps/web 안으로 가둔다. */
const scopeToWeb = (configs) =>
  configs.flatMap((config) => {
    // 전역 ignores만 있는 항목은 아래 공통 ignores가 이미 처리한다.
    if (config.ignores && !config.files && !config.rules && !config.plugins) return [];

    const patterns = config.files ?? [SOURCE_GLOB];
    return [
      {
        ...config,
        files: patterns.map((pattern) => `${WEB}/${pattern}`),
        // 설정이 루트에 있으므로 Next 플러그인에 앱 위치를 알려준다.
        // (없으면 no-html-link-for-pages가 루트에서 pages/를 찾다 경고한다)
        settings: { ...config.settings, next: { rootDir: WEB_DIR } },
      },
    ];
  });

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/.next/**",
      "**/dist/**",
      "**/out/**",
      "**/build/**",
      "**/next-env.d.ts",
      "apps/mobile/**", // Expo RN 앱. 별도 프리셋이 필요해 지금은 범위 밖.
    ],
  },

  // ── apps/web: Next 프리셋 (TypeScript·React Hooks 규칙을 자체 포함한다)
  ...scopeToWeb(nextCoreWebVitals),
  ...scopeToWeb(nextTypescript),

  // ── 그 외 워크스페이스: packages/*, apps/ait
  {
    ...js.configs.recommended,
    files: ["packages/**/*.{ts,tsx}", "apps/ait/**/*.{ts,tsx}"],
  },
  ...tseslint.configs.recommended.map((config) => ({
    ...config,
    files: ["packages/**/*.{ts,tsx}", "apps/ait/**/*.{ts,tsx}"],
  })),
  {
    ...reactHooks.configs.flat["recommended-latest"],
    // 훅은 .ts 파일에도 있다. .tsx만 걸면 hooks/ 디렉토리가 통째로 빠진다.
    files: ["packages/**/*.{ts,tsx}", "apps/ait/**/*.{ts,tsx}"],
  },

  {
    // 테스트와 목(mock)은 브라우저 API를 부분만 흉내 내므로 any 캐스트가 불가피하다.
    // 프로덕션 코드에는 계속 금지한다.
    files: ["**/__tests__/**", "**/*.test.{ts,tsx}", "**/test-setup.ts"],
    rules: { "@typescript-eslint/no-explicit-any": "off" },
  },

  {
    // 빌드와 무관한 Node CommonJS 스크립트.
    files: ["**/scripts/**/*.js"],
    languageOptions: { sourceType: "commonjs" },
    rules: { "@typescript-eslint/no-require-imports": "off" },
  },

  prettier,
];
