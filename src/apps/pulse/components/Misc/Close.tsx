import CloseIcon from '../../assets/close-icon.svg';

export default function Close(props: { onClose: () => void }) {
  const { onClose } = props;
  return (
    <button
      style={{ height: 20, width: 20, marginRight: 10 }}
      onClick={() => onClose()}
      type="button"
      aria-label="Close"
      data-testid="pulse-close-button"
    >
      <img src={CloseIcon} alt="close-icon" />
    </button>
  );
}
