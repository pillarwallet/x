import React from 'react';
import styled from 'styled-components';

import lobbyItemsAsBgImage from '../assets/images/dummy/lobby-items-as-bg.png';

const Lobby = () => {
  return (
    <DummyContent />
  );
}

const DummyContent = styled.div`
  height: 100vh;
  width: 560px;
  background: url(${lobbyItemsAsBgImage}) no-repeat center center;
  background-size: contain;
`;

export default Lobby;
