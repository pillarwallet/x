interface CloseProps {
  closePreview: () => void;
}

export default function Esc(props: CloseProps) {
  const { closePreview } = props;
  return (
    <button
      className="flex items-center justify-center w-[36px] h-[34px] bg-[#1E1D24] rounded-[8px]"
      onClick={closePreview}
      type="button"
      aria-label="Close"
    >
      <p className="text-white/50 font-medium text-[13px] leading-[100%] tracking-[-0.02em] text-center">
        ESC
      </p>
    </button>
  );
}
