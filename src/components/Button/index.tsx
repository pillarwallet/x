import styled from 'styled-components';

const Button = styled.button<{
  $fullWidth?: boolean;
  $fontSize?: number;
  $secondary?: boolean;
  $last?: boolean;
  $small?: boolean;
}>`
  font-size: ${({ $fontSize, $small }) => $fontSize ?? ($small ? 12: 14)}px;
  font-weight: 500;
  border-radius: 6px;
  background: ${({ theme, disabled, $secondary }) =>  disabled
    ? theme.color.background[$secondary ? 'buttonSecondaryDisabled' : 'buttonPrimaryDisabled']
    : theme.color.background[$secondary ? 'buttonSecondary' : 'buttonPrimary']
  };
  color: ${({ theme, disabled, $secondary }) =>  disabled
    ? theme.color.text[$secondary ? 'buttonSecondaryDisabled' : 'buttonPrimaryDisabled']
    : theme.color.text[$secondary ? 'buttonSecondary' : 'buttonPrimary']
  };
  transition: all 0.2s ease-in-out;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  gap: 8px;
  
  margin-bottom: ${({ $last }) => $last ? 0 : 15}px;
  &:last-child {
    margin-bottom: 0;
  }
  
  ${({ $secondary, $small, theme }) => `
    border: ${$secondary ? `1px solid ${theme.color.border.buttonSecondary}` : 'none'};
    padding: ${$small ? 7 : 15 - ($secondary ? 1 : 0)}px;
  `}
  
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
