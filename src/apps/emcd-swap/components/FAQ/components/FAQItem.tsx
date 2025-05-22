import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggle = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="faq-item mb-4 border-b border-bg-35 pb-4">
      <button
        onClick={toggle}
        className="flex justify-between items-center cursor-pointer"
      >
        <div className='text-sm text-color-1'>
          { question }
        </div>

      </button>

      <div className={ `text-xs text-color-3 transition-all overflow-hidden ${isOpen ? 'h-auto' : 'h-0 opacity-0'}` }>
        { answer }
      </div>
    </div>
  );
};

export default FAQItem;
