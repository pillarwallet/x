import React from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

// types
import { AppManifest, RecordPerKey } from '../../types';

// apps
import { loadApps } from '../../apps';

// components
import AppIcon from '../AppIcon';

// hooks
import useBottomMenuModal from '../../hooks/useBottomMenuModal';

const AppsModal = () => {
  const [apps, setApps] = React.useState<RecordPerKey<AppManifest>>({});
  const navigate = useNavigate();
  const { hide } = useBottomMenuModal();

  React.useEffect(() => {
    const loadedApps = loadApps();
    setApps(loadedApps);
  }, []);

  return (
    <Wrapper>
      {Object.keys(apps).map((appId) => (
        <AppListItem
          key={appId}
          onClick={() => {
            hide();
            navigate('/' + appId);
          }}
        >
          <AppIcon appId={appId} />
        </AppListItem>
      ))}
    </Wrapper>
  )
}

const Wrapper = styled.div`
  display: flex;
  gap: 15px;
  flex-direction: row;
  align-content: flex-start;
  justify-content: flex-start;
  flex-wrap: wrap;
  width: 100%;
  min-height: 100%;
`;

const AppListItem = styled.div`
  width: 90px;
  height: 90px;
  border-radius: 20px;
  overflow: hidden;
  transition: all .1s ease-in-out;
  cursor: pointer;

  &:hover {
    transform: scale(1.1);
    opacity: 0.9;
  }
`;

export default AppsModal;
