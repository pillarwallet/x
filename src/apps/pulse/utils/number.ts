export function formatBigNumber(num: number): string {
  if (num > 0 && num < 1_000_000) {
    return `${(num / 1_000).toFixed(3).replace(/\.?0+$/, '')}K`;
  }
  if (num >= 1_000_000 && num < 1_000_000_000) {
    return `${(num / 1_000_000).toFixed(3).replace(/\.?0+$/, '')}M`;
  }
  if (num >= 1_000_000_000) {
    return `${(num / 1_000_000_000).toFixed(3).replace(/\.?0+$/, '')}B`;
  }
  return num.toString();
}

export function parseNumberString(input: string): number {
  const match = input.match(/^([\d,.]+)([KMB]?)$/i);
  if (!match) return 0;

  const [, num, unit] = match;
  let value = parseFloat(num.replace(/,/g, ''));

  switch (unit.toUpperCase()) {
    case 'K':
      value *= 1_000;
      break;
    case 'M':
      value *= 1_000_000;
      break;
    case 'B':
      value *= 1_000_000_000;
      break;
    default:
      value *= 1;
      break;
  }
  return value;
}
