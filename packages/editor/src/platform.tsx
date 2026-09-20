'use client';

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';

/**
 * 플랫폼 주입 지점.
 *
 * 저장·공유는 실행 환경마다 방식이 다르다(web은 React Native WebView
 * postMessage, ait는 App in Toss SDK). 버튼의 UI와 흐름은 완전히 공통이므로,
 * 다른 부분만 앱이 구현해서 넣는다.
 */

export interface RenderedImage {
  canvas: HTMLCanvasElement;
  fileName: string;
}

export interface Platform {
  /** 네이티브 저장/공유를 쓸 수 있는 환경인가. false면 브라우저 폴백을 쓴다. */
  isNativeAvailable(): boolean;
  /** 렌더된 이미지들을 기기에 저장한다. */
  saveImagesNatively(images: RenderedImage[]): Promise<void>;
  /** 한 장을 공유한다. */
  shareImageNatively(image: RenderedImage): Promise<void>;
}

/** 네이티브 기능이 없는 환경(일반 브라우저)의 기본 구현. */
const browserOnly: Platform = {
  isNativeAvailable: () => false,
  saveImagesNatively: async () => {},
  shareImageNatively: async () => {},
};

const PlatformContext = createContext<Platform>(browserOnly);

export const PlatformProvider = ({
  value,
  children,
}: {
  value: Platform;
  children: ReactNode;
}) => <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;

export const usePlatform = (): Platform => useContext(PlatformContext);
