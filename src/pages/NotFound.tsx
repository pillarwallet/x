import React from 'react';
import { useTranslation } from 'react-i18next';

// components
import Paragraph from '../components/Text/Paragraph';

const NotFound = ({ message }: { message?: string }) => {
  const [t] = useTranslation();

  return (
    <Paragraph $center>{message ?? t`error.pageNotFound`}</Paragraph>
  );
}

export default NotFound;
