import { useEffect, useRef, useState } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  content: string;
}

const Tooltip = ({ children, content }: TooltipProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isPositioned, setIsPositioned] = useState(false);
  const [position, setPosition] = useState({
    top: 0,
    left: 0,
    transform: 'translateX(-50%)',
  });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const calculatePosition = () => {
    if (!triggerRef.current || !tooltipRef.current) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipRect = tooltipRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const tooltipWidth = tooltipRect.width;
    const tooltipHeight = tooltipRect.height;

    // Calculate ideal center position
    const idealLeft = triggerRect.left + triggerRect.width / 2;
    const idealTop = triggerRect.top - tooltipHeight - 8;

    // Calculate boundaries
    const margin = 10;
    const minLeft = margin;
    const maxLeft = viewportWidth - tooltipWidth - margin;
    const minTop = margin;

    let finalLeft = idealLeft;
    let finalTop = idealTop;
    let transform = 'translateX(-50%)';

    // Adjust horizontal position if tooltip would overflow
    if (idealLeft - tooltipWidth / 2 < minLeft) {
      // Too far left - align to left edge
      finalLeft = minLeft;
      transform = 'translateX(0)';
    } else if (idealLeft + tooltipWidth / 2 > viewportWidth - margin) {
      // Too far right - align to right edge
      finalLeft = maxLeft;
      transform = 'translateX(0)';
    }

    // Adjust vertical position if tooltip would overflow above
    if (idealTop < minTop) {
      // Not enough space above - position below trigger
      finalTop = triggerRect.bottom + 8;
      transform = transform
        .replace('translateX', 'translateX')
        .replace('translateY', 'translateY');
    }

    setPosition({
      top: finalTop,
      left: finalLeft,
      transform,
    });
    setIsPositioned(true);
  };

  const handleMouseEnter = () => {
    setIsVisible(true);
  };

  const handleMouseLeave = () => {
    setIsVisible(false);
    setIsPositioned(false);
  };

  useEffect(() => {
    if (isVisible && tooltipRef.current) {
      // Calculate position after tooltip is rendered
      calculatePosition();
    }
  }, [isVisible]);

  return (
    <div className="relative inline-block">
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="cursor-help"
      >
        {children}
      </div>
      {isVisible && (
        <div
          ref={tooltipRef}
          className="fixed z-50 w-max max-w-[220px] h-auto border border-white/5 bg-[#25232D] p-2 rounded"
          style={{
            top: position.top,
            left: position.left,
            transform: position.transform,
            opacity: isPositioned ? 1 : 0,
            transition: 'opacity 0.1s ease-in-out',
          }}
        >
          <div className="text-white text-[10px] font-normal leading-tight break-words">
            {content}
          </div>
        </div>
      )}
    </div>
  );
};

export default Tooltip;
