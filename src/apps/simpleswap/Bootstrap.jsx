import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

import * as exchangeThunks from './redux/exchange/thunks';
import PropTypes from 'prop-types';
import WebFont from 'webfontloader';

const Bootstrap = (props) => {
  const { children } = props;
  const dispatch = useDispatch();
  WebFont.load({
    google: {
      families: ['Roboto:400,600', 'Inter:400,600,700']
    }
  });
  useEffect(()=>{
    (async () => {
      // await dispatch(exchangeThunks.fetchAllCurrencies());
      await dispatch(exchangeThunks.fetchAllPairs());
      await dispatch(exchangeThunks.fetchFixedPairs());
    })()
  }, []);

  return (
    <>
      {children}
    </>
  );
};

Bootstrap.propTypes = {
  children: PropTypes.node,
}

export default Bootstrap;
