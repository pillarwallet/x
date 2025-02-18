import { useState } from 'react';

interface SwitchToggleProps {
  isChecked: boolean;
  onToggle?: (checked: boolean) => void;
  isClipboardSwitch?: boolean;
  onClick?: () => void;
}

const SwitchToggle = ({
  isChecked,
  onToggle,
  onClick,
  isClipboardSwitch,
}: SwitchToggleProps) => {
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);

  const handleToggle = () => {
    if (onToggle) {
      onToggle(isChecked);
    }
  };

  return (
    <div
      id="pillarx-switch-toggle"
      onClick={isClipboardSwitch ? onClick : handleToggle}
      className={`relative inline-flex w-8 h-[18px] rounded-[20px] p-0.5 cursor-pointer transition-colors duration-300 ${
        isChecked ? 'bg-purple_medium' : 'bg-[#5F5C6E]'
      }`}
      onMouseEnter={() => isClipboardSwitch && setIsTooltipVisible(true)}
      onMouseLeave={() => isClipboardSwitch && setIsTooltipVisible(false)}
    >
      <span
        className={`absolute top-[2px] bottom-0 h-3.5 w-3.5 rounded-full bg-white shadow-md transform transition-transform duration-300 ${
          isChecked ? 'translate-x-3.5' : 'translate-x-0'
        }`}
      />
      {isTooltipVisible && (
        <div className="absolute bottom-8 right-[-120px] bg-purple_medium p-2 rounded shadow-lg w-60">
          <p className="text-white text-xs font-light">
            To change your clipboard permission, go to your browser settings.
          </p>
        </div>
      )}
    </div>
  );
};

export default SwitchToggle;
