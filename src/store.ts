// Core
import { Middleware, Reducer, combineReducers, configureStore, createDynamicMiddleware } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';

// Services
import { pillarXApiPresence } from './services/pillarXApiPresence';
import { pillarXApiWaitlist } from './services/pillarXApiWaitlist';

// Initialisation
const dynamicMiddleware = createDynamicMiddleware();
const middlewareReducers: { [key: string]: Reducer } = {};

/**
 * @name addMiddleware
 * @description addMiddleware is a function that allows anyone
 * working with PillarX to add RTK middleware to the store
 * from their own application.
 *
 * @param newMiddleware
 */
export const addMiddleware = (newMiddleware: {
  reducerPath: string; reducer: Reducer; middleware: Middleware 
}) => {
  middlewareReducers[newMiddleware.reducerPath as string] = newMiddleware.reducer;
  dynamicMiddleware.addMiddleware(newMiddleware.middleware);

  store.replaceReducer(combineReducers(middlewareReducers));
}

/**
 * Export a store from RTK
 */
export const store = configureStore({
  // Empty reducer for now - the addMiddleware function
  // below will dynamically regenerate the reducers required
  // from the middleware functions.
  reducer: {},
  // Adding the api middleware enables caching, invalidation, polling,
  // and other useful features of `rtk-query`.
  // Note: here we have added dynamicMiddleware.middleware
  // which instructs the store to use the middleware that we
  // will add later.
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(dynamicMiddleware.middleware),
});

/**
 * Whilst we're here we'll immediately mount the
 * PillarXApi middleware. This will contain all the
 * core API functionality for the PillarX application.
 */
addMiddleware(pillarXApiWaitlist);
addMiddleware(pillarXApiPresence);


// optional, but required for refetchOnFocus/refetchOnReconnect behaviors
// see `setupListeners` docs - takes an optional callback as the 2nd arg for customization
setupListeners(store.dispatch)
