// types
import { Projection, TokensMarketData } from '../../../../types/api';

// components
import TileContainer from '../TileContainer/TileContainer';
import TileTitle from '../TileTitle/TitleTitle';
import TokenMarketDataRow from '../TokenMarketDataRow/TokenMarketDataRow';

type TokensWithMarketDataTileProps = {
  data: Projection | undefined;
  isDataLoading: boolean;
};

const TokensWithMarketDataTile = ({
  data,
  isDataLoading,
}: TokensWithMarketDataTileProps) => {
  const { data: tokensWithMarketData } = data || {};

  const dataTokens = tokensWithMarketData as TokensMarketData | undefined;

  // Limit the rows to the first 8 items
  const limitedRows = dataTokens?.rows?.slice(0, 8) || [];

  // Divide the rows into two separate columns
  const leftColumn = limitedRows.slice(0, 4);
  const rightColumn = limitedRows.slice(4, 8);

  if (!data || !dataTokens?.rows?.length || isDataLoading) {
    return null;
  }

  return (
    // TO DO - replace the background with container background color once this has changed on Design
    <TileContainer
      id="tokens-with-market-data-tile"
      className="bg-[#1E1D24] flex-col p-8 gap-8 mobile:gap-6 mobile:px-3 mobile:pt-2.5 mobile:pb-6"
    >
      <TileTitle
        title={dataTokens?.title?.text}
        leftDecorator={dataTokens?.title?.leftDecorator}
        rightDecorator={dataTokens?.title?.rightDecorator}
      />

      <div className="grid grid-cols-1 desktop:grid-cols-2 desktop:gap-x-4 w-full">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={`row-${i}`} className="contents">
            {leftColumn[i] && (
              <TokenMarketDataRow
                key={`l-${i}`}
                data={leftColumn[i]}
                listNumber={i + 1}
              />
            )}
            {rightColumn[i] && (
              <TokenMarketDataRow
                key={`r-${i}`}
                data={rightColumn[i]}
                listNumber={i + 5}
              />
            )}
          </div>
        ))}
      </div>
    </TileContainer>
  );
};

export default TokensWithMarketDataTile;
