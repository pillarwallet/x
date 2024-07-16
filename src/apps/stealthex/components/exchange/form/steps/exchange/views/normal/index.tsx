import React from 'react';

import reviewImage from '../../../../../../../assets/review.svg';

import Details from './details';
import Mercuryo from './providers/mercuryo';
import Simplex from './providers/simplex';
import {
    ButtonsBlock,
    ButtonWrapper,
    Container,
    FailedBlock,
    FailedHeading,
    FailedId,
    FailedMessage,
    FailedText,
    ImageContainer,
    LeaveReviewButton,
    NewExchangeReview,
    SubmitTicketAnchor,
    Support,
    SupportContainer,
} from './styles';

import type ViewProps from '../view-props';
import { useTranslation } from 'react-i18next';

const NormalView: React.FC<ViewProps> = ({ exchangeInfo, onNewExchange }) => {
    const { status, id, address_from: addressFrom } = exchangeInfo;

    const { t } = useTranslation();
    const waiting = status == 'waiting';
    const finished = status == 'finished';
    const failed = status == 'failed';
    const verifying = status == 'verifying';
    const fiat = addressFrom == 'mercuryo' || addressFrom == 'simplex';

    const smthWentWrong = failed || verifying;

    if (fiat && waiting) {
        return (
            <Container>
                {addressFrom == 'mercuryo' && <Mercuryo exchangeInfo={exchangeInfo} />}
                {addressFrom == 'simplex' && <Simplex exchangeInfo={exchangeInfo} />}
            </Container>
        );
    }

    return (
        <>
            <Container>
                {smthWentWrong ? (
                    <FailedBlock>
                        <FailedMessage data-testid="exchange-failed-message">
                            <FailedHeading>
                                {verifying ? t('verifying') : t('smthWentWrong')}
                            </FailedHeading>
                            <FailedText>{t('exchangeCouldNotBeCompleted')}</FailedText>
                            <FailedText>{t('contactSupport')}</FailedText>
                        </FailedMessage>

                        <FailedId id={id} />

                        <SubmitTicketAnchor
                            href="https://stealthex.freshdesk.com/support/tickets/new"
                            target="_blank"
                            rel="noreferrer"
                        >
                            {t('submitTicket')}
                        </SubmitTicketAnchor>
                    </FailedBlock>
                ) : (
                    <Details exchangeInfo={exchangeInfo} />
                )}

                {finished && (
                    <ButtonsBlock>
                        <ButtonWrapper>
                            <LeaveReviewButton
                                rel="noreferrer"
                                target="_blank"
                                href="https://www.trustpilot.com/review/stealthex.io"
                            >
                                <ImageContainer>
                                    <img alt="review" src={reviewImage} />
                                </ImageContainer>
                                <span>{t('leaveReview')}</span>
                            </LeaveReviewButton>

                            <NewExchangeReview
                                component="link"
                                href="/exchange/new"
                                onClick={onNewExchange}
                            >
                                {t('createNewExchange')}
                            </NewExchangeReview>
                        </ButtonWrapper>
                    </ButtonsBlock>
                )}

                {!smthWentWrong ? (
                    <SupportContainer>
                        <Support
                            href="https://stealthex.freshdesk.com/support/tickets/new"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            {t('support')}
                        </Support>
                    </SupportContainer>
                ) : null}
            </Container>
        </>
    );
};

export default NormalView;