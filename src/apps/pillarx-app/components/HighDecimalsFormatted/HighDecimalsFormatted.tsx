type HighDecimalsFormattedProps = {
  value: number;
  moneySymbol?: string;
  styleNumber?: string;
  styleZeros?: string;
};
const HighDecimalsFormatted = ({
  value,
  moneySymbol,
  styleNumber,
  styleZeros,
}: HighDecimalsFormattedProps) => {
  const formatNumber = (num: number) => {
    const [integer, decimals] = num.toString().split('.');
    if (!decimals) return num;

    // The match will match an array of 0 at the beginning of the decimals
    const match = decimals.match(/^(0+)/);

    // If there is a match, this will show the number of 0 in total at the beginning of the decimals
    const zeroCount = match ? match[0].length : 0;

    if (zeroCount < 2) {
      return num.toString();
    }

    const remainingDecimals = decimals.slice(zeroCount);

    return (
      <>
        {integer}.0
        <span className={`${styleZeros} align-sub mr-0.5 ml-0.5`}>
          {zeroCount}
        </span>
        {remainingDecimals}
      </>
    );
  };

  return (
    <p className={`${styleNumber}`}>
      {moneySymbol}
      {formatNumber(value)}
    </p>
  );
};

export default HighDecimalsFormatted;
