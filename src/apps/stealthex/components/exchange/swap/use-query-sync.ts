
import { useEffect, useRef } from 'react';
import {
  defaultAmount,
  defaultReceiveCurrency,
  defaultSendCurrency,
} from '../../../lib/consts';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { getFiatCoins, searchCurrency } from '../../../lib/backend/exchange/requests';
import { CurrencyData } from '../../../lib/backend/api';
import { setAmount, setFiat, setFixed, setReceiveCurrency, setReverse, setSendCurrency } from '../../../redux/reducers/exchange';


const updateURL = (newUrl: string) => {
  window.history.replaceState(
    { ...window.history.state, as: newUrl, url: newUrl },
    '',
    newUrl,
  );
};

const mapQueryObject = (query: Map<string, string>) => {
  if (Array.from(query.keys()).length == 0) {
    return window.location.pathname;
  }

  return (
    window.location.pathname +
    '?' +
    Array.from(query.entries())
      .map(([key, value]) => `${key}=${value}`)
      .join('&')
  );
};

export type UseQuerySyncConfig = {
  amount: string;
  fixed: boolean;
  fiat: boolean;
  sendCurrency: CurrencyData;
  receiveCurrency: CurrencyData;
};

const useQuerySync = (config?: UseQuerySyncConfig, sync = true) => {
  const dispatch = useAppDispatch();
  const { sendCurrency, receiveCurrency, fixed, amount, fiat, reverse } = useAppSelector(state => state.exchange)
  // const [receiveCurrency, setReceiveCurrency] = useAtom(receiveCurrencyAtom);
  // const [fixed, setFixed] = useAtom(fixedAtom);
  // const [amount, setAmount] = useAtom(amountAtom);
  // const [fiat, setFiat] = useAtom(fiatAtom);
  // const [reverse, setReverse] = useAtom(reverseAtom);

  const processedQuery = useRef(false);

  useEffect(() => {
    const processQueries = async () => {
      if (config || !sync) {
        processedQuery.current = true;

        return;
      }

      const query = new URLSearchParams(window.location.search);

      const legacyQueryTo = query.get('cur_to');
      const legacyQueryFrom = query.get('cur_from');

      const queryTo = query.get('to') || legacyQueryTo || 'btc';
      const queryFrom = query.get('from') || legacyQueryFrom || 'eth';

      const queryAmount = query.get('amount');
      const queryAmountTo = query.get('amountTo');
      let queryMethod = query.get('method');

      if (legacyQueryFrom || legacyQueryTo) {
        const query = new Map<string, string>();

        if (legacyQueryTo) {
          query.set('to', legacyQueryTo);
        } else if (queryTo) {
          query.set('to', queryTo);
        }

        if (legacyQueryFrom) {
          query.set('from', legacyQueryFrom);
        } else if (queryFrom) {
          query.set('from', queryFrom);
        }

        if (queryAmount) {
          query.set('amount', queryAmount);
        }

        query.set('method', 'fixed');
        queryMethod = 'fixed';

        const newUrl = mapQueryObject(query);
        updateURL(newUrl);
      }

      const promises = [];
      let fiatCoinsPromise = null;

      if (queryTo) {
        promises.push(
          searchCurrency({ query: queryTo, onlySymbolSearch: true }),
        );
      }

      if (queryFrom) {
        promises.push(
          searchCurrency({ query: queryFrom, onlySymbolSearch: true }),
        );
        fiatCoinsPromise = getFiatCoins();
      }

      const responses = await Promise.all(promises);

      let sendCurrency: CurrencyData | null = null;
      let receiveCurrency: CurrencyData | null = null;

      if (queryTo && queryFrom) {
        if (responses[0].data) {
          receiveCurrency = responses[0].data;
        }

        if (responses[1].data) {
          sendCurrency = responses[1].data;
        }
      } else {
        if (queryTo) {
          if (responses[0].data) {
            receiveCurrency = responses[0].data;
          }
        } else if (queryFrom) {
          if (responses[0].data) {
            sendCurrency = responses[0].data;
          }
        }
      }

      if (sendCurrency != null && fiatCoinsPromise != null) {
        const response = await fiatCoinsPromise;

        if (response.data) {
          const isFiat = response.data.find(
            (coin) => coin.symbol.toLowerCase() == sendCurrency?.symbol,
          );

          dispatch(setFiat(isFiat != undefined));
        }
      }

      if (sendCurrency) {
        dispatch(setSendCurrency(sendCurrency));
      }
      if (receiveCurrency) {
        dispatch(setReceiveCurrency(receiveCurrency));
      }
      if (queryAmount && !isNaN(Number(queryAmount))) {
        dispatch(setAmount(queryAmount));
      }

      if (queryMethod == 'fixed') {
        dispatch(setFixed(true));
        if (queryAmountTo && !isNaN(Number(queryAmountTo))) {
          dispatch(setAmount(queryAmountTo));
          dispatch(setReverse(true));
        }
      }

      processedQuery.current = true;
    };

    void processQueries();

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!processedQuery.current || !sync) {
      return;
    }

    const newQuery = new Map<string, string>();

    if (amount != defaultAmount) {
      const key = reverse ? 'amountTo' : 'amount';
      newQuery.set(key, amount);
    }

    if (fixed) {
      newQuery.set('method', 'fixed');
    }

    if (sendCurrency.symbol != defaultSendCurrency.symbol) {
      newQuery.set('from', sendCurrency.symbol);
    }

    if (
      (!fiat && receiveCurrency.symbol != defaultReceiveCurrency.symbol) ||
      fiat
    ) {
      newQuery.set('to', receiveCurrency.symbol);
    }

    const newUrl = mapQueryObject(newQuery);
    updateURL(newUrl);
  }, [amount, fixed, fiat, sendCurrency, receiveCurrency, sync, reverse]);

  useEffect(() => {
    if (!config || !processedQuery.current) {
      return;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [config]);
};

export default useQuerySync;