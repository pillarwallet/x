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
    }

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
    <>
      {!iconLoaded && <AppIconSkeleton />}
      <AppIconImage ref={imageRef} src={iconSrc} $display={iconLoaded} />
    </>
  );
};

const AppIconImage = styled.img<{ $display: boolean }>`
  display: ${({ $display }) => $display ? 'block' : 'none'};
  max-width: 100%;
  border-radius: 20px;
`;

const AppIconSkeleton = styled.div`
  animation: ${animation.skeleton} 1s linear infinite alternate;
  height: 100%;
  border-radius: 20px;
`;


export default AppIcon;
