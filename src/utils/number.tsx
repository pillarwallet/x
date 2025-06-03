import { parseInt, parseInt as parseIntLodash } from 'lodash';

export const formatAmountDisplay = (
  amountRaw: string | number,
  minimumFractionDigits?: number,
  maximumFractionDigits: number = 2
): string => {
  const amount = typeof amountRaw === 'number' ? `${amountRaw}` : amountRaw;

  // check string to avoid underflow
  if (
    (amount !== '0.01' && amount.startsWith('0.01')) ||
    amount.startsWith('0.00')
  ) {
    const [, fraction] = amount.split('.');
    let smallAmount = '0.';

    fraction.split('').every((digitString) => {
      if (digitString === '0') {
        smallAmount = `${smallAmount}0`;
        return true;
      }
      smallAmount = `${smallAmount}${digitString}`;
      return false;
    });

    return smallAmount;
  }

  const formatConfig = { maximumFractionDigits, minimumFractionDigits };

  return new Intl.NumberFormat('en-US', formatConfig).format(+amount);
};

export const isValidAmount = (amount?: string): boolean => {
  if (!amount) return false;
  if (+amount <= 0) return false;
  // eslint-disable-next-line no-restricted-globals
  return !isNaN(+amount);
};

export const limitDigitsNumber = (num: number): number => {
  // Handle zero or undefined number
  if (num === 0 || !num) return 0;

  // Convert number to string with a large number of decimals to make sure it covers all decimals
  const numStr = num.toFixed(20);
  const [integerPart, fractionalPart] = numStr.split('.');

  // If integer part is greater than 0 it will show between 2 and 4 decimals
  if (parseIntLodash(integerPart) > 0) {
    if (parseIntLodash(integerPart) >= 1000) {
      return Number(num.toFixed(2));
    }
    return Number(num.toFixed(4));
  }
  // If integer part is equal to 0 it will find the position of the first non-zero digit
  const firstNonZeroIndex = fractionalPart.search(/[1-9]/);

  // If we do not find 0, return 0
  if (firstNonZeroIndex === -1) return 0;

  // Show up to firstNonZeroIndex + 2-4 significant digits
  const significantDigits = 4; // Show first non-zero digit plus 3 more (4 significant)
  const decimalPlaces = firstNonZeroIndex + significantDigits;

  // Ensure we have at least those digits in the fractional part
  return Number(num.toFixed(decimalPlaces));
};

/**
 * @name formatExponential
 * @description Format a number in exponential notation to a string
 * @param {Number} num
 * @returns {String}
 */
export const formatExponential = (num: number) => {
  // Convert the number to a string with maximum precision
  const str = num.toString();

  // If the number is not in exponential format, return as is
  if (!str.includes('e') && !str.includes('E')) {
    return str;
  }

  // Split the number into mantissa and exponent
  const [mantissa, exponent] = str.toLowerCase().split('e');
  const exp = parseInt(exponent);

  // Split mantissa into integer and fractional parts
  const [intPart, fracPart = ''] = mantissa.split('.');

  // Calculate the number of decimal places to move
  const decimalPlaces = exp > 0 ? exp : -exp;

  if (exp > 0) {
    // Move decimal point to the right
    const newIntPart =
      intPart + (fracPart + '0'.repeat(decimalPlaces)).slice(0, decimalPlaces);
    const newFracPart = (fracPart + '0'.repeat(decimalPlaces)).slice(
      decimalPlaces
    );
    const final = newFracPart ? `${newIntPart}.${newFracPart}` : newIntPart;
    return final;
  }
  // Move decimal point to the left
  const newIntPart = '0'.repeat(decimalPlaces - intPart.length) + intPart;

  const final = `0.${newIntPart}${fracPart}`;
  return final;
};
