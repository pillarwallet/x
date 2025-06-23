import styled from 'styled-components';
import MainButton from '../../../../../common/main-button/main-button';
import { device } from '../../../../../../lib/styles/breakpoints';


const NextButton = styled(MainButton)`
  width: 100%;

  & > button {
    height: 48px;
    border-radius: 8px;
  }

  & > button,
  & > button > span {
    font-size: 14px;
  }

  @media ${device.mobileXL} {
    width: 172px;

    & > button {
      height: 68px;
      border-radius: 12px;
    }

    & > button,
    & > button > span {
      font-size: 16px;
    }
  }

  @media ${device.tablet} {
    width: 100%;
  }
`;

export default NextButton;
