import { usePrivy } from '@privy-io/react-auth';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// images
import { ReactComponent as IconApps } from '../../assets/images/icon/icon-apps.svg';
import { ReactComponent as IconHistory } from '../../assets/images/icon/icon-history.svg';
import { ReactComponent as IconHome } from '../../assets/images/icon/icon-home.svg';
import { ReactComponent as IconSend } from '../../assets/images/icon/icon-send.svg';
import { ReactComponent as IconWallet } from '../../assets/images/icon/icon-wallet.svg';

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

  if (!authenticated) return null;

  const menuItems = [
    {
      icon: <IconSend />,
      type: 'send',
      iconNotificationCounter: globalTransactionsBatch.length,
      label: t`menuAction.send`,
      show: showSend,
    },
    {
      icon: <IconHistory />,
      type: 'history',
      label: t`menuAction.history`,
      show: showHistory,
    },
    {
      icon: <IconWallet />,
      type: 'account',
      label: t`menuAction.account`,
      show: showAccount,
    },
    {
      icon: <IconApps />,
      type: 'apps',
      label: t`menuAction.apps`,
      show: showApps,
    },
  ];

  const isHomeActive = active === null
    && navLocation.pathname === '/';

  return (
    <>
      <Wrapper>
        <HomeMenuItem>
          <MenuItem
            onClick={() => navigate(navigationRoute.home)}
            className={isHomeActive ? 'active' : ''}
          >
            <IconHome />
          </MenuItem>
        </HomeMenuItem>
        <MainMenuItems>
          {menuItems.map((item, index) => (
            <MenuItem
              key={item.label + index}
              onClick={() => {
                if (active?.type === item.type) {
                  hide();
                  return;
                }
                item.show();
              }}
              className={active?.type === item.type ? 'active' : ''}
            >
              {item.icon}
              {!!item.iconNotificationCounter && (
                <MenuItemNotification>{item.iconNotificationCounter}</MenuItemNotification>
              )}
              <span>{item.label}</span>
            </MenuItem>
          ))}
        </MainMenuItems>
      </Wrapper>
      <BottomMenuModal
        activeMenuItem={active}
        onClose={hide}
      />
    </>
  );
}

const MenuItemNotification = styled.div`
  position: absolute;
  transition: all .1s ease-in-out;
  bottom: -4px;
  left: 15px;
  background: ${({ theme }) => theme.color.background.bottomMenuItemNotification};
  padding: 2px;
  text-align: center;
  width: 17px;
  height: 17px;
  border-radius: 50%;
  color: #fff;
  font-size: 10px;
  box-shadow: 0 0 0 0 rgba(0, 0, 0, 1);
  transform: scale(1);
  animation: ${animation.pulse(0.85, 1)} 2s infinite;
`;

const MenuItem = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  color: ${({ theme }) => theme.color.text.bottomMenuItem};
  height: 48px;
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
`;

const Wrapper = styled.div`
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  position: fixed;
  bottom: 40px;
  left: 50%;
  z-index: 100;
  transform: translateX(-50%);

  &:not(&:hover) ${MenuItem}.active, ${MenuItem}:hover {
    padding: 0 13px;
    margin: 0;
    border-radius: 100px;
    background: ${({ theme }) => theme.color.background.bottomMenuItemHover};
    
    ${MenuItemNotification} {
      left: 28px;
    }

    span {
      display: block;
    }
  }
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
