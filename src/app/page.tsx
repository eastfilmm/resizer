'use client';

import styled from 'styled-components';

const Container = styled.div`
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
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
  }
`;

const Main = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 20px;
  
  @media (max-width: 480px) {
    font-size: 1.5rem;
  }
`;

const Description = styled.p`
  font-size: 1rem;
  color: #666;
  line-height: 1.6;
  margin-bottom: 30px;
  max-width: 320px;
`;

const Button = styled.button`
  background-color: #007bff;
  color: white;
  border: none;
  padding: 16px 32px;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  
  &:hover {
    background-color: #0056b3;
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

export default function Home() {
  return (
    <Container>
      <Main>
        <Title>Resizer App</Title>
        <Description>
          모바일에 최적화된 이미지 리사이징 서비스를 시작해보세요.
        </Description>
        <Button>시작하기</Button>
      </Main>
    </Container>
  );
}
