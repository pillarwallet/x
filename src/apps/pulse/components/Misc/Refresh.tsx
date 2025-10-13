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
      className={`flex items-center justify-center bg-[#1E1D24] rounded-[8px] ${
        disabled || isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      }`}
      style={{ width: 18, height: 18 }}
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
