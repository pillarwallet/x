import styled from 'styled-components';
import Tippy from '@tippyjs/react';

export const Tooltip = styled(Tippy)`
  position: relative;
  padding: 6px 6px;
  border-radius: 8px;
  background: ${({ theme }) => theme.color.background.card};
  font-size: 12px;
  font-weight: 400;
  line-height: 1;
  color: #fff;

  .tippy-content {
    padding: 0;
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    border-radius: 8px;
    background: rgba(0, 0, 0, 1);
    z-index: -1;
  }
`;

Tooltip.defaultProps = {
  delay: [1000, 0],
};
