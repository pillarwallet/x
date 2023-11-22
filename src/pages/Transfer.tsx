import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import { PrimaryTitle } from '../components/Text/Title';

const Transfer = () => {
  const [t] = useTranslation();

  return (
    <PrimaryTitle>{t`title.transfer`}</PrimaryTitle>
  );
}

export default Transfer;
