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
  font-size: 15px;
  font-weight: 700;
  margin-bottom: 24px;
`;

export default Label
