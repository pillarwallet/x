import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const HelloWorldText = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 30px;
`;

const App = () => {
  const [t] = useTranslation();
  return (
    <HelloWorldText>
      {t`common.helloWorld`}
    </HelloWorldText>
  );
}

export default App;
