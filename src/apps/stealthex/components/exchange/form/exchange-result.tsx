

import ExchangeStep from './steps/exchange';
import { Block, ErrorHeading } from './styles';


import type { FC } from 'react';
import { ExchangeInfo } from '../../../type';
import { useTranslation } from 'react-i18next';

interface ExchangeResultProps {
    onNewExchange?: VoidFunction;
    exchangeInfo?: ExchangeInfo;
    status: 'success' | 'notFoundError' | 'invalidSignatureError';
    widget?: boolean;
}

const ExchangeResult: FC<ExchangeResultProps> = ({
    status,
    exchangeInfo,
    onNewExchange,
    widget,
}) => {
    const { t } = useTranslation();

    return (
        <>
            {status == 'success' && exchangeInfo && (
                <ExchangeStep
                    exchangeInfo={exchangeInfo}
                    onNewExchange={onNewExchange}
                    widget={widget}
                />
            )}
            {status !== 'success' && (
                <Block>
                    <ErrorHeading>
                        {status === 'invalidSignatureError'
                            ? t('signatureInvalid')
                            : t('exchangeWasNotFound')}
                    </ErrorHeading>
                </Block>
            )}
        </>
    );
};

export default ExchangeResult;
