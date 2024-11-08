/* eslint-disable no-param-reassign */
import { useMemo } from 'react';

import { Container, Step, TextDivider } from './styles';
import PropTypes from 'prop-types';

const MAX_STEP = 4;
const HeaderStepBlock = ({ step }) => {
  const displayStep = useMemo(() => {
    switch (step) {
      case 1:
        return 1;
      case 2:
        return 2;
      case 3:
      case 4:
      case 5:
      case 6:
        return 3;
      case 7:
        return 4;
      default:
        return null;
    }
  }, [step]);
  if (!displayStep) return null;
  return (
    <Container>
      <Step>{displayStep}</Step>
      <TextDivider>/</TextDivider>
      {MAX_STEP}
    </Container>
  );
};

HeaderStepBlock.propTypes = {
  step: PropTypes.number,
}

export default HeaderStepBlock;
