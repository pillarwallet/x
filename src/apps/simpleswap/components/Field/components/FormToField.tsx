import React, { useEffect, useRef, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';

import { InputText, InputTo, InputToTilda } from '../styles';
import TildaIcon from '../../icons/TildaIcon';

interface IProps {
  // eslint-disable-next-line react/require-default-props
  isLoading?: boolean;
  fixed: boolean;
  // eslint-disable-next-line react/require-default-props
  isToError?: boolean;
  type: string;
  // eslint-disable-next-line react/require-default-props
  disabled?: boolean;
  amount: number;
}

const FormToField: React.FC<IProps> = (props) => {
  const { isLoading, fixed, isToError = false, type, disabled = false, amount } = props;
  const [showInputToTooltip, setShowInputToTooltip] = useState(false);
  const inputToRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (
        inputToRef.current &&
        inputToRef.current?.clientWidth !== inputToRef.current?.scrollWidth
      ) {
        setShowInputToTooltip(true);
      }
    });
  }, [amount]);
  const renderContent = () => {
    if (disabled) {
      return <span className="secure">{type === 'to' ? '≈ ' : ''}...</span>;
    }

    if (isToError) return <span>-</span>;

    return (
      <InputText
        // thousandSeparator
        // displayType="text"
        // value={amount}
        ref={inputToRef}
        // allowedDecimalSeparators={[',']}
      >{amount}</InputText>
    );
  };

  return (
      <Tooltip id="inputToTooltip" title={amount} placement="top" leaveDelay={300} >
        <InputTo
          $isDisabled={showInputToTooltip}
          $hide={isLoading}
          $fixed={fixed}
        >
          {!fixed && !isToError && type === 'to' && (
            <InputToTilda>
              <TildaIcon />
            </InputToTilda>
          )}

          {renderContent()}
        </InputTo>
      </Tooltip>
  );
};

export default FormToField;
