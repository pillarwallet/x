import { createReducer } from '@reduxjs/toolkit';

import * as actions from './actions';

const initialState = {
  allCurrenciesList: {
    data: null,
    isLoading: true,
  },
  filter: {
    data: null,
    isLoading: true,
  },
  fixedCurrencies: null,
  allPairsList: null,
  fixedPairs: null,
  fiat: null,
  popularCurrencies: null,
  popularFiat: null,
  exchangesList: [],
};

const reducer = createReducer(initialState, (builder) => {
  builder.addCase(actions.setAllCurrencies, (state, action) => {
    const { data, isLoading } = action.payload;
    if (isLoading)
      return {
        ...state,
        allCurrenciesList: { data: null, isLoading: true },
      };

    const mapCoins = data.filter((coinItem) => !coinItem.isFiat);
    return {
      ...state,
      allCurrenciesList: { data: mapCoins, isLoading: false },
    };
  })
    .addCase(actions.setAllPairs, (state, action) => {
      const { data } = action.payload;

      return {
        ...state,
        allPairsList: data,
      };
    })
    .addCase(actions.setFixedCurrencies, (state, action) => {
      const { data } = action.payload;

      return {
        ...state,
        fixedCurrencies: data,
      };
    })
    .addCase(actions.setFixedPairs, (state, action) => {
      const { data: fixedPairs } = action.payload;

      return {
        ...state,
        fixedPairs,
      };
    })
    .addCase(actions.setPopularCurrencies, (state, action) => {
      const { popularCurrencies } = action.payload;

      return {
        ...state,
        popularCurrencies,
      };
    })
    .addCase(actions.setExchangeInfo, (state, action) => {
      const { data, exchangeId } = action.payload;

      const { exchangesList } = state;

      if (data.error) {
        return state;
      }

      const newExchangesList = exchangesList.filter((i) => i.id !== exchangeId);
      newExchangesList.push(data.data);

      return {
        ...state,
        exchangesList: newExchangesList,
      };
    })
})


export default reducer;
