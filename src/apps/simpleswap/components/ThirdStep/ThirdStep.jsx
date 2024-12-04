import { useContext, useEffect, useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';
import { ThemeContext } from 'styled-components';
import Tooltip from '@mui/material/Tooltip';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';

import CopyIcon from '../icons/CopyIcon/CopyIcon';
import TooltipQRCode from '../TooltipQRCode/TooltipQRCode';
import { InformationContext } from '../../contexts/InformationContext';
import { decreaseTextLength } from '../../helpers/parsed';
import CurrencyLogo from '../CurrencyLogo';
import { networkColors } from '../../constants/networkColors';
import { DropdownTickerLabel } from '../ExchangeSmallBlock/styles';
import TooltipIcon from '../icons/TooltipIcon';

const ThirdStep = () => {
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();

  const {
    state: { currencyFrom, exchangeInfo },
  } = useContext(ExchangeContext);
  const {
    actions: { setNotification },
  } = useContext(InformationContext);
  const [warning, setWarning] = useState(null);
  const [showAmountTooltip, setShowAmountTooltip] = useState(false);

  const amountRef = useRef();

  useEffect(() => {
    if (amountRef.current && amountRef.current?.clientWidth !== amountRef.current?.scrollWidth) {
      setShowAmountTooltip(true);
    }
  }, [exchangeInfo?.amountFrom]);

  useEffect(() => {
    const warningFrom =
      currencyFrom?.warningsFrom?.length > 0 ? currencyFrom?.warningsFrom[0] : false;
    if (warningFrom) {
      setWarning(warningFrom);
    }
    return () => {
      setWarning(null);
    };
  }, [currencyFrom]);

  useEffect(() => {
    setNotification(t('depositNotification'));
    return () => {
      setNotification(null);
    };
  }, []);

  return (
    <>
      <Styles.SendBox>
        {t('FIELDS.TEXT_1')}:
        <Styles.CoinRow>
          <Styles.CoinIcon>
            <CurrencyLogo mSize={16} symbol={currencyFrom.ticker} />
          </Styles.CoinIcon>{' '}
          <Tooltip ref={amountRef} id="amountTooltip" title={exchangeInfo?.amountFrom} placement="top" leaveDelay={300} >
            <Styles.Amount $isDisable={!showAmountTooltip}>
              {exchangeInfo?.amountFrom}
            </Styles.Amount>
          </Tooltip>
          {currencyFrom.ticker.toUpperCase()}
          {currencyFrom?.network && currencyFrom.ticker !== currencyFrom.network ? (
            <DropdownTickerLabel
              $background={
                networkColors[currencyFrom?.network.toLowerCase()] ?? networkColors.default
              }
            >
              {currencyFrom?.format?.label || currencyFrom?.network.toUpperCase()}
            </DropdownTickerLabel>
          ) : null}
        </Styles.CoinRow>
      </Styles.SendBox>
      <Styles.Memo>
        <Styles.Text color={warning && '#EE7500'}>{t('depositAddress')}</Styles.Text>
        {warning && (
          <Styles.MemoIcon>
            <Tooltip id="warningTooltip" title={warning} placement="top" leaveDelay={300} >
              <div>
                <TooltipIcon
                  color="#EE9500"
                />
              </div>
            </Tooltip>
          </Styles.MemoIcon>
        )}
      </Styles.Memo>
      <Styles.AddressBlock>
        {matchMedia('screen and (min-width: 350px)').matches && (
          <QRCode
            value={exchangeInfo?.addressFrom || ''}
            size={88}
            bgColor={theme.addressBlockBackground}
          />
        )}
        <Styles.AddressText>{exchangeInfo?.addressFrom}</Styles.AddressText>
        <Styles.IconColumn>
          <CopyIcon
            text={exchangeInfo?.addressFrom}
            background="#C6D5EA4D"
            color={theme.copyIcon}
            hoverBackground="#004AD9"
            hoverColor="#FFFFFF"
          />
          {!matchMedia('screen and (min-width: 350px)').matches && <TooltipQRCode />}
        </Styles.IconColumn>
      </Styles.AddressBlock>
      {exchangeInfo?.extraIdFrom && (
        <Styles.Memo>
          <Styles.Text>{t('depositMemo')}</Styles.Text>{' '}
          <Styles.MemoIcon>
            <Tooltip id="memoTooltip" title={t('step3.tooltip')} placement="top" leaveDelay={300} >
              <TooltipIcon color="#EE9500"/>
            </Tooltip>
          </Styles.MemoIcon>
          <Styles.MemoValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.extraIdFrom, 13)
              : decreaseTextLength(exchangeInfo?.extraIdFrom, 7)}
          </Styles.MemoValue>
          <CopyIcon
            text={exchangeInfo?.extraIdFrom}
            color="#EE9500"
            background={theme.warningCopyIconBackground}
            hoverBackground="#EE9500"
            hoverColor={theme.warningCopyIconHover}
          />
        </Styles.Memo>
      )}
    </>
  );
};

export default ThirdStep;
