import React, { useEffect, useState } from 'react';

interface DefaultInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  loading?: boolean;
  placeholder?: string;
}

const DefaultInput:React.FC<DefaultInputProps> = ({ value, onChange, loading, placeholder }) => {
  const [stateValue, setStateValue] = useState('');

  useEffect(() => {
    console.log('value', value);
    if (value) {
      setStateValue(value)
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value);
    onChange(e.target.value);
  }

  return (
    <div className='w-full'>
      <input placeholder={placeholder} value={stateValue} onChange={handleChange} className='w-full bg-bg-6 p-4 text-color-1 border border-bg-2 hover:border-brand-hover focus:border-brand-active text-sm outline-none rounded-sm transition-all' />
    </div>
  );
};

export default DefaultInput;