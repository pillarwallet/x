import { useTranslation } from 'react-i18next';
import Swap, { Config } from '../../../../swap';
import { useState } from 'react';
import { Form } from '../../../form';
import { ExchangeButton, ExchangeExtra, StyledWidgetBy, WidgetByLink, WidgetStyledExchange, WidgetTitle } from '../../../../preview/styles';

const Preview: React.FC<{ config?: Config; preview?: boolean }> = () => {
    const { t } = useTranslation();

    const [isExchangeButtonDisabled, setExchangeButtonDisabled] = useState(true);
    const [formVisible, setFormVisible] = useState(false);

    if (formVisible) {
        return (
            <Form
                onReject={() => setFormVisible(false)}
                widget
            />
        );
    }

    return (
        <WidgetStyledExchange>
            <WidgetTitle>Exchange Crypto</WidgetTitle>
            <Swap
                onDisableChange={setExchangeButtonDisabled}
                widget
            />
            <ExchangeExtra widget={'true'}>
                <ExchangeButton
                    disabled={isExchangeButtonDisabled}
                    onClick={() => {
                        setFormVisible(true);
                    }}
                    widget
                >
                    {t('startExchange')}
                </ExchangeButton>
            </ExchangeExtra>

            <WidgetByLink href={'https://stealthex.io'} target="_blank">
                <StyledWidgetBy />
            </WidgetByLink>
        </WidgetStyledExchange>
    );
};

export default Preview;