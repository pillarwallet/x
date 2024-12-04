/* eslint-disable no-param-reassign */
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from '../../helpers/axios';
import {widgetInfo} from '../../constants/widgetInfo';

const initialState = {
  exchangeInfo: null,
};

export const GET_WIDGET_EXCHANGE_INFO = 'widget/GET_WIDGET_EXCHANGE_INFO';

// eslint-disable-next-line consistent-return
export const getWidgetExchangeInfo = createAsyncThunk(
  GET_WIDGET_EXCHANGE_INFO,
  async ({ exchangeId }) => {
      const headers = {
        'x-api-key': widgetInfo.apiKey,
      };
      const response = await axios.get(`/exchanges/${exchangeId}`, {
        headers,
      });

      return response.data.result;
  },
);

export const widgetSlice = createSlice({
  name: 'widget',
  initialState,
  reducers: {
    resetWidgetExchangeInfo: (state) => {
      state.exchangeInfo = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getWidgetExchangeInfo.fulfilled, (state, { payload }) => {
        state.exchangeInfo = payload;
      })
  },
});

export const { resetWidgetExchangeInfo } = widgetSlice.actions;

export default widgetSlice.reducer;
