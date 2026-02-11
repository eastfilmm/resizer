/**
 * 사이트 설정 유틸리티
 * 환경 변수를 사용하여 base URL을 동적으로 가져옵니다.
 */

/**
 * 사이트의 base URL을 반환합니다.
 * 우선순위:
 * 1. NEXT_PUBLIC_SITE_URL 환경 변수
 * 2. VERCEL_URL 환경 변수 (Vercel 자동 제공)
 * 3. 기본값 (fallback)
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // 프로덕션 기본값
  return 'https://picturedrucker.com';
}

/**
 * 사이트의 base URL을 URL 객체로 반환합니다.
 */
export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}
