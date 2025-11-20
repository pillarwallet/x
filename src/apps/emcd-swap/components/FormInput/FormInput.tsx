import React, { useEffect, useState } from 'react';

import LinearProgress from '@mui/material/LinearProgress';

interface FormInputProps {
  value: string | null;
  onChange: (value: string | null) => void;
  loading?: boolean;

  valid?: boolean | null;
  error?: string | null;
}

const FormInput: React.FC<FormInputProps> = ({
  value,
  onChange,
  loading,
  valid,
  error,
}) => {
  const [stateValue, setStateValue] = useState('');

  useEffect(() => {
    if (value !== null) {
      setStateValue(value);
    } else {
    setStateValue('');
    }
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStateValue(e.target.value);
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-y-2 w-full">
      <input
        value={stateValue}
        onChange={handleChange}
        aria-label="Form input"
        aria-invalid={valid === false}
        aria-describedby={!valid ? "error-message" : undefined}
        className="w-full text-xl text-medium py-1 outline-none focus:outline-none"
      />

      {loading ? (
        <div className="text-brand">
          <LinearProgress color="inherit" />
        </div>
      ) : (
        <div className="h-1" />
      )}
      {!valid && <div id="error-message" className='text-sm text-error'> {error} </div>}
    </div>
  );
};

export default FormInput;