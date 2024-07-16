import React from 'react';
import styled, { css } from 'styled-components';

import { ArrowExchange } from '../../../../common/icons'
import { DividerLine } from '../../styles';
import { device } from '../../../../../lib/styles/breakpoints';
import useToggle from '../../../../../lib/hooks/use-toggle';

const Container = styled.div``;

const Action = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const LeftSide = styled.div`
  flex-shrink: 0;
  display: flex;
  align-items: center;
  gap: 12px;
`;

type ButtonProps = {
    pressed?: boolean;
    variant: Variants;
};

const Button = styled.button<ButtonProps>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 38px;
  height: 38px;
  border: none;
  transform: ${(props) => (props.pressed ? 'rotate(180deg)' : 'none')};
  border-radius: 50%;
  cursor: pointer;

  & > svg {
    fill: ${(props) => (props.pressed ? '#3c3c3c' : 'var(--gray)')};
  }

  ${(props) =>
        props.variant == 'default' &&
        css`
      background: var(--lynx-white);
    `}

  ${(props) =>
        props.variant == 'excel' &&
        css`
      background: ${props.pressed
                ? 'var(--lynx-white)'
                : 'var(--brand-yellow)'};
    `}
`;

type LabelProps = { pressed?: boolean; variant: Variants };

const Label = styled.span<LabelProps>`
  flex-shrink: 0;

  ${(props) =>
        props.variant == 'default' &&
        css<LabelProps>`
      font-size: 12px;
      color: ${(props) => (props.pressed ? '#3c3c3c' : 'var(--gray)')};
      font-weight: 700;

      @media ${device.tablet} {
        font-size: 14px;
      }
    `}

  ${(props) =>
        props.variant == 'excel' &&
        css`
      font-size: 14px;
      color: var(--dark-gray);

      @media ${device.tablet} {
        font-size: 16px;
      }
    `}
`;

type Variants = 'excel' | 'default';

const Collapsible: React.FC<
    React.PropsWithChildren<{
        label: string;
        variant?: Variants;
        testId?: string;
    }>
> = ({ label, variant = 'default', testId, children }) => {
    const [visible, toggle] = useToggle();
    return (
        <Container>
            <Action>
                <LeftSide>
                    <Button
                        onClick={toggle}
                        pressed={visible}
                        variant={variant}
                        data-testid={testId}
                    >
                        <ArrowExchange />
                    </Button>
                    <Label variant={variant} pressed={visible}>
                        {label}
                    </Label>
                </LeftSide>
                <DividerLine />
            </Action>
            {visible && children}
        </Container>
    );
};

export default Collapsible;
