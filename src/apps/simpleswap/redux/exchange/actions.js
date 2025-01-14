import { createAction } from '@reduxjs/toolkit';

export const setAllCurrencies = createAction('exchange/SET_ALL_CURRENCIES');
export const setFixedCurrencies = createAction('exchange/SET_FIXED_CURRENCIES');
export const setPopularCurrencies = createAction('exchange/SET_POPULAR_CURRENCIES');
export const setAllPairs = createAction('exchange/SET_ALL_PAIRS');
export const setFixedPairs = createAction('exchange/SET_FIXED_PAIRS');
export const setExchangeInfo = createAction('exchange/SET_EXCHANGE_INFO');
