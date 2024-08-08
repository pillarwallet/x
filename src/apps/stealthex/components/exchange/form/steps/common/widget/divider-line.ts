import styled from 'styled-components';
import { device } from '../../../../../../lib/styles/breakpoints';
import { DividerLine as GenericDividerLine } from '../../../styles';

const DividerLine = styled(GenericDividerLine)`
  margin: 4px 0;
  border-top: 1px solid var(--lynx-white);

  @media ${device.mobileXL} {
    margin: 16px 0;
  }
`;

export default DividerLine;
