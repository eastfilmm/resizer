import { Metadata } from 'next';
import ClientPage from './client-page';

// 서버 컴포넌트에서 메타데이터와 기본 HTML 구조 제공
export const metadata: Metadata = {
  title: 'Image Resizer for Instagram - 인스타그램 이미지 리사이저',
  description:
    '인스타그램용 이미지 리사이저. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고, 폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용하세요.',
};

export default function Home() {
  return (
    <>
      {/* Google 크롤러를 위한 기본 HTML 콘텐츠 (서버 사이드 렌더링) */}
      <div style={{ display: 'none' }} aria-hidden="true">
        <h1>Image Resizer for Instagram - 인스타그램 이미지 리사이저</h1>
        <p>
          인스타그램용 이미지 리사이저입니다. 1:1, 4:5, 9:16 비율로 이미지를 리사이즈하고,
          폴라로이드 프레임, 패딩, 글래스 블러, 그림자 효과를 적용할 수 있습니다.
        </p>
        <h2>주요 기능</h2>
        <ul>
          <li>이미지 리사이즈</li>
          <li>비율 조정 (1:1, 4:5, 9:16)</li>
          <li>폴라로이드 프레임</li>
          <li>패딩 조정</li>
          <li>글래스 블러 효과</li>
          <li>그림자 효과</li>
          <li>배경색 변경</li>
        </ul>
        <p>
          무료로 사용할 수 있는 온라인 이미지 리사이저 도구입니다.
          인스타그램 포스팅을 위한 이미지를 쉽고 빠르게 편집하세요.
        </p>
      </div>
      {/* 클라이언트 사이드 인터랙티브 컴포넌트 */}
      <ClientPage />
    </>
  );
}
