import Tippy from '@tippyjs/react';
import styled from 'styled-components';

import 'tippy.js/dist/tippy.css';

import { CopyIcon as _CopyIcon } from '../icons';

export const CopyIcon = styled(_CopyIcon)``;

export const Container = styled.button<{ hovercolor?: string }>`
  display: flex;
  gap: 8px;
  align-items: center;

  @media (hover: hover) {
    ${CopyIcon} {
      transition: var(--transition-fill);
    }

    &:hover {
      ${CopyIcon} {
        fill: ${(props) => props.hovercolor ?? 'var(--nero)'};
      }
    }
  }
`;

export const CopyContainer = styled.span`
  flex-shrink: 0;
`;

export const StyledTippy = styled(Tippy)`
  padding: 8px 12px;
  border-radius: 6px;
  background: var(--nero);
  font-size: 14px;
  font-weight: 400;
  line-height: 1;
  color: #fff;

  .tippy-content {
    padding: 0;
  }
`;
