import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';

// images
import { ReactComponent as IconSend } from '../../assets/images/icon/icon-send.svg';
import { ReactComponent as IconHistory } from '../../assets/images/icon/icon-history.svg';
import { ReactComponent as IconApps } from '../../assets/images/icon/icon-apps.svg';
import { ReactComponent as IconWallet } from '../../assets/images/icon/icon-wallet.svg';
import { ReactComponent as IconHome } from '../../assets/images/icon/icon-home.svg';

// navigation
import { navigationRoute } from '../../navigation';

const BottomMenu = () => {
  const { authenticated } = usePrivy();
  const navigate = useNavigate();
  const [t] = useTranslation();

  if (!authenticated) return null;

  return (
    <Wrapper>
      <HomeMenuItem>
        <MenuItem onClick={() => navigate(navigationRoute.home)}>
          <IconHome />
        </MenuItem>
      </HomeMenuItem>
      <MainMenuItems>
        <MenuItem>
          <IconSend />
          <span>{t`menuAction.send`}</span>
        </MenuItem>
        <MenuItem>
          <IconHistory />
          <span>{t`menuAction.history`}</span>
        </MenuItem>
        <MenuItem>
          <IconWallet />
          <span>{t`menuAction.account`}</span>
        </MenuItem>
        <MenuItem onClick={() => navigate(navigationRoute.apps)}>
          <IconApps />
          <span>{t`menuAction.apps`}</span>
        </MenuItem>
      </MainMenuItems>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  max-width: 800px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  transform: translateX(-50%);
`;

const MainMenuItems = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  backdrop-filter: blur(5px);
  background: ${({ theme }) => theme.color.background.bottomMenu};
  border-radius: 130px;
  padding: 6px 7px;
  width: 280px;
  height: 60px;
`;

const MenuItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  height: 48px;
  overflow: hidden;
  cursor: pointer;
  transition: all .1s ease-in-out;
  font-weight: 400;
  letter-spacing: -0.5px;
  font-size: 14px;

  &:first-child {
    margin-left: 17px;
  }

  &:last-child {
    margin-right: 17px;
  }

  span {
    display: none;
  }

  &:hover {
    padding: 0 13px;
    margin: 0;
    border-radius: 100px;
    background: ${({ theme }) => theme.color.background.bottomMenuItemHover};
    
    span {
      display: block;
    }
  }
`;

const HomeMenuItem = styled(MainMenuItems)`
  flex: none;
  width: 60px;
  height: 60px;

  ${MenuItem} {
    width: 48px;

    &:first-child, &:last-child {
      margin: 0
    }

    &:hover {
      padding: 0;
    }
  }
`;

export default BottomMenu;
