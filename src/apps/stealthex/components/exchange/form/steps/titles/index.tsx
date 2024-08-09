import React from 'react';

import checkImage from '../../../../../assets/check.svg';

import { TabItem, TabItemTitle, Tabs, TabsHr } from './styles';
import { useTranslation } from 'react-i18next';
import { Arrow, LinkGoBack } from '../../styles';

const steps = 4;

type TitlesProps = {
    currentStep: number;
    infoStatus?: string;
    finished?: boolean;
    alignLeft?: boolean;
};

const Titles: React.FC<TitlesProps> = ({
    currentStep,
    infoStatus,
    finished,
    alignLeft,
}) => {
    const { t } = useTranslation();
    const onClick = () => {
    }

    return (
        <Tabs center={!alignLeft} data-testid="exchange-titles">
            {currentStep === 1 ? (
                <LinkGoBack onClick={onClick}>
                    <Arrow />
                </LinkGoBack>
            ) : null}
            {Array.from({ length: steps }).map((_, index) => {
                const step = index + 1;
                const title = t(`steps.${index}`);

                let exchangeStep = currentStep;
                if (infoStatus == 'success') {
                    if (finished) {
                        exchangeStep = 4;
                    } else {
                        exchangeStep = 3;
                    }
                }

                return (
                    <React.Fragment key={title}>
                        <TabItem current={exchangeStep === step}>
                            <TabItemTitle
                                data-testid={`exchange-title-${index + 1}`}
                                data-state={
                                    exchangeStep === step
                                        ? 'selected'
                                        : exchangeStep > step
                                            ? 'passed'
                                            : 'inactive'
                                }
                            >
                                {exchangeStep > step ? <img alt="icon" src={checkImage} /> : null}
                                {title}
                            </TabItemTitle>
                        </TabItem>
                        {step !== steps && (
                            <TabsHr
                                current={exchangeStep === step}
                                passed={exchangeStep > step}
                            />
                        )}
                    </React.Fragment>
                );
            })}
        </Tabs>
    );
};

export default Titles;
