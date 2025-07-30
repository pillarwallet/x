export function formatTokenPriceDisplay(value: number): JSX.Element {
  const fixed = value.toFixed(10);
  const parts = fixed.split('.');

  if (!parts[1]) {
    return <p style={{ fontSize: 13, fontWeight: 400 }}>${value.toFixed(5)}</p>;
  }

  const decimals = parts[1];
  const firstNonZeroIndex = decimals.search(/[^0]/);

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

export function formatPriceChangeDisplay(value: number): JSX.Element {
  const green = (
    <svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginTop: 6, marginRight: 3 }}
    >
      <path
        d="M2.51996 0.640004C2.75995 0.320002 3.23995 0.319998 3.47996 0.639996L5.27999 3.04C5.57665 3.43554 5.29442 4 4.79999 4H1.19999C0.705563 4 0.423334 3.43555 0.719986 3.04L2.51996 0.640004Z"
        fill="#5CFF93"
      />
    </svg>
  );

  const red = (
    <svg
      width="6"
      height="4"
      viewBox="0 0 6 4"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ marginTop: 6, marginRight: 3 }}
    >
      <path
        d="M2.51996 3.36C2.75995 3.68 3.23995 3.68 3.47996 3.36L5.27999 0.960003C5.57665 0.564462 5.29442 0 4.79999 0H1.19999C0.705563 0 0.423334 0.564454 0.719986 0.959996L2.51996 3.36Z"
        fill="#FF366C"
      />
    </svg>
  );

  return (
    <div>
      <div
        className="flex"
        style={{
          fontSize: 13,
          fontWeight: 400,
          color: value > 0 ? '#5CFF93' : '#FF366C',
        }}
      >
        {value > 0 ? green : red}
        <p>{value < 0 ? (value * -1).toFixed(2) : value.toFixed(2)}%</p>
      </div>
    </div>
  );
}
