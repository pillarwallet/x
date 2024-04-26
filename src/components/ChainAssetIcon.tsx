import styled from 'styled-components';
import { TokenListToken } from '@etherspot/prime-sdk/dist/sdk/data';

// utils
import { getLogoForChainId } from '../utils/blockchain';

// images
import ImageWithFallback from './ImageWithFallback';

const ChainAssetIcon = ({
  asset,
  chainId,
}: {
  asset: TokenListToken | undefined;
  chainId: number;
}) => {
  const chainLogo = getLogoForChainId(chainId);

  return (
    <Wrapper>
      <AssetIconWrapper>
        <ImageWithFallback src={asset?.logoURI} alt={asset?.address} />
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
