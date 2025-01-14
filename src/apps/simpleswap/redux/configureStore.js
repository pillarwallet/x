import {combineReducers, configureStore} from '@reduxjs/toolkit';

// Reducers
import exchange from './exchange/reducer';
import widget from './widget';

const reducer = combineReducers({
  exchange,
  widget,
});

const createStoreBootstrap = () => {
  return configureStore({ reducer });
};

export default createStoreBootstrap;
