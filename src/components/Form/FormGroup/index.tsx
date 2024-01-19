import React from 'react'
import styled from 'styled-components';

const FormGroup = ({ children }: React.PropsWithChildren) => {
  return (
    <Wrapper>
      {children}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
`;

export default FormGroup
