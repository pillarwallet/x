import * as actions from './actions';
import axios from '../../helpers/axios';
import {widgetInfo} from '../../constants/widgetInfo';

export const fetchAllCurrencies =
  (props = {}) =>
  (dispatch) => {
    dispatch(
      actions.setAllCurrencies({
        data: null,
        isLoading: true,
      }),
    );

    return axios
      .get(`/currencies?fixed=${!!props.isFixed}`, {    headers: {
          'x-api-key':widgetInfo.apiKey
        }})
      .then(({ data }) => {
        dispatch(
          actions.setAllCurrencies({
            data: data?.result,
            isLoading: false,
          }),
        );
      });
  };

export const fetchAllPairs = () => (dispatch) => {
  return axios.get(`/pairs?fixed=false?x-user-agent=${window.navigator.userAgent}`, {
    headers: {
      'x-api-key':widgetInfo.apiKey
    },
  })
    .then((data) => {
      dispatch(
        actions.setAllPairs({
          data: data.data.result ?? data,
        }),
      );
    });
};

export const fetchFixedPairs = () => (dispatch) => {
  return axios.get(`/pairs?fixed=true&x-user-agent=${window.navigator.userAgent}`, {
    headers: {
      'x-api-key':widgetInfo.apiKey
    },
  })
    .then((data) => {
      dispatch(
        actions.setFixedPairs({
          data: data.data.result ?? data,
        }),
      );
    });
};