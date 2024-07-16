import styled from 'styled-components';

import { Block as GenericBlock } from '../../../../../styles';
import { device } from '../../../../../../../../lib/styles/breakpoints';

const Block = styled(GenericBlock)`
  padding-top: 20px;
  padding-bottom: 20px;

  @media ${device.tablet} {
    padding-top: 32px;
    padding-bottom: 32px;
  }
`;

export default Block;