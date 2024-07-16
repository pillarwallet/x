import React from 'react';

import Swap from '../swap';
import Tabs from '../tabs';
import { ExchangeButton, ExchangeExtra, StyledExchange } from './styles';
import { useTranslation } from 'react-i18next';

const Preview: React.FC = () => {
    const { t } = useTranslation();

    return (
        <StyledExchange>
            <Tabs />
            <Swap />
            <ExchangeExtra>
                <ExchangeButton
                    $beforeexchange="true"
                    onClick={() => { }}
                    testId="exchange_submit"
                >
                    {t('startExchange')}
                </ExchangeButton>
            </ExchangeExtra>
        </StyledExchange>
    );
};

export default Preview;