import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MdAccountBalance, MdApps } from 'react-icons/md';
import { PiPaperPlaneTiltFill } from 'react-icons/pi';
import { FaHistory } from "react-icons/fa";
import { usePrivy } from '@privy-io/react-auth';

import { navigationRoute } from '../navigation';

const BottomMenu = () => {
  const { authenticated } = usePrivy();
  const navigate = useNavigate();

  if (!authenticated) return null;

  return (
    <Wrapper>
      <MenuItem onClick={() => navigate(navigationRoute.home)}>
        <MdAccountBalance size={30} />
      </MenuItem>
      <MenuItem>
        <PiPaperPlaneTiltFill size={26} />
      </MenuItem>
      <MenuItem>
        <FaHistory size={26} />
      </MenuItem>
      <MenuItem>
        <MdApps size={30} />
      </MenuItem>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
`;

const MenuItem = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background.bottomMenuItem};
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  border-radius: 16px;
  height: 60px;
  width: 60px;
  overflow: hidden;
  box-shadow: 7px 9px 59px 4px rgba(0,0,0,0.45);
  cursor: pointer;
  
  &:hover {
    opacity: 0.5;
  }
  
  &:active {
    opacity: 0.2;
  }
`;

export default BottomMenu;
