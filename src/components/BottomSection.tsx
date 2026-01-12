import { styled } from "styled-components";
import CanvasPaddingSelector from "./CanvasPaddingSelector";
import CanvasBackgroundSelector from "./CanvasBackgroundSelector";
import GlassBlurSelector from "./GlassBlurSelector";
import CopyrightSelector from "./CopyrightSelector";

export const BottomSection = () => {
  return (
    <Wrapper>
      <CanvasPaddingSelector />
      <CanvasBackgroundSelector />
      <GlassBlurSelector />
      <CopyrightSelector />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 10px;
  width: 100%;
  padding: 10px;
  max-width: 320px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;