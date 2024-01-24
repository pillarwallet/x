import styled from 'styled-components';

const Paragraph = styled.p<{
  $center?: boolean;
  $fontSize?: number;
  $fontWeight?: number;
}>`
  ${({ $center }) => $center && 'text-align: center;'}
  ${({ $fontSize }) => $fontSize && `font-size: ${$fontSize}px;`}
  ${({ $fontWeight }) => $fontWeight && `font-weight: ${$fontWeight};`}
`;

export default Paragraph;
