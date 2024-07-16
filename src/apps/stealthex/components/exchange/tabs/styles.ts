import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

type ButtonProps = {
  active?: 'true';
};

export const Button = styled.button<ButtonProps>`
  cursor: pointer;
  font-weight: bold;
  font-size: 28px;
  line-height: 34px;
  border: none;
  outline: none;
  border-top: 3px solid #fff;
  padding-bottom: 5px;
  text-align: center;
  padding-top: 27px;
  width: 50%;
  color: var(--gray);
  border-color: var(--medium-gray);
  margin-right: 4px;

  ${(props) =>
    props.active &&
    css`
      border-color: var(--brand-yellow);
      background: linear-gradient(
        180deg,
        rgba(253, 233, 55, 0.32) 0%,
        rgba(253, 233, 55, 0) 40.63%
      );
      color: #222;
    `}

  @media (hover: hover) {
    transition: color 0.2s ease-in-out;

    &:hover {
      color: #222;
    }
  }

  @media (max-width: 767px) {
    font-size: 20px;
    line-height: 24px;
    padding-top: 16px;
  }
`;
