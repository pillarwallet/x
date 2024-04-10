import styled from 'styled-components';
import { useState } from 'react';
import { TokenListToken } from '@etherspot/prime-sdk/dist/sdk/data';

// components
import IdenticonImage from './IdenticonImage';

// utils
import { getLogoForChainId } from '../utils/blockchain';

// images
import unknownAssetImage from '../assets/images/logo-unknown.png';

const ChainAssetIcon = ({
  asset,
  chainId,
}: {
  asset: TokenListToken | undefined;
  chainId: number;
}) => {
  const chainLogo = getLogoForChainId(chainId);
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  return (
    <Wrapper>
      <AssetIconWrapper>
      {!!asset?.logoURI && !useFallbackImage && (
        <AssetIcon
          src={asset.logoURI}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            setUseFallbackImage(true);
          }}
        />
      )}
      {(!asset?.logoURI || useFallbackImage) && !!asset?.address && <IdenticonImage text={asset.address} />}
      {(!asset || useFallbackImage) && <AssetIcon src={unknownAssetImage} />}
      </AssetIconWrapper>
      <ChainIcon src={chainLogo} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  position: relative;
`;

const AssetIconWrapper = styled.div`
  border-radius: 50%;
  overflow: hidden;
  height: 32px;
  width: 32px;
`;

const AssetIcon = styled.img``;

const ChainIcon = styled.img`
  border-radius: 50%;
  height: 15px;
  width: 15px;
  position: absolute;
  bottom: 0;
  right: -5px;
  border: 1px solid ${({ theme }) => theme.color.border.groupedIconsSmaller};
`;

export default ChainAssetIcon;
