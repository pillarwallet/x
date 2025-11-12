import SettingsIcon from '../../assets/setting-icon.svg';

interface SettingsProps {
  onClick?: () => void;
}

export default function Settings({ onClick }: SettingsProps) {
  return (
    <button
      className="flex items-center justify-center rounded-[10px] w-9 h-[34px] content-center"
      type="button"
      aria-label="Settings"
      onClick={onClick}
      data-testid="pulse-settings-button"
    >
      <div className="py-2 px-px w-9 h-[34px] bg-[#1E1D24] rounded-lg flex justify-center">
        <img src={SettingsIcon} width={18} height={18} alt="settings-icon" />
      </div>
    </button>
  );
}
