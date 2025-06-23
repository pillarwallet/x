import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import PropTypes from 'prop-types';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import CopyIcon from '../icons/CopyIcon/CopyIcon';
import { decreaseTextLength } from '../../helpers/parsed';

const ExchangeAddressInfo = (props) => {
  const { step } = props;
  const {
    state: { exchangeInfo },
  } = useContext(ExchangeContext);
  const theme = useContext(ThemeContext);
  const { t } = useTranslation();

  return (
    <>
      {step < 6 && (
        <Styles.Row>
          <Styles.Text>{t('depositAddress')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.addressFrom, 13)
              : decreaseTextLength(exchangeInfo?.addressFrom, 7)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.addressFrom}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
      {step >= 6 && (
        <Styles.Row>
          <Styles.Text>{t('recipientAddress')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.addressTo, 13)
              : decreaseTextLength(exchangeInfo?.addressTo, 6)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.addressTo}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
      {exchangeInfo?.extraIdFrom && step < 6 && (
        <Styles.Row>
          <Styles.Text>{t('depositMemo')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.extraIdFrom, 13)
              : decreaseTextLength(exchangeInfo?.extraIdFrom, 6)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.extraIdFrom}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
      {exchangeInfo?.extraIdTo && (
        <Styles.Row>
          <Styles.Text>{t('yourMemo')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.extraIdTo, 13)
              : decreaseTextLength(exchangeInfo?.extraIdTo, 6)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.extraIdTo}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
      {exchangeInfo?.txFrom && (
        <Styles.Row>
          <Styles.Text>{t('hashIn')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.txFrom, 13)
              : decreaseTextLength(exchangeInfo?.txFrom, 6)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.txFrom}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
      {exchangeInfo?.txTo && (
        <Styles.Row>
          <Styles.Text>{t('hashOut')}</Styles.Text>
          <Styles.RowValue>
            {matchMedia('screen and (min-width: 470px)').matches
              ? decreaseTextLength(exchangeInfo?.txTo, 13)
              : decreaseTextLength(exchangeInfo?.txTo, 6)}
          </Styles.RowValue>
          <CopyIcon
            text={exchangeInfo?.txTo}
            background="#C6D5EA4D"
            color={theme.addressInfoCopyIcon}
            hoverBackground={theme.copyIconHoverBackground}
            hoverColor="#FFFFFF"
          />
        </Styles.Row>
      )}
    </>
  );
};

ExchangeAddressInfo.propTypes = {
  step: PropTypes.number,
}

export default ExchangeAddressInfo;
