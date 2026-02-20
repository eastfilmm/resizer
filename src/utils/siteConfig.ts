/**
 * 사이트 설정 유틸리티
 * 환경 변수를 사용하여 base URL을 동적으로 가져옵니다.
 */

const PRODUCTION_URL = 'https://picturedrucker.com';

/**
 * 사이트의 base URL을 반환합니다.
 * 우선순위:
 * 1. NEXT_PUBLIC_SITE_URL 환경 변수
 * 2. Production 환경이면 기본 도메인 사용
 * 3. VERCEL_URL 환경 변수 (preview/development용)
 * 4. 기본값 (fallback)
 */
export function getSiteUrl(): string {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }

  if (process.env.VERCEL_ENV === 'production') {
    return PRODUCTION_URL;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  return PRODUCTION_URL;
}

/**
 * 사이트의 base URL을 URL 객체로 반환합니다.
 */
export function getSiteUrlObject(): URL {
  return new URL(getSiteUrl());
}
