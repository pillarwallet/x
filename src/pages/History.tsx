import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import { PrimaryTitle } from '../components/Text/Title';

const History = () => {
  const [t] = useTranslation();

  return (
    <PrimaryTitle>{t`title.history`}</PrimaryTitle>
  );
}

export default History;
