import { configureStore, TypedStartListening } from '@reduxjs/toolkit';
import exchangeReducer from './reducers/exchange';
import { exchange } from '../lib/backend/api';

export const store = configureStore({
    reducer: {
        exchange: exchangeReducer,
        [exchange.reducerPath]: exchange.reducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({ serializableCheck: false }).concat(exchange.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStartListening = TypedStartListening<RootState, AppDispatch>; 