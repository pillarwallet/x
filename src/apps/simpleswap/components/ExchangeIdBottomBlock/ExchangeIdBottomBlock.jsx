import { useContext } from 'react';
import { useTranslation } from 'react-i18next';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import NeedHelpIcon from '../icons/NeedHelpIcon';

const ExchangeIdBottomBlock = () => {
  const {
    state: { exchangeInfo },
  } = useContext(ExchangeContext);

  const { t } = useTranslation();

  return (
    <Styles.Container>
      <Styles.ExchangeId>{t('exchangeId')}</Styles.ExchangeId>
      <Styles.ExchangeIdValue>{exchangeInfo?.id}</Styles.ExchangeIdValue>
      <Styles.NeedHelp href="https://simpleswap.io/contacts" target="_blank">
        <NeedHelpIcon />
        <Styles.NeedHelpText>{t('needHelp')} </Styles.NeedHelpText>
      </Styles.NeedHelp>
    </Styles.Container>
  );
};

export default ExchangeIdBottomBlock;
