import { toUpper } from '../../helpers/parsed';

import CurrencyLogo from '../CurrencyLogo';
import { Container, LogoRow, CoinName, CoinTicker, CoinLabel, LeftSide } from './styles';
import { networkColors } from '../../constants/networkColors';
import PropTypes from 'prop-types';

const CoinListItem = (props) => {
  const { className, onSelect, ticker, name, selected, format, network } = props;

  return (
    <Container className={className} onClick={onSelect} role="close-dropdown" selected={selected}>
      <LeftSide>
        <LogoRow role="close-dropdown">
          <CurrencyLogo symbol={ticker} mSize={20} tSize={24} />
        </LogoRow>
        <CoinTicker role="close-dropdown">
          {format ? format.name : toUpper(ticker)}
        </CoinTicker>
        {network && ticker !== network ? (
          <CoinLabel
            role="close-dropdown"
            background={networkColors[network.toLowerCase()] ?? networkColors.default}
          >
            {network.toUpperCase()}
          </CoinLabel>
        ) : null}{' '}
      </LeftSide>
      <CoinName role="close-dropdown">{name}</CoinName>
    </Container>
  );
};

CoinListItem.propTypes = {
  className: PropTypes.string,
  ticker: PropTypes.string,
  name: PropTypes.string,
  onSelect: PropTypes.func,
  selected: PropTypes.bool,
  format: PropTypes.object,
  network: PropTypes.string
}

export default CoinListItem;
