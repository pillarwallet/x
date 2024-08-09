import { FC, PropsWithChildren, useState } from 'react';
import { useTranslation } from 'react-i18next';
import NotificationForm from './notification-from';
import Tabs from '../tabs';
import { Content, DividerLine, FormContainer, Loader, LoaderContainer, StepsContainer, TabsContainer } from './styles';
import { ExchangeInfo } from '../../../type';
import StepTitles from './steps/titles';

interface FormWrapperProps {
  exchangeInfoResult: { data?: {data: ExchangeInfo | undefined, signature: string}, isLoading: boolean, status?: string };
  currentStep: number;
  existingExchange?: boolean;
  widget?: boolean;
}

const useShowNotification = (
  exchangeInfoResult?: ExchangeInfo,
) => {
  const [isNotificationVisible, setIsNotificationVisible] = useState(true);

  const closeNotification = () => {
    setIsNotificationVisible(false);
  };

  const shouldShowNotification = exchangeInfoResult &&
    exchangeInfoResult.status === 'waiting' &&
    (exchangeInfoResult.address_from == 'mercuryo' ||
      exchangeInfoResult.address_from == 'simplex');

  return {
    showNotification: shouldShowNotification && isNotificationVisible,
    closeNotification,
  };
};

export const FormWrapper: FC<PropsWithChildren<FormWrapperProps>> = ({
  children,
  exchangeInfoResult,
  currentStep,
  existingExchange,
  widget
}) => {
  const { t } = useTranslation();
  const { showNotification, closeNotification } =
    useShowNotification(exchangeInfoResult.data?.data);
  const correctedStep = existingExchange ? 3 : currentStep;
  return (
    <>
      {showNotification && showNotification ? (
        <NotificationForm
          text={t('notification')}
          onClose={closeNotification}
        />
      ) : null}

      <FormContainer widget={widget ? 'true' : undefined}>
        {correctedStep === 1 && !widget && !existingExchange && (
          <TabsContainer>
            <Tabs />
          </TabsContainer>
        )}
        <Content>
          {!widget && (
            <StepsContainer resetbottompadding={correctedStep == 1}>
              <StepTitles
                alignLeft={correctedStep != 1 || existingExchange}
                infoStatus={exchangeInfoResult.status}
                finished={exchangeInfoResult.data?.data?.status == 'finished'}
                currentStep={correctedStep}
              />
            </StepsContainer>
          )}
          {correctedStep != 1 && !widget &&  <DividerLine desktopOnly={false} />}
          {exchangeInfoResult?.isLoading ? ( //have to change logic too
            <LoaderContainer>
              <Loader />
            </LoaderContainer>
          ) : (
            <>{children}</>
          )}
        </Content>
      </FormContainer>
    </>
  );
};