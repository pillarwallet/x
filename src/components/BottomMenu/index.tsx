import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import {
  Home2 as IconHome,
  Send2 as IconSend,
  Wallet2 as IconWallet,
  Receipt1 as IconHistory,
  Element as IconApps,
} from 'iconsax-react';
import React, { useEffect } from 'react';
import { Transition } from 'react-transition-group';

// navigation
import { navigationRoute } from '../../navigation';

// hooks
import useBottomMenuModal from '../../hooks/useBottomMenuModal';
import useGlobalTransactionsBatch from '../../hooks/useGlobalTransactionsBatch';

// components
import BottomMenuModal from '../BottomMenuModal';

// theme
import { animation } from '../../theme';

const BottomMenu = () => {
  const { authenticated } = usePrivy();
  const navLocation = useLocation();
  const navigate = useNavigate();
  const [t] = useTranslation();
  const { active, showSend, showApps, showHistory, showAccount, hide } = useBottomMenuModal();
  const { transactions: globalTransactionsBatch } = useGlobalTransactionsBatch();
  const overlayRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    const localRef = overlayRef.current;
    if (!localRef) return;

    const handleOverlayClick = (e: Event) => {
      if (e.target !== localRef) return;
      hide();
      e.preventDefault();
    };

    localRef.addEventListener('click', handleOverlayClick);

    return () => {
      if (!localRef) return;
      localRef.removeEventListener('click', handleOverlayClick);
    };
  }, [overlayRef, hide]);

  if (!authenticated) return null;

  const isHomeActive = active === null
    && navLocation.pathname === navigationRoute.home;

  const menuItems = [
    {
      icon: <IconHome />,
      type: 'home',
      label: t`menuAction.home`,
    },
    {
      icon: <IconSend />,
      type: 'send',
      iconNotificationCounter: globalTransactionsBatch.length,
      label: t`menuAction.send`,
      show: showSend,
      color: '#8A77FF'
    },
    {
      icon: <IconHistory />,
      type: 'history',
      label: t`menuAction.history`,
      show: showHistory,
      color: '#77FFF9'
    },
    {
      icon: <IconWallet />,
      type: 'account',
      label: t`menuAction.account`,
      show: showAccount,
      color: '#D5FF48'
    },
    {
      icon: <IconApps />,
      type: 'apps',
      label: t`menuAction.apps`,
      show: showApps,
      color: '#3699FF'
    },
  ];

  return (
    <>
      <Wrapper>
        <BottomMenuModal />
        <MainMenuItems $modalVisible={!!active}>
          {menuItems.map((item, index) => {
            const isActiveItem = active?.type === item.type || (item.type === 'home' && isHomeActive);
            return (
              <MenuItem
                key={item.label + index}
                onClick={() => {
                  if (item.type === 'home') {
                    hide();
                    isHomeActive && navigate(navigationRoute.home);
                    return;
                  }

                  if (active?.type === item.type ) {
                    hide();
                    return;
                  }

                  if (item.show) item.show();
                }}
                className={isActiveItem ? 'active' : ''}
              >
                {item.type !== 'home' && item.color && <TopSliderIndicator $color={item.color} />}
                {item.icon}
                {!!item.iconNotificationCounter && (
                  <MenuItemNotification>{item.iconNotificationCounter}</MenuItemNotification>
                )}
                <MenuItemText>{item.label}</MenuItemText>
              </MenuItem>
            );
          })}
        </MainMenuItems>
      </Wrapper>
      <Transition nodeRef={overlayRef} in={!!active} timeout={100}>
        {(overlayState) => (
          <Overlay
            ref={overlayRef}
            $blur={overlayState === 'entered' ? 5 : 0}
            $display={overlayState !== 'exited'}
          />
        )}
      </Transition>
    </>
  );
}

const MenuItemText = styled.span`
  display: none;
  margin-left: 10px;
`;

const MenuItemNotification = styled.div`
  position: absolute;
  top: 6px;
  left: 2px;
  background: ${({ theme }) => theme.color.background.contentNotification};
  color: ${({ theme }) => theme.color.text.contentNotification};
  text-align: center;
  height: 15px;
  min-width: 15px;
  border-radius: 3px;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${animation.pulse(0.85, 1)} 2s infinite;
`;

const TopSliderIndicator = styled.div<{ $color: string }>`
  display: none;
  position: absolute;
  top: -3px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 3px;
  height: 3px;
  background: ${({ $color }) => $color};
  width: 20px;
`;

const MenuItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  cursor: pointer;
  transition: all .1s ease-in-out;
  letter-spacing: -0.5px;
  font-size: 14px;
  user-select: none;
  padding: 0 7px;
  height: 100%;

  &.active ${TopSliderIndicator} {
    display: block;
  }

  &:first-child {
    margin-left: 17px;
  }

  &:last-child {
    margin-right: 17px;
  }
`;

const Wrapper = styled.div`
  margin: 0 auto;
  position: fixed;
  bottom: 22px;
  left: 50%;
  z-index: 100;
  width: 338px;
  transform: translateX(-50%);
  border: 1px solid ${({ theme }) => theme.color.border.bottomMenu};
  background: ${({ theme }) => theme.color.background.bottomMenu};
  border-radius: 20px;
  overflow: hidden;
  backdrop-filter: blur(15px);
`;

const MainMenuItems = styled.div<{ $modalVisible?: boolean }>`
  position: relative;
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 7px;
  height: 45px;
  width: 100%;
  ${({ $modalVisible, theme }) => $modalVisible && `
    height: 48px;
    border-top: 3px solid ${theme.color.border.bottomMenu};
  `};

  &:not(&:hover) ${MenuItem}.active, ${MenuItem}:hover {
    color: ${({ theme }) => theme.color.text.bottomMenuItemActive};
    padding: 0 15px;
    margin: 0;

    ${TopSliderIndicator} {
      width: 32px;
      transform: translateX(calc(-50% + 5px));
    }

    ${MenuItemNotification} {
      left: 10px;
    }

    ${MenuItemText} {
      display: block;
    }
  }
`;

const Overlay = styled.div<{
  $blur: number;
  $display: boolean;
}>`
  position: fixed;
  z-index: 98;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  transition: 100ms linear;
  backdrop-filter: blur(${({ $blur }) => $blur}px);
  display: ${({ $display }) => $display ? 'flex' : 'none'};
  align-items: flex-end;
  justify-content: center;
  padding-bottom: 114px;
  overflow: hidden;
`;

export default BottomMenu;
