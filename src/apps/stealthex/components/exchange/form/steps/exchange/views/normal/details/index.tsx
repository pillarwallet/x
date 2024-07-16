
import React from 'react';

import InfoBlock from '../../../../common/info-block';
import useCountdown from '../../use-countdown';
import useStatusTitle from '../../use-status-title';
import Id from '../common/id';
import {
    GetBlock,
    InfoBlockContainer,
    LoaderIcon,
    NotificationAddress,
    NotificationText,
    QRCont,
    SentBlock,
    Status,
    StatusHeading,
    StyledLoader,
    StyledNotificationIcon,
    StyledRoundedCheck,
    Success,
} from './styles';

import { useTranslation } from 'react-i18next';
import { DividerLine } from '../../../../../styles';
import { ExchangeInfo } from '../../../../../../../../type';

const Details: React.FC<{ exchangeInfo: ExchangeInfo }> = ({
    exchangeInfo: {
        type,
        status,
        currencies,
        currency_to: currencyTo,
        currency_from: currencyFrom,
        id,
        amount_to: amountTo,
        amount_from: amountFrom,
        address_from: addressFrom,
        address_to: addressTo,
        tx_from: txFrom,
        tx_to: txTo,
        extra_id_from: extraIdFrom,
        extra_id_to: extraIdTo,
        timestamp,
    },
}) => {
    const { t } = useTranslation();

    const fixed = type == 'fixed';
    const from = currencies[currencyFrom];
    const to = currencies[currencyTo];
    const warningFrom = from?.warnings_from[0] ?? '';

    const waiting = status == 'waiting';
    const finished = status == 'finished';
    const failed = status == 'failed';
    const verifying = status == 'verifying';
    const refunded = status == 'refunded';

    const statusTitle = useStatusTitle(status, false);

    const shouldCheckForTimeout = fixed && waiting;
    const { timeout, countdown } = useCountdown(
        timestamp,
        !shouldCheckForTimeout,
    );
    const checkedTimeout = shouldCheckForTimeout && timeout;

    return (
        <>
            <SentBlock>
                <div>
                    {!failed && !verifying && <Id id={id} />}
                    {!failed && !verifying && (
                        <StatusHeading success={status == 'finished'}>
                            {finished && (
                                <Success>
                                    <StyledRoundedCheck />
                                </Success>
                            )}
                            <Status data-testid="exchange-status">
                                {checkedTimeout ? t('timeoutStep') : statusTitle}
                            </Status>
                            {!refunded && !checkedTimeout && !finished && (
                                <StyledLoader>
                                    <LoaderIcon />
                                </StyledLoader>
                            )}
                        </StatusHeading>
                    )}
                    {fixed && waiting && !timeout && (
                        <InfoBlockContainer>
                            <InfoBlock
                                title={t('timeToDeposit')}
                                text={countdown}
                                copy={false}
                            />
                        </InfoBlockContainer>
                    )}
                    <InfoBlockContainer>
                        <InfoBlock
                            title={`${t('youSend')}:`}
                            testId="exchange-amount-from"
                            text={`${amountFrom} ${from?.symbol.toUpperCase()}`}
                            copy={false}
                        />
                        {waiting && warningFrom && (
                            <NotificationAddress data-testid="exchange-warning-from">
                                <StyledNotificationIcon />
                                <NotificationText>{warningFrom}</NotificationText>
                            </NotificationAddress>
                        )}
                    </InfoBlockContainer>
                    <InfoBlockContainer>
                        <InfoBlock
                            title={`${t('toAddress')}:`}
                            tip="Copy Address"
                            text={addressFrom}
                            link={from?.address_explorer?.replace('{}', `${addressFrom}`)}
                            testId="exchange-address-from"
                        />
                    </InfoBlockContainer>
                    {extraIdFrom && (
                        <InfoBlockContainer>
                            <InfoBlock
                                title={from?.extra_id ? from.extra_id : t('extraID')}
                                tip="Copy Extra ID"
                                text={extraIdFrom}
                                link={from?.address_explorer?.replace('{}', `${addressFrom}`)}
                                testId="exchange-extra-id-from"
                            />
                            <NotificationAddress>
                                <StyledNotificationIcon />
                                <NotificationText>
                                    {t('dontForgetAbout')} {t('extraID')}!
                                </NotificationText>
                            </NotificationAddress>
                        </InfoBlockContainer>
                    )}
                    {from?.tx_explorer && txFrom && (
                        <InfoBlockContainer>
                            <InfoBlock
                                title={`${t('inputHash')}:`}
                                text={txFrom}
                                link={from?.tx_explorer.replace('{}', txFrom)}
                                testId="exchange-tx-explorer-from"
                            />
                        </InfoBlockContainer>
                    )}
                </div>
                {waiting && <QRCont value={addressFrom} />}
            </SentBlock>

            <DividerLine />

            <GetBlock>
                <InfoBlockContainer>
                    <InfoBlock
                        title={`${t('youGet')}:`}
                        text={`${fixed ? '' : '≈'} ${amountTo} ${to?.symbol.toUpperCase()}`}
                        testId="exchange-amount-to"
                        copy={false}
                    />
                </InfoBlockContainer>
                <InfoBlockContainer>
                    <InfoBlock
                        title={t('recipientAddress')}
                        text={addressTo}
                        testId="exchange-address-to"
                        link={to?.address_explorer?.replace('{}', addressTo)}
                        tip="Copy Address"
                    />
                </InfoBlockContainer>
                {extraIdTo && (
                    <InfoBlockContainer>
                        <InfoBlock
                            title={to?.extra_id ? to.extra_id : t('extraID')}
                            text={extraIdTo}
                            testId="exchange-extra-id-to"
                        />
                    </InfoBlockContainer>
                )}
                {txTo && to?.tx_explorer && (
                    <InfoBlockContainer>
                        <InfoBlock
                            title={t('outputHash')}
                            text={txTo}
                            testId="exchange-tx-explorer-to"
                            link={to?.tx_explorer.replace('{}', txTo)}
                        />
                    </InfoBlockContainer>
                )}
            </GetBlock>
        </>
    );
};

export default Details;
