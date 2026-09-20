/**
 * apps/mobile의 WebView가 주입하는 전역.
 * 존재 여부가 곧 "네이티브 래퍼 안에서 돌고 있다"는 신호다.
 * 프로토콜은 docs/native-bridge.md 참고.
 */
interface Window {
  ReactNativeWebView?: {
    postMessage(message: string): void;
  };
}
