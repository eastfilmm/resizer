import { useState, useRef, useCallback } from "react";
import { styled } from "styled-components";
import CanvasPaddingSelector from "./CanvasPaddingSelector";
import CanvasBackgroundSelector from "./CanvasBackgroundSelector";
import GlassBlurSelector from "./GlassBlurSelector";
import CopyrightSelector from "./CopyrightSelector";
import ShadowSelector from "./ShadowSelector";

const COLLAPSED_HEIGHT = 28;
const EXPANDED_HEIGHT = 360;
const CLOSE_SNAP_THRESHOLD = 100;

export const BottomSection = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [currentHeight, setCurrentHeight] = useState(COLLAPSED_HEIGHT);
  const [hasOpened, setHasOpened] = useState(false);
  
  const startYRef = useRef(0);
  const startHeightRef = useRef(0);

  const handleDragMove = useCallback((clientY: number) => {
    const deltaY = startYRef.current - clientY;
    const newHeight = Math.max(
      COLLAPSED_HEIGHT,
      Math.min(EXPANDED_HEIGHT, startHeightRef.current + deltaY)
    );
    setCurrentHeight(newHeight);
    
    // 한번이라도 120px 이상 올라가면 열린 상태로 판단
    if (newHeight >= CLOSE_SNAP_THRESHOLD) {
      setHasOpened(true);
    }
  }, []);

  const handleDragEnd = useCallback(() => {
    // 열린 상태에서 120px 아래로 내리면 닫힘
    if (hasOpened && currentHeight < CLOSE_SNAP_THRESHOLD) {
      setCurrentHeight(COLLAPSED_HEIGHT);
      setHasOpened(false);
    }
    setIsDragging(false);
  }, [hasOpened, currentHeight]);

  const handlePointerDown = useCallback((clientY: number) => {
    startYRef.current = clientY;
    startHeightRef.current = currentHeight;
    setIsDragging(true);
  }, [currentHeight]);

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
    <BottomSheet $height={currentHeight} $isDragging={isDragging}>
      <HandleArea
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        <Handle />
      </HandleArea>
      <Content>
        <CanvasPaddingSelector />
        <CanvasBackgroundSelector />
        <GlassBlurSelector />
        <ShadowSelector />
        <CopyrightSelector />
      </Content>
    </BottomSheet>
  );
}

const BottomSheet = styled.div<{ $height: number; $isDragging: boolean }>`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  width: 100%;
  margin: 0 auto;
  height: ${({ $height }) => $height}px;
  background-color: #ffffff;
  border-radius: 16px 16px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  transition: ${({ $isDragging }) => ($isDragging ? "none" : "height 0.3s ease")};
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
  flex: 1;
  min-height: 0;
  
  /* 스크롤바 숨기기 (스크롤은 가능) */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE, Edge */
  
  &::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }
`;
