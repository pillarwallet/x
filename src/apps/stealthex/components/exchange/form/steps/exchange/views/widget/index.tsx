import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';

import useCountdown from '../use-countdown';
import useStatusTitle from '../use-status-title';
import {
    AddressBlock,
    Container,
    Content,
    Details,
    DividerLine,
    ExtraBlock,
    FailedBlock,
    FailedDescription,
    Footer,
    Id,
    IdContainer,
    IdLabel,
    Loader,
    LoaderWithTimer,
    Status,
    StatusRow,
    StyledCopyButton,
    StyledExchangeData,
    StyledQRCode,
    StyledRoundedCheck,
    StyledSupportIcon,
    StyledWarningIcon,
    SubmitTicketAnchor,
    Success,
    Support,
    SupportLink,
    Timer,
    WaitingBlock,
    WaitingBlockAddress,
    WaitingContent,
    WaitingExtraContainer,
    WaitingExtraId,
    WaitingExtraIdLabel,
    WaitingExtraRow,
    Warning,
} from './styles';

import type ViewProps from '../view-props';
import { useTranslation } from 'react-i18next';
import Copy from '../../../../../../common/copy';
import { CopyIcon } from '../../../../../../common/icons';

const CopyButton: React.FC<{ label: string; data: string }> = ({
    label,
    data,
}) => {
    const [copied, setCopied] = useState(false);
    useEffect(() => {
        if (!copied) {
            return;
        }

        const timeout = setTimeout(() => setCopied(false), 3000);

        return () => clearTimeout(timeout);
    }, [copied]);

    return (
        <StyledCopyButton
            onClick={() => {
                setCopied(copy(data));
            }}
        >
            {copied ? (
                'Copied'
            ) : (
                <>
                    <CopyIcon fill="var(--black)" />
                    <span>{label}</span>
                </>
            )}
        </StyledCopyButton>
    );
};

const WidgetView: React.FC<ViewProps> = ({ exchangeInfo }) => {
    const {
        status,
        id,
        address_to: addressTo,
        address_from: addressFrom,
        currencies,
        currency_from: currencyFrom,
        extra_id_from: extraIdFrom,
        timestamp,
        type,
        tx_from: txFrom,
    } = exchangeInfo;

    const { t } = useTranslation();

    const statusTitle = useStatusTitle(status, true);

    const fixed = type == 'fixed';
    const from = currencies[currencyFrom];

    const waiting = status == 'waiting';
    const confirming = status == 'confirming';
    const exchanging = status == 'exchanging';
    const sending = status == 'sending';
    const finished = status == 'finished';
    const refunded = status == 'refunded';

    const processing = confirming || exchanging || sending || finished;
    const failed = status == 'failed' || status == 'verifying';

    const shouldCheckForTimeout = fixed && waiting;
    const { timeout, countdown } = useCountdown(
        timestamp,
        !shouldCheckForTimeout,
    );
    const checkedTimeout = shouldCheckForTimeout && timeout;
    const displayLoaderWithTimer = fixed && waiting && !checkedTimeout;
    const displayLoader =
        !displayLoaderWithTimer &&
        !checkedTimeout &&
        !failed &&
        !finished &&
        !refunded;

    return (
        <Container>
            <Content>
                <StatusRow>
                    {!failed ? (
                        <>
                            <Status>{checkedTimeout ? t('timeoutStep') : statusTitle}</Status>
                            {finished && (
                                <Success>
                                    <StyledRoundedCheck />
                                </Success>
                            )}
                            {displayLoaderWithTimer && (
                                <LoaderWithTimer>
                                    <Timer>{countdown}</Timer>
                                    <Loader />
                                </LoaderWithTimer>
                            )}
                            {displayLoader && <Loader />}
                        </>
                    ) : (
                        <FailedBlock>
                            <Status>{t('smthWentWrong')}</Status>
                            <DividerLine />
                            <FailedDescription>
                                {t('exchangeCouldNotBeCompleted')} {t('contactSupport')}
                            </FailedDescription>
                            <SubmitTicketAnchor
                                href="https://stealthex.freshdesk.com/support/tickets/new"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('submitTicket')}
                            </SubmitTicketAnchor>
                        </FailedBlock>
                    )}
                </StatusRow>
                {!failed && (
                    <>
                        <DividerLine />
                        <StyledExchangeData
                            emphasize={waiting ? 'send' : 'get'}
                            exchnageInfo={exchangeInfo}
                        />
                    </>
                )}
                {waiting && (
                    <>
                        <DividerLine mobileonly="true" />
                        <WaitingBlock>
                            <WaitingContent>
                                <StyledQRCode value={addressFrom} />
                                <WaitingBlockAddress>
                                    <Details
                                        label="To address:"
                                        data={addressFrom}
                                        breakWords
                                        thin
                                    />
                                    <CopyButton data={addressFrom} label="Copy Address" />
                                </WaitingBlockAddress>
                            </WaitingContent>
                            {extraIdFrom && (
                                <>
                                    <DividerLine />
                                    <WaitingExtraContainer>
                                        <WaitingExtraRow>
                                            <WaitingExtraIdLabel>
                                                {from?.extra_id ? from.extra_id : t('extraID')}:
                                            </WaitingExtraIdLabel>
                                            <WaitingExtraId>{extraIdFrom}</WaitingExtraId>
                                            <Copy text={extraIdFrom} />
                                        </WaitingExtraRow>
                                        <WaitingExtraRow>
                                            <Warning>
                                                <StyledWarningIcon width={14} height={14} />
                                                <span>Dont forget about Extra ID!</span>
                                            </Warning>
                                        </WaitingExtraRow>
                                    </WaitingExtraContainer>
                                </>
                            )}
                        </WaitingBlock>
                    </>
                )}
                {processing && (
                    <>
                        <AddressBlock>
                            <DividerLine />
                            <Details label="To address:" data={addressTo} thin breakWords />
                            <DividerLine />
                            <Details
                                label="Recipient’s address:"
                                data={addressFrom}
                                breakWords
                            />
                            {txFrom || extraIdFrom ? <DividerLine /> : null}
                        </AddressBlock>
                        <ExtraBlock>
                            {txFrom && (
                                <Details label="Input hash:" data={txFrom} thin breakWords />
                            )}
                            {extraIdFrom && (
                                <>
                                    {txFrom && <DividerLine />}
                                    <Details
                                        label={`${from?.extra_id ? from.extra_id : t('extraID')}:`}
                                        data={extraIdFrom}
                                        breakWords
                                        thin
                                    />
                                </>
                            )}
                        </ExtraBlock>
                    </>
                )}
            </Content>
            <Footer>
                <IdContainer>
                    <IdLabel>Exchange ID:</IdLabel>
                    <Id>{id}</Id>
                    <Copy text={id} hoverColor="var(--gray)" />
                </IdContainer>
                <SupportLink
                    href="https://stealthex.freshdesk.com/support/tickets/new"
                    target="_blank"
                >
                    <StyledSupportIcon />
                    <Support>{t('support')}</Support>
                </SupportLink>
            </Footer>
        </Container>
    );
};

export default WidgetView;
