import React from 'react';

interface StepProps {
  number: number;
  success?: boolean;
}

const Step:React.FC<StepProps> = ({ number, success }) => {
  return (
    <div className={`flex justify-center font-medium text-2.5 w-6 h-6 items-center text-center  rounded-full ${!success ? 'bg-bg-35 text-color-1' : 'bg-success-bg text-success'}`}>
      { number }
    </div>
  );
};

export default Step;