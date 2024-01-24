import React from 'react';
import styled from 'styled-components';

const TextInput = ({ onValueChange, rightAddon, ...props }: {
  onValueChange: (value: string) => void;
  rightAddon?: React.ReactNode;
} & React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <Wrapper>
      <StyledTextInput
        type="text"
        onChange={(e) => onValueChange(e?.target?.value ?? '')}
        {...props}
      />
      {rightAddon}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  padding: 17px;
  border-radius: 10px;
  background: ${({ theme }) => theme.color.background.input};
  color: ${({ theme }) => theme.color.text.input};
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  user-select: none;
`;

const StyledTextInput = styled.input`
  background: transparent;
  color: ${({ theme }) => theme.color.text.input};
  border: none;
  font-size: 14px;
  font-weight: 400;
  flex: 1;

  &:focus {
    outline: none;
  }

  &::placeholder {
    color: ${({ theme }) => theme.color.text.inputPlaceholder};
  }

`;

export default TextInput;
