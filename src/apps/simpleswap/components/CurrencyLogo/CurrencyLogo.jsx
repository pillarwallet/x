/* eslint-disable no-param-reassign */
import React from 'react';
import PropTypes from 'prop-types';

import { StyledImage } from './styles';

const CurrencyLogo = ({ mSize, tSize, dSize, symbol }) => {
  const ref = React.useRef(null);

  const src = `https://static.simpleswap.io/images/currencies-logo/${symbol}.svg`;
  const fallbackSrc = `https://static.simpleswap.io/images/currencies-logo-old/${
    symbol && symbol[0].toUpperCase()
  }.svg`;

  React.useEffect(() => {
    new Promise((resolve) => {
      const img = document.createElement('img');
      img.onerror = () => resolve(false);
      img.onload = () => resolve(true);
      img.src = src;
    }).then((isValid) => {
      if (!isValid && ref.current) ref.current.src = fallbackSrc;
    });
  }, [symbol]);

  return (
    <StyledImage
      ref={ref}
      src={src}
      $mSize={mSize}
      $tSize={tSize}
      $dSize={dSize}
      loading="lazy"
      width={24}
      height={24}
    />
  );
};

CurrencyLogo.propTypes = {
  mSize: PropTypes.number, tSize: PropTypes.number, dSize: PropTypes.number, symbol: PropTypes.string
}

export default CurrencyLogo;
