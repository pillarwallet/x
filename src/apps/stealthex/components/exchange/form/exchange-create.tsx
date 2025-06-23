import type { Config } from '../../../type';
import type { FC } from 'react';
import SelectStep from './steps/select';
import ConfirmStep from './steps/confirm';
import { isSignatureError } from '../../../lib/backend/exchange/error';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { SerializedError } from '@reduxjs/toolkit';

interface ExchangeCreateProps {
    step: 'select' | 'confirm';
    createExchange: { data?: unknown, isLoading: boolean, error?: FetchBaseQueryError | SerializedError };
    address: string;
    preview?: boolean;
    widget?: boolean;
    refundAddress: string;
    extraId: string;
    config?: Config;
    onExtraIdChange: (v: string) => void;
    onAddressChange: (v: string) => void;
    onRefundAddressChange: (v: string) => void;
    onSubmitSelect: VoidFunction;
    onSubmitConfirm: VoidFunction;
    onReject?: VoidFunction;
    fiat: boolean;
    onRejectConfirmStep: VoidFunction;
}

const ExchangeCreate: FC<ExchangeCreateProps> = ({
    step,
    createExchange,
    address,
    config,
    extraId,
    refundAddress,
    preview,
    widget,
    onExtraIdChange,
    onAddressChange,
    onRefundAddressChange,
    onSubmitSelect,
    onSubmitConfirm,
    onReject,
    fiat,
    onRejectConfirmStep,
}) => {
    return (
        <>
            {step === 'select' && (
                <SelectStep
                    isExchangeCreated={Boolean(createExchange.data)}
                    preview={preview}
                    widget={widget}
                    address={address}
                    refundAddress={refundAddress}
                    extraId={extraId}
                    config={config}
                    onExtraIdChange={onExtraIdChange}
                    onAddressChange={onAddressChange}
                    onRefundAddressChange={onRefundAddressChange}
                    isExchangeCreating={createExchange.isLoading}
                    onSubmit={onSubmitSelect}
                    onReject={onReject}
                />
            )}

            {step === 'confirm' && (
                <ConfirmStep
                    address={address}
                    extraId={extraId}
                    isExchangeCreating={createExchange.isLoading}
                    isCreateFailed={
                        createExchange.error
                            ? isSignatureError(createExchange.error)
                                ? 'signature'
                                : 'error'
                            : false
                    }
                    isExchangeCreated={Boolean(createExchange.data)}
                    isFiat={fiat}
                    onReject={onRejectConfirmStep}
                    onSubmit={onSubmitConfirm}
                />
            )}
        </>
    );
};

export default ExchangeCreate;
