import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import { PrimaryTitle } from '../components/Text/Title';

const Lobby = () => {
  const [t] = useTranslation();

  return (
    <PrimaryTitle>{t`title.lobby`}</PrimaryTitle>
  );
}

export default Lobby;
