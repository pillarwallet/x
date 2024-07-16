import styled, { css } from 'styled-components';

type ContainerProps = {
  hoverable?: boolean;
  dropdownType: 'floating' | 'normal';
};

export const Container = styled.div<ContainerProps>`
  width: 100%;
  padding: ${(props) =>
    props.dropdownType == 'floating' ? '16px 4px' : '16px'};
  display: flex;
  flex-direction: row;
  background: #fff;
  border-top: 1px solid var(--lynx-white);

  &:last-child {
    border-bottom: 1px solid var(--lynx-white);
  }

  & > * + * {
    margin-left: 9px;
  }

  ${(props) =>
    props.hoverable &&
    css`
      @media (hover: hover) {
        cursor: pointer;
        transition: var(--transition-background);

        &:hover {
          background: var(--light-gray);
        }
      }
    `}

  ${(props) =>
    !props.hoverable &&
    css`
      ${Name} {
        opacity: 0.5;
      }
    `}
`;

export const Logo = styled.img`
  flex-shrink: 0;
  object-fit: contain;
`;

export const Info = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;

  & > * + * {
    margin-top: 10px;
  }
`;

export const InfoTitle = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  & > * + * {
    margin-left: 4px;
  }
`;

export const Symbol = styled.h4`
  margin: 0;
  font-weight: 700;
  font-size: 14px;
  line-height: 1;
  color: var(--black);
`;

export const Network = styled.span`
  color: #fff;
  line-height: 1;
  font-size: 10px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 4px;
`;

export const Name = styled.span`
  font-weight: 400;
  font-size: 14px;
  line-height: 1;
  color: var(--dark-gray);
`;
