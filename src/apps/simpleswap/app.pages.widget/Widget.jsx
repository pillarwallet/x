import { useCallback, useContext, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import dayjs from 'dayjs';

import { ThemeProvider } from 'styled-components';
import { useTranslation, Trans } from 'react-i18next';
import Tooltip from '@mui/material/Tooltip';

import {
  Wrapper,
  HeaderRow,
  LogoButton,
  StepTitle,
  NewExchangeButton,
  StepSubTitle,
  BottomContainer,
  MainButton,
  CenterTitle,
  CenterSubTitle,
  GoBackButton,
  StepHeader,
  TooltipContainer,
} from './styles';

import { ExchangeFormMain } from '../components/ExchangeFormMain';
import { ExchangeContext } from '../contexts/ExchangeContext';
import LogoIcon from '../components/icons/LogoIcon';
import SecondStep from '../components/SecondStep/SecondStep';
import ThirdStep from '../components/ThirdStep/ThirdStep';
import ExchangeIdBottomBlock from '../components/ExchangeIdBottomBlock/ExchangeIdBottomBlock';
import ExchangeSmallBlock from '../components/ExchangeSmallBlock/ExchangeSmallBlock';
import ExchangeAddressInfo from '../components/ExchangeAddressInfo/ExchangeAddressInfo';
import CountDown from '../components/CountDown';
import RefreshIcon from '../components/icons/RefreshIcon';
import SimpleArrowIcon from '../components/icons/SimpleArrowIcon';
import * as Styles from '../components/ExchangeIdBottomBlock/styles';
import NeedHelpIcon from '../components/icons/NeedHelpIcon';
import { themes } from '../constants/theme';
import InformationIcons from '../components/InformationIcons';
import { resetWidgetExchangeInfo } from '../redux/widget/reducer';
import HeaderStepBlock from '../components/HeaderStepBlock';
import ExchangeStatuses from '../components/ExchangeStatuses';
import QuestionIcon from '../components/icons/QuestionIcon';
import { widgetInfo } from '../constants/widgetInfo';

const Widget = () => {
  const {
    state: { isFixed, exchangeInfo, currencyTo, currencyFrom },
    actions: { clearUpdateTimer, setAddress, setExtraId, refresh },
  } = useContext(ExchangeContext);
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [step, setStep] = useState(1);

  const lastNames = {
    'dark-hard': 'black',
    'dark-default': 'blue',
    'dark-light': 'blue',
  };

  const goToStart = useCallback(() => {
    refresh();
    setStep(1);
  }, [refresh]);

  const goBack = () => {
    if (step === 2) {
      setAddress('');
      setExtraId('');
      setStep(1);
    }
    if (step === 3) {
      clearUpdateTimer();
      dispatch(resetWidgetExchangeInfo());
      setStep(2);
    }
    if (step === 'Verifying' || step === 'Failed') {
      goToStart();
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <ExchangeFormMain onExchangeClick={() => setStep(2)} />;
      case 2:
        return <SecondStep />;
      case 3:
        return (
          <>
            <ThirdStep />
            <ExchangeIdBottomBlock />
          </>
        );
      case 4:
      case 5:
      case 6:
      case 7:
      case 'Refunded':
        return (
          <>
            <ExchangeSmallBlock hasTilda={setStep < 6 && !isFixed} />
            <ExchangeAddressInfo step={step} />
            <BottomContainer>
              {(step === 'Refunded' || step === 7) && (
                <NewExchangeButton onClick={goToStart}>
                  <RefreshIcon />
                  {t('newExchange')}
                </NewExchangeButton>
              )}
              <ExchangeIdBottomBlock />
            </BottomContainer>
          </>
        );
      case 'Verifying':
      case 'Failed':
        return (
          <>
            <CenterTitle>Exchange in status {step}</CenterTitle>
            <CenterSubTitle>Contact to <a href="mailto:support@simpleswap.io">support@simpleswap.io</a></CenterSubTitle>
            <ExchangeIdBottomBlock />
          </>
        );
      case 'TimeOver':
      case 'MessageSent':
        return (
          <>
            <CenterTitle>{t(`step${step}.centerTitle`)}</CenterTitle>
            <CenterSubTitle>{t(`step${step}.centerSubTitle`)}</CenterSubTitle>
            <MainButton onClick={goToStart}>{t(`step${step}.buttonText`)}</MainButton>
          </>
        );
      default:
        return null;
    }
  };

  useEffect(() => {
    if (!exchangeInfo) return;

    if (exchangeInfo.status === 'waiting') {
      if (isFixed) {
        const timestamp = exchangeInfo?.createdAt;
        const now = dayjs();
        const diffInSeconds = dayjs(timestamp).add(20, 'm').diff(now, 'seconds');
        if (diffInSeconds < 0) {
          setStep('TimeOver');
          return;
        }
      }
      setStep(3);
    }
    if (exchangeInfo.status === 'confirming') setStep(4);
    if (exchangeInfo.status === 'exchanging') setStep(5);
    if (exchangeInfo.status === 'sending') setStep(6);
    if (exchangeInfo.status === 'finished') setStep(7);
    if (exchangeInfo.status === 'finished') clearUpdateTimer();
    if (exchangeInfo.status === 'refunded') setStep('Refunded');
    if (exchangeInfo.status === 'expired') {
      setStep('TimeOver');
      clearUpdateTimer();
    }
    if (exchangeInfo.status === 'failed') {
      setStep('Failed');
      clearUpdateTimer();
    }
    if (exchangeInfo.status === 'verifying') {
      setStep('Verifying');
      clearUpdateTimer();
    }
  }, [exchangeInfo]);

  return (
    <ThemeProvider
      theme={
        themes[widgetInfo?.colorTheme] || themes[lastNames[widgetInfo?.colorTheme]] || themes.white
      }
    >
      <Wrapper>
        <HeaderRow>
              <LogoButton href="https://simpleswap.io" target="_blank">
                <LogoIcon />
              </LogoButton>
          <HeaderStepBlock step={step} />
          <ExchangeStatuses step={step} />
          <InformationIcons />
          {(step === 2 || step === 3 || step === 'Verifying' || step === 'Failed') && (
            <GoBackButton onClick={goBack}>
              <SimpleArrowIcon />
            </GoBackButton>
          )}
          {(step === 'MessageSent' || step === 'TimeOver') && (
            <Styles.NeedHelp
              href="https://support.simpleswap.io/hc/en-us/requests/new"
              target="_blank"
            >
              <NeedHelpIcon />
              <Styles.NeedHelpText>{t('needHelp')} </Styles.NeedHelpText>
            </Styles.NeedHelp>
          )}
        </HeaderRow>
        {step !== 1 && step !== 'TimeOver' && step !== 'MessageSent' && (
          <StepHeader>
            <StepTitle $step={step}>
              <Trans
                i18nKey={`step${step}.title`}
                values={{
                  currencyFrom: currencyFrom.ticker.toUpperCase(),
                  currencyTo: currencyTo.ticker.toUpperCase(),
                }}
                components={[<span key={1}/>]}
              />

              {step === 3 && isFixed && (
                <CountDown startDate={dayjs(exchangeInfo?.createdAt).add(20, 'm')} />
              )}
            </StepTitle>
            {step === 4 && currencyFrom.confirmationsFrom && (
              <>
                <Tooltip id="confirmationsTooltip" title="The exchange will continue once the deposit reaches the required number of confirmations set by our liquidity providers. This number may vary slightly." leaveDelay={1000} placement="bottom">
                  <StepSubTitle>
                    {t(`step${step}.subTitle`)} {currencyFrom.confirmationsFrom}
                    <TooltipContainer>
                      <QuestionIcon />
                    </TooltipContainer>
                  </StepSubTitle>
                </Tooltip>
              </>
            )}
          </StepHeader>
        )}
        {renderStep()}
      </Wrapper>
    </ThemeProvider>
  );
};

export default Widget;
