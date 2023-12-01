import React from 'react';
import styled from 'styled-components';

import lobbyItemsAsBgImage from '../assets/images/dummy/lobby-items-as-bg.png';

const Lobby = () => {
  return (
    <DummyContent />
  );
}

const DummyContent = styled.div`
  height: 140vh; // higher height for display purpose
  width: 560px;
  max-width: 100%;
  background: url(${lobbyItemsAsBgImage}) repeat-y top center;
  background-size: contain;
`;

export default Lobby;
