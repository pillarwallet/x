import styled from 'styled-components';

const Button = styled.button<{ $fullWidth?: boolean; $fontSize?: number }>`
  font-size: ${({ $fontSize }) => $fontSize ?? 18}px;
  font-weight: 700;
  padding: 15px 45px;
  border: none;
  border-radius: 100px;
  background: ${({ theme, disabled }) =>  disabled
    ? theme.color.background.buttonPrimaryDisabled
    : theme.color.background.buttonPrimary
  };
  color: ${({ theme, disabled }) =>  disabled
    ? theme.color.text.buttonPrimaryDisabled
    : theme.color.text.buttonPrimary
  };
  transition: all 0.2s ease-in-out;
  margin-bottom: 15px;
  
  ${({ $fullWidth }) => $fullWidth && `
    width: 100%;
  `}

  ${({ disabled }) => !disabled && `
    cursor: pointer;
  
    &:hover {
      opacity: 0.7;
    }
  
    &:active {
      opacity: 0.4;
    }
  `}

  &:focus {
    outline: none;
  }
`;

export default Button;
