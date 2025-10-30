import { useEffect } from 'react';
import EscIcon from '../../assets/esc-icon.svg';

interface EscProps {
  onClose: () => void;
}

export default function Esc(props: EscProps) {
  const { onClose } = props;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [onClose]);

  return (
    <button
      onClick={onClose}
      type="button"
      className="flex items-center justify-center"
      data-testid="esc-button"
      aria-label="Close"
    >
      <img src={EscIcon} alt="ESC" className="w-9 h-[34px]" />
    </button>
  );
}
