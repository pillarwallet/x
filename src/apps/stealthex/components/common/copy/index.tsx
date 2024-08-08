import copy from 'copy-to-clipboard';
import React, { useEffect, useState } from 'react';

import { SuccessIcon } from '../icons';
import { Container, CopyContainer, CopyIcon, StyledTippy } from './styles';

type CopyProps = {
    text: string;
    tip?: string;
    className?: string;
    hoverColor?: string;
};

const Copy: React.FC<React.PropsWithChildren<CopyProps>> = ({
    tip = 'Copy',
    children,
    text,
    className,
    hoverColor,
}) => {
    const [isCopied, setCopied] = useState(false);

    const handleCopy = () => {
        copy(text);
        setCopied(true);
    };

    useEffect(() => {
        let copiedTimeout: NodeJS.Timeout | null = null;

        if (isCopied) {
            copiedTimeout = setTimeout(() => {
                setCopied(false);
            }, 1000);
        }

        return () => {
            if (copiedTimeout) {
                clearTimeout(copiedTimeout);
            }
        };
    }, [isCopied]);

    const renderContent = () => (
        <Container
            onClick={handleCopy}
            className={className}
            hovercolor={hoverColor}
        >
            {children}
            <CopyContainer>
                {!isCopied ? <CopyIcon /> : <SuccessIcon />}
            </CopyContainer>
        </Container>
    );

    if (!tip) {
        return renderContent();
    }

    return (
        <StyledTippy
            content={isCopied ? 'Copied!' : tip}
            placement="top"
            delay={[300, 0]}
            hideOnClick={false}
            arrow
        >
            {renderContent()}
        </StyledTippy>
    );
};

export default Copy;
