export const formatAmountDisplay = (
  amountRaw: string | number,
  minimumFractionDigits?: number,
  maximumFractionDigits: number = 2
): string => {
  const amount = typeof amountRaw === 'number' ? `${amountRaw}` : amountRaw;

  // check string to avoid underflow
  if ((amount !== '0.01' && amount.startsWith('0.01')) || amount.startsWith('0.00')) {
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
  return !isNaN(+amount);
};
