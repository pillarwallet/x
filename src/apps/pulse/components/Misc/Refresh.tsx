import RefreshIcon from '../../assets/refresh-icon.svg';

export default function Refresh() {
  return (
    <button
      className="flex items-center justify-center w-full h-full bg-[#121116] rounded-[10px]"
      type="button"
      aria-label="Refresh"
    >
      <img src={RefreshIcon} alt="refresh-icon" />
    </button>
  );
}
