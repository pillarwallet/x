import { useState, useContext } from 'react';
import { useTranslation } from 'react-i18next';

import {
  Main,
  Controls,
  FloatingRow,
  FloatingButton,
  FloatingText,
  SwapRow,
  SwapIconContainer,
  Button,
  AgreementsText,
  AgreementsTextLink,
  PopupRow,
  PopupHeader,
  PopupText,
  PopupButton,
  PopupClose,
} from './styles';
import { ExchangeContext } from '../../contexts/ExchangeContext';
import SwapIcon from '../icons/SwapIcon';
import LockIcon from '../icons/LockIcon';
import RateTypeIcon from '../icons/RateTypeIcon';
import { Tooltip, TooltipExtras } from '../Tooltip';
import Fields from '../Field';
import CloseIcon from '../icons/CloseIcon';
import PropTypes from 'prop-types';
import { getNetworkByChainId } from '../../constants/networkData';
import { getCurrencyInternalName } from '../../helpers/formatCurrency';
import useAssets from '../../../../hooks/useAssets';

const ExchangeFormMain = (props) => {
  const { secondStep, isDesktopHorizontal, onExchangeClick } = props;

  const {
    state: {
      isFixed,
      currencyFrom,
      currencyTo,
      currencyFromValue,
      currencyToValue,
      minAmount,
      maxAmount,
      isAmountLoading,
    },
    actions: { setIsfixed, setCurrencyFrom, setCurrencyTo, setAmount },
  } = useContext(ExchangeContext);


  const [isAnimateSwap, setIsAnimateSwap] = useState(false);
  const [animateTimer, setAnimateTimer] = useState(null);
  const assets = useAssets();

  const { t } = useTranslation();

  const onSetIsFixed = () => {
    setIsfixed(!isFixed);
  };

  const onSwap = () => {
    if (isAmountLoading.to) return;
    if (animateTimer) {
      clearTimeout(animateTimer);
    }

    setCurrencyFrom(currencyTo);
    setCurrencyTo(currencyFrom);
    setAmount(currencyFromValue);

    setIsAnimateSwap(false);
    setIsAnimateSwap(true);
    const timer = setTimeout(() => {
      setIsAnimateSwap(false);
      setAnimateTimer(null);
    }, 400);
    setAnimateTimer(timer);
  };

  const isToError =
    (isFixed &&
      ((minAmount && +currencyFromValue < +minAmount) ||
        (maxAmount && +currencyFromValue > +maxAmount))) ||
    (minAmount && +currencyFromValue < +minAmount);
  const isFormError =
    isToError ||
    isAmountLoading.to ||
    !`${currencyFromValue}`.length ||
    !`${currencyToValue}`.length;

  const walletCurrencies = Object.entries(assets).reduce((acc, [chainId, tokens])=> {
    return [...acc, ...tokens.map(token=>`${token.symbol.toLowerCase() === 'matic'? 'pol': token.symbol.toLowerCase() }:${getNetworkByChainId(chainId)?.shortName}`)]
  },[])

  return (
    <Main second={secondStep} isDesktopHorizontal={isDesktopHorizontal}>
      <Fields type="from" walletCurrencies={walletCurrencies}/>
      <Controls>
        <Tooltip
          trigger="click"
          placement="bottom-start"
          offsetTop={0}
          renderReference={(bind) => {
            return (
              <FloatingRow
                {...bind.actionHandlers}
                ref={bind.ref}
              >
                <FloatingButton>
                  <RateTypeIcon isActive={isFixed} />
                  <LockIcon
                    isHover={bind.actionHandlers.$tooltipIsShown}
                    isActive={isFixed}
                    className="main-exchange__floating-icon"
                  />
                </FloatingButton>
                <FloatingText>{isFixed?t('MAIN.FIXED') :t('MAIN.FLOAT')}</FloatingText>
              </FloatingRow>
            );
          }}
          renderTooltip={(bind) => {
            return (
              <TooltipExtras.FixedTooltip ref={bind.ref} {...bind.popperProps}>
                <PopupRow>
                  <LockIcon isDisabled className="main-exchange__floating-icon" />
                  <PopupHeader>Floating exchange rate</PopupHeader>
                </PopupRow>
                <PopupText $withMargin>
                  The amount you get may change due to market volatility.
                </PopupText>
                <PopupRow>
                  <LockIcon isDisabled isActive className="main-exchange__floating-icon" />
                  <PopupHeader>Fixed exchange rate</PopupHeader>
                </PopupRow>
                <PopupText>
                  The amount you get is fixed and doesn&apos;t depend on market volatility.
                </PopupText>
                <PopupButton
                  onClick={() => {
                    onSetIsFixed();
                    bind.hide();
                  }}
                >
                  {isFixed ? 'Floating' : 'Fixed'}
                </PopupButton>
                <PopupClose
                  onClick={() => {
                    bind.hide();
                  }}
                >
                  <CloseIcon />
                </PopupClose>
                <TooltipExtras.TopTriangle $offset={14} $offsetMedium={30} />
              </TooltipExtras.FixedTooltip>
            );
          }}
        />
        <SwapRow
          $isDisabled={!walletCurrencies.includes(getCurrencyInternalName(currencyTo))}
          $isDesktopHorizontal={isDesktopHorizontal}
          onClick={onSwap}
        >
          <SwapIconContainer className={`${isAnimateSwap ? 'animate' : ''}`}>
            <SwapIcon />
          </SwapIconContainer>
        </SwapRow>
      </Controls>
      <Fields type="to" />
      <AgreementsText>
        By clicking Exchange you agree with{' '}
        <AgreementsTextLink
          href="https://simpleswap.io/terms-of-service"
          target="_blank"
          rel="noopener noreferrer nofolow"
        >
          Terms of Service
        </AgreementsTextLink>
        {' and '}
        <AgreementsTextLink
          href="https://simpleswap.io/privacy-policy"
          target="_blank"
          rel="noopener noreferrer nofolow"
        >
          Privacy Policy
        </AgreementsTextLink>
      </AgreementsText>
      {!secondStep ? (
        <Button
          isDesktopHorizontal={isDesktopHorizontal}
          disabled={isFormError}
          onClick={onExchangeClick}
        >
          {t('FIELDS.TEXT_5')}
        </Button>
      ) : null}
    </Main>
  );
};

ExchangeFormMain.propTypes = {
  secondStep: PropTypes.bool,
  isDesktopHorizontal: PropTypes.bool,
  onExchangeClick: PropTypes.func,
}

export {ExchangeFormMain}