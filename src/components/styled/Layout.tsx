import styled from 'styled-components';

export const Container = styled.div`
  min-height: 100vh;
  width: 100vw;
  max-width: 100vw;
  overflow-x: hidden;
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
`;

export const Title = styled.h1`
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 10px;
  
  @media (max-width: 480px) {
    font-size: 1.25rem;
  }
`;
