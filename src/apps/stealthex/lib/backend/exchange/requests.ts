import { Abortable } from 'events';
import { baseUrl, CoinData, CurrencyData } from '../api';
import { makeRequest } from '../makeRequest';

export const searchCurrency = async (
    {
        query,
        signal,
        onlySymbolSearch = false,
    }: { query: string; onlySymbolSearch?: boolean } & Abortable,
) =>
    makeRequest<CurrencyData>(
        {
            method: 'get',
            url: `${baseUrl}/api/exchange/searchCurrency`,
            signal,
            params: { query, only_symbol_search: onlySymbolSearch, timeout: false },
        },
    );

export const getFiatCoins = async (
    props?: Abortable,
) =>
    makeRequest<CoinData[]>(
        {
            method: 'get',
            url: `${baseUrl}/api/coins/fiat`,
            signal: props?.signal,
            params: { timeout: false, }
        },
    );
