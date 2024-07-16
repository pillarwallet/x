
import React, { useState } from 'react';

import Loader from '../../../../../../../components/common/loaders/simple-loader';



import {
    Container,
    DesktopOnly,
    MobileOnly,
    NextButton,
    PaymentOfferContainer,
    PaymentOfferDescription,
    PaymentOfferError,
    PaymentOfferEstimate,
    PaymentOfferLogo,
    PaymentOfferPaymentLogo,
    PaymentOfferPayments,
    PaymentOfferStats,
    RefundAddressContainer,
    SelectBlock,
    SelectBlockContent,
    SelectBlockTitle,
    StyledRadioIndicator,
    StyledRadioItem,
    StyledRadioRoot,
} from './styles';

import { useTranslation } from 'react-i18next';
import { useFiatEstimateQuery, useRangeQuery } from '../../../../../../../lib/backend/api';
import Swap, { checkRanges, Config } from '../../../../../swap';
import { useAppDispatch, useAppSelector } from '../../../../../../../redux/hooks';
import providers, { ProviderName } from '../../../../../../../lib/providers';
import { setSelectedProvider } from '../../../../../../../redux/reducers/exchange';
import Collapsible from '../../../common/collapsible';

type Components = {
    addressInput: React.ReactNode;
    extraIdInput: React.ReactNode;
    refundAddressInput?: React.ReactNode;
};

type NormalViewProps = {
    config?: Config;
    components: Components;
    disabled?: boolean;
    onSubmit?: () => void;
};

const NormalView: React.FC<NormalViewProps> = ({
    config,
    components,
    disabled,
    onSubmit,
}) => {
    const { t } = useTranslation();

    const [swapDisabled, setSwapDisabled] = useState(true);
    const { fiat, amount, sendCurrency: selectedSendCurrency, receiveCurrency: selectedReceiveCurrency, selectedProvider } = useAppSelector(state => state.exchange)
    // const fiat = useAtomValue(fiatAtom);
    // const amount = useAtomValue(amountAtom);
    // const selectedSendCurrency = useAtomValue(sendCurrencyAtom);
    // const selectedReceiveCurrency = useAtomValue(receiveCurrencyAtom);
    // const selectedProvider = useAtomValue(providerAtom);

    const mercuryoQuery = useFiatEstimateQuery(
        {
            amount: Number(amount),
            from: selectedSendCurrency.symbol,
            to: selectedReceiveCurrency.symbol,
            fixed: false,
            provider: 'mercuryo'
        },
        { pollingInterval: 0, skip: !fiat }
    );
    const simplexQuery = useFiatEstimateQuery({
        amount: Number(amount),
        from: selectedSendCurrency.symbol,
        to: selectedReceiveCurrency.symbol,
        fixed: false,
        provider: 'simplex'
    },
        { pollingInterval: 0, skip: !fiat })
    const fiatEstimates = [mercuryoQuery, simplexQuery]

    const providerFailed =
        fiatEstimates[
            providers.findIndex((provider) => provider.name == selectedProvider)
        ].isError;
    const currencyExtraId = selectedReceiveCurrency.extra_id;
    return (
        <Container>
            <SelectBlock>
                <Swap onDisableChange={setSwapDisabled} config={config} preserveSpace />
            </SelectBlock>
            {fiat && <Providers />}
            {components.extraIdInput && (
                <SelectBlock>
                    {fiat && (
                        <SelectBlockTitle>
                            {t('extraIdOptionally', { extraId: currencyExtraId })}
                        </SelectBlockTitle>
                    )}
                    <SelectBlockContent>{components.extraIdInput}</SelectBlockContent>
                </SelectBlock>
            )}
            <SelectBlock>
                <SelectBlockContent>
                    {components.addressInput}
                    {components.refundAddressInput && (
                        <MobileOnly>
                            <Collapsible label={t('refundAddress')}>
                                <RefundAddressContainer>
                                    {components.refundAddressInput}
                                </RefundAddressContainer>
                            </Collapsible>
                        </MobileOnly>
                    )}
                    <NextButton
                        onClick={() => {
                            onSubmit && onSubmit();

                            // event('select_next', {
                            //     category: 'Exchange',
                            //     label: 'Exchange select next button click',
                            // });
                        }}
                        disabled={swapDisabled || disabled || providerFailed}
                        testId="exchange-submit"
                    >
                        {t('next')}
                    </NextButton>
                </SelectBlockContent>
            </SelectBlock>
            {components.refundAddressInput && (
                <DesktopOnly>
                    <Collapsible label={t('refundAddress')}>
                        <RefundAddressContainer>
                            {components.refundAddressInput}
                        </RefundAddressContainer>
                    </Collapsible>
                </DesktopOnly>
            )}
        </Container>
    );
};

const Providers: React.FC = () => {
    const { t } = useTranslation();
    const { selectedProvider, amount, fiat, sendCurrency: selectedSendCurrency, receiveCurrency: selectedReceiveCurrency } = useAppSelector(state => state.exchange)
    const dispatch = useAppDispatch();

    const ranges = useRangeQuery(
        {
            from: selectedSendCurrency.symbol,
            to: selectedReceiveCurrency.symbol,
            fixed: false,
            fiat,
        },
        {
            pollingInterval: 0
        },
    );
    const rangesBound = ranges.data ? checkRanges(ranges.data, amount) : 'ok';

    const mercuryoQuery = useFiatEstimateQuery(
        {
            amount: Number(amount),
            from: selectedSendCurrency.symbol,
            to: selectedReceiveCurrency.symbol,
            fixed: false,
            provider: 'mercuryo'
        },
        { pollingInterval: 0 }
    );
    const simplexQuery = useFiatEstimateQuery({
        amount: Number(amount),
        from: selectedSendCurrency.symbol,
        to: selectedReceiveCurrency.symbol,
        fixed: false,
        provider: 'simplex'
    },
        { pollingInterval: 0 })
    const fiatEstimates = [mercuryoQuery, simplexQuery]

    return (
        <SelectBlock>
            <SelectBlockTitle>Available offers:</SelectBlockTitle>
            <SelectBlockContent>
                <StyledRadioRoot
                    value={selectedProvider}
                    onValueChange={(value: ProviderName) => dispatch(setSelectedProvider(value))}
                >
                    {providers.map((provider, index) => {
                        const estimate = fiatEstimates[index];
                        const loading = estimate.isLoading;
                        const error = estimate.isError || rangesBound != 'ok';

                        return (
                            <PaymentOfferContainer
                                key={provider.name}
                                onClick={() => {
                                    if (error) return;

                                    dispatch(setSelectedProvider(provider.name));
                                }}
                                data-state={
                                    error
                                        ? 'error'
                                        : provider.name == selectedProvider
                                            ? 'checked'
                                            : 'unchecked'
                                }
                            >
                                <PaymentOfferDescription>
                                    <StyledRadioItem value={provider.name} disabled={error}>
                                        <StyledRadioIndicator />
                                    </StyledRadioItem>
                                    <PaymentOfferLogo>
                                        <img src={provider.logo} alt="" />
                                    </PaymentOfferLogo>
                                </PaymentOfferDescription>
                                {loading && <Loader />}
                                {!loading && (
                                    <PaymentOfferStats>
                                        {error ? (
                                            <PaymentOfferError>
                                                {rangesBound == 'below'
                                                    ? t('providerAmountBelow')
                                                    : rangesBound == 'over'
                                                        ? t('providerAmountAbove')
                                                        : t('providerNotAvailable')}
                                            </PaymentOfferError>
                                        ) : (
                                            <>
                                                <PaymentOfferEstimate>
                                                    <span>{`≈${estimate.data?.estimate}`}</span>
                                                    <span>
                                                        {selectedReceiveCurrency.symbol.toUpperCase()}
                                                    </span>
                                                </PaymentOfferEstimate>
                                                <PaymentOfferPayments>
                                                    {provider.payments.map((logo, index) => (
                                                        <PaymentOfferPaymentLogo key={index}>
                                                            <img src={logo} alt="" />
                                                        </PaymentOfferPaymentLogo>
                                                    ))}
                                                </PaymentOfferPayments>
                                            </>
                                        )}
                                    </PaymentOfferStats>
                                )}
                            </PaymentOfferContainer>
                        );
                    })}
                </StyledRadioRoot>
            </SelectBlockContent>
        </SelectBlock>
    );
};

export default NormalView;
