import { useEffect } from 'react';

interface CloseButtonProps {
  onClose: () => void;
}

export default function CloseButton(props: CloseButtonProps) {
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
      data-testid="close-button"
    >
      <svg
        className="w-5 h-5 text-white/50"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M6 18L18 6M6 6l12 12"
        />
      </svg>
    </button>
  );
}
