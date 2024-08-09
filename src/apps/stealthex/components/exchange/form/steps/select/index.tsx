import React, { useEffect, useMemo, useState } from 'react';

import {
    AddressError,
    AddressInput,
    AddressInputContainer,
    LabelInput,
    NotificationAddress,
    NotificationText,
    StyledNotificationIcon,
} from './styles';

import type { Config } from '../../../../../type';
import { useAppSelector } from '../../../../../redux/hooks';
import { useTranslation } from 'react-i18next';
import WidgetView from './views/widget';

type SelectProps = {
    address: string;
    extraId: string;
    refundAddress: string;
    config?: Config;
    preview?: boolean;
    widget?: boolean;
    isExchangeCreating?: boolean;
    onExtraIdChange?: (extraId: string) => void;
    onAddressChange?: (address: string) => void;
    onRefundAddressChange?: (refundAddress: string) => void;
    onSubmit?: () => void;
    onReject?: () => void;
    isExchangeCreated?: boolean;
};

const Select: React.FC<SelectProps> = ({
    address,
    extraId,
    onExtraIdChange,
    onAddressChange,
    onSubmit,
    isExchangeCreated,
    isExchangeCreating,
    widget,
    onReject
}) => {
    const { t } = useTranslation();

    const [isAddressValid, setAddressValid] = useState(true);

    const { fiat, receiveCurrency } = useAppSelector(state => state.exchange);
    const selectedReceiveCurrency = receiveCurrency;
    const currencyExtraId = selectedReceiveCurrency.extra_id;
    const upperCasedReceiveSymbol = selectedReceiveCurrency.symbol.toUpperCase();

    const renderNotification = (warnings: readonly string[]) => {
        if (warnings.length == 0) {
            return null;
        }

        return (
            <NotificationAddress data-testid="exchange-warning-to">
                <StyledNotificationIcon />
                <NotificationText>{warnings[0]}</NotificationText>
            </NotificationAddress>
        );
    };

    const addressInput = (
        <CustomInput
            value={address}
            widget={widget}
            fiat={fiat}
            onChange={onAddressChange}
            label={t('enterTheRecipientAddress', {
                symbol: upperCasedReceiveSymbol,
            })}
            invalidLabel={t('addressIsInvalid')}
            notification={renderNotification(receiveCurrency.warnings_to)}
            validation={selectedReceiveCurrency.validation_address}
            onValidationStateChange={setAddressValid}
            testId="exchange-address"
        />
    );
    const extraIdInput = currencyExtraId ? (
        <CustomInput
            value={extraId}
            widget={widget}
            onChange={onExtraIdChange}
            label={t('extraIdOptionally', { extraId: currencyExtraId })}
            invalidLabel={t('extraIdInvalid', { extraId: currencyExtraId })}
            validation={selectedReceiveCurrency.validation_extra}
            testId="exchange-extraid"
        />
    ) : null;

    return widget ? (
        <WidgetView
            isExchangeCreated={isExchangeCreated}
            components={{
                addressInput,
                extraIdInput,
            }}
            disabled={!isAddressValid || address == '' || false}
            onSubmit={onSubmit}
            onReject={onReject}
            isExchangeCreating={isExchangeCreating}
        />
    ) : null;
};

const CustomInput: React.FC<{
    fiat?: boolean;
    notification?: JSX.Element | null;
    value: string;
    label: string;
    invalidLabel: string;
    validation: string | null;
    testId?: string;
    onChange?: (value: string) => void;
    onValidationStateChange?: (valid: boolean) => void;
    widget?: boolean;
}> = ({
    fiat,
    notification,
    value,
    label,
    invalidLabel,
    validation,
    testId,
    onChange,
    onValidationStateChange,
    widget,
}) => {
        const valid = useMemo(() => {
            if (!validation || value == '') {
                return true;
            }

            if (validation !== null && validation.length > 0) {
                const extraRegExp = new RegExp(validation);
                return extraRegExp.test(value);
            }

            return false;
        }, [value, validation]);
        useEffect(() => {
            onValidationStateChange && onValidationStateChange(valid);
        }, [valid, onValidationStateChange]);

        return (
            <AddressInputContainer
                widget={widget ? 'true' : undefined}
                marginBottom={fiat ? 'true' : undefined}
                viewwarning={!notification ? 'true' : undefined}
            >
                <AddressInput
                    value={value}
                    onChange={(event) => onChange && onChange(event.target.value)}
                    widget={widget ? 'true' : undefined}
                    autoComplete="off"
                    title=""
                    data-testid={testId}
                    required
                />
                <LabelInput widget={widget ? 'true' : undefined}>{label}</LabelInput>
                {!valid && <AddressError>{invalidLabel}</AddressError>}
                {valid && notification}
            </AddressInputContainer>
        );
    };

export default Select;
