import RefreshIcon from '../../assets/refresh-icon.svg';

export default function Refresh() {
  return (
    <button
      className="flex items-center justify-center w-[36px] h-[34px] bg-[#1E1D24] rounded-[8px]"
      type="button"
      aria-label="Refresh"
    >
      <img src={RefreshIcon} alt="refresh-icon" />
    </button>
  );
}
