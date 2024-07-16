import styled, { css } from 'styled-components';

type ContainerProps = { embed?: boolean; maxHeight: number };

export const Container = styled.div<ContainerProps>`
  ${(props) =>
    !props.embed &&
    css<ContainerProps>`
      position: absolute;
      bottom: 0;
      left: 0;
      transform: translateY(100%);
      width: 100%;
      background: #fff;
      border-radius: 0 0 12px 12px;
      box-shadow: rgb(196 196 196 / 30%) 0px 0px 32px;
      max-height: ${(props) => props.maxHeight}px;
      overflow: hidden;
    `}

  & > * {
    &::-webkit-scrollbar {
      width: 4px;
      height: 16px;
      border-radius: 0px 0px 4px 0px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: var(--brand-yellow);
    }
  }

  // add z-index to sticky element because skeletons have z-index 1
  *[data-test-id='virtuoso-scroller'] > *:first-child {
    z-index: 2 !important;
  }
`;

export const DefaultGroup = styled.div`
  background: #fff;
  padding: 15px;
  font-size: 14px;
  line-height: 1;
  color: var(--dark-gray);
`;

export const DefaultNotFound = styled.div`
  margin: 15px;
  font-size: 14px;
  font-weight: 400;
  padding: 16px;
  background: var(--lynx-white);
  color: var(--dark-gray);
  text-align: center;
`;
