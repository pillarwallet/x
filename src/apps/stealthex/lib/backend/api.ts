import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { RequestResponse } from './type';
import { ExchangeInfo } from '../../type';
import { ProviderName } from '../providers';

export const baseUrl = 'https://stealthex.io';

export type Abortable = { signal?: AbortSignal }

export type IsFixed = {
    isFixed: boolean;
};

export type CreateExchangeParams = {
    currencyFrom: string;
    currencyTo: string;
    address: string;
    extraId?: string;
    amountTo?: string;
    amountFrom?: string;
    referral?: string;
    fixed?: boolean;
    timezoneOffset: number;
    isWidget?: boolean;
    partnerId?: string;
    rate_id?: string;
    refundAddress?: string;
    provider?: ProviderName;
};
export type Estimate = {
    estimate: string | null;
    rate_id?: string;
};

export type Range = {
    min_amount?: string;
    max_amount?: string;
    message?: string;
};

export type EstimateProps = {
    from: string | null;
    to: string | null;
    amount?: number;
    amount_to?: number;
    fixed: boolean;
    provider?: 'simplex' | 'mercuryo';
    signal?: AbortSignal;
};

export type RangeProps = {
    to: string | null;
    from: string | null;
    fixed?: boolean;
    fiat?: boolean;
    reverse?: boolean;
};

export type CoinImage = {
    id?: string;
    mimetype?: string;
    size?: number;
    filename: string;
    originalFilename?: string;
    encoding?: string;
    _meta?: boolean;
};

export type Post = {
    id: number;
    date: string;
    link: string;
    title: {
        rendered: string;
    };
    excerpt: {
        rendered: string;
    };
    featured_media: number;
    categories: string[];
    tags: number[];
    modified?: string;
};

export type FormattedPost = Post & {
    image: string;
};

export type CoinData = {
    change24h?: string;
    changepct24h?: string;
    high24h?: string;
    low24h?: string;
    mktcap?: string;
    price: string;
    network: string | null;
    supply?: string;
    volume24h?: string;
    _id: string;
    image: string;
    symbol: string;
    slug: string;
    name: string;
    about?: string;
    order?: number;
    colorIcon?: CoinImage;
    seoImage?: CoinImage;
    disableTradingView: false;
    priceChart: {
        type: 'third_party';
        symbol: string;
    };
    relatedArticles: FormattedPost[];
};

export type CurrencyData = {
    symbol: string;
    slug?: string;
    has_extra_id: boolean;
    extra_id: string | null;
    is_fiat?: boolean;
    name: string;
    network: string | null;
    warnings_from: string[];
    warnings_to: string[];
    validation_address: string | null;
    validation_extra: string | null;
    address_explorer: string | null;
    tx_explorer: string | null;
    image: string;
};

export type PairsTo = {
    popular: CurrencyData[];
    other: CurrencyData[];
};

export type PairsFrom = {
    popular: CurrencyData[];
    other: CurrencyData[];
    fiat: CurrencyData[];
};

export const exchange = createApi({
    reducerPath: 'exchangeInfo',
    baseQuery: fetchBaseQuery({ baseUrl }),
    endpoints: (builder) => ({
        exchangeInfo: builder.query<{ data: ExchangeInfo, signature: string }, string>({
            query: (exchangeId) => ({ url: `/api/exchange/v2/${exchangeId}` })
        }),
        createExchange: builder.mutation<{ data: ExchangeInfo, signature: string }, CreateExchangeParams>({
            query: ({ ...params }) => {
                const { currencyFrom, currencyTo, address, extraId, amountFrom, amountTo, isWidget, partnerId, refundAddress, ...otherParams } = params;
                return ({
                    url: '/api/exchange/v2/create', method: 'POST', body: {
                        currency_from: currencyFrom,
                        currency_to: currencyTo,
                        address_to: address,
                        extra_id_to: extraId,
                        amount_from: amountFrom,
                        amount_to: amountTo,
                        partner_id: partnerId,
                        is_widget: isWidget,
                        refund_address: refundAddress,
                        refund_extra_id: '',
                        ...otherParams,
                    }
                })
            },
        }),
        estimate: builder.query<Estimate, EstimateProps>({
            query: ({ amount, amount_to, from, to, fixed, signal }) => ({ url: `/api/exchange/estimate/v3/${from}/${to}`, params: { amount, fixed, amount_to }, signal })
        }),
        fiatEstimate: builder.query<Estimate, EstimateProps>({
            query: ({ amount, from, to, signal, provider }) => ({ url: `/api/exchange/estimate/v3/${from}/${to}`, params: { amount, fixed: false, provider }, signal })
        }),
        fiatCoins: builder.query<RequestResponse<false, CoinData[]>, Abortable>({
            query: ({ signal }) => ({ url: '/api/coins/fiat', signal, params: { timeout: false } })
        }),
        searchCurrency: builder.query<RequestResponse<false, CurrencyData>, { query: string, signal?: AbortSignal, onlySymbolSearch: boolean, }>({
            query: ({ signal, query, onlySymbolSearch }) => ({ url: '/api/exchange/searchCurrency', signal, params: { query, only_symbol_search: onlySymbolSearch } })
        }),
        range: builder.query<Range, RangeProps & { signal?: AbortSignal, enabled?: boolean }>({
            query: ({ to, from, signal, ...searchParams }) => ({ url: `/api/exchange/range/${from}/${to}`, params: searchParams, signal })
        }),
        pairsFrom: builder.query<PairsFrom, { coin: string | null } & Abortable>({
            query: ({ coin, signal }) => ({ url: `/api/exchange/pairsfrom/${coin}`, signal })
        }),
        pairsTo: builder.query<PairsTo, { coin: string | null } & Abortable>({
            query: ({ coin, signal }) => ({ url: `/api/exchange/pairs/${coin}`, signal })
        }),
        isFixed: builder.query<IsFixed, { from: string, to: string } & Abortable>({
            query: ({ from, to, signal }) => ({ url: `/api/exchange/is-fixed/${from}/${to}`, signal })
        })
    })
})

// export const estimate = createApi({
//     reducerPath: 'estimate',
//     baseQuery: fetchBaseQuery({baseUrl}),
//     endpoints: (builder) => ({
//         estimateInfo: builder.mutation<RequestResponse<true,Estimate>,CreateExchangeParams & {signal: AbortSignal}>({
//             query: ({currencyTo, currencyFrom,signal,  ...searchParams }) => ({url: `/api/exchange/estimate/v3/${currencyFrom}/${currencyTo}/?amount=${searchParams.}`,signal, method: 'POST'  })
//         })
//     })
// })


export const { useExchangeInfoQuery, useCreateExchangeMutation, useFiatEstimateQuery, useFiatCoinsQuery, useSearchCurrencyQuery, useRangeQuery, useEstimateQuery, usePairsFromQuery, usePairsToQuery, useIsFixedQuery } = exchange;