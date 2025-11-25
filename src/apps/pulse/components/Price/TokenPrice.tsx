export interface TokenPriceProps {
  value: number;
}

/**
 * Renders a token price in USD using different formats depending on its magnitude and where the first non-zero decimal appears.
 *
 * @param props - Component props.
 * @param props.value - The token price in USD.
 * @returns A JSX element displaying the formatted price: "$0.00" when all decimals are zero, "$X.XX" for values >= 0.01 or when the first non-zero decimal is within the first two places, and a compact "$0.0<sub>N</sub>dddd" form for very small values where `N` is the number of leading zeros before the first significant digits and `dddd` are up to four significant decimal digits.
 */
export default function TokenPrice(props: TokenPriceProps): JSX.Element {
  const { value } = props;
  const fixed = value.toFixed(10);
  const parts = fixed.split('.');

  const decimals = parts[1];
  const firstNonZeroIndex = decimals.search(/[^0]/);

  if (firstNonZeroIndex < 0) {
    return (
      <p
        style={{ fontSize: 13, fontWeight: 400 }}
        data-testid="pulse-token-price"
      >
        $0.00
      </p>
    );
  }

  if (value >= 0.01 || firstNonZeroIndex < 2) {
    return (
      <p
        style={{ fontSize: 13, fontWeight: 400 }}
        data-testid="pulse-token-price"
      >
        ${value.toFixed(2)}
      </p>
    );
  }

  const leadingZerosCount = firstNonZeroIndex;
  const significantDigits = decimals.slice(
    firstNonZeroIndex,
    firstNonZeroIndex + 4
  );

  return (
    <p
      style={{ fontSize: 13, fontWeight: 400 }}
      data-testid="pulse-token-price"
    >
      $0.0<sub>{leadingZerosCount}</sub>
      {significantDigits}
    </p>
  );
}