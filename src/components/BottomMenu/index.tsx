import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { MdAccountBalance, MdApps } from 'react-icons/md';
import { PiPaperPlaneTiltFill } from 'react-icons/pi';
import { FaHistory } from 'react-icons/fa';
import { usePrivy } from '@privy-io/react-auth';

// navigation
import { navigationRoute } from '../../navigation';

const BottomMenu = () => {
  const { authenticated } = usePrivy();
  const navigate = useNavigate();

  if (!authenticated) return null;

  return (
    <Wrapper>
      <MenuItemFullHeight>
        <MenuItem onClick={() => navigate(navigationRoute.home)}>
          <MdAccountBalance size={25} />
        </MenuItem>
      </MenuItemFullHeight>
      <MenuItemFullHeight>
        <MenuItem>
          <PiPaperPlaneTiltFill size={21} />
        </MenuItem>
      </MenuItemFullHeight>
      <MenuItemFullHeight>
        <MenuItem>
          <FaHistory size={21} />
        </MenuItem>
      </MenuItemFullHeight>
      <MenuItemFullHeight onClick={() => navigate(navigationRoute.apps)}>
        <MenuItem>
          <MdApps size={25} />
        </MenuItem>
      </MenuItemFullHeight>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 45px;
  position: fixed;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  backdrop-filter: blur(13px);
  box-shadow: 7px 9px 59px 4px rgba(0,0,0,0.45);
  background: ${({ theme }) => theme.color.background.bottomMenu};
  border-radius: 36px;
  padding: 0 55px;
  
  @media (max-width: 800px) {
    width: calc(100% - 40px);
    bottom: 20px;
    gap: 35px;
  }
`;

const MenuItemFullHeight = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 35px 0;

  &:hover {
    span {
      transform: scale(2);
      background: none;
    }

    &:before {
      width: 72px;
      height: 6px;
      background: ${({ theme }) => theme.color.border.bottomMenuItemBottomActive};
      content: '';
      position: absolute;
      bottom: 0;
      left: -10px;
      display: block;
      border-radius: 6px;
    }
  }
`;

const MenuItem = styled.span`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background.bottomMenuItem};
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  height: 50px;
  width: 50px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: all .1s ease-in-out;
`;

export default BottomMenu;
