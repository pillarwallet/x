import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ExchangeInfo } from '../../../../../../../../type';

const widgetId = '85c32930-4963-442f-9165-0e213b367633'


const Container = styled.div`
  padding-top: 40px;

  @media (max-width: 934px) {
    padding-top: 20px;
  }
`;

const Mercuryo: React.FC<{ exchangeInfo: ExchangeInfo }> = ({
    exchangeInfo: {
        status,
        currencies,
        currency_from: currencyFrom,
        currency_to: currencyTo,
        address_to: addressTo,
        id,
        amount_from: amountFrom,
        mercuryo_signature: mercuryoSignature,
    },
}) => {
    const from = currencies[currencyFrom];
    const to = currencies[currencyTo];
    const waiting = status == 'waiting';

    useEffect(() => {
        const createWidget = () => {
            const upperCasedFrom = from?.symbol.toUpperCase();
            const upperCasedTo = to?.symbol.toUpperCase();

            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (window as any)?.mercuryoWidget.run({
                widgetId,
                host: document.getElementById('mercuryo-widget'),
                fiatCurrency: upperCasedFrom === 'TL' ? 'TRY' : upperCasedFrom,
                currency: upperCasedTo === 'USDTERC20' ? 'USDT' : upperCasedTo,
                theme: 'stealthex',
                address: addressTo,
                signature: mercuryoSignature,
                merchantTransactionId: id,
                fiatAmount: amountFrom,
                fixAmount: true,
                fixCurrency: true,
                fixFiatAmount: true,
                fixFiatCurrency: true,
                hideAddress: true,
                type: 'buy',
                lang: 'en',
            });
        };

        if ('mercuryoWidget' in window) {
            void createWidget();
        } else {
            const script = document.createElement('script');
            script.async = true;
            script.src = 'https://widget.mercuryo.io/embed.2.0.js';
            script.id = 'mercuryo';
            script.onload = createWidget;
            document.body.appendChild(script);
        }
    }, [
        waiting,
        id,
        from,
        to,
        addressTo,
        amountFrom,
        mercuryoSignature,
    ]);

    return (
        <Container>
            <div id="mercuryo-widget" />
        </Container>
    );
};

export default Mercuryo;
