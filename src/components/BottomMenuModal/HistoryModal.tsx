interface HistoryModalProps {
  isContentVisible?: boolean; // for animation purpose to not render rest of content and return main wrapper only
}

const HistoryModal = ({ isContentVisible }: HistoryModalProps) => {
  if (!isContentVisible) {
    return <div />
  }

  return (
    <div>
      History
    </div>
  );
}

export default HistoryModal;
