import styled from 'styled-components';

const Paragraph = styled.p<{
  $center?: boolean;
}>`
  ${({ $center }) => $center && 'text-align: center;'}
`;

export default Paragraph;
