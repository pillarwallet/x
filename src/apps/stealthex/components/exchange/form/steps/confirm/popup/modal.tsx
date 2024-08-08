import { useState } from 'react';


import {
    Background,
    CheckWrap,
    CloseImage,
    CloseModalButton,
    ExchangeButtonPopap,
    MainWrapper,
    ModalHeader,
    ModalText,
    ModalTextGrey,
    ModalTextGreyTwo,
    ModalWrapper,
    TermsCheckboxLabelOne,
    TermsCheckboxLabelTwo,
    TitleModal,
} from './styles';
import { Trans, useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../../redux/hooks';
// import LinkText from '../../../../../common/link-text';

type ModalProps = {
    showModal?: boolean;
    setShowModal?: (show: boolean) => void;
    createExchange: () => void;
    isExchangeCreating?: boolean;
};

const Modal = ({
    showModal,
    setShowModal,
    createExchange,
    isExchangeCreating,
}: ModalProps) => {
    const { t } = useTranslation();
    const { selectedProvider } = useAppSelector(state => state.exchange)

    const [isTermsCheckedOne, setTermsCheckedOne] = useState(false);
    const [isTermsCheckedTwo, setTermsCheckedTwo] = useState(false);

    const handleTermsChangeOne = () => {
        setTermsCheckedOne(!isTermsCheckedOne);
    };

    const handleTermsChangeTwo = () => {
        setTermsCheckedTwo(!isTermsCheckedTwo);
    };

    const handleConfirm = () => {
        setShowModal && setShowModal(false);
        createExchange();
    };

    const isChecked = isTermsCheckedOne && isTermsCheckedTwo;
    const providerName =
        selectedProvider[0].toUpperCase() + selectedProvider.slice(1);
    return (
        <>
            {showModal ? (
                <Background>
                    <MainWrapper>
                        <ModalWrapper>
                            <ModalHeader>
                                <TitleModal>{t('fiatModalTitle')}</TitleModal>
                                <CloseModalButton
                                    onClick={() => setShowModal && setShowModal(!showModal)}
                                >
                                    <CloseImage />
                                </CloseModalButton>
                            </ModalHeader>
                            <ModalText>
                                {t('fiatModalText', { provider: providerName })}
                            </ModalText>

                            <CheckWrap>
                                <TermsCheckboxLabelOne checked={isTermsCheckedOne}>
                                    <input
                                        type="checkbox"
                                        checked={isTermsCheckedOne}
                                        onChange={handleTermsChangeOne}
                                    />
                                </TermsCheckboxLabelOne>
                                <ModalTextGrey>
                                    {t('fiatModalAgree', { provider: providerName })}
                                </ModalTextGrey>
                            </CheckWrap>

                            <CheckWrap>
                                <TermsCheckboxLabelTwo checked={isTermsCheckedTwo}>
                                    <input
                                        type="checkbox"
                                        checked={isTermsCheckedTwo}
                                        onChange={handleTermsChangeTwo}
                                    />
                                </TermsCheckboxLabelTwo>
                                <ModalTextGreyTwo>
                                    <Trans
                                        i18nKey="agreeTerms"
                                        components={[
                                            <a href="https://stealthex.io/terms" key="terms" />,
                                            <a href="https://stealthex.io/privacy-policy/" key="privacy" />,
                                        ]}
                                    />
                                </ModalTextGreyTwo>
                            </CheckWrap>
                            <ExchangeButtonPopap
                                className={isChecked ? 'checked' : ''}
                                disabled={!isChecked}
                                onClick={handleConfirm}
                                isLoading={isExchangeCreating}
                            >
                                {t('fiatModalAction')}
                            </ExchangeButtonPopap>
                        </ModalWrapper>
                    </MainWrapper>
                </Background>
            ) : null}
        </>
    );
};

export default Modal;