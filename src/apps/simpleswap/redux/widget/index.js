import reducer from './reducer';
import getClientLanguage from '../../helpers/getClientLanguage';
import axios from '../../helpers/axios';
import {widgetInfo} from '../../constants/widgetInfo';

export const createWidgetExchange = async ({
  fixed,
  currencyFrom,
  currencyTo,
  address,
  amount,
  extraId,
}) => {
  const params = new URLSearchParams({
    'x-user-language': getClientLanguage(),
  });

  if (process.browser) {
    const { timeZone } = Intl.DateTimeFormat().resolvedOptions();
    const timeOffset = new Date().getTimezoneOffset() / 60;

    params.append('x-user-timezone',`${timeZone}, ${timeOffset}`);
    params.append('x-user-agent', window.navigator.userAgent);
  }
  const res = await axios({
    method: 'POST',
    url: `/exchanges?${params.toString()}`,
    data: {
      fixed,
      tickerFrom: currencyFrom.ticker,
      tickerTo: currencyTo.ticker,
      networkFrom:currencyFrom.network,
      networkTo: currencyTo.network,
      addressTo: address,
      amount,
      extraIdTo: extraId,
    },
    headers: {
      'x-api-key':widgetInfo.apiKey
    },
  })

  return res.data
};

export default reducer;
