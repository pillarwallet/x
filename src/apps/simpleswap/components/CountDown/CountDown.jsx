import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';

import useCountdown from '../../hooks/useCountDown';

import { Container } from './styles';
import PropTypes from 'prop-types';

const CountDown = (props) => {
  const { startDate = Date.now() } = props;

  const { t } = useTranslation();

  const timeLeft = useCountdown(() => dayjs(startDate));

  const timeLeftDate = dayjs(timeLeft);

  return <Container>{`${t('timer')}${Math.max(timeLeftDate.minute(), 0)}m ${Math.max(timeLeftDate.second(), 0)}s`}</Container>;
};

CountDown.propTypes = {
  startDate: PropTypes.any
}

export default CountDown;
