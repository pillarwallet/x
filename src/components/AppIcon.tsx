/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useEffect } from 'react';
import styled from 'styled-components';

// theme
import { animation } from '../theme';

const AppIcon = ({ appId }: { appId: string }) => {
  const [iconSrc, setIconSrc] = React.useState<string | undefined>(undefined);
  const [iconLoaded, setIconLoaded] = React.useState<boolean>(false);
  const imageRef = React.useRef<HTMLImageElement>(null);

  useEffect(() => {
    const loadIconSrc = async () => {
      const icon = await import(`../apps/${appId}/icon.png`);
      setIconSrc(icon.default);
    };

    loadIconSrc();
  }, [appId]);

  useEffect(() => {
    if (!imageRef.current || !iconSrc) return;

    if (imageRef.current.complete) {
      setIconLoaded(true);
      return;
    }

    imageRef.current.onload = () => setIconLoaded(true);
  }, [imageRef, iconSrc]);

  return (
    <AppIconWrapper>
      {!iconLoaded && <AppIconSkeleton />}
      <AppIconImage ref={imageRef} src={iconSrc} $display={iconLoaded} />
    </AppIconWrapper>
  );
};

const AppIconWrapper = styled.div`
  width: 86px;
  height: 86px;
  border-radius: 4px;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.color.background.card};
`;

const AppIconImage = styled.img<{ $display: boolean }>`
  display: ${({ $display }) => ($display ? 'block' : 'none')};
  max-width: 100%;
`;

const AppIconSkeleton = styled.div`
  animation: ${animation.skeleton} 1s linear infinite alternate;
  width: 86px;
  height: 86px;
`;

export default AppIcon;
