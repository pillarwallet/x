import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import { PrimaryTitle } from '../components/Text/Title';

const Account = () => {
  const [t] = useTranslation();

  return (
    <PrimaryTitle>{t`title.account`}</PrimaryTitle>
  );
}

export default Account;
