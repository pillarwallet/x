export interface TokenPriceProps {
  value: number;
}

export default function TokenPrice(props: TokenPriceProps): JSX.Element {
  const { value } = props;
  const fixed = value.toFixed(10);
  const parts = fixed.split('.');

  const decimals = parts[1];
  const firstNonZeroIndex = decimals.search(/[^0]/);

  if (firstNonZeroIndex < 0) {
    return <p style={{ fontSize: 13, fontWeight: 400 }}>$0.00</p>;
  }

  if (value >= 0.01 || firstNonZeroIndex < 2) {
    return <p style={{ fontSize: 13, fontWeight: 400 }}>${value.toFixed(5)}</p>;
  }

  const leadingZerosCount = firstNonZeroIndex;
  const significantDigits = decimals.slice(
    firstNonZeroIndex,
    firstNonZeroIndex + 4
  );

  return (
    <p style={{ fontSize: 13, fontWeight: 400 }}>
      $0.0<sub>{leadingZerosCount}</sub>
      {significantDigits}
    </p>
  );
}
