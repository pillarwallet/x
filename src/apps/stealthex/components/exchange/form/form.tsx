/* eslint-disable react/prop-types */
import { useCallback, useEffect, useState } from 'react';
import { Config } from '../../../type';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { useCreateExchangeMutation, useExchangeInfoQuery } from '../../../lib/backend/api';
import getSafeLocalStorage from '../../../lib/get-safe-local-storage';
import { setCurrentStep } from '../../../redux/reducers/exchange';
import { FormWrapper } from './form-wrapper';
import ExchangeCreate from './exchange-create';
import { isSignatureError } from '../../../lib/backend/exchange/error';
import { FormSizer, StyledSection } from './styles';
import ExchangeResult from './exchange-result';
import { skipToken } from '@reduxjs/toolkit/query';

type FormProps = {
  preview?: boolean;
  config?: Config;
  onReject?: () => void;
  existingExchange?: boolean;
  widget?: boolean;
};

export const Form: React.FC<FormProps> = ({
  config,
  onReject,
  existingExchange,
  widget
}) => {
  const [address, setAddress] = useState(config?.recepientAddress || '');
  const [extraId, setExtraId] = useState('');
  const [refundAddress, setRefundAddress] = useState('');
  const [userReferral, setUserReferral] = useState('');
  const [exchangeId, setExchangeId] = useState<string | undefined>();

  const { currentStep, selectedProvider, receiveCurrency, sendCurrency, amount, fixed, fiat } = useAppSelector(state => state.exchange);
  // eslint-disable-next-line no-console
  const dispatch = useAppDispatch();
  const exchangeInfo = useExchangeInfoQuery(exchangeId ?? skipToken,{pollingInterval: 30 * 1000});
  const [createExchange, createExchangeInfo] = useCreateExchangeMutation({})

  useEffect(() => {
    if (createExchangeInfo && createExchangeInfo.data?.data.id) {
      setExchangeId(createExchangeInfo.data?.data.id)
      dispatch(setCurrentStep(2))
    }
  }, [createExchangeInfo, dispatch])

  const setReferral = useCallback(() => {
    let referral;
    try {
      const referralInfo = JSON.parse(
        getSafeLocalStorage().getItem('stealthex-referral') || '{}',
      );
      referral = referralInfo.refferal || '';
    } catch (e) {
      referral = getSafeLocalStorage().getItem('stealthex-referral') || '';
    }

    if (referral) setUserReferral(referral);
  }, []);

  const handleNewExchange = () => {
    dispatch(setCurrentStep(1));
  };

  const handleFormSubmit = () => {
    const nonFixedProps = !fixed
      ? {
        amountFrom: amount,
      }
      : {};
    const nonFiatProps = !fiat ? { refundAddress } : {};

    createExchange({
      currencyFrom: sendCurrency.symbol,
      currencyTo: receiveCurrency.symbol,
      address,
      extraId,
      referral: userReferral,
      fixed,
      timezoneOffset: new Date().getTimezoneOffset(),
      ...nonFiatProps,
      provider: fiat ? selectedProvider : undefined,
      ...nonFixedProps,
    });
  };
  useEffect(() => {
    setReferral();
  }, [setReferral]);

  const createExchangeStep =
    currentStep === 1
      ? 'select'
      : currentStep === 2 && exchangeInfo.isLoading
        ? 'confirm'
        : null;

  const exchangeResultStep = Boolean(
    existingExchange ||
    (currentStep === 2 &&
      (createExchangeInfo.isSuccess || createExchangeInfo.isError)),
  );
  return (
    <>
      <FormWrapper
        currentStep={currentStep}
        exchangeInfoResult={exchangeInfo}
        existingExchange={existingExchange}
        widget={widget}
      >
        {createExchangeStep && !existingExchange && (
          <ExchangeCreate
            address={address}
            config={config}
            createExchange={createExchangeInfo}
            extraId={extraId}
            fiat={fiat}
            onAddressChange={setAddress}
            onExtraIdChange={setExtraId}
            onRefundAddressChange={setRefundAddress}
            onReject={onReject}
            onRejectConfirmStep={() => dispatch(setCurrentStep(1))}
            onSubmitSelect={() => {
              widget ? handleFormSubmit() : dispatch(setCurrentStep(2));
            }}
            onSubmitConfirm={handleFormSubmit}
            refundAddress={refundAddress}
            step={createExchangeStep}
            preview={false}
            widget={widget}
          />
        )}

        {exchangeResultStep && (exchangeInfo.data || exchangeInfo.error) && (
          <ExchangeResult
            exchangeInfo={exchangeInfo.data?.data}
            onNewExchange={handleNewExchange}
            onReject={onReject}
            widget={widget}
            status={
              !exchangeInfo.error
                ? 'success'
                : isSignatureError(exchangeInfo.error as Error)
                  ? 'invalidSignatureError'
                  : 'notFoundError'
            }
          />
        )}
      </FormWrapper>
    </>
  );
}

export const ExchangeLayout: React.FC<{
  existingExchange?: boolean;
}> = ({ existingExchange }) => {
  return (
    <StyledSection>
      <FormSizer>
        <Form existingExchange={existingExchange} />
      </FormSizer>
    </StyledSection>
  );
};
