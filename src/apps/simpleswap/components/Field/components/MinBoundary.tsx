import React from 'react';
import { useTranslation } from 'react-i18next';
import { ErrorAmount, ErrorBlock, ErrorLabel, InputText } from '../styles';

interface MinProps {
  value: number;
  onClick: () => void;
}

const MinBoundary: React.FC<MinProps> = ({ value, onClick }) => {
  const { t } = useTranslation();

  return (
    <ErrorBlock>
      <ErrorLabel>{t('ERRORS.TEXT_2')}</ErrorLabel>
      <ErrorAmount
        onClick={() => {
          onClick();
        }}
      >
        <InputText
          // thousandSeparator
          // displayType="text"
          // allowedDecimalSeparators={[',']}
        >{value}</InputText>
      </ErrorAmount>
    </ErrorBlock>
  );
};

interface MaxProps {
  value: number;
  onClick: () => void;
}

const MaxBoundary: React.FC<MaxProps> = ({ value, onClick }) => {
  const { t } = useTranslation();

  return (
    <ErrorBlock>
      <ErrorLabel>{t('ERRORS.TEXT_3')}</ErrorLabel>
      <ErrorAmount
        onClick={() => {
          onClick();
        }}
      >
        {value}
      </ErrorAmount>
    </ErrorBlock>
  );
};

export { MinBoundary, MaxBoundary };
