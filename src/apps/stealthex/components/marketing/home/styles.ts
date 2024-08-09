import styled from 'styled-components';
import { device } from '../../../lib/styles/breakpoints';



export const StyledSection = styled.section`
  background: var(--lynx-white);
  display: flex;
  justify-content: center;
  padding: 40px 0 60px;

  @media ${device.tablet} {
    padding: 33px 0 60px;
  }

  @media ${device.tabletL} {
    padding: 98px 0 171px;
  }
`;

export const Title = styled.h1`
  font-size: 30px;
  line-height: 36.31px;
  margin-bottom: 40px;
  color: var(--nero);
  text-align: center;
  font-weight: 700;

  @media (min-width: 460px) {
    margin-bottom: 60px;
  }

  @media ${device.tablet} {
    font-size: 42px;
    line-height: 50.83px;
  }

  @media ${device.tabletL} {
    font-size: 52px;
    line-height: 62.93px;
    padding: 0;
    margin-bottom: 73px;
  }
`;
