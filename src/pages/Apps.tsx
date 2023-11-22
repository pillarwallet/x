import React from 'react';
import { useTranslation } from 'react-i18next';

import { PrimaryTitle } from '../components/Text/Title';

const Apps = () => {
  const [t] = useTranslation();

  return (
    <PrimaryTitle>{t`title.apps`}</PrimaryTitle>
  );
}

export default Apps;
