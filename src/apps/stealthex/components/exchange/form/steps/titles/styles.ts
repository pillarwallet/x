import styled, { css } from 'styled-components';

type TabsHrProps = {
  current?: boolean;
  passed?: boolean;
};

export const TabsHr = styled.hr<TabsHrProps>`
  transform: rotate(90deg);
  width: 1px;
  height: 32px;
  border: 0;
  background-color: ${({ current, passed }) =>
    current || !passed ? 'var(--medium-gray)' : 'var(--brand-yellow)'};
  background-color: ${({ current, passed }) =>
    current || !passed ? 'var(--medium-gray)' : 'var(--brand-yellow)'};

  @media (max-width: 480px) {
    height: 22px;
  }

  @media (max-width: 480px) {
    height: 22px;
  }

  @media (max-width: 430px) {
    height: 8px;
  }
`;

export const Tabs = styled.div<{ center?: boolean }>`
  position: relative;
  max-width: 560px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: ${(props) => (props.center ? '0 auto' : '0')};

  ${TabsHr} {
    &:nth-child(1) {
      margin-left: 24px;
    }
  }

  @media (max-width: 640px) {
    max-width: 370px;
  }
`;

type TabItemProps = {
  current?: boolean;
};

export const TabItem = styled.div<TabItemProps>`
  padding-right: ${({ current }) => (current ? '6px' : '0px')};
  padding-left: ${({ current }) => (current ? '6px' : '0px')};
  display: flex;

  @media (max-width: 640px) {
    padding-right: ${({ current }) => (current ? '3px' : '0px')};
    padding-left: ${({ current }) => (current ? '0px' : '0px')};
  }

  ${(props) =>
    props.current &&
    css`
      &:first-child {
        padding-left: 0;
      }

      &:last-child {
        padding-right: 0;
      }
    `}
`;

export const TabItemTitle = styled.p`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-size: 14px;
  line-height: 17px;
  color: var(--gray);
  background-color: #fff;
  padding: 8px;
  border-radius: 4px;
  margin: 0;

  @media (max-width: 640px) {
    font-size: 11px;
    line-height: 14px;
    padding: 4px;
  }

  &::before {
    content: '';
    display: block;
    width: 14px;
    height: 14px;
    margin-right: 8px;
    margin-top: -1px;
    border-radius: 50%;

    @media (max-width: 640px) {
      display: none;
    }
  }

  & > span {
    margin-right: 8px !important;
    margin-top: -1px !important;

    @media (max-width: 640px) {
      display: none !important;
    }
  }

  &[data-state='selected'] {
    font-size: 20px;
    line-height: 20px;
    color: var(--black);
    background-color: var(--brand-yellow);

    @media (max-width: 640px) {
      font-size: 12px;
      line-height: 20px;
    }
  }

  &[data-state='inactive'] {
    &::before {
      background: var(--light-gray);
    }
  }

  &[data-state='selected'],
  &[data-state='inactive'] {
    & > span {
      display: none !important;
    }
  }

  &[data-state='selected'],
  &[data-state='passed'] {
    &::before {
      display: none;
    }
  }
`;
