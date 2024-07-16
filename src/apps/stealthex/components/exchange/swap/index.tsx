/* eslint-disable react-hooks/exhaustive-deps */

import React, { useCallback, useEffect, useMemo, useRef } from 'react';

import Input from '../../exchange/swap/input';
import {
    Container,
    ErrorAction,
    PointerIcon,
    PointerIconContainer,
    SwapButton,
    SwapIcon,
    SwapIconMobile,
} from './styles';

import useToggle from '../../../lib/hooks/use-toggle';
import { UseQuerySyncConfig } from './use-query-sync';
import { CurrencyData, Range, useRangeQuery, useFiatEstimateQuery, useEstimateQuery, usePairsFromQuery, usePairsToQuery, useIsFixedQuery } from '../../../lib/backend/api';
import { useTranslation } from 'react-i18next';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAmount, setFixed, setReceiveCurrency, setReverse, setSendCurrency } from '../../../redux/reducers/exchange';
import providers from '../../../lib/providers';

export type Config = UseQuerySyncConfig & {
    getPairs?: CurrencyData[];
    sendPairs?: CurrencyData[];
    recepientAddress?: string;
    lockReceiveCurrency?: boolean;
};

type SwapProps = {
    config?: Config;
    preserveSpace?: boolean;
    syncQuery?: boolean;
    widget?: boolean;
    onDisableChange?: (condition: boolean) => void;
};

const Swap: React.FC<SwapProps> = ({
    config,
    preserveSpace,
    onDisableChange,
    widget,
}) => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();
    const { amount, sendCurrency, receiveCurrency, fixed, reverse, fiat, selectedProvider } = useAppSelector(state => state.exchange)

    const [swapShouldAnimate, toggleSwapAnimation] = useToggle(false);

    const changedAmountWhileLoadingRanges = useRef(false);
    const handleRangeSuccess = useCallback((range: Range) => {
        if (!range.min_amount || changedAmountWhileLoadingRanges.current) {
            changedAmountWhileLoadingRanges.current = false;
            return;
        }

        const numberAmount = Number(amount);
        const belowMin =
            range.min_amount && Number(range.min_amount) > numberAmount;
        const aboveMax =
            range.max_amount && Number(range.max_amount) < numberAmount;

        if (belowMin || aboveMax) {
            dispatch(setAmount(range.min_amount));
        }
    }, [amount, dispatch]);

    const ranges = useRangeQuery(
        {
            to: receiveCurrency.symbol,
            from: sendCurrency.symbol,
            fixed,
            fiat,
        }
    );
    const reverseRanges = useRangeQuery(
        {
            to: receiveCurrency.symbol,
            from: sendCurrency.symbol,
            fixed,
            reverse: true,
        }, { skip: !fixed }
    );

    useEffect(() => {
        if (!reverse) {
            return;
        }
        reverseRanges?.data && handleRangeSuccess(reverseRanges.data);
    }, [reverseRanges, reverse])

    useEffect(() => {
        if (reverse) {
            return;
        }

        ranges?.data && handleRangeSuccess(ranges?.data)
    }, [ranges, reverse])

    const rangesToCheck = reverse ? reverseRanges : ranges;

    const rangesBound = useMemo(() => {
        if (!rangesToCheck.data) {
            return 'ok';
        }

        return checkRanges(rangesToCheck.data, amount);
    }, [amount, rangesToCheck]);

    const estimate = useEstimateQuery(
        {
            amount: reverse ? undefined : Number(amount),
            amount_to: reverse ? Number(amount) : undefined,
            from: sendCurrency.symbol,
            to: receiveCurrency.symbol,
            fixed,
        },
        { skip: !(rangesBound == 'ok' && !rangesToCheck.isError && !fiat) }
    );

    const mercuryoQuery = useFiatEstimateQuery(
        {
            amount: Number(amount),
            from: sendCurrency.symbol,
            to: receiveCurrency.symbol,
            fixed: false,
            provider: 'mercuryo'
        },
        { skip: !(rangesBound == 'ok' && !rangesToCheck.isError && fiat) }
    );
    const simplexQuery = useFiatEstimateQuery({
        amount: Number(amount),
        from: sendCurrency.symbol,
        to: receiveCurrency.symbol,
        fixed: false,
        provider: 'simplex'
    },
        { skip: !(rangesBound == 'ok' && !rangesToCheck.isError && fiat) })
    const fiatEstimates = [mercuryoQuery, simplexQuery]

    const sendPairs = usePairsFromQuery({ coin: receiveCurrency.symbol });
    const getPairs = usePairsToQuery({ coin: sendCurrency.symbol });


    const isPairFixed = useIsFixedQuery({
        from: sendCurrency.symbol,
        to: receiveCurrency.symbol,
    });

    const onChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        reverse?: boolean,
    ) => {
        const value = e.currentTarget.value.trim().replace(/,/g, '.');
        const numValue = Number(value);

        const validNumber = value == '' || !isNaN(numValue);
        if (!validNumber) {
            e.target.value = amount;
            return;
        }

        const nDecimalPlaces = nAfterDecimal(value);
        if ((fiat && nDecimalPlaces > 2) || (!fiat && nDecimalPlaces > 18)) {
            e.target.value = amount;
            return;
        }

        changedAmountWhileLoadingRanges.current = rangesToCheck.isFetching;

        dispatch(setAmount(value));
        dispatch(setReverse(Boolean(reverse)));
    };

    const onFixedChange = (fixed: boolean) => {
        dispatch(setFixed(fixed));

        if (!fixed) {
            dispatch(setReverse(false));

            if (reverse) {
                dispatch(setAmount(visibleEstimate));
            }
        }
    };

    const swap = () => {
        if (config?.lockReceiveCurrency) {
            return;
        }
        toggleSwapAnimation();

        dispatch(setSendCurrency(receiveCurrency));
        dispatch(setReceiveCurrency(sendCurrency));
    };

    const getVisibleEstimate = () => {
        if (loading) {
            return '';
        }

        if (
            rangesToCheck.isError ||
            (fiat
                ? fiatEstimates.forEach((fiatEstimate) => !fiatEstimate.data?.estimate)
                : estimate?.data?.estimate == null)
        ) {
            return '-';
        }

        if (fiat) {
            return (
                '≈' +
                fiatEstimates[
                    providers.findIndex((provider) => provider.name == selectedProvider)
                ].data?.estimate
            );
        }

        return (!fixed ? '≈' : '') + estimate.data?.estimate;
    };

    const getError = () => {
        if (rangesToCheck.isFetching) {
            return;
        }

        if (rangesToCheck.isError) {
            return t('pairError');
        }

        if (
            rangesToCheck.data &&
            (rangesBound == 'below' || rangesBound == 'over')
        ) {
            return (
                <span>
                    {rangesBound == 'below' ? t('minimumError') : t('maximumError')}{' '}
                    <ErrorAction
                        onClick={() => {
                            const rangeAmount =
                                rangesBound == 'below'
                                    ? rangesToCheck.data?.min_amount
                                    : rangesToCheck.data?.max_amount;

                            if (!rangeAmount) {
                                return;
                            }

                            dispatch(setAmount(rangeAmount));
                        }}
                    >
                        {rangesBound == 'below'
                            ? rangesToCheck.data.min_amount
                            : rangesToCheck.data.max_amount}{' '}
                        {(reverse ? receiveCurrency : sendCurrency).symbol.toUpperCase()}
                    </ErrorAction>
                </span>
            );
        }
    };

    const loading =
        (fiat
            ? fiatEstimates.some((fiatEstimate) => fiatEstimate.isUninitialized)
            : estimate.isUninitialized) ||
        rangesToCheck.isFetching ||
        isPairFixed.isFetching;

    const error = getError();

    const visibleEstimate = getVisibleEstimate();

    const formDisabled =
        loading ||
        Boolean(error) ||
        (fiat
            ? fiatEstimates.every((fiatEstimate) => fiatEstimate.isError)
            : estimate.isError);

    useEffect(() => {
        onDisableChange && onDisableChange(formDisabled);
    }, [formDisabled, onDisableChange]);

    return (
        <>
            <Container preserveSpace={preserveSpace} widget={widget ? 'true' : undefined}>
                <Input
                    currency={sendCurrency}
                    value={reverse ? visibleEstimate : amount}
                    loading={reverse && loading}
                    type="send"
                    onChange={(event) => onChange(event, false)}
                    error={reverse ? undefined : error}
                    fiat={fiat}
                    onCurrencySelect={(currency) => {
                        if (currency.symbol == receiveCurrency.symbol) {
                            dispatch(setReceiveCurrency(sendCurrency));
                        }
                        dispatch(setSendCurrency(currency));
                    }}
                    loadingCurrency={sendPairs.isLoading}
                    disabled={rangesToCheck.isError}
                    widget={false}
                    fixed={fixed}
                    onFixedChange={onFixedChange}
                    {...(config?.sendPairs
                        ? {
                            floatingDropdown: true,
                            availableCurrency: config.sendPairs,
                        }
                        : { availableCurrency: sendPairs.data || undefined })}
                />
                {fiat ? (
                    <PointerIconContainer>
                        <PointerIcon />
                    </PointerIconContainer>
                ) : (
                    <SwapButton
                        onClick={swap}
                        disabled={swapShouldAnimate}
                        data-testid="exchange-swap"
                        aria-label="Swap"
                        widget={widget ? 'true' : undefined}
                    >
                        <SwapIcon
                            animate={swapShouldAnimate}
                            onAnimationEnd={toggleSwapAnimation}
                        />
                        <SwapIconMobile
                            animate={swapShouldAnimate}
                            onAnimationEnd={toggleSwapAnimation}
                        />
                    </SwapButton>
                )}
                <Input
                    currency={receiveCurrency}
                    value={reverse ? amount : visibleEstimate}
                    loading={!reverse && loading}
                    type="get"
                    onChange={(event) => onChange(event, true)}
                    fiat={fiat}
                    error={reverse ? error : undefined}
                    onCurrencySelect={(currency) => {
                        if (currency.symbol == sendCurrency.symbol) {
                            dispatch(setSendCurrency(receiveCurrency));
                        }
                        dispatch(setReceiveCurrency(currency));
                    }}
                    loadingCurrency={getPairs.isLoading}
                    withLock={isPairFixed.data?.isFixed}
                    widget={widget}
                    fixed={fixed}
                    onFixedChange={onFixedChange}
                    disabled={!fixed || rangesToCheck.isError}
                    pressable={!config?.lockReceiveCurrency}
                    {...(config?.getPairs
                        ? {
                            floatingDropdown: true,
                            availableCurrency: config.getPairs,
                        }
                        : { availableCurrency: getPairs.data || undefined })}
                />
            </Container>
        </>
    );
};

export const checkRanges = (
    range: Range,
    amount: string,
): 'below' | 'over' | 'ok' => {
    if (amount == '') {
        return 'below';
    }

    const parsedAmount = Number(amount);

    if (range.min_amount && range.max_amount) {
        const parsedMin = Number(range.min_amount);
        const parsedMax = Number(range.max_amount);

        if (parsedMax < parsedAmount) {
            return 'over';
        }

        if (parsedMin > parsedAmount) {
            return 'below';
        }

        return 'ok';
    }

    if (range.min_amount) {
        const parsedMin = Number(range.min_amount);

        if (parsedMin > parsedAmount) {
            return 'below';
        }

        return 'ok';
    }

    return 'ok';
};

const nAfterDecimal = (num: string) => num.split('.')[1]?.length ?? 0;

export default Swap;
