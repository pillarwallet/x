import SettingsIcon from '../../assets/setting-icon.svg';

export default function Settings() {
  return (
    <button
      className="flex items-center justify-center w-full h-full bg-[#121116] rounded-[10px]"
      type="button"
      aria-label="Save"
    >
      <img src={SettingsIcon} alt="settings-icon" />
    </button>
  );
}
