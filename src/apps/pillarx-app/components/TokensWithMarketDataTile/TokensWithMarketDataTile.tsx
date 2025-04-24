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

  if (!data || !dataTokens?.rows?.length || isDataLoading) {
    return null;
  }

  const dataLength = dataTokens.rows.length;
  const midLength = Math.ceil(dataLength / 2);

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
      <div className="w-full">
        {/* Mobile: 1 column */}
        <div className="flex flex-col gap-4 desktop:hidden">
          {dataTokens.rows.map((row, index) => (
            <TokenMarketDataRow
              key={`mobile-${index}`}
              data={row}
              listNumber={index + 1}
              isMiddleNumber={index + 1 === midLength}
              isLastNumber={index + 1 === dataLength}
            />
          ))}
        </div>

        {/* Desktop: 2 columns */}
        <div className="hidden desktop:grid desktop:grid-cols-2 desktop:gap-x-14 desktop:gap-y-4 w-full">
          {Array.from({ length: midLength }).map((_, i) => (
            <div key={`row-${i}`} className="contents">
              {dataTokens?.rows?.slice(0, midLength)[i] && (
                <TokenMarketDataRow
                  key={`l-${i}`}
                  data={dataTokens?.rows?.slice(0, midLength)[i]}
                  listNumber={i + 1}
                  isMiddleNumber={i + 1 === midLength}
                  isLastNumber={i + 1 === dataLength}
                />
              )}
              {dataTokens?.rows?.slice(midLength, dataTokens.rows.length)[
                i
              ] && (
                <TokenMarketDataRow
                  key={`r-${i}`}
                  data={
                    dataTokens?.rows?.slice(midLength, dataTokens.rows.length)[
                      i
                    ]
                  }
                  listNumber={i + 1 + midLength}
                  isMiddleNumber={i + 1 === midLength}
                  isLastNumber={i + 1 + midLength === dataLength}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </TileContainer>
  );
};

export default TokensWithMarketDataTile;
