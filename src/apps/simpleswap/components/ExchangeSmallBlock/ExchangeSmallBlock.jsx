import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import ArrowIcon from '../icons/ArrowIcon';
import TildaIcon from '../icons/TildaIcon';
import CurrencyLogo from '../CurrencyLogo';
import { networkColors } from '../../constants/networkColors';
import QuestionIcon from '../icons/QuestionIcon';
import PropTypes from 'prop-types';

const ExchangeSmallBlock = (props) => {
  const { hasTilda } = props;
  const {
    state: { currencyTo, currencyFrom, currencyFromValue, currencyToValue, isFixed, exchangeInfo },
  } = useContext(ExchangeContext);
  const [showAmountFromTooltip, setShowAmountFromTooltip] = useState(false);
  const аmountFromRef = useRef();
  const [showAmountToTooltip, setShowAmountToTooltip] = useState(false);
  const аmountToRef = useRef();
  const amountTo = useMemo(
    () => exchangeInfo?.amountTo || currencyToValue,
    [exchangeInfo, currencyToValue],
  );

  useEffect(() => {
    setTimeout(() => {
      if (
        аmountFromRef.current &&
        аmountFromRef.current?.clientWidth !== аmountFromRef.current?.scrollWidth
      ) {
        setShowAmountFromTooltip(true);
      }
      if (
        аmountToRef.current &&
        аmountToRef.current?.clientWidth !== аmountToRef.current?.scrollWidth
      ) {
        setShowAmountToTooltip(true);
      }
    });
  }, [currencyFromValue, currencyToValue]);
  const { t } = useTranslation();
  return (
    <Styles.Container>
      <Styles.CoinBlock>
        <Styles.Label>{t('FIELDS.TEXT_1')}</Styles.Label>
        <Styles.CoinRow>
          <Styles.CoinIcon>
            <CurrencyLogo mSize={16} symbol={currencyFrom.ticker} />
          </Styles.CoinIcon>
          <Tooltip ref={аmountFromRef} id="amountFromTooltip" title={currencyFromValue} placement="top" leaveDelay={300} >
            <Styles.CoinValue $isDisabled={!showAmountFromTooltip}>
              {currencyFromValue}
            </Styles.CoinValue>
          </Tooltip>
          {currencyFrom.ticker.toUpperCase()}
          {currencyFrom?.network && currencyFrom.ticker !== currencyFrom.network ? (
            <Styles.DropdownTickerLabel
              $background={
                networkColors[currencyFrom?.network.toLowerCase()] ?? networkColors.default
              }
            >
              {currencyFrom?.format?.label || currencyFrom?.network.toUpperCase()}
            </Styles.DropdownTickerLabel>
          ) : null}
        </Styles.CoinRow>
      </Styles.CoinBlock>
      <Styles.CoinBlock>
        <Styles.Label>
          {t('FIELDS.TEXT_2')}
          {!isFixed && (
              <Tooltip id="floatingTooltip" title={t('floatingTooltip')} placement="top" leaveDelay={1000} >
                <Styles.QuestionIcon>
                  <QuestionIcon />
                </Styles.QuestionIcon>
              </Tooltip>
          )}
        </Styles.Label>
        <Styles.CoinRow>
          <Styles.CoinIcon>
            <CurrencyLogo mSize={16} symbol={currencyTo.ticker} />
          </Styles.CoinIcon>
          {hasTilda && (
            <Styles.InputToTilda>
              <TildaIcon />
            </Styles.InputToTilda>
          )}
           <Tooltip ref={аmountToRef} id="amountToTooltip" title={amountTo} placement="top" leaveDelay={300} >
            <Styles.CoinValue
              $isDisabled={!showAmountToTooltip}
          >
            {amountTo}
          </Styles.CoinValue>
          </Tooltip>
         {' '}
          {currencyTo.ticker.toUpperCase()}
          {currencyTo?.network && currencyTo.ticker !== currencyTo.network ? (
            <Styles.DropdownTickerLabel
              styles={{ marginLeft: '6px' }}
              $background={networkColors[currencyTo?.network.toLowerCase()] ?? networkColors.default}
            >
              {currencyTo?.format?.label || currencyTo?.network.toUpperCase()}
            </Styles.DropdownTickerLabel>
          ) : null}
        </Styles.CoinRow>
      </Styles.CoinBlock>
      <Styles.ArrowBlock>
        <ArrowIcon />
      </Styles.ArrowBlock>
    </Styles.Container>
  );
};

ExchangeSmallBlock.propTypes = {
  hasTilda: PropTypes.bool,
}


export default ExchangeSmallBlock;
