import { SortType } from '../types/tokens';

export interface SortProps {
  sortType?: SortType;
}

export default function Sort(props: SortProps) {
  const { sortType } = props;
  return (
    <svg
      width="8"
      height="14"
      viewBox="0 0 8 14"
      fill="white"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity={sortType === SortType.Up ? '1' : '0.3'}
        d="M3.16789 1.24808C3.56371 0.654347 4.43617 0.654339 4.832 1.24807L6.96351 4.44529C7.40656 5.10985 6.93016 6 6.13147 6H1.8685C1.06981 6 0.593416 5.10986 1.03645 4.44531L3.16789 1.24808Z"
        fill="white"
      />
      <path
        opacity={sortType === SortType.Down ? '1' : '0.3'}
        d="M3.16789 12.7519C3.56371 13.3457 4.43617 13.3457 4.832 12.7519L6.96351 9.55471C7.40656 8.89015 6.93016 8 6.13147 8H1.8685C1.06981 8 0.593416 8.89014 1.03645 9.55469L3.16789 12.7519Z"
        fill="white"
      />
    </svg>
  );
}
