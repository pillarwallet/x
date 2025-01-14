import { createSelector } from '@reduxjs/toolkit';

export const getSlice = (state) => state.exchange;

export const getAllCurrenciesList = createSelector(getSlice, (state) => state.allCurrenciesList);
export const getFixedCurrencies = createSelector(getSlice, (state) => state.fixedCurrencies);
export const getAllPairsList = createSelector(getSlice, (state) => state.allPairsList);
export const getFixedPairs = createSelector(getSlice, (state) => state.fixedPairs);
export const getFiat = createSelector(getSlice, (state) => state.fiat);
