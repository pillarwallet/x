import React from 'react';
import styled, { css } from 'styled-components';

import InlineLink, { Text } from '../../../../common/inline-link';
import { Trans } from 'react-i18next';

const Container = styled.div<{ widget?: 'true' }>`
  display: flex;
  align-items: flex-start;

  color: var(--black);

  ${(props) =>
    props.widget &&
    css`
      font-size: 10px;
      align-items: center;

      ${Text} {
        font-weight: 700;
        font-size: 10px;
        color: var(--black);
        border-bottom: 1px dashed var(--black);

        &:hover,
        &:active {
          &:before {
            border-bottom: 1px dashed #fff;
          }
        }
      }

      label {
        margin-top: 0;
      }

      p {
        margin: 0;
      }

      * {
        line-height: 1.05;
      }
    `}

  ${(props) =>
    !props.widget &&
    css`
      font-size: 14px;
      line-height: 17px;

      ${Text} {
        font-weight: 700;
        font-size: 14px;
        line-height: 17px;
        color: var(--black);
        border-bottom: 1px dashed var(--black);

        &:hover,
        &:active {
          &:before {
            border-bottom: 1px dashed #fff;
          }
        }
      }

      p {
        width: 275px;
        flex-shrink: 1;
        margin: 0;
      }

      @media (max-width: 767px) {
        padding: 30px 0;
        font-size: 12px;
        line-height: 18px;
      }
    `}
`;

const TermsCheckboxLabel = styled.label<{ checked?: boolean }>`
  flex-shrink: 0;
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 15px;
  height: 15px;
  margin-top: 4px;
  margin-right: 10px;
  background: ${({ checked }) => (checked ? 'var(--black)' : 'transparent')};
  border: 1px solid var(--black);

  ${({ checked }) =>
    checked &&
    css`
      &::before {
        content: '';
        display: block;
        margin-top: -2px;
        width: 3px;
        height: 5px;
        border-width: 0 2px 2px 0;
        border-style: solid;
        border-color: #fff;
        transform: rotate(45deg);
        box-sizing: content-box;
      }
    `}

  input {
    display: none;
  }

  @media (max-width: 767px) {
    margin-top: 3px;
  }
`;

const Terms: React.FC<{
  widget?: boolean;
  checked: boolean;
  blank?: boolean;
  onCheckToggle: () => void;
}> = ({ widget, checked, blank, onCheckToggle }) => {
  return (
    <Container widget={widget ? 'true' : undefined}>
      <TermsCheckboxLabel checked={checked}>
        <input
          data-testid="terms-checkbox"
          type="checkbox"
          checked={checked}
          onChange={onCheckToggle}
        />
      </TermsCheckboxLabel>
      <p>
        <Trans
          i18nKey="agreeTerms"
          components={[
            // @ts-expect-error children is passed impicitly
            <InlineLink bold to="https://stealthex.io/terms" key="terms" blank={blank ? 'true' : undefined} />,
            // @ts-expect-error children is passed impicitly
            <InlineLink
              bold
              to="https://stealthex.io/privacy-policy"
              key="privacy"
              blank={blank ? 'true' : undefined}
            />,
          ]}
        />
      </p>
    </Container>
  );
};

export default Terms;
