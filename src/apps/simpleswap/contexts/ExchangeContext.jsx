import React, { useEffect, useState, useCallback, useContext, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux'
import _ from 'lodash';
import Axios from 'axios';
import { useTranslation } from 'react-i18next';
import * as exchangeSelectors from '../redux/exchange/selectors';
import axios from '../helpers/axios';
import { createWidgetExchange } from '../redux/widget';
import { InformationContext } from './InformationContext';
import { resetWidgetExchangeInfo, getWidgetExchangeInfo } from '../redux/widget/reducer';
import {widgetInfo} from '../constants/widgetInfo';
import {getCurrencyInternalName} from '../helpers/formatCurrency';
import PropTypes from 'prop-types';
import useBottomMenuModal from '../../../hooks/useBottomMenuModal';
import {getChainIdByNetwork} from '../constants/networkData';
import * as exchangeThunks from "../redux/exchange/thunks";

export const ExchangeContext = React.createContext({ state: {}, actions: {}, error: {} });
const requestTimeout = 1000 * 30;

export const ExchangeProvider = (props) => {
  const { children } = props;
  const { t } = useTranslation();

  const {
    actions: { setError, setWarning },
  } = useContext(InformationContext);

  const [isFixed, setIsfixed] = useState(false);
  const dispatch = useDispatch();
  const rangesControllerRef = useRef();
  const estimatesControllerRef = useRef();
  const allCurrencies = useSelector(exchangeSelectors.getAllCurrenciesList).data;
  const exchangeInfo = useSelector((state) => state.widget.exchangeInfo);

  const [currencyFrom, setCurrencyFrom] = useState(
    allCurrencies?.find(
      (i) => getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyFrom || 'eth:eth'),
    ) || {network: 'eth', ticker: 'eth'},
  );
  const [currencyTo, setCurrencyTo] = useState(
    allCurrencies?.find(
      (i) => getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyTo || 'btc:btc'),
    ) || {network: 'btc', ticker: 'btc'},
  );
  const [currencyFromValue, setCurrencyFromValue] = useState(
    widgetInfo?.defaultPaymentAmount || 0.1,
  );
  const [currencyToValue, setCurrencyToValue] = useState(null);
  const [minAmount, setMinAmount] = useState(null);
  const [maxAmount, setMaxAmount] = useState(null);
  const [isAmountLoading, setIsAmountLoading] = useState({
    from: !currencyFromValue || false,
    to: false,
  });
  const [timer, setTimer] = useState();
  const [updateExchangeTimer, setUpdateExchangeTimer] = useState(null);

  const [address, setAddress] = useState('');
  const [extraId, setExtraId] = useState('');
  const [updatedCount, setUpdatedCount] = useState('');
  const { showTransactionConfirmation } = useBottomMenuModal();

  const setNoSupported = useCallback(() => {
    setError(t('ERRORS.TEXT_4'));
    setIsAmountLoading({
      from: false,
      to: false,
    });
  }, [t]);

  async function getMinMaxAmount() {
    setIsAmountLoading({
      from: true,
      to: true,
    });

    const getMinMaxApiBinding = () => {
      if (rangesControllerRef.current) {
        rangesControllerRef.current.cancel();
      }
      const controller = Axios.CancelToken.source();
      const timeout = setTimeout(() => {
        controller.cancel();
        rangesControllerRef.current = null;
      }, requestTimeout);
      rangesControllerRef.current = controller;

      return axios(
        `/ranges?tickerFrom=${currencyFrom.ticker}&tickerTo=${currencyTo.ticker}&networkFrom=${currencyFrom.network}&networkTo=${currencyTo.network}&fixed=${isFixed}`,
        {
          headers: {
            'x-api-key':widgetInfo.apiKey
          },
          cancelToken: controller.token,
        },
      ).finally(() => {
        rangesControllerRef.current = null;
        clearTimeout(timeout);
      });
    };

    return getMinMaxApiBinding()
      .then(({ data }) => {
        setMinAmount(data.result.min);
        setMaxAmount(data.result.max);
        setIsAmountLoading({
          ...isAmountLoading,
          from: false,
        });
        return data;
      })
      .catch((err) => {
        if (err?.response?.data?.code === 404) {
          setNoSupported();
        }
      });
  }

  const getEstimated = async (value, rangesData) => {
    setIsAmountLoading({
      ...isAmountLoading,
      to: true,
    });
    if (
      +currencyFromValue < rangesData?.result?.min ||
      +currencyFromValue > (rangesData?.result?.max || Infinity)
    ) {
      return null;
    }

    const getEstimatedApiBinding = () => {
      if (estimatesControllerRef.current) {
        estimatesControllerRef.current.cancel();
      }
      const controller = Axios.CancelToken.source();
      const timeout = setTimeout(() => {
        controller.cancel();
        estimatesControllerRef.current = null;
      }, requestTimeout);
      estimatesControllerRef.current = controller;

      return axios.get(
        `/estimates?tickerFrom=${currencyFrom.ticker}&tickerTo=${currencyTo.ticker}&networkFrom=${currencyFrom.network}&networkTo=${currencyTo.network}&fixed=${isFixed}&amount=${value}`,
        {
          headers: {
            'x-api-key':widgetInfo.apiKey
          },
          cancelToken: controller.token,
        },
      ).finally(() => {
        estimatesControllerRef.current = null;
        clearTimeout(timeout);
      });
    };

    return getEstimatedApiBinding().then(
      ({ data }) => {
        if (data === null || !data?.result?.estimatedAmount) {
          setNoSupported();

          return;
        }
        setError(null);

        setIsAmountLoading({
          ...isAmountLoading,
          to: false,
        });
        setCurrencyToValue(data.result.estimatedAmount);
      },
      (e) => {
        if (e?.response?.data?.code === 404) {
          setNoSupported();
        }
      },
    );
  };

  const updateMinMaxAmount = () => {
    setError(false);
    getMinMaxAmount();
  };

  const forDebounceGetEstimated = async (value) => {
    setIsAmountLoading({
      ...isAmountLoading,
      to: true,
    });
    const rangesData = {
      result: {
        min: minAmount,
        max: maxAmount,
      },
    };
    getEstimated(value, rangesData);
  };
  const debounceGetEstimated = _.debounce(forDebounceGetEstimated, 800, {
    leading: true,
  });
  const debounceUpdateMinMax = _.debounce(updateMinMaxAmount, 1500, {
    leading: true,
  });

  const setAmount = (value) => {
    if ((currencyFromValue === '0' && value === '00') || isAmountLoading.from) {
      return;
    }

    setCurrencyFromValue(value);
    debounceGetEstimated(value);
  };

  const createExchange = async () => {
    try {
      const request = await createWidgetExchange({
        currencyFrom,
        currencyTo,
        address,
        amount: parseFloat(currencyFromValue),
        extraId,
        fixed: isFixed,
      });

      if (!request?.result?.id) throw new Error(request?.error || 'wrong request');
      await dispatch(getWidgetExchangeInfo({ exchangeId: request?.result.id }));
      setError(null);
      setWarning(null);
      setUpdateExchangeTimer(
        setInterval(() => {
          dispatch(getWidgetExchangeInfo({ exchangeId: request?.result.id }));
        }, 30000),
      );
      showTransactionConfirmation({
        title: 'SimpleSwap Exchange',
        description: `send ${currencyFromValue} ${currencyFrom.ticker.toUpperCase()} to ${request?.result.addressFrom} \n
         : chainId ${getChainIdByNetwork(request?.result.networkFrom).chainId}`,
        transaction: {
          to: request?.result.addressFrom,
          value: request?.result.amount,
          chainId: getChainIdByNetwork(request?.result.networkFrom).chainId,
        },
      })
    } catch (e) {
      setError(e?.response?.data?.error || e.toString());
    }
  };

  const clearUpdateTimer = () => {
    clearInterval(updateExchangeTimer);
    setUpdateExchangeTimer(null);
  };

  const refresh = () => {
    if (!allCurrencies) return;
    setIsfixed(false);
    setCurrencyFrom(
      allCurrencies.find(
        (i) => getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyFrom || 'eth:eth'),
      ),
    );
    setCurrencyTo(
      allCurrencies.find(
        (i) =>  getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyTo || 'btc:btc'),
      ),
    );
    setAmount(widgetInfo.defaultPaymentAmount || 0.1);
    dispatch(resetWidgetExchangeInfo());
    clearUpdateTimer();
    setAddress('');
    setExtraId('');
  };

  useEffect(() => {
    (async () => {
      debounceUpdateMinMax();
    })();
  }, [isFixed, currencyFrom, currencyTo]);

  useEffect(() => {
    if (!minAmount) return;
      setError(false);
      debounceGetEstimated(currencyFromValue);
  }, [minAmount, maxAmount]);
  useEffect(() => {
    dispatch(
      exchangeThunks.fetchAllCurrencies({
        isFixed,
      }),
    );
  }, [isFixed]);
  useEffect(() => {
    if (!allCurrencies) return;
    if (!currencyFrom.id) setCurrencyFrom(allCurrencies?.find(
      (i) => getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyFrom || 'eth:eth')));
    if (!currencyTo.id) setCurrencyTo(allCurrencies?.find(
      (i) => getCurrencyInternalName(i) === (widgetInfo.defaultCurrencyTo || 'btc:btc')));
  }, [allCurrencies]);

  useEffect(() => {
    const newTimer = setInterval(() => {
      setUpdatedCount((updatedCount) => updatedCount + 1);
    }, 30000);

    setTimer(newTimer);
    return function cleanup() {
      clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    if (!allCurrencies?.length) return;
    debounceUpdateMinMax();
    debounceGetEstimated(currencyFromValue);
  }, [updatedCount]);

  return (
    <ExchangeContext.Provider
      value={{
        state: {
          isFixed,
          currencyFrom,
          currencyTo,
          currencyFromValue,
          currencyToValue,
          minAmount,
          maxAmount,
          isAmountLoading,
          address,
          extraId,
          exchangeInfo,
        },
        actions: {
          setAmount,
          setIsfixed,
          setCurrencyFrom,
          setCurrencyTo,
          setAddress,
          setExtraId,
          createExchange,
          clearUpdateTimer,
          refresh,
        },
      }}
    >
      {children}
    </ExchangeContext.Provider>
  );
};

ExchangeProvider.propTypes = {
  children: PropTypes.node
}