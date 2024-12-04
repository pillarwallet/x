import { ActiveStepName, IconsContainer } from './styles';
import PendingIcon from '../icons/PendingIcon';
import ConfirmingIcon from '../icons/ConfirmingIcon';
import ExchangingIcon from '../icons/ExchangingIcon';
import SendingIcon from '../icons/SendingIcon';
import CheckIcon from '../icons/CheckIcon';
import PropTypes from 'prop-types';

const ExchangeStatuses = ({ step }) => {
  if (![3, 4, 5, 6].includes(step)) return null;
  return (
    <IconsContainer>
      {step > 3 ? <CheckIcon /> : <PendingIcon isActive={step === 3} />}
      {step === 3 && <ActiveStepName>Pending deposit</ActiveStepName>}-
      {step > 4 ? <CheckIcon /> : <ConfirmingIcon isActive={step === 4} />}
      {step === 4 && <ActiveStepName>Confirming</ActiveStepName>}-
      {step > 5 ? <CheckIcon /> : <ExchangingIcon isActive={step === 5} />}
      {step === 5 && <ActiveStepName>Exchanging</ActiveStepName>}-
      <SendingIcon isActive={step === 6} />
      {step === 6 && <ActiveStepName>Sending</ActiveStepName>}
    </IconsContainer>
  );
};

ExchangeStatuses.propTypes = {
  step: PropTypes.number,
}


export default ExchangeStatuses;
