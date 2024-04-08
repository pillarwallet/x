import React from 'react';
import styled from 'styled-components';

const Card = ({
  title,
  content,
  children,
}: React.PropsWithChildren<{
  title: string;
  content: string;
}>) => {
  return (
    <Wrapper>
      <Title>{title}</Title>
      <Content>{content}</Content>
      {children}
    </Wrapper>
  );
}

const Wrapper = styled.div<{ $outline?: boolean }>`
  padding: 12px;
  background: ${({ theme, $outline }) => $outline ? 'transparent' : theme.color.background.card};
  margin-bottom: 15px;
  border-radius: 6px;
  position: relative;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const Title = styled.p`
  color: ${({ theme }) => theme.color.text.cardTitle};
  margin-bottom: 4px;
  font-size: 13px;
`;

const Content = styled.p`
  color: ${({ theme }) => theme.color.text.cardContent};
  font-size: 12px;
  font-weight: 400;
`;


export default Card;
