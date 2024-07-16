import styled from 'styled-components';
import { device } from './breakpoints';


type SectionHeadingProps = {
    leftHeading?: boolean;
    colorHeading?: boolean;
};

export const SectionHeading = styled.h2<SectionHeadingProps>`
  margin: 0 0 20px;
  font-family: 'Inter', sans-serif;
  font-style: normal;
  font-weight: bold;
  text-align: ${(props) => (props.leftHeading ? 'start' : 'center')};
  color: ${(props) => (props.colorHeading ? 'var(--black)' : '#fff')};

  &.heading-padding {
    @media (max-width: 767px) {
      padding-top: 40px;
    }
  }

  @media (min-width: 300px) {
    font-size: 28px;
    line-height: 39px;
  }

  @media (min-width: 768px) {
    margin: 0 0 15px;
    line-height: 34px;
    font-size: 28px;
    margin-bottom: 23px;
    margin-top: 14px;
    text-align: center;
  }

  @media (min-width: 934px) {
    font-size: 28px;
    line-height: 34px;
    margin-bottom: 50px;
    margin-top: 0;
  }

  @media (min-width: 1200px) {
    font-size: 48px;
    line-height: 58px;

    &.section-margin {
      margin-bottom: 24px;
    }

    &.section-margin_two {
      margin-top: 29px;
    }
  }

  &.padding-heding {
    @media (max-width: 934px) {
      padding-top: 10px;
    }

    @media (max-width: 934px) {
      margin: 0 0 0px;
    }
  }
`;

export const TextPage = styled.main`
  padding: 0px 0 90px;
  line-height: 1.5;

  @media ${device.tablet} {
    padding: 20px 0 90px;
  }

  @media ${device.tabletL} {
    padding: 0px 0 90px;
  }

  ul,
  ol {
    padding-left: 20px;
    list-style-type: decimal;
  }

  h1 {
    margin: 0 0 20px;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;

    @media ${device.tabletL} {
      font-size: 48px;
      line-height: 58px;
    }
  }

  h2 {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
    color: var(--black);
    padding-top: 10px;
    padding-bottom: 20px;

    @media ${device.tabletL} {
      font-size: 20px;
      line-height: 25px;
      padding-bottom: 20px;
    }
  }

  li {
    padding: 5px 0;
    font-size: 14px;
    line-height: 24px;

    @media ${device.tabletL} {
      font-size: 16px;
      line-height: 28px;
      padding: 10px 0;
    }
  }

  p,
  strong {
    padding: 5px 0;
    font-size: 14px;
    line-height: 24px;

    @media ${device.tabletL} {
      font-size: 16px;
      line-height: 28px;
      padding: 10px 0;
    }
  }

  table {
    border-collapse: collapse;
  }

  table,
  th,
  td {
    border: 1px solid black;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  th {
    font-weight: 700;
    font-size: 11px;
    line-height: 15px;

    @media ${device.tablet} {
      font-size: 16px;
      line-height: 22px;
    }

    @media ${device.tabletL} {
      font-size: 18px;
      line-height: 25px;
    }
  }

  td {
    vertical-align: top;

    font-size: 10px;
    line-height: 16px;

    @media ${device.tablet} {
      font-size: 14px;
      line-height: 24px;
    }

    @media ${device.tabletL} {
      font-size: 16px;
      line-height: 28px;
    }

    & > strong {
      font-size: 10px;
      line-height: 16px;

      @media ${device.tablet} {
        font-size: 14px;
        line-height: 24px;
      }

      @media ${device.tabletL} {
        font-size: 16px;
        line-height: 28px;
      }
    }

    & > p {
      font-size: 10px;
      line-height: 16px;

      @media ${device.tablet} {
        font-size: 14px;
        line-height: 24px;
      }

      @media ${device.tabletL} {
        font-size: 16px;
        line-height: 28px;
      }
    }
  }

  /** TODO duplicates TextPageSubheading; remove when cms will be ok for terms */

  & > a {
    color: inherit;
    border-bottom: 1px dotted currentColor;
  }

  @media (min-width: 768px) {
    padding-bottom: 105px;
  }

  @media (min-width: 1200px) {
    padding-bottom: 145px;

    & > a {
      transition: border-bottom-color var(--transition-ease-in-out);

      @media (hover: hover) {
        &:hover {
          border-bottom-color: transparent;
        }
      }
    }
  }
`;

export const KycPage = styled.main`
  padding: 0px 0 90px;
  line-height: 1.5;

  @media ${device.tablet} {
    padding: 20px 0 90px;
  }

  @media ${device.tabletL} {
    padding: 0px 0 90px;
  }

  h1 {
    margin: 0 0 20px;
    font-weight: 700;
    font-size: 28px;
    line-height: 34px;

    @media ${device.tabletL} {
      font-size: 48px;
      line-height: 58px;
    }
  }

  h2 {
    font-size: 18px;
    line-height: 22px;
    font-weight: 700;

    @media ${device.tabletL} {
      font-size: 20px;
      line-height: 25px;
    }
  }

  h3 {
    font-weight: 700;
    font-size: 11px;
    line-height: 15px;

    @media ${device.tablet} {
      font-size: 16px;
      line-height: 22px;
    }

    @media ${device.tabletL} {
      font-size: 18px;
      line-height: 25px;
    }
  }

  strong {
    font-weight: 700;
    font-size: 18px;
    line-height: 22px;
    padding-bottom: 16px;
    color: var(--black);
    padding-bottom: 20px;

    @media ${device.tabletL} {
      font-size: 20px;
      line-height: 25px;
      padding-bottom: 20px;
    }
  }

  ul,
  ol {
    padding-left: 20px;
    list-style: none;
    counter-reset: li;
  }

  li {
    padding: 5px 0;
    font-size: 14px;
    line-height: 24px;

    @media ${device.tabletL} {
      font-size: 16px;
      line-height: 28px;
      padding: 10px 0;
    }
  }

  li:before {
    counter-increment: li;
    content: counters(li, '.') '. ';
  }

  p {
    font-size: 14px;
    line-height: 24px;

    @media ${device.tabletL} {
      font-size: 16px;
      line-height: 28px;
    }

    & > strong {
      font-size: 14px;
      line-height: 24px;

      @media ${device.tabletL} {
        font-size: 16px;
        line-height: 28px;
      }
    }
  }

  em {
    font-weight: 700;
    font-style: normal;
  }

  table {
    border-collapse: collapse;
  }

  table,
  th,
  td {
    border: 1px solid black;
  }

  th,
  td {
    padding: 10px;
    text-align: left;
  }

  td {
    vertical-align: top;

    & > p {
      font-size: 10px;
      line-height: 16px;

      @media ${device.tablet} {
        font-size: 14px;
        line-height: 24px;
      }

      @media ${device.tabletL} {
        font-size: 16px;
        line-height: 28px;
      }
    }
  }
`;

export const TextPageHeading = styled.h1`
  margin: 0 0 20px;
  font-weight: 700;
  font-size: 28px;
  line-height: 34px;

  @media (min-width: 1200px) {
    font-size: 48px;
    line-height: 58px;
  }
`;

export const TextPageSubheading = styled.h2`
  margin: 25px 0 10px;
  font-weight: 500;
  font-size: 18px;

  @media (min-width: 768px) {
    margin-top: 30px;
    font-size: 22px;
  }
`;

export const PageHeading = styled(TextPageHeading)`
  font-weight: bold;
  font-size: 48px;
  line-height: 58px;
  padding: 0;
  margin: 0;
  padding-bottom: 55px;

  @media (max-width: 1024px) {
    font-size: 28px;
    line-height: 34px;
    padding-top: 24px;
    padding-bottom: 35px;
  }

  @media (max-width: 767px) {
    padding-top: 9px;
    text-align: left;
  }
`;

export const PageSubheading = styled(TextPageSubheading)`
  && {
    margin: 0;
    text-align: center;

    @media (min-width: 768px) {
      text-align: left;
    }
  }
`;

export const HeadingLabel = styled.span`
  display: block;
  font-family: 'Inter', sans-serif;
  font-weight: bold;
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--gray);

  @media (min-width: 1050px) {
    font-size: 16px;
  }
`;

export const BreakAll = styled.span`
  display: inline-block;
  word-break: break-all;
`;

export const DMSans = styled.span`
  font-family: 'DM Sans', sans-serif;
`;

export const SecondaryHeading = styled.h2`
  font-weight: 700;
  font-size: 20px;
  line-height: 26px;
  margin: 0 0 12px 0;

  @media (min-width: 768px) {
    font-size: 28px;
    line-height: 35px;
  }
`;