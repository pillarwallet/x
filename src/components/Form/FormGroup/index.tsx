/* eslint-disable @typescript-eslint/no-use-before-define */
import React from 'react';
import styled from 'styled-components';

const FormGroup = ({ children }: React.PropsWithChildren) => {
  return <Wrapper>{children}</Wrapper>;
};

const Wrapper = styled.div`
  margin-bottom: 20px;

  &:last-child {
    margin-bottom: 0;
  }
`;

export default FormGroup;
