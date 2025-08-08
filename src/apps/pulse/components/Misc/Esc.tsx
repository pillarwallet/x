import EscIcon from '../../assets/esc-icon.svg';

interface CloseProps {
  closePreview: () => void;
}

export default function Esc(props: CloseProps) {
  const { closePreview } = props;
  return (
    <button
      style={{
        backgroundColor: 'black',
        borderRadius: 10,
        width: 40,
        height: 40,
      }}
      onClick={() => {
        closePreview();
      }}
      type="button"
      aria-label="Save"
    >
      <img src={EscIcon} alt="esc-icon" />
    </button>
  );
}
