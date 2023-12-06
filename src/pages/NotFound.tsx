import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import Paragraph from '../components/Text/Paragraph';

const NotFound = () => {
  const [t] = useTranslation();

  return (
    <Paragraph $center>{t`error.pageNotFound`}</Paragraph>
  );
}

export default NotFound;
