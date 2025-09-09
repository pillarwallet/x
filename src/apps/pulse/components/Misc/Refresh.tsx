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
      className={`flex items-center justify-center w-[36px] h-[34px] bg-[#1E1D24] rounded-[8px] ${
        disabled || isLoading
          ? 'cursor-not-allowed opacity-50'
          : 'cursor-pointer'
      }`}
      type="button"
      aria-label="Refresh"
      onClick={onClick}
      disabled={disabled || isLoading}
    >
      {isLoading ? (
        <TailSpin color="#FFFFFF" height={20} width={20} />
      ) : (
        <img src={RefreshIcon} alt="refresh-icon" />
      )}
    </button>
  );
}
