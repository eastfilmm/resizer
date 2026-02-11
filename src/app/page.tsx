import { Metadata } from 'next';
import ClientPage from './client-page';
import { getSiteUrl } from '@/utils/siteConfig';

// 서버 컴포넌트에서 메타데이터와 기본 HTML 구조 제공
export const metadata: Metadata = {
  title: 'Picture Drucker - Image Resizer for Instagram',
  description:
    'Free online image resizer optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios. Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    url: `${getSiteUrl()}/`,
  },
};

export default function Home() {
  return (
    <>
      {/* SEO content for search engines (server-side rendered) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h1>Picture Drucker - Image Resizer for Instagram</h1>
        <p>
          Free online image resizer tool optimized for Instagram Feed and Stories. Resize images to 1:1, 4:5, and 9:16 aspect ratios.
          Apply polaroid frames, padding, glass blur, shadow effects, and customize background colors.
        </p>
        <h2>Key Features</h2>
        <ul>
          <li>Image resizing</li>
          <li>Aspect ratio adjustment (1:1, 4:5, 9:16)</li>
          <li>Polaroid frame</li>
          <li>Padding adjustment</li>
          <li>Glass blur effect</li>
          <li>Shadow effect</li>
          <li>Background color customization</li>
        </ul>
        <p>
          A free online image resizer tool optimized for Instagram Feed and Stories. Easily and quickly edit images for Instagram posts and stories.
        </p>
      </div>
      {/* 클라이언트 사이드 인터랙티브 컴포넌트 */}
      <ClientPage />
    </>
  );
}
