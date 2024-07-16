import React, { useState } from 'react';

import Terms from '../../../common/terms';

import ExchangeData from '../../../common/widget/exchange-data';

import StepButton from '../../../common/widget/step-button';
import {
    Container,
    Content,
    CredentialsBlock,
    CredentialsContent,
    Footer,
    InputsContainer,
} from './styles';
import DividerLine from '../../../common/widget/divider-line';
import NextButton from '../../../common/widget/next-button';

type Components = {
    addressInput: React.ReactNode;
    extraIdInput: React.ReactNode;
};

type WidgetViewProps = {
    disabled?: boolean;
    components: Components;
    isExchangeCreating?: boolean;
    isExchangeCreated?: boolean;
    onSubmit?: () => void;
    onReject?: () => void;
};

const WidgetView: React.FC<WidgetViewProps> = ({
    disabled,
    components,
    isExchangeCreating,
    onSubmit,
    onReject,
    isExchangeCreated,
}) => {
    const [termsChecked, setTermsChecked] = useState(true);
    return (
        <Container>
            <StepButton text="Recipient Info" onClick={onReject} />
            <Content>
                <CredentialsBlock>
                    <DividerLine />
                    <CredentialsContent>
                        <ExchangeData />
                        <DividerLine />
                        <InputsContainer>
                            {components.addressInput}
                            {components.extraIdInput}
                        </InputsContainer>
                    </CredentialsContent>
                    <DividerLine />
                </CredentialsBlock>
                <Footer>
                    <Terms
                        checked={termsChecked}
                        onCheckToggle={() => setTermsChecked(!termsChecked)}
                        blank
                        widget
                    />
                    <NextButton
                        disabled={
                            !termsChecked ||
                            disabled ||
                            isExchangeCreating ||
                            isExchangeCreated
                        }
                        onClick={onSubmit}
                        isLoading={isExchangeCreating || isExchangeCreated}
                    >
                        NEXT
                    </NextButton>
                </Footer>
            </Content>
        </Container>
    );
};

export default WidgetView;
