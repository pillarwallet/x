import styled from 'styled-components';

const Button = styled.button<{ fullWidth?: boolean }>`
  font-size: 18px;
  font-weight: 700;
  padding: 15px 45px;
  border: none;
  border-radius: 100px;
  background: ${({ theme }) => theme.color.background.buttonPrimary};
  color: ${({ theme }) => theme.color.text.buttonPrimary};
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  margin-bottom: 15px;
  
  ${({ fullWidth }) => fullWidth && `
    width: 100%;
  `}

  &:hover {
    opacity: 0.7;
  }

  &:active {
    opacity: 0.4;
  }

  &:focus {
    outline: none;
  }
`;

export default Button;
