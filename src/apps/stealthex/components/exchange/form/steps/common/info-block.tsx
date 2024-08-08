import React from 'react';
import styled from 'styled-components';


import Copy from '../../../../common/copy';
import { device } from '../../../../../lib/styles/breakpoints';
import { LinkIcon } from '../../../../common/icons';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Title = styled.h2`
  font-size: 16px;
  font-weight: 400;
  color: var(--dark-gray);
  margin: 0;

  @media (max-width: 934px) {
    font-size: 14px;
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-right: 20px;
  color: var(--black);
`;

const Text = styled.span`
  max-width: 485px;
  font-weight: bold;
  font-size: 16px;
  word-break: break-all;
  text-align: left;
  display: flex;
  line-height: 1;

  @media ${device.tabletL} {
    max-width: 670px;
    font-size: 18px;
  }
`;

const ExternalLink = styled.a`
  color: inherit;

  @media (hover: hover) {
    & > svg {
      transition: var(--transition-fill);
    }

    &:hover > svg {
      fill: var(--nero);
    }
  }
`;

const InfoBlock: React.FC<{
    text: string;
    title: string;
    link?: string;
    tip?: string;
    testId?: string;
    copy?: boolean;
}> = ({ text, title, link, tip, testId, copy = true }) => {
    return (
        <Container>
            <Title>{title}</Title>
            <Content>
                {copy ? (
                    <Copy text={text} tip={tip}>
                        <Text data-testid={testId}>{text}</Text>
                    </Copy>
                ) : (
                    <Text data-testid={testId}>{text}</Text>
                )}
                {link && (
                    <ExternalLink href={link} target="_blank" rel="noreferrer">
                        <LinkIcon />
                    </ExternalLink>
                )}
            </Content>
        </Container>
    );
};

export default InfoBlock;
