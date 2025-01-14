import styled from 'styled-components';

export const TooltipIconContainer = styled.button`
  all: unset;
  width: 20px;
  height: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  background-color: ${({ $color }) => $color};
  border-radius: 4px;
  margin-right: 8px;

  svg {
    width: 80%;
    height: 80%;
  }

  @media (min-width: 350px) {
    width: 24px;
    height: 24px;
  }

  :disabled {
    pointer-events: none;

    svg {
      opacity: 0.5;
    }
  }
`;

export const IconsContainer = styled.div`
  display: flex;
  width: fit-content;
`;
