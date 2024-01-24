import styled from 'styled-components';

const HorizontalDivider = styled.div`
  opacity: 0.2;
  background: ${({ theme }) => theme.color.background.horizontalDivider};
  height: 1px;
  width: 100%;
`;

export default HorizontalDivider;
