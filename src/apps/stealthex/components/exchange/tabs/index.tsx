import { useTranslation } from 'react-i18next';
import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks';
import { setAmount, setFiat, setFixed, setReceiveCurrency, setSendCurrency } from '../../../redux/reducers/exchange';
import { defaultAmount, defaultReceiveCurrency, defaultReceiveFiatCurrency, defaultSendCurrency, defaultSendFiatCurrency } from '../../../lib/consts';
import { Button, Container } from './styles';

const Tabs: React.FC = () => {
    const { t } = useTranslation();
    const dispatch = useAppDispatch();

    const { fiat } = useAppSelector(state => state.exchange);
    const onClickForm = () => {
        dispatch(setAmount('100'));
        dispatch(setFixed(false));
        dispatch(setFiat(true));
        dispatch(setSendCurrency(defaultSendFiatCurrency));
        dispatch(setReceiveCurrency(defaultReceiveFiatCurrency));
    };

    const offClickForm = () => {
        dispatch(setAmount(defaultAmount));
        dispatch(setFiat(false));
        dispatch(setSendCurrency(defaultSendCurrency));
        dispatch(setReceiveCurrency(defaultReceiveCurrency));
    };

    return (
        <Container>
            <Button
                active={!fiat ? 'true' : undefined}
                onClick={offClickForm}
                data-testid="exchange-crypto"
            >
                {t('exchange')}
            </Button>
            <Button active={fiat ? 'true' : undefined} onClick={onClickForm} data-testid="exchange-fiat">
                {t('buy')}
            </Button>
        </Container>
    );
};

export default Tabs;
