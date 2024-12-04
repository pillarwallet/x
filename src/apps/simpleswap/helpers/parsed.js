export const toLower = (string) => string.toLowerCase();

export const toUpper = (string) => string.toUpperCase();

export const price = (amount, toFixed = 0) => {
  if (toFixed === false) {
    const a = amount.toString().split('.')[0];
    const b = amount.toString().split('.')[1];
    const amountRes = a.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');

    if (!b) return amountRes;

    return `${amountRes}.${b.substr(0, 6)}`;
  }

  return Number(amount)
    .toFixed(toFixed)
    .toString()
    .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
};

export const parseAmount = (amount) => {
  const countDecimals = (value) => {
    if (Math.floor(value) === value) {
      return 0;
    }
    const split = value.toString().split('.');
    if (split && split.length === 2) {
      return split[1].length || 0;
    }
    return 0;
  };

  if (countDecimals(Number(amount)) > 6) {
    return Number(amount).toFixed(6);
  }
  return amount;
};

export const decreaseTextLength = (text, symbols) => {
  if (text.length <= symbols * 2) return text;
  return `${text.slice(0, symbols)}…${text.slice(-symbols)}`;
};
