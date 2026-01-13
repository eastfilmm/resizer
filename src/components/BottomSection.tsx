import { useState, useRef, useCallback, memo } from "react";
import { styled } from "styled-components";
import CanvasPaddingSelector from "./CanvasPaddingSelector";
import CanvasBackgroundSelector from "./CanvasBackgroundSelector";
import GlassBlurSelector from "./GlassBlurSelector";
import CopyrightSelector from "./CopyrightSelector";
import ShadowSelector from "./ShadowSelector";

const COLLAPSED_HEIGHT = 28;
const EXPANDED_HEIGHT = 360;
const CLOSE_SNAP_THRESHOLD = 100;

// 자식 컴포넌트 리렌더링 방지
const MemoizedContent = memo(() => (
  <Content>
    <CanvasPaddingSelector />
    <CanvasBackgroundSelector />
    <GlassBlurSelector />
    <ShadowSelector />
    <CopyrightSelector />
  </Content>
));
MemoizedContent.displayName = "MemoizedContent";

export const BottomSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [translateY, setTranslateY] = useState(EXPANDED_HEIGHT - COLLAPSED_HEIGHT);
  
  const startYRef = useRef(0);
  const startTranslateYRef = useRef(0);
  const hasOpenedRef = useRef(false);
  const rafIdRef = useRef<number | null>(null);
  const pendingTranslateYRef = useRef(EXPANDED_HEIGHT - COLLAPSED_HEIGHT);

  const updateTranslateY = useCallback((newTranslateY: number) => {
    pendingTranslateYRef.current = newTranslateY;
    
    if (rafIdRef.current === null) {
      rafIdRef.current = requestAnimationFrame(() => {
        setTranslateY(pendingTranslateYRef.current);
        rafIdRef.current = null;
      });
    }
  }, []);

  const handleDragMove = useCallback((clientY: number) => {
    const deltaY = clientY - startYRef.current;
    const newTranslateY = Math.max(
      0,
      Math.min(EXPANDED_HEIGHT - COLLAPSED_HEIGHT, startTranslateYRef.current + deltaY)
    );
    
    updateTranslateY(newTranslateY);
    
    // 한번이라도 threshold 이상 올라가면 열린 상태로 판단
    const currentHeight = EXPANDED_HEIGHT - newTranslateY;
    if (!hasOpenedRef.current && currentHeight >= CLOSE_SNAP_THRESHOLD) {
      hasOpenedRef.current = true;
    }
  }, [updateTranslateY]);

  const handleDragEnd = useCallback(() => {
    // RAF 취소
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current);
      rafIdRef.current = null;
    }
    
    const currentHeight = EXPANDED_HEIGHT - pendingTranslateYRef.current;
    
    // 열린 상태에서 threshold 아래로 내리면 닫힘
    if (hasOpenedRef.current && currentHeight < CLOSE_SNAP_THRESHOLD) {
      setTranslateY(EXPANDED_HEIGHT - COLLAPSED_HEIGHT);
      pendingTranslateYRef.current = EXPANDED_HEIGHT - COLLAPSED_HEIGHT;
      hasOpenedRef.current = false;
    } else {
      setTranslateY(pendingTranslateYRef.current);
    }
    
    setIsDragging(false);
  }, []);

  const handlePointerDown = useCallback((clientY: number) => {
    startYRef.current = clientY;
    startTranslateYRef.current = pendingTranslateYRef.current;
    setIsDragging(true);
  }, []);

  // Mouse events
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    handlePointerDown(e.clientY);
    
    const handleMouseMove = (e: MouseEvent) => handleDragMove(e.clientY);
    const handleMouseUp = () => {
      handleDragEnd();
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
    
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);
  }, [handlePointerDown, handleDragMove, handleDragEnd]);

  // Touch events
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    handlePointerDown(e.touches[0].clientY);
  }, [handlePointerDown]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    handleDragMove(e.touches[0].clientY);
  }, [handleDragMove]);

  const handleTouchEnd = useCallback(() => {
    handleDragEnd();
  }, [handleDragEnd]);

  return (
    <BottomSheet $translateY={translateY} $isDragging={isDragging}>
      <HandleArea
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Handle />
      </HandleArea>
      <MemoizedContent />
    </BottomSheet>
  );
}

const BottomSheet = styled.div<{ $translateY: number; $isDragging: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  margin: 0 auto;
  height: ${EXPANDED_HEIGHT}px;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transform: translateY(${({ $translateY }) => $translateY}px);
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "transform 0.3s ease")};
  will-change: transform;
  z-index: 100;
`;

const HandleArea = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  cursor: grab;
  flex-shrink: 0;
  touch-action: none;
  
  &:active {
    cursor: grabbing;
  }
`;

const Handle = styled.div`
  width: 40px;
  height: 4px;
  background-color: #d0d0d0;
  border-radius: 2px;
  pointer-events: none;
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 20px 20px;
  overflow-y: auto;
  width: 320px;
  flex: 1;
  min-height: 0;
  
  /* 스크롤바 숨기기 (스크롤은 가능) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
