import React from 'react';


import BaseContainer from '../../common/base-container';
import ExchangePreview from '../../../components/exchange/preview/home';

import { StyledSection, Title } from './styles';
import { useTranslation } from 'react-i18next';

const Exchange: React.FC = () => {
    const { t } = useTranslation();
    return (
        <StyledSection>
            <BaseContainer>
                <Title>{t('heading')}</Title>
                <ExchangePreview />
            </BaseContainer>
        </StyledSection>
    );
};

export default Exchange;