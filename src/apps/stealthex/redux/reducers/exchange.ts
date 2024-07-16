import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { defaultReceiveCurrency, defaultSendCurrency } from '../../lib/consts';
import { CurrencyData } from '../../lib/backend/api';

type ExchangeState = {
    currentStep: number;
    selectedProvider: 'mercuryo' | 'simplex';
    receiveCurrency: CurrencyData;
    sendCurrency: CurrencyData;
    amount: string;
    fixed: boolean;
    fiat: boolean;
    reverse: boolean;
};

const initialState: ExchangeState = {
    currentStep: 1,
    selectedProvider: 'mercuryo',
    receiveCurrency: defaultReceiveCurrency,
    sendCurrency: defaultSendCurrency,
    amount: '0.1',
    fixed: false,
    fiat: false,
    reverse: false,
}

const exchangeSlice = createSlice({
    name: 'exchange', initialState, reducers: {
        setCurrentStep(state, action: PayloadAction<number>) {
            state.currentStep = action.payload;
        },
        setSelectedProvider(state, action: PayloadAction<'mercuryo' | 'simplex'>) {
            state.selectedProvider = action.payload
        },
        setReceiveCurrency(state, action: PayloadAction<CurrencyData>) {
            state.receiveCurrency = action.payload;
        },
        setSendCurrency(state, action: PayloadAction<CurrencyData>) {
            state.sendCurrency = action.payload;
        },
        setAmount(state, action: PayloadAction<string>) {
            state.amount = action.payload
        },
        setFixed(state, action: PayloadAction<boolean>) {
            state.fixed = action.payload
        },
        setFiat(state, action: PayloadAction<boolean>) {
            state.fiat = action.payload;
        },
        setReverse(state, action: PayloadAction<boolean>) {
            state.reverse = action.payload
        }
    }
})

export const {
    setCurrentStep,
    setSelectedProvider,
    setReceiveCurrency,
    setSendCurrency,
    setAmount,
    setFixed,
    setFiat,
    setReverse
} = exchangeSlice.actions;

export default exchangeSlice.reducer;