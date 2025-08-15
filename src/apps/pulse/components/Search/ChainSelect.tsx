import GlobeIcon from '../../assets/globe-icon.svg';

export default function ChainSelectButton() {
  return (
    <button
      className="flex items-center justify-center w-full h-full bg-[#121116] rounded-[10px]"
      type="button"
      aria-label="Save"
    >
      <img src={GlobeIcon} alt="globe-icon" />
    </button>
  );
}
