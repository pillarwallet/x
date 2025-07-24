/* eslint-disable @typescript-eslint/no-use-before-define */
import { Element as IconApps } from 'iconsax-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

// components
import AppIcon from './AppIcon';
import Label from './Form/Label';
import SkeletonLoader from './SkeletonLoader';

// types
import { AppManifest } from '../types';

// hooks
import useAllowedApps from '../hooks/useAllowedApps';
import useBottomMenuModal from '../hooks/useBottomMenuModal';
import useTransactionKit from '../hooks/useTransactionKit';

// services
import { useRecordPresenceMutation } from '../services/pillarXApiPresence';

// utils
import { loadApps } from '../apps';

const AppsList = ({ hideTitle = false }: { hideTitle?: boolean }) => {
  const [apps, setApps] = React.useState<Record<string, AppManifest>>({});
  const navigate = useNavigate();
  const { setIsAnimated } = useAllowedApps();
  const { hide } = useBottomMenuModal();
  const { isLoading: isLoadingAllowedApps, allowed } = useAllowedApps();
  const [t] = useTranslation();
  const { walletAddress: accountAddress } = useTransactionKit();
  /**
   * Import the recordPresence mutation from the
   * pillarXApiPresence service. We use this to
   * collect data on what apps are being opened
   */
  const [recordPresence] = useRecordPresenceMutation();

  React.useEffect(() => {
    const fetchApps = async () => {
      const loadedApps = loadApps(allowed);
      setApps(await loadedApps);
    };
    fetchApps();
  }, [allowed]);

  return (
    <Wrapper id="apps-modal">
      {!hideTitle && (
        <ModalTitle>
          <IconApps size={18} />
          {t`title.apps`}
        </ModalTitle>
      )}
      <ExploreAppsCard>
        <ExploreAppsCardTitle>Explore Apps</ExploreAppsCardTitle>
        <ExploreAppsCardContent>
          Discover new apps and services
        </ExploreAppsCardContent>
      </ExploreAppsCard>
      <Label>{t`label.latestApps`}</Label>
      <AppsListWrapper id="apps-list">
        {isLoadingAllowedApps && (
          <>
            <SkeletonLoader $height="94px" $width="94px" />
            <SkeletonLoader $height="94px" $width="94px" />
            <SkeletonLoader $height="94px" $width="94px" />
            <SkeletonLoader $height="94px" $width="94px" />
            <SkeletonLoader $height="94px" $width="94px" />
          </>
        )}
        {!isLoadingAllowedApps &&
          Object.keys(apps).map((appId) => (
            <AppListItem
              id="app-list-item"
              key={appId}
              onClick={() => {
                hide();
                // Fire (and forget) the recordPresence mutation
                recordPresence({
                  address: accountAddress,
                  action: 'appOpened',
                  value: appId,
                });
                setIsAnimated(true);
                // eslint-disable-next-line prefer-template
                navigate('/' + appId);
              }}
            >
              <AppIcon appId={appId} />
              <AppTitle>{apps[appId].title}</AppTitle>
            </AppListItem>
          ))}
      </AppsListWrapper>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  max-height: 100%;
  width: 100%;
  overflow-y: scroll;
`;

const AppsListWrapper = styled.div`
  display: flex;
  gap: 7px;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
`;

const ModalTitle = styled.div`
  margin: 5px 0 35px;
  font-size: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 9px;
`;

const AppListItem = styled.div`
  width: 94px;
  border-radius: 6px;
  overflow: hidden;
  transition: all 0.1s ease-in-out;
  cursor: pointer;
  padding: 4px;
  background: ${({ theme }) => theme.color.background.card};

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

const AppTitle = styled.p`
  font-size: 11px;
  color: ${({ theme }) => theme.color.text.cardTitle};
  padding: 8px 6px 8px;
  word-break: break-word;
`;

const ExploreAppsCard = styled.div`
  padding: 14px;
  background: ${({ theme }) => theme.color.background.exploreAppsCard};
  margin-bottom: 14px;
  border-radius: 10px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ExploreAppsCardTitle = styled.p`
  color: ${({ theme }) => theme.color.text.cardTitle};
  margin-bottom: 5px;
  font-size: 14px;
`;

const ExploreAppsCardContent = styled.p`
  color: ${({ theme }) => theme.color.text.cardContent};
  font-size: 12px;
  font-weight: 400;
`;

export default AppsList;
