import { TailSpin } from 'react-loader-spinner';
import RefreshIcon from '../../assets/refresh-icon.svg';

interface RefreshProps {
  onClick?: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function Refresh({
  onClick,
  disabled = false,
  isLoading = false,
}: RefreshProps) {
  return (
    <button
      className={`flex h-[18px] w-[18px] items-center justify-center rounded-[8px] bg-[#1E1D24] ${
        disabled || isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      }`}
      type="button"
      aria-label="Refresh"
      onClick={onClick}
      disabled={disabled || isLoading}
      data-testid="pulse-refresh-button"
    >
      {isLoading ? (
        <TailSpin color="#FFFFFF" height={18} width={18} />
      ) : (
        <img src={RefreshIcon} height={18} width={18} alt="refresh-icon" />
      )}
    </button>
  );
}
