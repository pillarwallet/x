import { memo } from 'react';

// components
import CurrencyLogo from '../../CurrencyLogo';

// utils
import { networkColors } from '../../../constants/networkColors';

import { Dots, Arrow, Layout, Icon, Network, Name, TickerFlexBox } from '../styles';

interface IProps {
  hide: boolean;
  onClick: () => void;
  currency: Record<string, string> | null;
}

const Dropdown = memo(function Dropdown({ hide, onClick, currency }: IProps): JSX.Element {
  const symbol = currency?.ticker;
  const tickerLength = currency?.ticker?.length;

  return (
    <Layout $hide={hide} onClick={onClick}>
      {hide ? (
        <Dots>...</Dots>
      ) : (
        <>
          <Icon>
            <CurrencyLogo mSize={16} tSize={24} dSize={24} symbol={symbol} />
          </Icon>
          <TickerFlexBox>
            {currency?.network && currency?.ticker !== currency?.network && (
              <Network $background={networkColors[currency.network] ?? networkColors.default}>
                {currency.network}
              </Network>
            )}
            <Name $length={tickerLength}>
              {(currency?.ticker) ?? symbol}
            </Name>
          </TickerFlexBox>
        </>
      )}
      <Arrow />
    </Layout>
  );
});
export default Dropdown;
