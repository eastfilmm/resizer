import styled from 'styled-components';
import { COLOR_GRAY_TEXT, DESKTOP_MEDIA_QUERY } from './theme';

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;

  @media ${DESKTOP_MEDIA_QUERY} {
    max-width: 700px;
    margin: 0 auto;
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px 12px 12px 12px;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
`;

export const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: bold;
  color: #333;

  @media (max-width: 480px) {
    font-size: 1rem;
  }
`;

export const SubTitle = styled.h2`
  font-size: 0.75rem;
  font-weight: normal;
  color: ${COLOR_GRAY_TEXT};
`;
