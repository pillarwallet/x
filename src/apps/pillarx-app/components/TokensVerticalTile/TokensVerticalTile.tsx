// types
import { Projection, TokenData } from '../../../../types/api';

// components
import TileContainer from '../TileContainer/TileContainer';

import TokensVerticalList from '../TokensVerticalList/TokensVerticalList';
import Body from '../Typography/Body';

type TokensVerticalTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const TokensVerticalTile = ({
  data,
  isDataLoading,
}: TokensVerticalTileProps) => {
  const { data: dataTokens, meta } = data || {};

  const dataTokensVertical = dataTokens as TokenData[] | undefined;
  const dataLeft = dataTokensVertical?.slice(0, 3) || [];
  const dataRight = dataTokensVertical?.slice(3, 6) || [];

  if (!data || !dataTokensVertical?.length || isDataLoading) {
    return null;
  }

  return (
    <TileContainer
      id="tokens-vertical-tile"
      className="flex-col px-10 pt-[30px] pb-5 tablet:p-5 mobile:p-0 mobile:bg-[#1F1D23]"
    >
      {meta?.display?.title && (
        <Body className="text-purple_light">{meta.display.title}</Body>
      )}
      <div className="flex mobile:flex-col">
        <TokensVerticalList position="left" data={dataLeft} />
        <TokensVerticalList position="right" data={dataRight} />
      </div>
    </TileContainer>
  );
};

export default TokensVerticalTile;
