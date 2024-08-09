import { useTranslation } from 'react-i18next';
import { ExchangeInfo } from '../../../../../../type';


const useStatusTitle = (status: ExchangeInfo['status'], widget: boolean) => {
    const { t } = useTranslation();

    switch (status) {
        case 'waiting':
            return t('waitingStep');
        case 'exchanging':
            return t('exchangingStep');
        case 'confirming':
            return t('confirmingStep');
        case 'sending':
            return t('sendingStep');
        case 'refunded':
            return t('refundedStep');
        case 'expired':
            return t('timeoutStep');
        case 'finished':
            return widget ? t('finishStep') : t('success') + '!';
        default:
            return '';
    }
};

export default useStatusTitle;