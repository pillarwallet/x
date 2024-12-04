import { useCallback, useContext, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ThemeContext } from 'styled-components';
import * as Styles from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import ExchangeSmallBlock from '../ExchangeSmallBlock/ExchangeSmallBlock';
import TooltipHelper from '../TooltipHelper/TooltipHelper';
import Spinner from '../Spinner';
import QuestionIcon from '../icons/QuestionIcon';

const SecondStep = () => {
  const {
    state: { address, extraId, currencyTo, isFixed },
    actions: { setAddress, setExtraId, createExchange },
  } = useContext(ExchangeContext);

  const theme = useContext(ThemeContext);
  const [isAddressActive, setIsAddressActive] = useState(false);
  const [isMemoActive, setIsMemoActive] = useState(false);
  const [isButtonLoading, setIsButtonLoading] = useState(false);
  const isAddressValid = currencyTo.validationAddress
    ? new RegExp(currencyTo.validationAddress).test(address)
    : true;
  const isMemoValid = currencyTo.validationExtra
    ? !extraId || new RegExp(currencyTo.validationExtra).test(extraId)
    : true;
  const isButtonDisabled = !isAddressValid || !address.length || !isMemoValid;
  const { t } = useTranslation();

  const onExchange = useCallback(async () => {
    try {
      setIsButtonLoading(true);
      await createExchange();
    } finally {
      setIsButtonLoading(false);
    }
  });
  const warningTo = currencyTo?.warningsTo?.length > 0 ? currencyTo?.warningsTo[0] : false;

  useEffect(() => () => setIsButtonLoading(false), []);

  return (
    <>
      <ExchangeSmallBlock hasTilda={!isFixed} />
      <Styles.InputGroup>
        {(isAddressActive || address) && (
          <Styles.InputLabel>
            {t('step2.recipientAddress', { currency: currencyTo.ticker.toUpperCase() })}
          </Styles.InputLabel>
        )}
        {warningTo && !(!isAddressValid && address.length) && (
          <Styles.TooltipContainer>
            <TooltipHelper direction="left" tooltipText={warningTo} color="#EE9500" />
          </Styles.TooltipContainer>
        )}
        {!isAddressValid && !!address.length && (
          <Styles.TooltipContainer>
            <TooltipHelper
              color="#E15D56"
              direction="left"
              tooltipText={t('step2.invalidAddress')}
            />
          </Styles.TooltipContainer>
        )}
        <Styles.TextInput
          $hasTooltip={currencyTo.ticker === 'eth'}
          value={address}
          placeholder={t('step2.recipientAddress', { currency: currencyTo.ticker.toUpperCase() })}
          onChange={(e) => {
            setAddress(e.target.value);
          }}
          onFocus={() => setIsAddressActive(true)}
          onBlur={() => setIsAddressActive(false)}
        />
      </Styles.InputGroup>
      {currencyTo.hasExtraId && (
        <Styles.InputGroup>
          {(isMemoActive || extraId) && <Styles.InputLabel>{t('step2.extraId')}</Styles.InputLabel>}
          {!isMemoValid && (
            <Styles.TooltipContainer>
              <TooltipHelper direction="left" tooltipText="Invalid memo" color="#E15D56" />
            </Styles.TooltipContainer>
          )}
          {isMemoValid && (
            <Styles.TooltipContainer>
              <TooltipHelper
                direction="left"
                tooltipText="A memo is a unique set of numbers that identifies your transaction and guarantees it won't be lost."
                Icon={QuestionIcon}
                textColor={theme.tooltipText}
                color={theme.text1}
              />
            </Styles.TooltipContainer>
          )}
          <Styles.TextInput
            value={extraId}
            placeholder={t('step2.extraId')}
            onChange={(e) => {
              setExtraId(e.target.value);
            }}
            onFocus={() => setIsMemoActive(true)}
            onBlur={() => setIsMemoActive(false)}
          />
        </Styles.InputGroup>
      )}
      <Styles.MainButton disabled={isButtonDisabled || isButtonLoading} onClick={onExchange}>
        {' '}
        {isButtonLoading ? (
          <>
            <Spinner size={30} color={theme.buttonText} />
            {t('step2.creating')}
          </>
        ) : (
          t('step2.button')
        )}
      </Styles.MainButton>
    </>
  );
};

export default SecondStep;
