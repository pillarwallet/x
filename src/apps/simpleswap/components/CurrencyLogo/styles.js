import styled from 'styled-components';

export const StyledImage = styled.img`
  width: ${({ $mSize }) => $mSize}px;
  height: ${({ $mSize }) => $mSize}px;
  object-fit: contain;

  @media (min-width: 350px) {
    width: ${({ $mSize, $tSize }) => $tSize || $mSize}px;
    height: ${({ $mSize, $tSize }) => $tSize || $mSize}px;
  }

  @media (min-width: 1280px) {
    width: ${({ $mSize, $tSize, $dSize }) => $dSize || $tSize || $mSize}px;
    height: ${({ $mSize, $tSize, $dSize }) => $dSize || $tSize || $mSize}px;
  }
`;