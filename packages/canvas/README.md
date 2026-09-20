# @resizer/canvas

web(Next.js)과 ait(App in Toss)가 공유하는 캔버스 렌더링 엔진.

React·styled-components·앱 상태에 의존하지 않는 순수 TypeScript다. 브라우저 판정,
프리뷰/다운로드 중 무엇을 그릴지, 어떤 블러 구현을 쓸지 같은 **환경 결정은 앱이 내리고
인자로 넘긴다.** 이 패키지 안에 `isSafari` 같은 환경 분기를 다시 들이지 말 것.

- `dimensions` — 캔버스 실해상도/표시 크기/프리뷰 배율 계산
- `drawImage` — 프레임·블러·그림자를 합성하는 진입점
- `effects` — Glass Blur (StackBlur / 네이티브 `ctx.filter`)
- `frames` — 폴라로이드·얇은 테두리·미디엄 필름
- `constants` — 2000px 기준 치수 상수

빌드 스텝이 없다. `exports`가 `src/index.ts`를 직접 가리키므로 소비하는 쪽 번들러가
트랜스파일한다 (Next는 `transpilePackages`, Vite는 기본 동작).
