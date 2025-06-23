import React from 'react';
import styled, { css } from 'styled-components';
import { device } from '../../../../../../lib/styles/breakpoints';



const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const Label = styled.span<{ emphasize?: 'true' }>`
  font-size: 8px;
  font-weight: 700;
  color: ${(props) => (props.emphasize ? 'var(--nero)' : 'var(--gray)')};

  @media ${device.mobileXL} {
    font-size: 10px;
  }
`;

const TruncContainer = styled.div`
  display: table;
  table-layout: fixed;
  width: 100%;
`;

const Data = styled.div<{
    truncate?: boolean;
    thin?: 'true' | 'false';
    emphasize?: 'true';
    breakwords?: boolean;
    alignemphasized?: 'true';
}>`
  font-size: 12px;
  font-weight: ${(props) => (props.thin === 'true' ? 400 : 700)};
  color: ${(props) => (props.emphasize ? '#fff' : 'var(--nero)')};
  word-break: ${(props) => (props.breakwords ? 'break-all' : 'normal')};
  line-height: ${(props) => (props.alignemphasized ? 1.4 : 1)};
  width: ${(props) => (props.breakwords ? 'auto' : 'max-content')};

  @media ${device.mobileXL} {
    font-size: 16px;
    line-height: 1.4;
  }

  ${(props) =>
        props.emphasize &&
        css`
      background: var(--nero);
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    `}

  ${(props) =>
        props.truncate &&
        css`
      display: table-cell;
      white-space: nowrap;
      text-overflow: ellipsis;
      overflow: hidden;
    `}
`;

const DataBlock: React.FC<{
    label: string;
    data: string;
    truncate?: boolean;
    thin?: boolean;
    emphasize?: boolean;
    breakWords?: boolean;
    withTitle?: boolean;
    alignEmphasized?: boolean;
    className?: string;
}> = ({
    label,
    data,
    truncate,
    thin,
    emphasize,
    breakWords,
    withTitle,
    alignEmphasized,
    className,
}) => {
        return (
            <Container>
                <Label emphasize={emphasize ? 'true' : undefined}>{label}</Label>
                {truncate ? (
                    <TruncContainer>
                        <Data
                            className={className}
                            title={withTitle ? data : undefined}
                            thin={thin ? 'true'  : 'false'}
                            emphasize={emphasize ? 'true' : undefined}
                            breakwords={breakWords}
                            alignemphasized={alignEmphasized ? 'true' : undefined}
                            truncate
                        >
                            {data}
                        </Data>
                    </TruncContainer>
                ) : (
                    <Data
                        className={className}
                        thin={thin ? 'true'  : 'false'}
                        emphasize={emphasize ? 'true' : undefined}
                        breakwords={breakWords}
                        title={withTitle ? data : undefined}
                        alignemphasized={alignEmphasized ? 'true' : undefined}
                    >
                        {data}
                    </Data>
                )}
            </Container>
        );
    };

export default DataBlock;
