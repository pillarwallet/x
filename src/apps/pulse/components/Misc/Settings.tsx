import SettingsIcon from '../../assets/setting-icon.svg';

export default function Settings() {
  return (
    <button
      className="flex items-center justify-center rounded-[10px]"
      style={{ width: 36, height: 34, alignContent: 'center' }}
      type="button"
      aria-label="Save"
    >
      <div
        style={{
          padding: '8px 1px',
          width: 36,
          height: 34,
          backgroundColor: '#1E1D24',
          borderRadius: 8,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <img src={SettingsIcon} width={18} height={18} alt="settings-icon" />
      </div>
    </button>
  );
}
