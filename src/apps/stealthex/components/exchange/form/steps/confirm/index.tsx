import React, { useState } from 'react';

import { DividerLine } from '../../styles';
import InfoBlock from '../common/info-block';
import {
  Amount,
  ArrowImg,
  Block,
  BoxContainer,
  BreakAllText,
  Btn,
  Buttons,
  Error,
  FlexContainer,
  Footer,
  Title,
} from './styles';
import { useTranslation } from 'react-i18next';
import { useAppSelector } from '../../../../../redux/hooks';
import { useEstimateQuery, useFiatEstimateQuery } from '../../../../../lib/backend/api';
import providers from '../../../../../lib/providers';
import Terms from '../common/terms';
import Popap from './popup';
import { BreakAll } from '../../../../../lib/styles/typography';
import { ArrowBottom } from '../../../../common/icons';

export type ConfirmProps = {
  address: string;
  extraId: string;
  isCreateFailed?: 'signature' | 'error' | boolean;
  isExchangeCreating?: boolean;
  isFiat?: boolean;
  onSubmit?: () => void;
  onReject?: () => void;
  isExchangeCreated?: boolean;
};

const Confirm: React.FC<ConfirmProps> = ({
  address,
  extraId,
  isCreateFailed,
  isExchangeCreating,
  isFiat,
  onSubmit,
  onReject,
  isExchangeCreated,
}) => {
  const { t } = useTranslation();

  const [isTermsChecked, setTermsChecked] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { reverse, selectedProvider, amount, receiveCurrency, sendCurrency, fixed, fiat } = useAppSelector(state => state.exchange)
  // const reverse = useAtomValue(reverseAtom);
  // const selectedProvider = useAtomValue(providerAtom);
  // const amount = useAtomValue(amountAtom);
  // const receiveCurrency = useAtomValue(receiveCurrencyAtom);
  // const sendCurrency = useAtomValue(sendCurrencyAtom);
  // const fixed = useAtomValue(fixedAtom);
  // const fiat = useAtomValue(fiatAtom);

  const estimate = useEstimateQuery(
    {
      amount: reverse ? undefined : Number(amount),
      amount_to: reverse ? Number(amount) : undefined,
      from: sendCurrency.symbol,
      to: receiveCurrency.symbol,
      fixed,
    },
    {
      pollingInterval: 0
    },
  );
  const mercuryoQuery = useFiatEstimateQuery(
    {
      amount: Number(amount),
      from: sendCurrency.symbol,
      to: receiveCurrency.symbol,
      fixed: false,
      provider: 'mercuryo'
    },
    { pollingInterval: 0 }
  );
  const simplexQuery = useFiatEstimateQuery({
    amount: Number(amount),
    from: sendCurrency.symbol,
    to: receiveCurrency.symbol,
    fixed: false,
    provider: 'simplex'
  },
    { pollingInterval: 0 }
  );
  const fiatEstimates = [mercuryoQuery, simplexQuery]

  const matchedAmount = reverse ? estimate.data?.estimate : amount;
  const matchedEstimate = reverse
    ? amount
    : fiat
      ? fiatEstimates[
        providers.findIndex((provider) => provider.name == selectedProvider)
      ].data?.estimate
      : estimate.data?.estimate;

  const amountExceeds = matchedAmount ? matchedAmount.length >= 13 : false;
  const visibleAmount = amountExceeds
    ? `${matchedAmount?.slice(0, 13)}...`
    : matchedAmount;

  const estimateExceeds = matchedEstimate
    ? matchedEstimate.length >= 17
    : false;
  const visibleEstimate = estimateExceeds
    ? `${matchedEstimate?.slice(0, 16)}...`
    : matchedEstimate;

  const { extra_id: currencyExtraId, address_explorer: addressExplorer } =
    receiveCurrency;

  const handleTermsChange = () => {
    setTermsChecked(!isTermsChecked);
  };

  const handleModalOpen = () => {
    setShowModal(true);
  };

  return (
    <>
      <Popap
        showModal={showModal}
        setShowModal={setShowModal}
        createExchange={onSubmit}
      />
      <Block>
        <FlexContainer>
          <BoxContainer>
            <Title>{t('youSend')}</Title>
            <Amount
              exceeds={amountExceeds}
              data-testid="exchange-confirm-amount"
            >
              <BreakAll>{visibleAmount}</BreakAll>{' '}
              <BreakAll>{sendCurrency?.symbol.toUpperCase()}</BreakAll>
              <BreakAllText>
                {amount} {sendCurrency?.symbol.toUpperCase()}
              </BreakAllText>
            </Amount>
          </BoxContainer>
          <BoxContainer>
            <ArrowImg>
              <ArrowBottom fill="#B0B0B0" width={14} />
            </ArrowImg>
          </BoxContainer>
          <BoxContainer>
            <Title>{t('youGet')}</Title>
            <Amount
              exceeds={estimateExceeds}
              data-testid="exchange-confirm-estimate"
            >
              <BreakAll>{`${fixed ? '' : '≈'}${visibleEstimate}`}</BreakAll>{' '}
              {receiveCurrency?.symbol.toUpperCase()}
              <BreakAllText className="get-all_text">
                {`${fixed ? '' : '≈'}${estimate.data?.estimate}`}{' '}
                {receiveCurrency?.symbol.toUpperCase()}
              </BreakAllText>
            </Amount>
          </BoxContainer>
        </FlexContainer>
      </Block>

      <DividerLine />

      <Block>
        <InfoBlock
          title={t('toAddress')}
          text={address}
          tip="Copy Address"
          testId="exchange-confirm-address"
          link={addressExplorer?.replace('{}', `${address}`)}
        />
        {currencyExtraId && extraId && (
          <InfoBlock
            title={t('recipientExtraId', {
              placeholder: currencyExtraId || t('extraID'),
            })}
            text={extraId}
            tip="Copy Extra ID"
          />
        )}
        {isCreateFailed ? (
          <Error>
            {isCreateFailed == 'signature'
              ? t('signatureInvalid')
              : t('failedCreatingExchange')}
          </Error>
        ) : null}
        <Footer>
          <Terms
            checked={isTermsChecked}
            onCheckToggle={handleTermsChange}
            blank
          />

          <Buttons>
            <Btn
              onClick={() => {
                onReject && onReject();

                // event('confirm_back', {
                //   label: 'Confirm back button press',
                //   category: 'Exchange',
                // });
              }}
              mr="20px"
              testId="exchange-back"
              bordered
            >
              {t('back')}
            </Btn>
            <Btn
              disabled={
                !isTermsChecked || isExchangeCreating || isExchangeCreated
              }
              onClick={() => {
                if (isFiat) {
                  handleModalOpen();
                } else {
                  onSubmit && onSubmit();
                }

                // event('confirm_next', {
                //   label: 'Confirm next button press',
                //   category: 'Exchange',
                // });
              }}
              isLoading={isExchangeCreating || isExchangeCreated}
              testId="exchange-submit"
            >
              {t('next')}
            </Btn>
          </Buttons>
        </Footer>
      </Block>
    </>
  );
};

export default Confirm;
