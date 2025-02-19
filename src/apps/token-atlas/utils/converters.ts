export const hasThreeZerosAfterDecimal = (num: number): boolean => {
  const decimalPart = num.toString().split('.')[1] || '';
  return decimalPart.startsWith('000');
};

export const limitDigits = (num: number): number => {
  // Convert number to string with a max of 18 decimals
  const numStr = num.toFixed(18);
  const [integerPart, fractionalPart] = numStr.split('.');

  const integerDigitsCount = integerPart.length;

  if (integerDigitsCount >= 8) {
    // If integer part has 8 or more digits, return the number with 2 decimal digits
    return Number(num.toFixed(2));
  }
  // Determine the number of decimal places we can keep
  const maxDecimalPlaces = 8 - integerDigitsCount;
  const limitedFractionalPart = fractionalPart.substring(0, maxDecimalPlaces);
  return parseFloat(`${integerPart}.${limitedFractionalPart}`);
};

export const convertDateToUnixTimestamp = (date: Date): number =>
  Math.floor(date.getTime() / 1000);

export const convertUnixTimestampToDate = (timestamp: number): Date =>
  new Date(timestamp * 1000);

export const lowerRemoveSpaceString = (str: string) =>
  str.toLowerCase().replace(/[\s.-]/g, '');
