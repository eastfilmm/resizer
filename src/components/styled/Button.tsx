import styled from 'styled-components';

interface ButtonProps {
  $variant?: 'primary' | 'secondary';
}

export const Button = styled.button<ButtonProps>`
  background-color: ${props => props.$variant === 'secondary' ? '#6c757d' : '#28a745'};
  color: white;
  border: none;
  font-size: 1rem;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  touch-action: manipulation;
  width: 100%;
  height: 40px;
  
  &:hover {
    background-color: ${props => props.$variant === 'secondary' ? '#5a6268' : '#218838'};
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  &:disabled {
    background-color: #6c757d;
    cursor: not-allowed;
  }
`;

export const IconButton = styled(Button)`
  width: 40px !important;
  min-width: 40px;
  max-width: 40px;
  height: 40px;
  flex: 0 0 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const ButtonIcon = styled.img`
  width: 20px;
  height: 20px;
  filter: brightness(0) invert(1);
`;
