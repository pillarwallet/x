import React from 'react';
import styled from 'styled-components';

const Label = ({ children, htmlFor }: React.PropsWithChildren<{ htmlFor?: string }>) => {
  return (
    <StyledLabel htmlFor={htmlFor}>
      {children}
    </StyledLabel>
  )
}

const StyledLabel = styled.label`
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
  display: inline-block;
  margin-bottom: 6px;
  color: ${({ theme }) => theme.color.text.formLabel};
`;

export default Label
