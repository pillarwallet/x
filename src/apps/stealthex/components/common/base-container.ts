import styled from 'styled-components';

const BaseContainer = styled.div<{ wide?: boolean; custom?: number }>`
  width: 100%;
  max-width: ${(props) =>
        props.custom ? `${props.custom}px` : props.wide ? '1372px' : '995px'};
  margin: 0 auto;
  padding: 0 16px;
`;

export default BaseContainer;
