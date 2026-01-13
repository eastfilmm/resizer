import styled from 'styled-components';

export const Container = styled.div`
  height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  
  @media (min-width: 768px) {
    max-width: 428px;
    margin: 0 auto;
  }
`;

export const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  gap: 12px;
  overflow: hidden;
  min-height: 0;
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;

export const SubTitle = styled.h2`
  font-size: 0.875rem;
  font-weight: normal;
  color: #666;
`;