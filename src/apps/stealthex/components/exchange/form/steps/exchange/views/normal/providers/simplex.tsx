import React, { useEffect, useRef } from 'react';
import { ExchangeInfo } from '../../../../../../../../type';


const Simplex: React.FC<{ exchangeInfo: ExchangeInfo }> = ({
    exchangeInfo,
}) => {
    const scriptLoadingRef = useRef(false);

    useEffect(() => {
        if (scriptLoadingRef.current) {
            return;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const windowAny = window as any;

        const createWidget = () => {
            windowAny.Simplex.load({
                payment_id: exchangeInfo.payment_id,
            });
};

if ('Simplex' in window) {
    createWidget();
} else {
    scriptLoadingRef.current = true;

    windowAny.simplexAsyncFunction = () => {
        windowAny.Simplex.init({
            public_key: 'pk_live_732a780f-cf93-47d1-ba9b-0494b677ef4b',
        });
    };
    const script = document.createElement('script');
    script.async = true;
    script.src = 'https://cdn.simplex.com/sdk/v1/js/sdk.js';
    script.id = 'simplex';
    script.onload = () => {
        scriptLoadingRef.current = false;
        createWidget();
    };
    document.body.appendChild(script);
}

return () => {
    if ('Simplex' in window) {
        windowAny.Simplex.unload();
    }
};
    }, [exchangeInfo.payment_id, exchangeInfo.id]);

return (
    <form id="simplex-form">
        <div id="checkout-element"></div>
    </form>
);
};

export default Simplex;
