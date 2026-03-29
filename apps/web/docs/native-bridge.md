# 네이티브 브릿지 명세서 (Native Bridge)

## 개요

모바일 앱(`apps/mobile`)은 WebView로 웹 앱을 로드합니다. 웹의 다운로드/공유 기능은 브라우저 API만으로는 네이티브 앱에서 동작하지 않으므로, `postMessage` 기반 브릿지를 통해 네이티브 기능을 호출합니다.

## 아키텍처

```
┌─────────────────────────────────┐
│         Mobile App (Expo)       │
│                                 │
│  WebView ◄──── onMessage ──────┤
│    │                            │
│    │ postMessage                │
│    ▼                            │
│  ┌───────────────────────┐      │
│  │    Web App (Next.js)  │      │  ┌─────────────────┐
│  │                       │      │  │ Native APIs      │
│  │  ReactNativeWebView   │──────┤  │  MediaLibrary    │
│  │  .postMessage(JSON)   │      │  │  Sharing         │
│  └───────────────────────┘      │  │  FileSystem      │
│                                 │  └─────────────────┘
└─────────────────────────────────┘
```

## WebView 감지 (Web 측)

```typescript
const webView = (window as any).ReactNativeWebView;
const isWebView = !!webView;
```

## 메시지 프로토콜

### 1. Download (다운로드 → 앨범 저장)

**발신**: `DownloadButton.tsx`
```typescript
webView.postMessage(JSON.stringify({
  type: 'download',
  data: string[]  // base64 PNG data URL 배열 (최대 5장)
}));
```

**수신**: `apps/mobile/App.tsx` → `handleMessage`
- MediaLibrary 권한 요청
- base64 → 임시 파일 저장 → MediaLibrary에 등록
- 성공/실패 모달 표시

### 2. Share (공유 시트)

**발신**: `ShareButton.tsx`
```typescript
webView.postMessage(JSON.stringify({
  type: 'share',
  data: string  // 단일 base64 PNG data URL
}));
```

**수신**: `apps/mobile/App.tsx` → `handleMessage`
- base64 → 임시 파일 저장
- `expo-sharing` → OS 공유 시트 호출

## 웹 폴백 동작

| 기능 | WebView | 웹 브라우저 |
|------|---------|------------|
| 다운로드 (1장) | 네이티브 브릿지 | `<a download>` 태그 |
| 다운로드 (2~5장) | 네이티브 브릿지 | JSZip으로 ZIP 다운로드 |
| 공유 | 네이티브 브릿지 | `navigator.share()` API |

## 네이티브 권한

### iOS (`app.json`)
- `NSPhotoLibraryUsageDescription`: 사진 읽기 권한
- `NSPhotoLibraryAddUsageDescription`: 사진 저장 권한

### Android (`app.json`)
- `READ_MEDIA_IMAGES`: 미디어 이미지 읽기
- `WRITE_EXTERNAL_STORAGE`: 외부 저장소 쓰기

## 관련 파일

| 파일 | 역할 |
|------|------|
| `apps/mobile/App.tsx` | 네이티브 메시지 수신 및 처리 |
| `apps/web/src/components/DownloadButton.tsx` | 다운로드 메시지 발신 |
| `apps/web/src/components/ShareButton.tsx` | 공유 메시지 발신 |
| `apps/mobile/app.json` | 네이티브 권한 설정 |

## 주의사항

- 공유는 **단일 이미지**만 지원 (OS 공유 시트 제약)
- base64 데이터가 크므로 5장 초과 업로드는 제한
- 임시 파일은 `Paths.cache` 디렉토리에 저장 (OS가 관리)
