import { useEffect } from 'react';

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
      className="flex items-center justify-center w-[36px] h-[34px] bg-[#1E1D24] rounded-[8px]"
      onClick={onClose}
      type="button"
      aria-label="Close"
      data-testid="esc-button"
    >
      <p className="text-white/50 font-medium text-[13px] leading-[100%] tracking-[-0.02em] text-center">
        ESC
      </p>
    </button>
  );
}
